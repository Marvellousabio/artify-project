import { DesignElement } from '@artify/constraints';

export type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
} as const;

/**
 * Determine viewport size from width
 */
export function getViewportSize(width: number): ViewportSize {
  if (width <= BREAKPOINTS.mobile) return 'mobile';
  if (width <= BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
}

/**
 * Scale factor calculations for different viewports
 */
export const SCALE_FACTORS = {
  mobile: 0.75,   // 75% of desktop size
  tablet: 0.875,  // 87.5% of desktop size
  desktop: 1,
};

/**
 * Apply responsive transformations to an element
 * - Mobile: stack vertically, smaller fonts
 * - Tablet: slight scaling, adjust spacing
 * - Desktop: base layout
 */
export function applyBreakpoint(
  element: DesignElement,
  viewport: ViewportSize
): DesignElement {
  if (viewport === 'desktop') return element;

  const scale = SCALE_FACTORS[viewport];
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  // Create responsive override
  const responsive: DesignElement['responsive'] = {
    ...element.responsive,
    [viewport]: {
      ...element.responsive[viewport],
    },
  };

  let updated = { ...element, responsive };

  // Apply scaling for non-artboard elements
  if (element.role !== 'artboard') {
    updated = {
      ...updated,
      width: Math.round(element.width * scale),
      height: Math.round(element.height * scale),
      x: Math.round(element.x * scale),
      y: Math.round(element.y * scale),
    };

    // Text-specific scaling
    if (element.type === 'text' && element.fontSize) {
      updated = {
        ...updated,
        fontSize: Math.round(element.fontSize * scale),
      };
    }
  }

  // Mobile-specific adjustments
  if (isMobile) {
    // Stack elements: increase vertical spacing
    updated = {
      ...updated,
      x: element.x, // Reset horizontal position
      y: Math.round(element.y * 1.2), // More vertical spacing
    };

    // Reduce font sizes further
    if (element.type === 'text' && updated.fontSize) {
      updated.fontSize = Math.max(12, Math.round(updated.fontSize * 0.9));
    }
  }

  // Tablet moderate adjustments
  if (isTablet) {
    updated = {
      ...updated,
      x: Math.round(element.x * 0.95), // Slight horizontal adjustment
    };
  }

  return updated;
}

/**
 * Get all breakpoint variants for an element
 */
export function generateBreakpoints(
  element: DesignElement
): Record<ViewportSize, DesignElement> {
  return {
    desktop: element,
    tablet: applyBreakpoint(element, 'tablet'),
    mobile: applyBreakpoint(element, 'mobile'),
  };
}
