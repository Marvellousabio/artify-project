import { fabric } from 'fabric';

declare module 'fabric' {
  export class Canvas {
    add(...objects: fabric.Object[]): fabric.StaticCanvas;
    remove(...objects: fabric.Object[]): fabric.StaticCanvas;
    clear(): fabric.StaticCanvas;
    getActiveObject(): fabric.Object | null;
    getActiveObjects(): fabric.Object[];
    setActiveObject(object: fabric.Object | null): fabric.StaticCanvas;
    setViewportTransform(transform: number[]): void;
    getPan(): { x: number; y: number };
    zoomToPoint(point: { x: number; y: number }, zoom: number): void;
    toDataURL(options?: any): string;
    toJSON(): any;
    loadFromJSON(json: any, callback?: () => void, reviver?: Function): Promise<void>;
    on(event: string, handler: (e: any) => void): fabric.StaticCanvas;
    off(event: string, handler?: (e: any) => void): fabric.StaticCanvas;
    requestRenderAll(): void;
    renderAll(): void;
    discardActiveObject(): fabric.StaticCanvas;
    destroy(): void;
    higherObject(object: fabric.Object): fabric.StaticCanvas;
    lowerObject(object: fabric.Object): fabric.StaticCanvas;
    bringToFront(object: fabric.Object): fabric.StaticCanvas;
    sendToBack(object: fabric.Object): fabric.StaticCanvas;
  }

  export class Rect extends fabric.Rect {}
  export class Ellipse extends fabric.Ellipse {}
  export class IText extends fabric.IText {}
  export class Textbox extends fabric.Textbox {}
  export class Line extends fabric.Line {}
  export class Image extends fabric.Image {}
  export class Group extends fabric.Group {}
  export class FabricObject {
    id?: string;
    set(key: string, value: any): this;
    setOptions(options: any): this;
    toDataURL(options?: any): string;
    toJSON(propertiesToInclude?: string[]): any;
    clone(cloneAs?: string): FabricObject;
  }
}
