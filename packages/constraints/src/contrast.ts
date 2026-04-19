/**
 * Calculate relative luminance of a color (WCAG 2.0 formula)
 * Color can be hex (#RRGGBB) or rgb(r,g,b)
 */
export function getLuminance(color: string): number {
  // Parse hex color
  let r: number, g: number, b: number;

  if (color.startsWith('#')) {
    const hex = color.slice(1);
    r = parseInt(hex.substr(0, 2), 16) / 255;
    g = parseInt(hex.substr(2, 2), 16) / 255;
    b = parseInt(hex.substr(4, 2), 16) / 255;
  } else if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (!match) return 0;
    r = parseInt(match[0]) / 255;
    g = parseInt(match[1]) / 255;
    b = parseInt(match[2]) / 255;
  } else {
    return 0;
  }

  // Apply sRGB gamma correction
  const srgb = (c: number) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  r = srgb(r);
  g = srgb(g);
  b = srgb(b);

  // Calculate relative luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.0)
 * Returns ratio from 1 to 21 (21 = white on black)
 */
export function getContrastRatio(fg: string, bg: string): number {
  const lum1 = getLuminance(fg);
  const lum2 = getLuminance(bg);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color combination passes WCAG contrast requirements
 */
export interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  level: 'FAIL' | 'AA' | 'AAA';
}

export function checkContrast(fg: string, bg: string, isLargeText: boolean = false): ContrastResult {
  const ratio = getContrastRatio(fg, bg);

  // WCAG 2.0 level AA requirements
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaPasses = isLargeText ? aaLarge : aaNormal;

  // WCAG 2.0 level AAA requirements
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;
  const aaaPasses = isLargeText ? aaaLarge : aaaNormal;

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: aaPasses,
    passesAAA: aaaPasses,
    level: aaPasses && aaaPasses ? 'AAA' : aaPasses ? 'AA' : 'FAIL',
  };
}

/**
 * Suggest an accessible text color for a given background
 */
export function suggestTextColor(bg: string): 'black' | 'white' {
  const lum = getLuminance(bg);
  // Use white text on dark backgrounds, black on light
  return lum > 0.5 ? 'black' : 'white';
}
