import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { layoutGenerator } from '../services/LayoutGenerator.js';
import { GenerateLayoutRequest } from '@artify/types';

const router = Router();

const GenerateLayoutSchema = z.object({
  prompt: z.string().min(3).max(1000),
  context: z.object({
    width: z.number().int().min(320).max(1920).optional(),
    height: z.number().int().min(240).max(1080).optional(),
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    style: z.string().optional(),
    existingElements: z.array(z.any()).optional(),
  }).optional(),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const validated = GenerateLayoutSchema.parse(req.body);

    const result = await layoutGenerator.generate(validated);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    }

    console.error('Layout generation error:', error);
    res.status(500).json({
      error: 'Failed to generate layout',
      message: error.message,
    });
  }
});

export { router as generateLayoutRoute };
