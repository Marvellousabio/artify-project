import { DesignElement } from '@artify/types';
import { format } from 'prettier';

interface ExportFile {
  filename: string;
  content: string;
}

interface ExportResult {
  files: ExportFile[];
}

// CSS custom properties for design tokens
const TOKEN_TO_CSS_VAR = {
  // Colors
  'color.primary': '--color-primary',
  'color.secondary': '--color-secondary',
  'color.accent': '--color-accent',
  'color.background': '--color-background',
  'color.surface': '--color-surface',
  'color.border': '--color-border',

  // Spacing
  'spacing.xs': '--spacing-xs',
  'spacing.sm': '--spacing-sm',
  'spacing.md': '--spacing-md',
  'spacing.lg': '--spacing-lg',
  'spacing.xl': '--spacing-xl',

  // Border radius
  'radius.sm': '--radius-sm',
  'radius.md': '--radius-md',
  'radius.lg': '--radius-lg',
  'radius.full': '--radius-full',
};

// Convert design element to HTML
function elementToHTML(element: DesignElement, indent = 0): string {
  const indentStr = '  '.repeat(indent);

  // Map element type to semantic HTML tag
  const tagMap: Record<string, string> = {
    rectangle: 'div',
    ellipse: 'div',
    text: 'span',
    image: 'img',
    frame: 'section',
    line: 'hr',
  };

  const tag = tagMap[element.type] || 'div';

  // Build style attribute
  const styles: string[] = [];

  // Size
  if (element.width && element.height) {
    styles.push(`width: ${element.width}px`);
    styles.push(`height: ${element.height}px`);
  }

  // Position
  if (element.x !== undefined && element.y !== undefined) {
    styles.push(`position: absolute`);
    styles.push(`left: ${element.x}px`);
    styles.push(`top: ${element.y}px`);
  }

  // Fill/Background
  if (element.fill) {
    if (element.fill.startsWith('token.')) {
      const cssVar = TOKEN_TO_CSS_VAR[element.fill as keyof typeof TOKEN_TO_CSS_VAR];
      if (cssVar) {
        styles.push(`background-color: var(${cssVar})`);
      }
    } else {
      styles.push(`background-color: ${element.fill}`);
    }
  }

  // Stroke/Border
  if (element.stroke && element.strokeWidth && element.strokeWidth > 0) {
    if (element.stroke.startsWith('token.')) {
      const cssVar = TOKEN_TO_CSS_VAR[element.stroke as keyof typeof TOKEN_TO_CSS_VAR];
      if (cssVar) {
        styles.push(`border: ${element.strokeWidth}px solid var(${cssVar})`);
      }
    } else {
      styles.push(`border: ${element.strokeWidth}px solid ${element.stroke}`);
    }
  }

  // Border radius
  if (element.borderRadius && !element.borderRadius.linked) {
    const { topLeft, topRight, bottomLeft, bottomRight } = element.borderRadius;
    if (topLeft === topRight && topRight === bottomLeft && bottomLeft === bottomRight) {
      styles.push(`border-radius: ${topLeft}px`);
    } else {
      styles.push(`border-radius: ${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`);
    }
  }

  // Text-specific properties
  if (element.type === 'text') {
    if (element.fontSize) styles.push(`font-size: ${element.fontSize}px`);
    if (element.fontWeight) styles.push(`font-weight: ${element.fontWeight}`);
    if (element.textAlign) styles.push(`text-align: ${element.textAlign}`);
    if (element.lineHeight) styles.push(`line-height: ${element.lineHeight}`);
  }

  // Opacity
  if (element.opacity !== undefined && element.opacity !== 1) {
    styles.push(`opacity: ${element.opacity}`);
  }

  // Rotation
  if (element.rotation && element.rotation !== 0) {
    styles.push(`transform: rotate(${element.rotation}deg)`);
  }

  const styleAttr = styles.length > 0 ? ` style="${styles.join('; ')};"` : '';

  // Content and attributes
  let content = '';
  let extraAttrs = '';

  if (element.type === 'text' && element.text) {
    content = element.text;
  } else if (element.type === 'image' && element.imageUrl) {
    extraAttrs = ` src="${element.imageUrl}" alt="${element.name || 'Image'}"`;
  }

  // Self-closing tags
  if (tag === 'img' || tag === 'hr') {
    return `${indentStr}<${tag}${styleAttr}${extraAttrs} />`;
  }

  // Regular tags
  if (content) {
    return `${indentStr}<${tag}${styleAttr}>\n${indentStr}  ${content}\n${indentStr}</${tag}>`;
  }

  return `${indentStr}<${tag}${styleAttr}></${tag}>`;
}

// Generate CSS custom properties
function generateCSSVariables(): string {
  const variables: string[] = [];

  Object.entries(TOKEN_TO_CSS_VAR).forEach(([token, cssVar]) => {
    // Default values - in a real implementation, these would come from the design tokens
    const defaultValues: Record<string, string> = {
      '--color-primary': '#3b82f6',
      '--color-secondary': '#6b7280',
      '--color-accent': '#10b981',
      '--color-background': '#ffffff',
      '--color-surface': '#f9fafb',
      '--color-border': '#e5e7eb',
      '--spacing-xs': '4px',
      '--spacing-sm': '8px',
      '--spacing-md': '16px',
      '--spacing-lg': '24px',
      '--spacing-xl': '32px',
      '--radius-sm': '2px',
      '--radius-md': '4px',
      '--radius-lg': '8px',
      '--radius-full': '9999px',
    };

    const defaultValue = defaultValues[cssVar] || '#000000';
    variables.push(`  ${cssVar}: ${defaultValue};`);
  });

  return `:root {\n${variables.join('\n')}\n}`;
}

// Infer component hierarchy
function buildHierarchy(elements: DesignElement[]): DesignElement[] {
  return elements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
}

export async function exportToHTMLCSS(elements: DesignElement[]): Promise<ExportResult> {
  const hierarchy = buildHierarchy(elements);

  // Generate HTML
  const htmlElements = hierarchy.map(element => elementToHTML(element, 2)).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Design</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
${htmlElements}
  </div>
</body>
</html>`;

  // Generate CSS
  const cssVariables = generateCSSVariables();
  const css = `${cssVariables}

.container {
  position: relative;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
`;

  // Format with Prettier
  const formattedHTML = await format(html, { parser: 'html' });
  const formattedCSS = await format(css, { parser: 'css' });

  return {
    files: [
      {
        filename: 'index.html',
        content: formattedHTML,
      },
      {
        filename: 'styles.css',
        content: formattedCSS,
      },
    ],
  };
}