from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import openai
import pinecone
import redis
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ArtifyPro AI Service",
    description="AI-powered image generation and design search",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients
openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
redis_client = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

# Pinecone setup (will be initialized on first use)
pinecone_client = None
pinecone_index = None

def get_pinecone_index():
    global pinecone_client, pinecone_index
    if not pinecone_client:
        pinecone_client = pinecone.Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        pinecone_index = pinecone_client.Index(os.getenv("PINECONE_INDEX", "artify-designs"))
    return pinecone_index

# Pydantic models
class ImageGenerationRequest(BaseModel):
    prompt: str
    style: Optional[str] = "realistic"
    width: Optional[int] = 1024
    height: Optional[int] = 1024

class DesignSearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 10
    style_filter: Optional[str] = None

class DesignEmbeddingRequest(BaseModel):
    document_id: str
    content: str
    style: Optional[str] = None
    component_count: Optional[int] = 0
    prompt: Optional[str] = None

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "openai": bool(os.getenv("OPENAI_API_KEY")),
            "pinecone": bool(os.getenv("PINECONE_API_KEY")),
            "redis": redis_client.ping() if redis_client else False
        }
    }

@app.post("/generate/image")
async def generate_image(request: ImageGenerationRequest):
    try:
        # Use OpenAI DALL-E for image generation
        response = openai_client.images.generate(
            model="dall-e-3",
            prompt=request.prompt,
            size=f"{request.width}x{request.height}",
            quality="standard",
            n=1,
        )

        image_url = response.data[0].url

        # Cache the result in Redis (TTL: 1 hour)
        cache_key = f"image:{hash(request.prompt)}"
        redis_client.setex(cache_key, 3600, image_url)

        return {
            "success": True,
            "image_url": image_url,
            "cached": False
        }

    except Exception as e:
        logger.error(f"Image generation failed: {e}")
        raise HTTPException(status_code=500, detail="Image generation failed")

@app.post("/search/designs")
async def search_designs(request: DesignSearchRequest):
    try:
        index = get_pinecone_index()

        # Generate embedding for search query
        response = openai_client.embeddings.create(
            input=request.query,
            model="text-embedding-3-small"
        )
        query_embedding = response.data[0].embedding

        # Search Pinecone
        search_results = index.query(
            vector=query_embedding,
            top_k=request.limit,
            include_metadata=True,
            filter={"style": request.style_filter} if request.style_filter else None
        )

        return {
            "results": [
                {
                    "document_id": match.id,
                    "score": match.score,
                    "metadata": match.metadata
                }
                for match in search_results.matches
            ]
        }

    except Exception as e:
        logger.error(f"Design search failed: {e}")
        raise HTTPException(status_code=500, detail="Design search failed")

@app.post("/embed/design")
async def embed_design(request: DesignEmbeddingRequest, background_tasks: BackgroundTasks):
    try:
        # Generate embedding for design content
        response = openai_client.embeddings.create(
            input=request.content,
            model="text-embedding-3-small"
        )
        embedding = response.data[0].embedding

        # Add to background task to upsert to Pinecone
        background_tasks.add_task(
            upsert_to_pinecone,
            request.document_id,
            embedding,
            {
                "style": request.style,
                "component_count": request.component_count,
                "prompt": request.prompt,
                "created_at": datetime.utcnow().isoformat()
            }
        )

        return {"success": True, "message": "Embedding queued for processing"}

    except Exception as e:
        logger.error(f"Design embedding failed: {e}")
        raise HTTPException(status_code=500, detail="Design embedding failed")

async def upsert_to_pinecone(document_id: str, embedding: list, metadata: Dict[str, Any]):
    try:
        index = get_pinecone_index()
        index.upsert(vectors=[{
            "id": document_id,
            "values": embedding,
            "metadata": metadata
        }])
        logger.info(f"Upserted embedding for document {document_id}")
    except Exception as e:
        logger.error(f"Failed to upsert to Pinecone: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)