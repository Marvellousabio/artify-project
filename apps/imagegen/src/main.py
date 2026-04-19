import hashlib
import io
import os
from datetime import datetime
from typing import Optional, Literal
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import boto3
import redis.asyncio as redis
from PIL import Image
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="ArtifyPro Image Generation API",
    description="Stability AI / Replicate image generation with S3 upload",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1'),
)

S3_BUCKET = os.getenv('S3_BUCKET', 'artify-assets')
CLOUDFRONT_DISTRIBUTION = os.getenv('CLOUDFRONT_DISTRIBUTION')

# Redis cache
redis_client = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379'))

class GenerateImageRequest(BaseModel):
    description: str = Field(..., min_length=3, max_length=1000)
    style: str = Field(..., description="Style: minimal, corporate, playful, dark, glassmorphism, etc.")
    width: Literal[512, 1024] = 512
    height: Literal[512, 1024] = 512

class GenerateImageResponse(BaseModel):
    imageUrl: str
    s3Key: str
    width: int
    height: int

def get_cache_key(description: str, style: str, width: int, height: int) -> str:
    """Generate SHA256 cache key"""
    content = f"{description}|{style}|{width}x{height}"
    return hashlib.sha256(content.encode()).hexdigest()

async def generate_with_stability_ai(prompt: str, width: int, height: int, style: str) -> bytes:
    """Call Stability AI API to generate image"""
    api_key = os.getenv('STABILITY_API_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="Stability API key not configured")

    style_prefix = STYLE_PROMPTS.get(style, '')
    full_prompt = f"{style_prefix} {prompt}".strip()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "text_prompts": [{"text": full_prompt}],
                "cfg_scale": 7,
                "height": height,
                "width": width,
                "steps": 30,
                "samples": 1,
            },
            timeout=60.0,
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Stability API error: {response.text}")

        result = response.json()
        image_b64 = result['artifacts'][0]['base64']
        import base64
        return base64.b64decode(image_b64)

async def generate_with_replicate(prompt: str, width: int, height: int, style: str) -> bytes:
    """Call Replicate API (SDXL)"""
    token = os.getenv('REPLICATE_API_TOKEN')
    if not token:
        raise HTTPException(status_code=500, detail="Replicate API token not configured")

    style_prefix = STYLE_PROMPTS.get(style, '')
    full_prompt = f"{style_prefix} {prompt}".strip()

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.replicate.com/v1/predictions",
            headers={
                "Authorization": f"Token {token}",
                "Content-Type": "application/json",
            },
            json={
                "version": "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
                "input": {
                    "prompt": full_prompt,
                    "width": width,
                    "height": height,
                    "num_outputs": 1,
                }
            },
            timeout=60.0,
        )

        if response.status_code not in [200, 201]:
            raise HTTPException(status_code=500, detail=f"Replicate API error: {response.text}")

        prediction = response.json()
        # Poll for completion
        while prediction['status'] not in ['succeeded', 'failed']:
            await asyncio.sleep(1)
            response = await client.get(
                f"https://api.replicate.com/v1/predictions/{prediction['id']}",
                headers={"Authorization": f"Token {token}"}
            )
            prediction = response.json()

        if prediction['status'] == 'failed':
            raise HTTPException(status_code=500, detail="Image generation failed")

        image_url = prediction['output'][0]
        img_response = await client.get(image_url)
        return img_response.content

async def upload_to_s3(image_bytes: bytes, description: str) -> str:
    """Upload image bytes to S3 and return CloudFront URL"""
    timestamp = datetime.utcnow().strftime('%Y%m%d/%H%M%S')
    safe_desc = ''.join(c for c in description if c.isalnum() or c in ('-', '_')).lower()[:50]
    s3_key = f"generated/{timestamp}_{safe_desc}.png"

    # Upload to S3
    s3_client.put_object(
        Bucket=S3_BUCKET,
        Key=s3_key,
        Body=image_bytes,
        ContentType='image/png',
        ACL='public-read',
    )

    # Return CloudFront URL if distribution configured
    if CLOUDFRONT_DISTRIBUTION:
        return f"https://{CLOUDFRONT_DISTRIBUTION}.cloudfront.net/{s3_key}"
    else:
        return f"https://{S3_BUCKET}.s3.amazonaws.com/{s3_key}"

STYLE_PROMPTS = {
    'minimal': 'minimalist design, clean, simple, white background, ample whitespace',
    'corporate': 'professional corporate style, blue tones, clean, modern business',
    'playful': 'playful, vibrant colors, cartoon style, fun, energetic',
    'dark': 'dark mode, dark background, neon accents, moody',
    'glassmorphism': 'glass morphism, frosted glass, translucent, blur effect',
}

@app.post('/api/generate/image', response_model=GenerateImageResponse)
async def generate_image(request: GenerateImageRequest):
    """
    Generate an image using AI and upload to S3.
    Returns CloudFront CDN URL.
    """
    # Check cache first
    cache_key = get_cache_key(request.description, request.style, request.width, request.height)
    cached = await redis_client.get(cache_key)
    if cached:
        return GenerateImageResponse.parse_raw(cached)

    try:
        # Try Stability AI first, fall back to Replicate
        try:
            image_bytes = await generate_with_stability_ai(
                request.description,
                request.width,
                request.height,
                request.style
            )
        except HTTPException:
            image_bytes = await generate_with_replicate(
                request.description,
                request.width,
                request.height,
                request.style
            )

        # Upload to S3
        image_url = await upload_to_s3(image_bytes, request.description)

        response = GenerateImageResponse(
            imageUrl=image_url,
            s3Key=cache_key,
            width=request.width,
            height=request.height,
        )

        # Cache for 1 hour (3600 seconds)
        await redis_client.setex(cache_key, 3600, response.model_dump_json())

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

@app.get('/health')
async def health():
    return {'status': 'ok', 'service': 'imagegen'}
