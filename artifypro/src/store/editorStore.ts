import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  DesignElement,
  Tool,
  ViewportState,
  HistoryState,
  DEFAULT_ELEMENT,
  DEFAULT_BORDER_RADIUS,
  ARTBOARD_WIDTH,
  ARTBOARD_HEIGHT,
  GRID_SIZE,
  MAX_HISTORY,
} from '@/types';

interface EditorState {
  // Elements
  elements: DesignElement[];
  selectedIds: string[];
  
  // Tool
  activeTool: Tool;
  
  // Viewport
  viewport: ViewportState;
  
  // History (undo/redo)
  history: HistoryState;
  
  // UI State
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  units: 'px' | 'rem';
  
  // Panels
  showLayersPanel: boolean;
  activePanelTab: 'properties' | 'layers';
}

interface EditorActions {
  // Element CRUD
  addElement: (type: DesignElement['type'], x?: number, y?: number) => string;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  deleteElements: (ids: string[]) => void;
  duplicateElements: (ids: string[]) => string[];
  
  // Selection
  selectElement: (id: string, addToSelection?: boolean) => void;
  selectElements: (ids: string[]) => void;
  clearSelection: () => void;
  toggleSelection: (id: string) => void;
  
  // Tool
  setActiveTool: (tool: Tool) => void;
  
  // Viewport
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  zoomAt: (zoom: number, point: { x: number; y: number }) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Settings
  toggleGrid: () => void;
  toggleSnap: () => void;
  setUnits: (units: 'px' | 'rem') => void;
  setActiveTab: (tab: 'properties' | 'layers') => void;
  
  // Layers
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  
  // Grouping
  groupElements: (ids: string[]) => void;
  ungroupElement: (id: string) => void;
  
