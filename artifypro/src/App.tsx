import { useRef, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { useEditorStore } from '@/store/editorStore';
import Toolbar from '@/components/Toolbar';
import PropertiesPanel from '@/components/PropertiesPanel';
import LayersPanel from '@/components/LayersPanel';
import Rulers from '@/components/Rulers';
import { DesignElement, ARTBOARD_WIDTH, ARTBOARD_HEIGHT, GRID_SIZE } from '@/types';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isPanning = useRef(false);
  const lastPanPos = useRef({ x: 0, y: 0 });
  
  const {
    elements,
    selectedIds,
    activeTool,
    viewport,
    showGrid,
    snapToGrid,
    gridSize,
    addElement,
    updateElement,
    selectElement,
    clearSelection,
    setActiveTool,
    setZoom,
    setPan,
    pushHistory,
    undo,
    redo,
    deleteElements,
    duplicateElements,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    toggleVisibility,
    toggleLock,
    groupElements,
    ungroupElement,
  } = useEditorStore();

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#F0F0F0',
      selection: true,
      preserveObjectStacking: true,
      renderOnAddRemove: true,
    });

    fabricRef.current = canvas;

    // Viewport transformations
    const viewportTransformer = new fabric.Group([], {
      id: 'viewport-transform',
      selectable: false,
      evented: false,
    });
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];

    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in text input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      const cmd = e.metaKey || e.ctrlKey;
      
      switch (e.key.toLowerCase()) {
        case 'v':
          if (cmd) {
            e.preventDefault();
            pasteElements();
          } else {
            setActiveTool('select');
          }
          break;
        case 'r':
          setActiveTool('rectangle');
          break;
        case 'e':
          setActiveTool('ellipse');
          break;
        case 't':
          setActiveTool('text');
          break;
        case 'i':
          setActiveTool('image');
          break;
        case 'f':
          setActiveTool('frame');
          break;
        case 'l':
          setActiveTool('line');
          break;
        case 'g':
          if (cmd) {
            e.preventDefault();
            groupElements(selectedIds);
          } else {
            useEditorStore.getState().toggleSnap();
          }
          break;
        case 'shift+g':
          e.preventDefault();
          selectedIds.forEach(id => ungroupElement(id));
          break;
        case 'delete':
        case 'backspace':
          e.preventDefault();
          if (selectedIds.length > 0) {
            pushHistory();
            deleteElements(selectedIds);
          }
          break;
        case 'z':
          if (cmd) {
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
          }
          break;
        case 'y':
          if (cmd) {
            e.preventDefault();
            redo();
          }
          break;
        case 'c':
          if (cmd) {
            e.preventDefault();
            copyElements();
          }
          break;
        case 'a':
          if (cmd) {
            e.preventDefault();
            selectAll();
          }
          break;
        case 'arrowup':
        case 'arrowdown':
        case 'arrowleft':
        case 'arrowright':
          e.preventDefault();
          nudgeElements(e.key, e.shiftKey);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Resize handler
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      canvas.renderAll();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  // Sync elements to fabric canvas
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Clear current fabric objects (except viewport transform)
    const existingObjects = canvas.getObjects().filter(
      (obj) => !(obj as any).id?.startsWith('__internal__')
    );
    existingObjects.forEach((obj) => canvas.remove(obj));

    // Create fabric objects from state
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
            rx: el.borderRadius.linked ? el.borderRadius.topLeft : undefined,
            ry: el.borderRadius.linked ? el.borderRadius.topLeft : undefined,
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
          fabricObj = new fabric.IText(el.text || 'Text', {
            left: el.x,
            top: el.y,
            fontFamily: el.fontFamily || 'Inter',
            fontSize: el.fontSize || 16,
            fontWeight: el.fontWeight as any || 'normal',
            lineHeight: el.lineHeight || 1.5,
            charSpacing: el.letterSpacing ? el.letterSpacing * 1000 : 0,
            textAlign: el.textAlign || 'left',
            fill: el.fill,
            stroke: el.stroke,
            strokeWidth: el.strokeWidth,
            angle: el.rotation,
            opacity: el.opacity,
          });
          break;

        case 'line':
          fabricObj = new fabric.Line(
            [el.x, el.y, el.x + el.width, el.y + el.height],
            {
              stroke: el.stroke || '#000000',
              strokeWidth: el.strokeWidth,
              angle: el.rotation,
              opacity: el.opacity,
            }
          );
          break;

        case 'frame':
          fabricObj = new fabric.Rect({
            left: el.x,
            top: el.y,
            width: el.width,
            height: el.height,
            fill: '',
            stroke: '#94a3b8',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            angle: el.rotation,
            opacity: el.opacity,
            selectable: true,
          });
          break;
      }

      if (fabricObj) {
        (fabricObj as any).designId = el.id;
        fabricObj.set({
          id: el.id,
          selectable: !el.locked,
          evented: !el.locked,
          visible: el.visible !== false,
        });
        canvas.add(fabricObj);
      }
    });

    // Restore selection
    if (selectedIds.length > 0) {
      const toSelect = canvas.getObjects().filter((obj) =>
        selectedIds.includes((obj as any).designId as string)
      );
      canvas.setActiveObject(
        toSelect.length === 1 ? toSelect[0] : new fabric.ActiveSelection(toSelect, { canvas })
      );
    }

    canvas.renderAll();
  }, [elements, selectedIds]);

  // Tool-specific mouse handlers
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    let isCreating = false;
    let startX = 0;
    let startY = 0;
    let currentObj: fabric.FabricObject | null = null;

    const handleMouseDown = (options: any) => {
      if (options.target) return; // Let selection handle it

      const pointer = canvas.getPointer(options.e);
      const canvasPoint = canvas.viewportTransform
        ? fabric.util.transformPoint(
            { x: pointer.x, y: pointer.y },
            fabric.util.invertTransform(canvas.viewportTransform)
          )
        : pointer;

      startX = canvasPoint.x;
      startY = canvasPoint.y;

      if (activeTool === 'select' && options.e.spaceKey) {
        isPanning = true;
        lastPanPos.current = { x: options.e.clientX, y: options.e.clientY };
        canvas.defaultCursor = 'grab';
        return;
      }

      if (activeTool === 'select') {
        return;
      }

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
          const textEl = elements.find((el) => el.id === textId);
          if (textEl) {
            currentObj = new fabric.IText(textEl.text || 'Text', {
              left: startX,
              top: startY,
              fontFamily: textEl.fontFamily || 'Inter',
              fontSize: textEl.fontSize || 16,
            });
            (currentObj as any).designId = textId;
          }
          break;

        case 'line':
          currentObj = new fabric.Line(
            [startX, startY, startX, startY],
            {
              stroke: '#000000',
              strokeWidth: 2,
            }
          );
          break;

        case 'frame':
          currentObj = new fabric.Rect({
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            fill: 'transparent',
            stroke: '#94a3b8',
            strokeWidth: 1,
            strokeDashArray: [5, 5],
          });
          break;
      }

      if (currentObj) {
        canvas.add(currentObj);
        canvas.setActiveObject(currentObj);
      }
    };

    const handleMouseMove = (options: any) => {
      const pointer = canvas.getPointer(options.e);
      const canvasPoint = canvas.viewportTransform
        ? fabric.util.transformPoint(
            { x: pointer.x, y: pointer.y },
            fabric.util.invertTransform(canvas.viewportTransform)
          )
        : pointer;

      if (isPanning) {
        const dx = options.e.clientX - lastPanPos.current.x;
        const dy = options.e.clientY - lastPanPos.current.y;
        const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
        vpt[4] += dx;
        vpt[5] += dy;
        canvas.setViewportTransform(vpt);
        lastPanPos.current = { x: options.e.clientX, y: options.e.clientY };
        return;
      }

      if (!isCreating || !currentObj) return;

      const width = Math.abs(canvasPoint.x - startX);
      const height = Math.abs(canvasPoint.y - startY);
      const left = Math.min(canvasPoint.x, startX);
      const top = Math.min(canvasPoint.y, startY);

      if (activeTool === 'ellipse') {
        (currentObj as fabric.Ellipse).set({
          rx: width / 2,
          ry: height / 2,
          left: left + width / 2,
          top: top + height / 2,
        });
      } else if (activeTool === 'line') {
        (currentObj as fabric.Line).set({
          x2: canvasPoint.x,
          y2: canvasPoint.y,
        });
      } else {
        currentObj.set({
          width: Math.max(width, 5),
          height: Math.max(height, 5),
          left,
          top,
        });
      }

      // Snap to grid
      if (snapToGrid && gridSize > 0) {
        const snappedLeft = Math.round(left / gridSize) * gridSize;
        const snappedTop = Math.round(top / gridSize) * gridSize;
        currentObj.set({ left: snappedLeft, top: snappedTop });
      }

      canvas.requestRenderAll();
    };

    const handleMouseUp = () => {
      isPanning = false;
      isCreating = false;

      if (currentObj) {
        const designId = (currentObj as any).designId as string;
        if (designId) {
          // Update store with final position/size
          const updates: Partial<DesignElement> = {
            x: currentObj.left || 0,
            y: currentObj.top || 0,
            width: currentObj.width || 0,
            height: currentObj.height || 0,
            rotation: currentObj.angle || 0,
          };
          updateElement(designId, updates);
        }
      }

      currentObj = null;
      canvas.defaultCursor = 'default';
    };

    const handleSelectionCreated = (e: any) => {
      const selected = e.selected || [];
      const ids = selected.map((obj: any) => obj.designId).filter(Boolean) as string[];
      selectElement(ids[0] || '', false);
    };

    const handleSelectionUpdated = (e: any) => {
      const selected = e.selected || [];
      const ids = selected.map((obj: any) => obj.designId).filter(Boolean) as string[];
      if (ids.length === 1) {
        selectElement(ids[0], false);
      }
    };

    const handleObjectModified = (e: any) => {
      const obj = e.target;
      if (!obj || !obj.designId) return;

      pushHistory();

      const updates: Partial<DesignElement> = {
        x: obj.left || 0,
        y: obj.top || 0,
        width: obj.width || 0,
        height: obj.height || 0,
        rotation: obj.angle || 0,
        opacity: obj.opacity || 1,
      };

      // Handle fill/stroke
      if ('fill' in obj) {
        updates.fill = obj.fill as string;
      }
      if ('stroke' in obj) {
        updates.stroke = obj.stroke as string;
      }
      if ('strokeWidth' in obj) {
        updates.strokeWidth = obj.strokeWidth || 0;
      }

      updateElement(obj.designId, updates);
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('object:modified', handleObjectModified);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('object:modified', handleObjectModified);
    };
  }, [activeTool, snapToGrid, gridSize]);

  // Initialize with an artboard
  useEffect(() => {
    if (elements.length === 0) {
      addElement('frame', (ARTBOARD_WIDTH - 960) / 2, (ARTBOARD_HEIGHT - 600) / 2);
    }
  }, []);

  // Zoom & pan effects
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const zoom = viewport.zoom;
    const panX = viewport.panX;
    const panY = viewport.panY;
    
    const vpt = [zoom, 0, 0, zoom, panX, panY];
    canvas.setViewportTransform(vpt);
    canvas.renderAll();
  }, [viewport]);

  // Utility functions
  const copyElements = useCallback(() => {
    const state = get();
    const clipboard: DesignElement[] = state.selectedIds
      .map((id) => state.elements.find((el) => el.id === id))
      .filter(Boolean) as DesignElement[];
    localStorage.setItem('artify-clipboard', JSON.stringify(clipboard));
  }, []);

  const pasteElements = useCallback(() => {
    const clipboardJson = localStorage.getItem('artify-clipboard');
    if (!clipboardJson) return;

    const clipboard: DesignElement[] = JSON.parse(clipboardJson);
    const newIds: string[] = [];

    get().selectedIds.forEach((id) => {
      const original = clipboard.find((el) => el.id === id);
      if (original) {
        const newId = addElement(original.type, original.x + 20, original.y + 20);
        const newEl = get().elements.find((el) => el.id === newId);
        if (newEl) {
          updateElement(newId, {
            width: original.width,
            height: original.height,
            fill: original.fill,
            stroke: original.stroke,
            strokeWidth: original.strokeWidth,
          });
        }
        newIds.push(newId);
      }
    });

    if (newIds.length > 0) {
      selectElements(newIds);
    }
  }, []);

  const selectAll = useCallback(() => {
    const ids = elements.map((el) => el.id);
    selectElements(ids);
  }, [elements]);

  const nudgeElements = useCallback((key: string, large: boolean) => {
    const step = large ? 8 : 1;
    let dx = 0, dy = 0;
    
    switch (key) {
      case 'ArrowUp': dy = -step; break;
      case 'ArrowDown': dy = step; break;
      case 'ArrowLeft': dx = -step; break;
      case 'ArrowRight': dx = step; break;
    }

    const canvas = fabricRef.current;
    if (!canvas) return;

    const selected = canvas.getActiveObjects();
    if (selected.length === 0) return;

    pushHistory();

    selected.forEach((obj) => {
      obj.set({ left: (obj.left || 0) + dx, top: (obj.top || 0) + dy });
    });

    canvas.requestRenderAll();
    
    // Update store
    selectedIds.forEach((id) => {
      const el = elements.find((e) => e.id === id);
      if (el) {
        updateElement(id, { x: el.x + dx, y: el.y + dy });
      }
    });
  }, [selectedIds, elements]);

  // Update store actions in useEffect
  useEffect(() => {
    useEditorStore.setState({
      addElement,
      updateElement,
      selectElement,
      clearSelection,
      setActiveTool,
      setZoom,
      setPan,
      undo,
      redo,
      pushHistory,
      deleteElements,
      duplicateElements,
      bringForward,
      sendBackward,
      bringToFront,
      sendToBack,
      toggleVisibility,
      toggleLock,
      groupElements,
      ungroupElement,
    });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Left Toolbar */}
      <Toolbar activeTool={activeTool} />

      {/* Center Canvas Area */}
      <div className="flex-1 relative">
        {/* Rulers */}
        <Rulers />

        {/* Fabric Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
          <button
            onClick={() => setZoom(viewport.zoom - 0.1)}
            className="px-2 py-1 hover:bg-gray-100 rounded"
          >
            −
          </button>
          <span className="px-2 text-sm font-mono w-16 text-center">
            {Math.round(viewport.zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(viewport.zoom + 0.1)}
            className="px-2 py-1 hover:bg-gray-100 rounded"
          >
            +
          </button>
          <button
            onClick={() => { setZoom(1); setPan(0, 0); }}
            className="px-2 py-1 hover:bg-gray-100 rounded text-xs"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => useEditorStore.getState().setActiveTab('properties')}
            className={`flex-1 py-3 text-sm font-medium ${
              useEditorStore.getState().activePanelTab === 'properties'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => useEditorStore.getState().setActiveTab('layers')}
            className={`flex-1 py-3 text-sm font-medium ${
              useEditorStore.getState().activePanelTab === 'layers'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Layers
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {useEditorStore.getState().activePanelTab === 'properties' ? (
            <PropertiesPanel />
          ) : (
            <LayersPanel />
          )}
        </div>
      </div>
    </div>
  );
}
