declare module 'fabric' {
  export namespace fabric {
    class Canvas {
      constructor(element: HTMLCanvasElement | string | null, options?: any);
      width: number;
      height: number;
      backgroundColor: string;
      selection: boolean;
      preserveObjectStacking: boolean;
      renderOnAddRemove: boolean;
      viewportTransform: number[];
      getObjects(): FabricObject[];
      add(...objects: FabricObject[]): void;
      remove(...objects: FabricObject[]): void;
      getPointer(e: any): { x: number; y: number };
      setViewportTransform(vpt: number[]): void;
      renderAll(): void;
      requestRenderAll(): void;
      dispose(): void;
      setActiveObject(object: FabricObject | ActiveSelection): void;
      getActiveObjects(): FabricObject[];
      on(event: string, handler: (e: any) => void): void;
      off(event: string, handler?: (e: any) => void): void;
      setDimensions(dimensions: { width: number; height: number }): void;
    }

    class Rect {
      constructor(options?: any);
      left: number;
      top: number;
      width: number;
      height: number;
      fill: string | null;
      stroke: string | null;
      strokeWidth: number;
      angle: number;
      opacity: number;
      rx?: number;
      ry?: number;
      set(options: any): void;
    }

    class Ellipse {
      constructor(options?: any);
      left: number;
      top: number;
      rx: number;
      ry: number;
      fill: string | null;
      stroke: string | null;
      strokeWidth: number;
      angle: number;
      opacity: number;
      set(options: any): void;
    }

    class IText {
      constructor(text: string, options?: any);
      left: number;
      top: number;
      fontSize: number;
      fill: string;
      set(options: any): void;
    }

    class Line {
      constructor(points: number[], options?: any);
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      left: number;
      top: number;
      stroke: string;
      strokeWidth: number;
      set(options: any): void;
    }

    class ActiveSelection {
      constructor(objects: FabricObject[], options?: any);
    }

    type FabricObject = Rect | Ellipse | IText | Line | ActiveSelection;

    const util: {
      transformPoint: (point: { x: number; y: number }, matrix: number[]) => { x: number; y: number };
      invertTransform: (matrix: number[]) => number[];
    };
  }
}