  // Initialization
  initializeFromFabric: (objects: fabric.Object[]) => void;
}

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  // Initial State
  elements: [],
  selectedIds: [],
  activeTool: 'select',
  viewport: { zoom: 1, panX: 0, panY: 0 },
  history: { past: [], present: [], future: [] },
  showGrid: true,
  snapToGrid: true,
  gridSize: GRID_SIZE,
  units: 'px',
  showLayersPanel: true,
  activePanelTab: 'properties',

  // Element CRUD
  addElement: (type, x = 100, y = 100) => {
    const id = uuidv4();
    const newElement: DesignElement = {
      ...DEFAULT_ELEMENT,
      id,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${get().elements.length + 1}`,
      x,
      y,
      ...(type === 'text' && { 
        text: 'Text',
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 'normal',
        lineHeight: 1.5,
        letterSpacing: 0,
        textAlign: 'left',
      }),
      ...(type === 'ellipse' && { width: 100, height: 100 }),
      ...(type === 'line' && { width: 150, height: 2 }),
    };
    
    set((state) => {
      const newElements = [...state.elements, newElement];
      const newHistory = {
        ...state.history,
        past: [...state.history.past.slice(-MAX_HISTORY + 1), state.elements],
        present: newElements,
        future: [],
      };
      return { elements: newElements, history: newHistory, selectedIds: [id] };
    });
    
    return id;
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } as DesignElement : el
      ),
    }));
  },

  deleteElements: (ids) => {
    set((state) => {
      const newElements = state.elements.filter((el) => !ids.includes(el.id));
      const newHistory = {
        ...state.history,
        past: [...state.history.past.slice(-MAX_HISTORY + 1), state.elements],
        present: newElements,
        future: [],
      };
      return {
        elements: newElements,
        selectedIds: state.selectedIds.filter((id) => !ids.includes(id)),
        history: newHistory,
      };
    });
  },

  duplicateElements: (ids) => {
    const state = get();
    const duplicates: string[] = [];
    
    ids.forEach((id) => {
      const element = state.elements.find((el) => el.id === id);
      if (element) {
        const newId = uuidv4();
        const duplicate: DesignElement = {
          ...element,
          id: newId,
          name: `${element.name} copy`,
          x: element.x + 20,
          y: element.y + 20,
        };
        set((prev) => ({ elements: [...prev.elements, duplicate] }));
        duplicates.push(newId);
      }
    });

    return duplicates;
  },

  // Selection
  selectElement: (id, addToSelection = false) => {
    set((state) => ({
      selectedIds: addToSelection
        ? state.selectedIds.includes(id)
          ? state.selectedIds.filter((i) => i !== id)
          : [...state.selectedIds, id]
        : [id],
    }));
  },

  selectElements: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  toggleSelection: (id) => {
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((i) => i !== id)
        : [...state.selectedIds, id],
    }));
  },

  // Tool
  setActiveTool: (tool) => {
    set({ activeTool: tool });
    // Deselect when switching to creation tools
    if (['rectangle', 'ellipse', 'text', 'image', 'frame', 'line'].includes(tool)) {
      set({ selectedIds: [] });
    }
  },

  // Viewport
  setZoom: (zoom) => {
    set((state) => ({
      viewport: { ...state.viewport, zoom: Math.max(0.1, Math.min(5, zoom)) },
    }));
  },

  setPan: (panX, panY) => {
    set((state) => ({
      viewport: { ...state.viewport, panX, panY },
    }));
  },

  zoomAt: (zoom, point) => {
    const state = get();
    const { zoom: oldZoom, panX, panY } = state.viewport;
    const newZoom = Math.max(0.1, Math.min(5, zoom));
    
    // Calculate new pan to zoom towards cursor point
    const scale = newZoom / oldZoom;
    const newPanX = point.x - (point.x - panX) * scale;
    const newPanY = point.y - (point.y - panY) * scale;
    
    set({
      viewport: { zoom: newZoom, panX: newPanX, panY: newPanY },
    });
  },

  // History
  pushHistory: () => {
    const state = get();
    const newPast = [...state.history.past.slice(-MAX_HISTORY + 1), state.history.present];
    
    set((state) => ({
      history: {
        ...state.history,
        past: newPast,
        present: state.elements,
        future: [],
      },
    }));
  },

  undo: () => {
    const state = get();
    if (state.history.past.length === 0) return;
    
    const previous = state.history.past[state.history.past.length - 1];
    const newPast = state.history.past.slice(0, -1);
    
    set({
      elements: previous,
      history: {
        past: newPast,
        present: previous,
        future: [state.history.present, ...state.history.future],
      },
      selectedIds: [],
    });
  },

  redo: () => {
    const state = get();
    if (state.history.future.length === 0) return;
    
    const next = state.history.future[0];
    const newFuture = state.history.future.slice(1);
    
    set({
      elements: next,
      history: {
        past: [...state.history.past, state.history.present],
        present: next,
        future: newFuture,
      },
      selectedIds: [],
    });
  },

  canUndo: () => get().history.past.length > 0,
  canRedo: () => get().history.future.length > 0,

  // Settings
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  setUnits: (units) => set({ units }),
  setActiveTab: (tab) => set({ activePanelTab: tab }),

  // Layers
  bringForward: (id) => {
    set((state) => {
      const index = state.elements.findIndex((el) => el.id === id);
      if (index === state.elements.length - 1) return state;
      
      const newElements = [...state.elements];
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
      
      return { elements: newElements };
    });
  },

  sendBackward: (id) => {
    set((state) => {
      const index = state.elements.findIndex((el) => el.id === id);
      if (index === 0) return state;
      
      const newElements = [...state.elements];
      [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
      
      return { elements: newElements };
    });
  },

  bringToFront: (id) => {
    set((state) => ({
      elements: [
        ...state.elements.filter((el) => el.id !== id),
        state.elements.find((el) => el.id === id)!,
      ],
    }));
  },

  sendToBack: (id) => {
    set((state) => ({
      elements: [
        state.elements.find((el) => el.id === id)!,
        ...state.elements.filter((el) => el.id !== id),
      ],
    }));
  },

  toggleVisibility: (id) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, visible: !el.visible } : el
      ),
    }));
  },

  toggleLock: (id) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, locked: !el.locked } : el
      ),
    }));
  },

  reorderLayers: (fromIndex, toIndex) => {
    set((state) => {
      const newElements = [...state.elements];
      const [removed] = newElements.splice(fromIndex, 1);
      newElements.splice(toIndex, 0, removed);
      return { elements: newElements };
    });
  },

  // Grouping
  groupElements: (ids) => {
    const state = get();
    const groupId = uuidv4();
    const selectedElements = state.elements.filter((el) => ids.includes(el.id));
    
    if (selectedElements.length < 2) return;
    
    // Calculate bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    selectedElements.forEach((el) => {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.width);
      maxY = Math.max(maxY, el.y + el.height);
    });
    
    const group: DesignElement = {
      id: groupId,
      type: 'frame',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      rotation: 0,
      opacity: 1,
      fill: '#ffffff',
      stroke: '',
      strokeWidth: 0,
      borderRadius: DEFAULT_BORDER_RADIUS,
      responsive: { mobile: {}, tablet: {} },
      name: `Group ${state.elements.length + 1}`,
    };
    
    // Remove individual elements and add group
    const remainingElements = state.elements.filter((el) => !ids.includes(el.id));
    const newElements = [...remainingElements, group];
    
    set({ elements: newElements, selectedIds: [groupId] });
  },

  ungroupElement: (id) => {
    // For now, just delete the group (full ungrouping requires tracking children)
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedIds: state.selectedIds.filter((i) => i !== id),
    }));
  },

  // Fabric initialization
  initializeFromFabric: (objects) => {
    // This will be implemented when fabric canvas is ready
    console.log('Fabric objects loaded:', objects.length);
  },
}));
