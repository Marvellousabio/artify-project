# ArtifyPro Editor

Core canvas editor for Artify — an AI-powered design tool.

## Tech Stack
- **React 19** + TypeScript
- **Fabric.js 5** for canvas manipulation
- **Zustand** for state management
- **Vite 6** for fast builds
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Features Implemented

### Canvas Core
- Full viewport fabric canvas with infinite pan/zoom
- Artboard: 960×600px centered on #F0F0F0 surface
- Snap-to-grid: 8px base (toggle with G key)
- Zoom: Ctrl+scroll, zoom controls in corner
- Pan: Space+drag

### Toolbar (Left)
Tools: Select (V), Rectangle (R), Ellipse (E), Text (T), Image (I), Frame (F), Line (L)
- Active tool highlighting
- Undo/Redo (Cmd+Z/Cmd+Y)
- Grid toggle

### Element Operations
- Click select, Shift+click multi-select
- 8-handle resize/rotate
- Double-click text → inline edit
- Delete/Backspace removal
- Copy/Paste (Cmd+C/Cmd+V)
- Arrow key nudge (1px, Shift=8px)
- Cmd+A select all

### Properties Panel (Right)
**Position**: X, Y, Width, Height inputs

**Fill**: Hex input + color picker

**Border**: Color, width (0–20px), style (solid/dashed/dotted)

**Border Radius**: Per-corner inputs for rectangles with linked toggle

**Typography** (when text selected):
- Font-family dropdown (Inter, Roboto, etc.)
- Size, weight (normal/bold/semibold)
- Line height, letter spacing
- Alignment (left/center/right)

**Layer Order**: Bring Forward, Send Backward, Bring to Front, Send to Back

### Layers Panel
- Z-order listing (top = front)
- Visibility toggle, lock toggle
- Rename on double-click
- Drag-to-reorder (buttons)
- Group (Cmd+G) / Ungroup (Cmd+Shift+G)

### State Management (Zustand)
- Single source of truth DesignElement interface
- Undo/redo stack (depth: 50)
- Viewport transform (zoom/pan)
- Selection state
- Full sync with Fabric canvas

## Getting Started

```bash
cd artifypro
npm install
npm run dev
```

Open http://localhost:5173

## File Structure

```
artifypro/
├── src/
│   ├── components/
│   │   ├── Toolbar.tsx
│   │   ├── PropertiesPanel.tsx
│   │   ├── LayersPanel.tsx
│   │   └── Rulers.tsx
│   ├── store/
│   │   └── editorStore.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── fabric.d.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Next Steps
- AI generation (Claude + Stable Diffusion)
- Real-time collaboration (Yjs)
- Code export (React/Tailwind/HTML)
- Responsive breakpoints (mobile/tablet)
- Component library
- Design tokens
