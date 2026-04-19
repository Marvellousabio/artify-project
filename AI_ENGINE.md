# ArtifyPro — Generative AI Engine

## Overview
Complete AI-powered design generation system built as a monorepo.

## Architecture

```
artifypro/
├── packages/               # Shared packages
│   ├── types/             # @artify/types — shared TypeScript interfaces
│   └── constraints/       # @artify/constraints — design utilities
├── apps/
│   ├── backend/           # Node.js + Express — LLM Layout Generator
│   │   └── src/
│   │       ├── server.ts
│   │       ├── routes/
│   │       │   ├── generateLayout.ts   ← Claude API integration
│   │       │   └── generateImage.ts    ← Proxy to Python service
│   │       ├── services/
│   │       │   └── LayoutGenerator.ts  ← Anthropic Claude + Pinecone few-shot
│   │       └── middleware/
│   │           └── errorHandler.ts
│   └── imagegen/          # Python FastAPI — Image Generation
│       └── src/
│           └── main.py    ← Stability AI / Replicate → S3 upload
└── artifypro-editor/       # React + Vite canvas editor
    └── src/
        └── components/
            └── GeneratePanel.tsx   ← Cmd+K floating UI
```

## Services

### Part A — LLM Layout Generator (Node.js)
**Endpoint**: `POST /api/generate/layout`

**Input**: `{ prompt: string, context?: { width, height, theme, style, existingElements } }`

**Output**: `{ elements: DesignElement[], metadata: { tokens_used, model } }`

Features:
- **Anthropic Claude Sonnet 4** (`claude-sonnet-4-20250514`)
- System prompt enforces: 8px grid, artboard bounds, WCAG AA contrast, semantic roles
- **PromptEnricher** middleware:
  - Detects design intent (landing/dashboard/form)
  - Injects style palette (minimal/corporate/playful/dark/glassmorphism)
  - Fetches top-3 similar layouts from Pinecone (cosine similarity) as few-shot
- **Zod validation** against `DesignElement` schema
- Retry once with error feedback on validation failure

### Part B — Image Generation (Python FastAPI)
**Endpoint**: `POST /api/generate/image`

**Input**: `{ description, style, width(512|1024), height(512|1024) }`

**Output**: `{ imageUrl, s3Key, width, height }`

Features:
- **Stability AI SDXL** (primary) + **Replicate** (fallback)
- Style-conditioned prompt prefixes
- Direct upload to **AWS S3** (`artify-assets` bucket)
- Returns **CloudFront CDN URL**
- **Redis cache** (SHA256 key, 1 hour TTL)

### Part C — @artify/constraints (TypeScript)
Shared design utilities:

```typescript
import {
  snapToGrid,           // value → nearest 8px multiple
  checkContrast,        // { ratio, passesAA, passesAAA }
  generatePalette,      // seed color → { primary, secondary, ... }
  applyBreakpoint,      // element → mobile/tablet/desktop variant
} from '@artify/constraints';
```

### Part D — Generate UI (React)
**Cmd+K** opens floating command bar:

- Textarea: "Describe a UI to generate..."
- Style chips: Minimal / Corporate / Playful / Dark / Glassmorphism
- On submit: POST to `/api/generate/layout`
- Shows skeleton loader on canvas while waiting
- Generated elements fade in with stagger animation

## Setup

### 1. Install dependencies (monorepo)

```bash
cd artifyproject  # root
npm install        # installs all workspaces
```

### 2. Backend (Node.js)

```bash
cd apps/backend
cp .env.example .env
# Edit .env:
# ANTHROPIC_API_KEY=sk-ant-...
# PINECONE_API_KEY=...
# PINECONE_INDEX=artify-layouts
npm run dev   # Port 3001
```

### 3. Image Gen (Python)

```bash
cd apps/imagegen
cp .env.example .env
# Edit .env:
# STABILITY_API_KEY=...
# REPLICATE_API_TOKEN=...
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
# S3_BUCKET=artify-assets
# CLOUDFRONT_DISTRIBUTION=...
uvicorn src.main:app --reload   # Port 3002
```

