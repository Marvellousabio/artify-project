// Geometry
export {
  ARTBOARD_WIDTH,
  ARTBOARD_HEIGHT,
  GRID_SIZE,
  MIN_ELEMENT_SIZE,
  MAX_ELEMENT_SIZE,
  snapToGrid,
  clampSize,
  clampPosition,
} from './src/geometry';

// Contrast checking
export {
  getLuminance,
  getContrastRatio,
  checkContrast,
  suggestTextColor,
  type ContrastResult,
} from './src/contrast';

// Color palettes
export { generatePalette, STYLE_PRESETS } from './src/palette';

// Responsive
export {
  BREAKPOINTS,
  getViewportSize,
  SCALE_FACTORS,
  applyBreakpoint,
  generateBreakpoints,
  type ViewportSize,
} from './src/responsive';

// Re-export DesignElement type from shared types
export type { DesignElement, BorderRadius, Tool, ViewportState, HistoryState } from '@artify/constraints/types';
