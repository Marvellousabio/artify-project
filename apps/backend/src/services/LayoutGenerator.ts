import Anthropic from '@anthropic-ai/sdk';
import { PineconeClient } from 'pinecone-client';
import { z } from 'zod';
import {
  DesignElement,
  GenerateLayoutRequest,
  GenerateLayoutResponse,
  ARTBOARD_WIDTH,
  ARTBOARD_HEIGHT,
  GRID_SIZE,
  snapToGrid,
} from '@artify/types';
import { generatePalette, STYLE_PRESETS } from '@artify/constraints';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!,
});

const DESIGN_ELEMENT_SCHEMA = z.object({
  id: z.string(),
  type: z.enum(['rectangle', 'ellipse', 'text', 'image', 'frame', 'line']),
  x: z.number().int().min(0).max(ARTBOARD_WIDTH),
  y: z.number().int().min(0).max(ARTBOARD_HEIGHT),
  width: z.number().int().min(8).max(ARTBOARD_WIDTH),
  height: z.number().int().min(8).max(ARTBOARD_HEIGHT),
  rotation: z.number().min(-360).max(360).default(0),
  opacity: z.number().min(0).max(1).default(1),
  fill: z.string().default('#3b82f6'),
  stroke: z.string().default(''),
  strokeWidth: z.number().int().min(0).default(0),
  borderRadius: z.object({
    topLeft: z.number().int().default(0),
    topRight: z.number().int().default(0),
    bottomLeft: z.number().int().default(0),
    bottomRight: z.number().int().default(0),
    linked: z.boolean().default(true),
  }),
  text: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().int().min(8).max(200).optional(),
  fontWeight: z.string().default('normal'),
  lineHeight: z.number().min(0.8).max(3).default(1.5),
  letterSpacing: z.number().min(-5).max(20).default(0),
  textAlign: z.enum(['left', 'center', 'right']).default('left'),
  imageUrl: z.string().optional(),
  role: z.enum(['navbar', 'hero', 'card', 'button', 'input', 'footer', 'text', 'image', 'container']).optional(),
  responsive: z.object({
    mobile: z.object({}).passthrough().optional(),
    tablet: z.object({}).passthrough().optional(),
  }).default({}),
  locked: z.boolean().default(false),
  visible: z.boolean().default(true),
  name: z.string().optional(),
});

const LAYOUT_RESPONSE_SCHEMA = z.array(DesignElement);

export class LayoutGenerator {
  private systemPrompt: string;

  constructor() {
    this.systemPrompt = this.buildSystemPrompt();
  }

  private buildSystemPrompt(): string {
    return `You are a UI layout generator for ArtifyPro design tool. Your job is to convert natural language descriptions into structured JSON design elements.

CRITICAL RULES:
1. Output ONLY a valid JSON array. NO markdown, NO explanations, NO formatting, NO code blocks. Just raw JSON.
2. All coordinates and dimensions MUST be multiples of 8 (snap-to-grid: 8px).
3. All elements must fit within ${ARTBOARD_WIDTH}x${ARTBOARD_HEIGHT}px artboard.
4. Ensure minimum contrast ratio of 4.5:1 for text elements (WCAG AA).
5. Assign semantic role to elements: navbar, hero, card, button, input, footer, text, image, container.

DESIGN PRINCIPLES:
- Use consistent spacing: 8, 16, 24, 32, 48, 64px
- Hierarchy: Headings > Body > Caption (24px, 16px, 12px scale)
- Limit color palette: primary, secondary, accent, background, surface, text
- Group related elements using 'frame' type

OUTPUT STRUCTURE (array of objects):
Each object must include all fields defined in the schema.

EXAMPLE (for reference - do not copy):
[
  {
    "id": "uuid-here",
    "type": "frame",
    "x": 80, "y": 80, "width": 800, "height": 440,
    "fill": "#ffffff", "stroke": "#e5e7eb", "strokeWidth": 1,
    "borderRadius": {"topLeft": 12, "topRight": 12, "bottomLeft": 12, "bottomRight": 12, "linked": true},
    "role": "container"
  },
  {
    "id": "uuid-here",
    "type": "text",
    "x": 120, "y": 120, "width": 400, "height": 40,
    "text": "Welcome to Artify",
    "fontFamily": "Inter", "fontSize": 32, "fontWeight": "bold",
    "fill": "#111827", "lineHeight": 1.2, "textAlign": "left",
    "role": "hero"
  }
]`;
  }

