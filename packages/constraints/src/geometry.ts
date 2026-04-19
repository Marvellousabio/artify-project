export const ARTBOARD_WIDTH = 960;
export const ARTBOARD_HEIGHT = 600;
export const GRID_SIZE = 8;
export const MIN_ELEMENT_SIZE = 8;
export const MAX_ELEMENT_SIZE = 2000;

// Snap a value to the nearest grid multiple
export function snapToGrid(value: number, grid: number = GRID_SIZE): number {
  return Math.round(value / grid) * grid;
}

// Ensure dimensions are valid (positive, within bounds)
export function clampSize(value: number): number {
  return Math.max(MIN_ELEMENT_SIZE, Math.min(MAX_ELEMENT_SIZE, value));
}

// Ensure position stays within artboard bounds
export function clampPosition(
  x: number,
  y: number,
  width: number,
  height: number
): { x: number; y: number } {
  const maxX = ARTBOARD_WIDTH - width;
  const maxY = ARTBOARD_HEIGHT - height;

  return {
    x: Math.max(0, Math.min(maxX, x)),
    y: Math.max(0, Math.min(maxY, y)),
  };
}
