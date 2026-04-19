'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { create } from 'zustand';

interface DesignElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
}

interface EditorState {
  elements: DesignElement[];
  selectedIds: string[];
  activeTool: string;
  addElement: (type: string, x: number, y: number) => string;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  selectElement: (id: string) => void;
  clearSelection: () => void;
  setActiveTool: (tool: string) => void;
  deleteElements: (ids: string[]) => void;
}

const useEditorStore = create<EditorState>((set, get) => ({
  elements: [],
  selectedIds: [],
  activeTool: 'select',
  addElement: (type, x, y) => {
    const id = `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newElement: DesignElement = {
      id,
      type,
      x,
      y,
      width: type === 'text' ? 100 : 150,
      height: type === 'text' ? 40 : 100,
      fill: '#3b82f6',
      stroke: '#000000',
      strokeWidth: 0,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
    };
    set((state) => ({ elements: [...state.elements, newElement] }));
    return id;
  },
  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    }));
  },
  selectElement: (id, single = true) => {
    set({ selectedIds: single && id ? [id] : [] });
  },
  clearSelection: () => {
    set({ selectedIds: [] });
  },
  setActiveTool: (tool) => {
    set({ activeTool: tool, selectedIds: [] });
  },
  deleteElements: (ids) => {
    set((state) => ({
      elements: state.elements.filter((el) => !ids.includes(el.id)),
      selectedIds: [],
    }));
  },
}));

const TOOLS = [
  { id: 'select', label: 'Select', icon: 'Cursor' },
  { id: 'rectangle', label: 'Rectangle', icon: 'Square' },
  { id: 'ellipse', label: 'Ellipse', icon: 'Circle' },
  { id: 'text', label: 'Text', icon: 'Type' },
  { id: 'line', label: 'Line', icon: 'Minus' },
];

export default function EditorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; targetId?: string } | null>(null);

  const {
    elements,
    selectedIds,
    activeTool,
    addElement,
    updateElement,
    selectElement,
    clearSelection,
    setActiveTool,
    deleteElements,
  } = useEditorStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 320,
      height: window.innerHeight,
      backgroundColor: '#f3f4f6',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    const handleSelectionCreated = (e: any) => {
      const selected = e.selected || [];
      const ids = selected.map((obj: any) => obj.designId).filter(Boolean) as string[];
      if (ids.length > 0) {
        selectElement(ids[0]);
      }
    };

    const handleSelectionCleared = () => {
      clearSelection();
    };

    const handleObjectModified = (e: any) => {
      const obj = e.target;
      if (!obj || !obj.designId) return;
      updateElement(obj.designId, {
        x: obj.left || 0,
        y: obj.top || 0,
        width: obj.width || 0,
        height: obj.height || 0,
        rotation: obj.angle || 0,
        opacity: obj.opacity || 1,
      });
    };

    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('object:modified', handleObjectModified);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();
    objects.forEach((obj) => {
      if (!(obj as any).isArtboard) {
        canvas.remove(obj);
      }
    });

    elements.forEach((el) => {
      let fabricObj: fabric.FabricObject | null = null;

      switch (el.type) {
        case 'rectangle':
          fabricObj = new fabric.Rect({
            left: el.x,
            top: el.y,
            width: el.width,
            height: el.height,
            fill: el.fill,
            stroke: el.stroke,
            strokeWidth: el.strokeWidth,
            angle: el.rotation,
            opacity: el.opacity,
          });
          break;
        case 'ellipse':
          fabricObj = new fabric.Ellipse({
            left: el.x,
            top: el.y,
            rx: el.width / 2,
            ry: el.height / 2,
            fill: el.fill,
            stroke: el.stroke,
            strokeWidth: el.strokeWidth,
            angle: el.rotation,
            opacity: el.opacity,
          });
          break;
        case 'text':
          fabricObj = new fabric.IText('Text', {
            left: el.x,
            top: el.y,
            fontSize: 24,
            fill: el.fill,
          });
          break;
        case 'line':
          fabricObj = new fabric.Line([el.x, el.y, el.x + el.width, el.y + el.height], {
            stroke: el.stroke,
            strokeWidth: el.strokeWidth,
          });
          break;
      }

      if (fabricObj) {
        (fabricObj as any).designId = el.id;
        canvas.add(fabricObj);
      }
    });

    canvas.renderAll();
  }, [elements]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    let isCreating = false;
    let startX = 0;
    let startY = 0;
    let currentObj: fabric.FabricObject | null = null;

    const handleMouseDown = (options: any) => {
      if (options.target) return;

      const pointer = canvas.getPointer(options.e);
      startX = pointer.x;
      startY = pointer.y;

      if (activeTool === 'select') return;

      isCreating = true;

      switch (activeTool) {
        case 'rectangle':
          currentObj = new fabric.Rect({
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            fill: '#3b82f6',
            stroke: '',
            strokeWidth: 0,
          });
          break;
        case 'ellipse':
          currentObj = new fabric.Ellipse({
            left: startX,
            top: startY,
            rx: 0,
            ry: 0,
            fill: '#3b82f6',
            stroke: '',
            strokeWidth: 0,
          });
          break;
        case 'text':
          const textId = addElement('text', startX, startY);
          currentObj = new fabric.IText('Text', {
            left: startX,
            top: startY,
            fontSize: 24,
            fill: '#3b82f6',
          });
          (currentObj as any).designId = textId;
          break;
        case 'line':
          currentObj = new fabric.Line([startX, startY, startX, startY], {
            stroke: '#000000',
            strokeWidth: 2,
          });
          break;
      }

      if (currentObj) {
        canvas.add(currentObj);
        canvas.setActiveObject(currentObj);
      }
    };

    const handleMouseMove = (options: any) => {
      if (!isCreating || !currentObj) return;

      const pointer = canvas.getPointer(options.e);
      const width = Math.abs(pointer.x - startX);
      const height = Math.abs(pointer.y - startY);
      const left = Math.min(pointer.x, startX);
      const top = Math.min(pointer.y, startY);

      if (activeTool === 'ellipse') {
        (currentObj as fabric.Ellipse).set({
          rx: width / 2,
          ry: height / 2,
          left: left + width / 2,
          top: top + height / 2,
        });
      } else if (activeTool === 'line') {
        (currentObj as fabric.Line).set({
          x2: pointer.x,
          y2: pointer.y,
        });
      } else {
        currentObj.set({
          width: Math.max(width, 5),
          height: Math.max(height, 5),
          left,
          top,
        });
      }

      canvas.requestRenderAll();
    };

    const handleMouseUp = () => {
      isCreating = false;
      currentObj = null;
    };

    const canvas = fabricRef.current;
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [activeTool, addElement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          deleteElements(selectedIds);
        }
      } else if (e.key === 'v') {
        setActiveTool('select');
      } else if (e.key === 'r') {
        setActiveTool('rectangle');
      } else if (e.key === 'e') {
        setActiveTool('ellipse');
      } else if (e.key === 't') {
        setActiveTool('text');
      } else if (e.key === 'l') {
        setActiveTool('line');
      } else if (e.key === 'Escape') {
        setActiveTool('select');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, deleteElements, setActiveTool]);

  const selectedElement = elements.find((el) => selectedIds.includes(el.id));

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-2">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              activeTool === tool.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={tool.label}
          >
            {tool.id === 'select' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            )}
            {tool.id === 'rectangle' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
              </svg>
            )}
            {tool.id === 'ellipse' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
              </svg>
            )}
            {tool.id === 'text' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 6v2m16-2v2M10 6v12m4-12v12M8 6v12" />
              </svg>
            )}
            {tool.id === 'line' && (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
              </svg>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="absolute inset-0" />
      </div>

      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="flex border-b">
          <button className="flex-1 py-3 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
            Properties
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {selectedElement ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fill Color
                </label>
                <input
                  type="color"
                  value={selectedElement.fill}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { fill: e.target.value })
                  }
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stroke Color
                </label>
                <input
                  type="color"
                  value={selectedElement.stroke}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { stroke: e.target.value })
                  }
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stroke Width
                </label>
                <input
                  type="number"
                  value={selectedElement.strokeWidth}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { strokeWidth: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opacity
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selectedElement.opacity}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { opacity: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Layers</h3>
            <div className="space-y-1">
              {elements.map((el) => (
                <button
                  key={el.id}
                  onClick={() => selectElement(el.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${
                    selectedIds.includes(el.id)
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {el.type} ({Math.round(el.x)}, {Math.round(el.y)})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}