  /**
   * Enrich prompt with context, similar layouts, and style constraints
   */
  private async enrichPrompt(
    userPrompt: string,
    context?: GenerateLayoutRequest['context']
  ): Promise<{ systemPrompt: string; userMessage: string }> {
    let enrichedSystem = this.systemPrompt;
    let fewShotExamples = '';

    // 1. Detect design intent
    const intent = this.detectIntent(userPrompt);
    
    // 2. Inject style constraints
    if (context?.style) {
      const preset = STYLE_PRESETS[context.style as keyof typeof STYLE_PRESETS];
      if (preset) {
        enrichedSystem += `\n\nSTYLE PALETTE (use these colors):
Primary: ${preset.primary}
Secondary: ${preset.secondary}
Accent: ${preset.accent}
Background: ${preset.background}
Surface: ${preset.surface}
Text: ${preset.text}`;
      }
    }

    // 3. Fetch similar past layouts from Pinecone (few-shot)
    if (process.env.PINECONE_INDEX) {
      try {
        const similar = await this.fetchSimilarLayouts(userPrompt);
        if (similar.length > 0) {
          fewShotExamples = '\n\nSIMILAR LAYOUTS (use as reference):\n' + 
            similar.map((ex, i) => `Example ${i + 1}:\n${JSON.stringify(ex, null, 2)}`).join('\n');
        }
      } catch (err) {
        console.warn('Pinecone fetch failed:', err);
      }
    }

    // 4. Add responsive constraints
    enrichedSystem += `
${fewShotExamples}

RESPONSIVE DESIGN:
Return each element with a "responsive" field:
{
  "responsive": {
    "mobile": { x, y, width, height }  // optional overrides
  }
}

For mobile: Stack vertically, reduce font sizes to ~75%.
For tablet: 87.5% scale, slight horizontal adjustments.`;

    // 5. Context-specific constraints
    if (intent === 'landing') {
      enrichedSystem += '\n\nLANDING PAGE PATTERNS:\n- Hero section: large heading, subtext, CTA button\n- Features: 3-column grid of cards\n- Footer: links, copyright';
    } else if (intent === 'dashboard') {
      enrichedSystem += '\n\nDASHBOARD PATTERNS:\n- Sidebar navigation (left)\n- Top bar with search\n- Main content area with cards\n- Data tables with clear headers';
    } else if (intent === 'form') {
      enrichedSystem += '\n\nFORM PATTERNS:\n- Labels above inputs\n- Adequate spacing (16px vertical)\n- Submit button clearly visible\n- Error states (use red border)';
    }

    return {
      systemPrompt: enrichedSystem,
      userMessage: `Generate a ${context?.width || ARTBOARD_WIDTH}x${context?.height || ARTBOARD_HEIGHT}px ${intent} design for: "${userPrompt}"`,
    };
  }

  /**
   * Detect design intent from prompt keywords
   */
  private detectIntent(prompt: string): string {
    const lower = prompt.toLowerCase();
    if (lower.match(/landing|homepage|marketing/)) return 'landing';
    if (lower.match(/dashboard|analytics|admin/)) return 'dashboard';
    if (lower.match(/form|login|signup|checkout/)) return 'form';
    if (lower.match(/card|grid|gallery/)) return 'card';
    if (lower.match(/button|cta/)) return 'button';
    return 'general';
  }

  /**
   * Fetch similar layouts from Pinecone vector DB
   */
  private async fetchSimilarLayouts(prompt: string): Promise<Partial<DesignElement>[][]> {
    // TODO: Implement Pinecone integration
    // For now return empty array
    return [];
  }

  /**
   * Validate and sanitize LLM response
   */
  private validateResponse(data: unknown): DesignElement[] {
    try {
      const parsed = LAYOUT_RESPONSE_SCHEMA.parse(data);
      
      // Additional constraints: snap to grid
      return parsed.map(el => ({
        ...el,
        x: snapToGrid(el.x),
        y: snapToGrid(el.y),
        width: snapToGrid(el.width),
        height: snapToGrid(el.height),
        // Ensure role is set
        role: el.role || this.inferRole(el.type),
      }));
    } catch (error) {
      console.error('Validation error:', error);
      throw new Error('Invalid layout format generated');
    }
  }

  /**
   * Infer semantic role from element type and properties
   */
  private inferRole(type: DesignElement['type']): DesignElement['role'] {
    switch (type) {
      case 'frame': return 'container';
      case 'text': return 'text';
      case 'image': return 'image';
      default: return 'element';
    }
  }

  /**
   * Main generation method
   */
  async generate(request: GenerateLayoutRequest): Promise<GenerateLayoutResponse> {
    const { systemPrompt, userMessage } = await this.enrichPrompt(request.prompt, request.context);

    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
      try {
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userMessage,
            },
          ],
        });

        const content = response.content[0];
        if (content.type !== 'text') {
          throw new Error('Invalid response type from Claude');
        }

        // Extract JSON array from response (handle potential wrapping)
        const jsonText = content.text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        const parsed = JSON.parse(jsonText);
        const validatedElements = this.validateResponse(parsed);

        return {
          elements: validatedElements,
          metadata: {
            tokens_used: response.usage?.input_tokens || 0 + response.usage?.output_tokens || 0,
            model: response.model,
            prompt_tokens: response.usage?.input_tokens || 0,
            completion_tokens: response.usage?.output_tokens || 0,
          },
        };
      } catch (error: any) {
        attempt++;
        console.warn(`Generation attempt ${attempt} failed:`, error.message);

        if (attempt === maxAttempts) {
          throw error;
        }

        // Append error to system prompt for retry
        // (Claude will retry with feedback embedded)
      }
    }

    throw new Error('Failed to generate layout after retries');
  }
}

export const layoutGenerator = new LayoutGenerator();
