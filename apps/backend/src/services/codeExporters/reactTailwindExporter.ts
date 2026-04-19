import { DesignElement } from '@artify/types';
import { format } from 'prettier';

interface ExportFile {
  filename: string;
  content: string;
}

interface ExportResult {
  files: ExportFile[];
}

// Token to Tailwind class mapping
const TOKEN_TO_CLASS = {
  // Colors
  'color.primary': 'text-blue-600',
  'color.secondary': 'text-gray-600',
  'color.accent': 'text-green-600',
  'color.background': 'bg-white',
  'color.surface': 'bg-gray-50',
  'color.border': 'border-gray-300',

  // Spacing
  'spacing.xs': 'p-1',
  'spacing.sm': 'p-2',
  'spacing.md': 'p-4',
  'spacing.lg': 'p-6',
  'spacing.xl': 'p-8',

  // Typography
  'typography.h1': 'text-4xl font-bold',
  'typography.h2': 'text-3xl font-bold',
  'typography.h3': 'text-2xl font-bold',
  'typography.body': 'text-base',
  'typography.caption': 'text-sm text-gray-600',

  // Border radius
  'radius.sm': 'rounded-sm',
  'radius.md': 'rounded-md',
  'radius.lg': 'rounded-lg',
  'radius.full': 'rounded-full',
};

// Convert design element to JSX
function elementToJSX(element: DesignElement, indent = 0): string {
  const indentStr = '  '.repeat(indent);

  // Map element type to HTML tag
  const tagMap: Record<string, string> = {
    rectangle: 'div',
    ellipse: 'div',
    text: 'span',
    image: 'img',
    frame: 'div',
    line: 'div',
  };

  const tag = tagMap[element.type] || 'div';

  // Build className from element properties
  const classes: string[] = [];

  // Size
  if (element.width && element.height) {
    classes.push(`w-[${element.width}px] h-[${element.height}px]`);
  }

  // Position (absolute positioning for design elements)
  if (element.x !== undefined && element.y !== undefined) {
    classes.push(`absolute left-[${element.x}px] top-[${element.y}px]`);
  }

  // Fill/Background
  if (element.fill) {
    if (element.fill.startsWith('token.')) {
      const tokenClass = TOKEN_TO_CLASS[element.fill as keyof typeof TOKEN_TO_CLASS];
      if (tokenClass) classes.push(tokenClass);
    } else {
      classes.push(`bg-[${element.fill}]`);
    }
  }

  // Stroke/Border
  if (element.stroke && element.strokeWidth && element.strokeWidth > 0) {
    if (element.stroke.startsWith('token.')) {
      const tokenClass = TOKEN_TO_CLASS[element.stroke as keyof typeof TOKEN_TO_CLASS];
      if (tokenClass?.includes('border-')) {
        classes.push(tokenClass);
      } else {
        classes.push(`border border-[${element.stroke}]`);
      }
    } else {
      classes.push(`border border-[${element.stroke}]`);
    }
  }

  // Border radius
  if (element.borderRadius && !element.borderRadius.linked) {
    const { topLeft, topRight, bottomLeft, bottomRight } = element.borderRadius;
    if (topLeft === topRight && topRight === bottomLeft && bottomLeft === bottomRight) {
      classes.push(`rounded-[${topLeft}px]`);
    } else {
      classes.push(`rounded-tl-[${topLeft}px] rounded-tr-[${topRight}px] rounded-bl-[${bottomLeft}px] rounded-br-[${bottomRight}px]`);
    }
  }

  // Text-specific properties
  if (element.type === 'text') {
    if (element.fontSize) classes.push(`text-[${element.fontSize}px]`);
    if (element.fontWeight) classes.push(`font-${element.fontWeight}`);
    if (element.textAlign) classes.push(`text-${element.textAlign}`);
    if (element.lineHeight) classes.push(`leading-[${element.lineHeight}]`);
  }

  // Opacity
  if (element.opacity !== undefined && element.opacity !== 1) {
    classes.push(`opacity-${Math.round(element.opacity * 100)}`);
  }

  // Rotation
  if (element.rotation && element.rotation !== 0) {
    classes.push(`rotate-[${element.rotation}deg]`);
  }

  const className = classes.length > 0 ? ` className="${classes.join(' ')}"` : '';

  // Content
  let content = '';
  if (element.type === 'text' && element.text) {
    content = element.text;
  } else if (element.type === 'image' && element.imageUrl) {
    content = ` src="${element.imageUrl}" alt="${element.name || 'Image'}"`;
  }

  // Self-closing tags
  if (tag === 'img') {
    return `${indentStr}<${tag}${className}${content} />`;
  }

  // Regular tags
  if (content) {
    return `${indentStr}<${tag}${className}>\n${indentStr}  ${content}\n${indentStr}</${tag}>`;
  }

  return `${indentStr}<${tag}${className} />`;
}

// Infer component hierarchy from z-index and overlap
function buildHierarchy(elements: DesignElement[]): DesignElement[] {
  return elements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
}

export async function exportToReactTailwind(elements: DesignElement[]): Promise<ExportResult> {
  const componentName = 'ExportedComponent';
  const hierarchy = buildHierarchy(elements);

  // Generate JSX
  const jsxElements = hierarchy.map(element => elementToJSX(element, 2)).join('\n');

  const componentCode = `import React from 'react';

interface ${componentName}Props {
  className?: string;
}

export default function ${componentName}({ className }: ${componentName}Props) {
  return (
    <div className={\`relative w-full h-full \${className}\`}>
${jsxElements}
    </div>
  );
}
`;

  // Format with Prettier
  const formattedCode = await format(componentCode, {
    parser: 'typescript',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
  });

  return {
    files: [
      {
        filename: `${componentName}.tsx`,
        content: formattedCode,
      },
    ],
  };
}