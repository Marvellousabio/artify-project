/**
 * Generate a harmonious color palette from a seed color
 * Uses HSL color wheel for harmony
 */
export function generatePalette(seed: string): {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
} {
  // Convert hex to HSL
  const hexToHSL = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const base = hexToHSL(seed);
  const { h, s, l } = base;

  // Generate harmonious colors using color theory
  const primary = seed; // Original seed
  const secondary = hslToHex((h + 30) % 360, s, l); // Analogous +30°
  const accent = hslToHex((h + 180) % 360, s, l); // Complementary +180°

  // Background: very light version of primary
  const background = hslToHex(h, s, Math.max(95, l + 40));

  // Surface: slightly off-white
  const surface = hslToHex(h, s, l > 50 ? 98 : 10);

  // Text: high contrast against background
  const textL = l > 50 ? 10 : 95;
  const text = hslToHex(h, Math.min(s, 20), textL);

  return { primary, secondary, accent, background, surface, text };
}

/**
 * Predefined style presets
 */
export const STYLE_PRESETS = {
  minimal: {
    primary: '#000000',
    secondary: '#666666',
    accent: '#3b82f6',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
  },
  corporate: {
    primary: '#1e40af',
    secondary: '#374151',
    accent: '#10b981',
    background: '#ffffff',
    surface: '#f3f4f6',
    text: '#111827',
  },
  playful: {
    primary: '#f59e0b',
    secondary: '#ec4899',
    accent: '#8b5cf6',
    background: '#fffbeb',
    surface: '#fef3c7',
    text: '#1f2937',
  },
  dark: {
    primary: '#f3f4f6',
    secondary: '#9ca3af',
    accent: '#60a5fa',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
  },
  glassmorphism: {
    primary: '#6366f1',
    secondary: '#a855f7',
    accent: '#ec4899',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff',
  },
};