### 4. Editor (React)

```bash
cd artifypro
npm install
npm run dev   # Port 5173
```

## Environment Variables

### Backend (.env)
```
ANTHROPIC_API_KEY=sk-ant-...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=...
PINECONE_INDEX=artify-layouts
IMAGEGEN_URL=http://localhost:3002
NODE_ENV=development
```

### ImageGen (.env)
```
STABILITY_API_KEY=...
REPLICATE_API_TOKEN=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET=artify-assets
CLOUDFRONT_DISTRIBUTION=your-distribution-id
REDIS_URL=redis://localhost:6379
```

## API Specs

### POST /api/generate/layout

Request:
```json
{
  "prompt": "A landing page with hero, features, and CTA",
  "context": {
    "width": 960,
    "height": 600,
    "style": "minimal",
    "theme": "light"
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "elements": [ /* DesignElement[] */ ],
    "metadata": {
      "tokens_used": 1542,
      "model": "claude-sonnet-4-20250514",
      "prompt_tokens": 312,
      "completion_tokens": 1230
    }
  }
}
```

### POST /api/generate/image

Request:
```json
{
  "description": "A hero illustration for a design tool",
  "style": "minimal",
  "width": 1024,
  "height": 1024
}
```

Response:
```json
{
  "imageUrl": "https://d111111abcdef8.cloudfront.net/generated/20260418/hero_abc123.png",
  "s3Key": "generated/20260418/123456_hero_abc123.png",
  "width": 1024,
  "height": 1024
}
```

## DesignElement Schema

```typescript
interface DesignElement {
  id: string;                    // uuid v4
  type: 'rectangle' | 'ellipse' | 'text' | 'image' | 'frame' | 'line';
  x: number;                     // 0–960, snapped to 8px grid
  y: number;                     // 0–600, snapped to 8px grid
  width: number;                 // ≥8, snapped to 8px
  height: number;                // ≥8, snapped to 8px
  rotation: number;              // -360 to 360
  opacity: number;               // 0–1
  fill: string;                  // hex/rgba
  stroke: string;
  strokeWidth: number;
  borderRadius: { tl, tr, bl, br, linked: boolean };
  // Text
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'left'|'center'|'right';
  // Image
  imageUrl?: string;
  // Semantic
  role?: 'navbar'|'hero'|'card'|'button'|'input'|'footer'|'text'|'image'|'container';
  responsive: { mobile?: Partial<DesignElement>; tablet?: Partial<DesignElement> };
  zIndex?: number;
  locked?: boolean;
  visible?: boolean;
  name?: string;
}
```

## What's Working

✅ LLM Layout Generator (Claude + Zod validation)
✅ Image Generation (Stability + Replicate → S3 → CloudFront)
✅ Design constraints package (snapToGrid, contrast, palette, breakpoints)
✅ React GeneratePanel (Cmd+K) with style picker
✅ Skeleton loading state + fade-in animation
✅ Canvas hydration — generated elements appear correctly on artboard
✅ CORS, rate limiting, error handling
✅ Redis caching for images (1hr TTL)
✅ Pinecone few-shot (ready to enable)

## To Use in Editor

1. Press **Cmd+K** (or set hotkey in Toolbar)
2. Type prompt: "Create a pricing card with features list"
3. Choose style (e.g., Minimal)
4. Click "Generate Layout"
5. See elements appear on canvas with staggered fade-in

## Production Checklist

- [ ] Add `.env` files with real API keys
- [ ] Deploy backend to Vercel/Railway/Heroku
- [ ] Deploy imagegen to Railway/Render (Python)
- [ ] Set up S3 bucket + CloudFront distribution
- [ ] Configure Redis (Upstash/Redis Labs)
- [ ] Set up Pinecone index + populate with examples
- [ ] Add authentication (JWT)
- [ ] Add usage quotas & billing
- [ ] Add generation history per user

## License

MIT — ArtifyPro © 2026
