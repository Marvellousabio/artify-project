import { useState, useEffect, useCallback } from 'react';
import { useEditorStore } from '@/store/editorStore';

export default function Rulers() {
  const viewport = useEditorStore((state) => state.viewport);
  const units = useEditorStore((state) => state.units);
  const setUnits = useEditorStore((state) => state.setUnits);

  const [showRulers, setShowRulers] = useState(true);
  const [rulerSize] = 20;

  // Convert pixels to rem (16px = 1rem)
  const pxToUnit = useCallback((px: number) => {
    return units === 'rem' ? px / 16 : px;
  }, [units]);

  // Generate ruler tick marks
  const generateTicks = (max: number, step: number) => {
    const ticks = [];
    for (let i = 0; i <= max; i += step) {
      ticks.push(i);
    }
    return ticks;
  };

  const majorTicks = generateTicks(2000, 100);
  const minorTicks = generateTicks(2000, 20);

  if (!showRulers) return null;

  return (
    <>
      {/* Top Ruler (Horizontal) */}
      <div
        className="absolute top-0 left-16 right-0 h-5 bg-white border-b border-gray-300 overflow-hidden select-none"
        style={{ transform: `translateX(${-viewport.panX * viewport.zoom}px)` }}
      >
        <svg width="5000" height={rulerSize} className="block">
          {minorTicks.map((tick) => (
            <line
              key={tick}
              x1={tick}
              y1={0}
              x2={tick}
              y2={tick % 100 === 0 ? rulerSize : 10}
              stroke="#9ca3af"
              strokeWidth={tick % 100 === 0 ? 1 : 0.5}
            />
          ))}
          {majorTicks.map((tick) => (
            <text
              key={`label-${tick}`}
              x={tick}
              y={rulerSize - 2}
              fontSize="8"
              fill="#4b5563"
            >
              {Math.round(pxToUnit(tick))}{units === 'rem' ? 'r' : 'px'}
            </text>
          ))}
        </svg>
      </div>

      {/* Left Ruler (Vertical) */}
      <div
        className="absolute top-16 left-0 bottom-0 w-5 bg-white border-r border-gray-300 overflow-hidden select-none"
        style={{ transform: `translateY(${-viewport.panY * viewport.zoom}px)` }}
      >
        <svg width={rulerSize} height="5000" className="block">
          {minorTicks.map((tick) => (
            <line
              key={tick}
              x1={0}
              y1={tick}
              x2={tick % 100 === 0 ? rulerSize : 10}
              y2={tick}
              stroke="#9ca3af"
              strokeWidth={tick % 100 === 0 ? 1 : 0.5}
            />
          ))}
          {majorTicks.map((tick) => (
            <text
              key={`label-${tick}`}
              x={2}
              y={tick + 8}
              fontSize="8"
              fill="#4b5563"
            >
              {Math.round(pxToUnit(tick))}{units === 'rem' ? 'r' : 'px'}
            </text>
          ))}
        </svg>
      </div>

      {/* Units Toggle */}
      <button
        onClick={() => setUnits(units === 'px' ? 'rem' : 'px')}
        className="absolute top-1 left-20 px-2 py-0.5 text-xs bg-white border border-gray-300 rounded shadow hover:bg-gray-50"
      >
        {units.toUpperCase()}
      </button>
    </>
  );
}
