export interface BorderRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
  linked: boolean;
}

export interface Responsive {
  mobile?: Partial<DesignElement>;
  tablet?: Partial<DesignElement>;
}

export type ElementRole = 'navbar' | 'hero' | 'card' | 'button' | 'input' | 'footer' | 'text' | 'image' | 'container' | 'section';

export interface DesignElement {
  id: string;
  type: 'rectangle' | 'ellipse' | 'text' | 'image' | 'frame' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius: BorderRadius;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  lineHeight?: number;
  letterSpacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  imageUrl?: string;
  role?: ElementRole;
  responsive: Responsive;
  zIndex?: number;
  locked?: boolean;
  visible?: boolean;
  name?: string;
}

export type Tool =
  | 'select'
  | 'rectangle'
  | 'ellipse'
  | 'text'
  | 'image'
  | 'frame'
  | 'line';

export interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
}

export interface HistoryState {
  past: DesignElement[][];
  present: DesignElement[];
  future: DesignElement[][];
}

export interface GenerateLayoutRequest {
  prompt: string;
  context?: {
    width?: number;
    height?: number;
    theme?: 'light' | 'dark' | 'auto';
    existingElements?: DesignElement[];
    style?: string; // minimal, corporate, playful, dark, glassmorphism
  };
}

export interface GenerateLayoutResponse {
  elements: DesignElement[];
  metadata: {
    tokens_used: number;
    model: string;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export interface GenerateImageRequest {
  description: string;
  style: string;
  width: 512 | 1024;
  height: 512 | 1024;
}

export interface GenerateImageResponse {
  imageUrl: string;
  s3Key: string;
  width: number;
  height: number;
}

export const ELEMENT_TYPE_MAP = {
  rectangle: 'rectangle',
  ellipse: 'ellipse',
  text: 'text',
  image: 'image',
  frame: 'frame',
  line: 'line',
} as const;
