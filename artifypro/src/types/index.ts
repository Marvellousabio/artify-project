import { fabric } from 'fabric';

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
  role?: 'artboard' | 'element';
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

export interface HistoryState {
  past: DesignElement[][];
  present: DesignElement[];
  future: DesignElement[][];
}

export interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
}

export const ARTBOARD_WIDTH = 960;
export const ARTBOARD_HEIGHT = 600;
export const GRID_SIZE = 8;
export const MAX_HISTORY = 50;

export const DEFAULT_BORDER_RADIUS: BorderRadius = {
  topLeft: 0,
  topRight: 0,
  bottomLeft: 0,
  bottomRight: 0,
  linked: true,
};

export const DEFAULT_ELEMENT: Partial<DesignElement> = {
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  rotation: 0,
  opacity: 1,
  fill: '#3b82f6',
  stroke: '',
  strokeWidth: 0,
  borderRadius: DEFAULT_BORDER_RADIUS,
  responsive: { mobile: {}, tablet: {} },
  locked: false,
  visible: true,
};
