import { Router, Request, Response } from 'express';
import { z } from 'zod';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  GenerateImageRequest,
  GenerateImageResponse,
} from '@artify/types';

const router = Router();

const GenerateImageSchema = z.object({
  description: z.string().min(3).max(1000),
  style: z.string().default('default'),
  width: z.enum([512, 1024]).default(512),
  height: z.enum([512, 1024]).default(512),
});

router.post('/image', async (req: Request, res: Response) => {
  try {
    const validated = GenerateImageSchema.parse(req.body);

    // Forward to Python image generation service
    const imagegenUrl = process.env.IMAGEGEN_URL || 'http://localhost:3002';
    
    const response = await axios.post(`${imagegenUrl}/api/generate/image`, {
      description: validated.description,
      style: validated.style,
      width: validated.width,
      height: validated.height,
    }, {
      timeout: 120_000, // 2 minute timeout for image generation
    });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    console.error('Image generation error:', error);

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(500).json({
      error: 'Failed to generate image',
      message: error.message,
    });
  }
});

export { router as generateImageRoute };
