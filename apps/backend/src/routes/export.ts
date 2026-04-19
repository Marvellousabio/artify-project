import express from 'express';
import { DesignElement } from '@artify/types';
import { exportToReactTailwind } from '../services/codeExporters/reactTailwindExporter.js';
import { exportToHTMLCSS } from '../services/codeExporters/htmlCssExporter.js';
import { exportToVue } from '../services/codeExporters/vueExporter.js';

const router = express.Router();

interface ExportRequest {
  elements: DesignElement[];
  format: 'react-tailwind' | 'html-css' | 'vue';
}

interface ExportResponse {
  files: { filename: string; content: string }[];
}

router.post('/', async (req, res) => {
  try {
    const { elements, format }: ExportRequest = req.body;

    if (!elements || !Array.isArray(elements)) {
      return res.status(400).json({ error: 'Elements array is required' });
    }

    if (!format || !['react-tailwind', 'html-css', 'vue'].includes(format)) {
      return res.status(400).json({ error: 'Valid format is required: react-tailwind, html-css, or vue' });
    }

    let result: ExportResponse;

    switch (format) {
      case 'react-tailwind':
        result = await exportToReactTailwind(elements);
        break;
      case 'html-css':
        result = await exportToHTMLCSS(elements);
        break;
      case 'vue':
        result = await exportToVue(elements);
        break;
      default:
        throw new Error('Unsupported format');
    }

    res.json(result);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export code' });
  }
});

export { router as exportRoute };