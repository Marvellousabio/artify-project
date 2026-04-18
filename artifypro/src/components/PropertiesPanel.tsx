import { useEditorStore } from '@/store/editorStore';
import { DesignElement, BorderRadius } from '@/types';
import { Trash2, Copy, Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, ChevronUp, ChevronDown } from 'lucide-react';

export default function PropertiesPanel() {
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const elements = useEditorStore((state) => state.elements);
  const updateElement = useEditorStore((state) => state.updateElement);
  const deleteElements = useEditorStore((state) => state.deleteElements);
  const duplicateElements = useEditorStore((state) => state.duplicateElements);
  const bringForward = useEditorStore((state) => state.bringForward);
  const sendBackward = useEditorStore((state) => state.sendBackward);
  const bringToFront = useEditorStore((state) => state.bringToFront);
  const sendToBack = useEditorStore((state) => state.sendToBack);
  const toggleVisibility = useEditorStore((state) => state.toggleVisibility);
  const toggleLock = useEditorStore((state) => state.toggleLock);

  const selectedElement = selectedIds.length === 1
    ? elements.find((el) => el.id === selectedIds[0])
    : null;

  const handleUpdate = (updates: Partial<DesignElement>) => {
    if (selectedIds.length === 1 && selectedElement) {
      updateElement(selectedElement.id, updates);
    }
  };

  const handleBulkUpdate = (updates: Partial<DesignElement>) => {
    selectedIds.forEach((id) => updateElement(id, updates));
  };

  if (selectedIds.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        Select an element to edit its properties
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Multi-selection indicator */}
      {selectedIds.length > 1 && (
        <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm">
          {selectedIds.length} elements selected
        </div>
      )}

      {/* Position & Size */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Position & Size</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">X</label>
            <input
              type="number"
              value={selectedElement?.x || 0}
              onChange={(e) => handleUpdate({ x: Number(e.target.value) })}
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Y</label>
            <input
              type="number"
              value={selectedElement?.y || 0}
              onChange={(e) => handleUpdate({ y: Number(e.target.value) })}
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">W</label>
            <input
              type="number"
              value={Math.round(selectedElement?.width || 0)}
              onChange={(e) => handleUpdate({ width: Number(e.target.value) })}
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">H</label>
            <input
              type="number"
              value={Math.round(selectedElement?.height || 0)}
              onChange={(e) => handleUpdate({ height: Number(e.target.value) })}
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
        </div>
      </section>

      {/* Fill Color */}
      {selectedElement?.type !== 'line' && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Fill</h3>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedElement?.fill || '#000000'}
              onChange={(e) => handleUpdate({ fill: e.target.value })}
              className="w-10 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={selectedElement?.fill || '#000000'}
              onChange={(e) => handleUpdate({ fill: e.target.value })}
              className="flex-1 px-2 py-1 border rounded text-sm font-mono"
              placeholder="#000000"
            />
          </div>
        </section>
      )}

      {/* Stroke */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Border</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedElement?.stroke || '#000000'}
              onChange={(e) => handleUpdate({ stroke: e.target.value })}
              className="w-8 h-8 rounded border cursor-pointer"
            />
            <input
              type="number"
              value={selectedElement?.strokeWidth || 0}
              onChange={(e) => handleUpdate({ strokeWidth: Number(e.target.value) })}
              className="w-16 px-2 py-1 border rounded text-sm"
              placeholder="Width"
              min="0"
              max="20"
            />
            <span className="text-xs text-gray-500">px</span>
          </div>
          <select
            value="solid"
            className="w-full px-2 py-1 border rounded text-sm"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>
      </section>

      {/* Border Radius */}
      {selectedElement?.type === 'rectangle' && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Border Radius</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={selectedElement?.borderRadius?.topLeft || 0}
                onChange={(e) => {
                  const r: BorderRadius = {
                    topLeft: Number(e.target.value),
                    topRight: selectedElement?.borderRadius?.topRight || 0,
                    bottomLeft: selectedElement?.borderRadius?.bottomLeft || 0,
                    bottomRight: selectedElement?.borderRadius?.bottomRight || 0,
                    linked: selectedElement?.borderRadius?.linked || false,
                  };
                  handleUpdate({ borderRadius: r });
                }}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="TL"
              />
              <input
                type="number"
                value={selectedElement?.borderRadius?.topRight || 0}
                onChange={(e) => {
                  const r: BorderRadius = {
                    topLeft: selectedElement?.borderRadius?.topLeft || 0,
                    topRight: Number(e.target.value),
                    bottomLeft: selectedElement?.borderRadius?.bottomLeft || 0,
                    bottomRight: selectedElement?.borderRadius?.bottomRight || 0,
                    linked: selectedElement?.borderRadius?.linked || false,
                  };
                  handleUpdate({ borderRadius: r });
                }}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="TR"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={selectedElement?.borderRadius?.bottomLeft || 0}
                onChange={(e) => {
                  const r: BorderRadius = {
                    topLeft: selectedElement?.borderRadius?.topLeft || 0,
                    topRight: selectedElement?.borderRadius?.topRight || 0,
                    bottomLeft: Number(e.target.value),
                    bottomRight: selectedElement?.borderRadius?.bottomRight || 0,
                    linked: selectedElement?.borderRadius?.linked || false,
                  };
                  handleUpdate({ borderRadius: r });
                }}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="BL"
              />
              <input
                type="number"
                value={selectedElement?.borderRadius?.bottomRight || 0}
                onChange={(e) => {
                  const r: BorderRadius = {
                    topLeft: selectedElement?.borderRadius?.topLeft || 0,
                    topRight: selectedElement?.borderRadius?.topRight || 0,
                    bottomLeft: selectedElement?.borderRadius?.bottomLeft || 0,
                    bottomRight: Number(e.target.value),
                    linked: selectedElement?.borderRadius?.linked || false,
                  };
                  handleUpdate({ borderRadius: r });
                }}
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder="BR"
              />
            </div>
          </div>
        </section>
      )}

      {/* Typography */}
      {selectedElement?.type === 'text' && (
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Typography</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Font</label>
              <select
                value={selectedElement.fontFamily || 'Inter'}
                onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Poppins">Poppins</option>
                <option value="Playfair Display">Playfair Display</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Size</label>
                <input
                  type="number"
                  value={selectedElement?.fontSize || 16}
                  onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
                  className="w-full px-2 py-1 border rounded text-sm"
                  min="8"
                  max="200"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Weight</label>
                <select
                  value={selectedElement?.fontWeight || 'normal'}
                  onChange={(e) => handleUpdate({ fontWeight: e.target.value })}
                  className="w-full px-2 py-1 border rounded text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="semibold">Semibold</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Line Height</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedElement?.lineHeight || 1.5}
                  onChange={(e) => handleUpdate({ lineHeight: Number(e.target.value) })}
                  className="w-full px-2 py-1 border rounded text-sm"
                  min="0.8"
                  max="3"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Letter Spacing</label>
                <input
                  type="number"
                  value={selectedElement?.letterSpacing || 0}
                  onChange={(e) => handleUpdate({ letterSpacing: Number(e.target.value) })}
                  className="w-full px-2 py-1 border rounded text-sm"
                  min="-5"
                  max="20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Alignment</label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => handleUpdate({ textAlign: align })}
                    className={`flex-1 px-2 py-1 rounded text-xs border ${
                      selectedElement?.textAlign === align
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {align.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Layer Operations */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Layers</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => bringForward(selectedIds[0])}
            className="flex items-center justify-center gap-1 px-2 py-2 border rounded hover:bg-gray-50 text-sm"
          >
            <ArrowUp size={14} />
            Forward
          </button>
          <button
            onClick={() => sendBackward(selectedIds[0])}
            className="flex items-center justify-center gap-1 px-2 py-2 border rounded hover:bg-gray-50 text-sm"
          >
            <ArrowDown size={14} />
            Backward
          </button>
          <button
            onClick={() => bringToFront(selectedIds[0])}
            className="flex items-center justify-center gap-1 px-2 py-2 border rounded hover:bg-gray-50 text-sm"
          >
            <ChevronUp size={14} />
            Front
          </button>
          <button
            onClick={() => sendToBack(selectedIds[0])}
            className="flex items-center justify-center gap-1 px-2 py-2 border rounded hover:bg-gray-50 text-sm"
          >
            <ChevronDown size={14} />
            Back
          </button>
        </div>
      </section>

      {/* Transform */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Transform</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Rotation</label>
            <input
              type="number"
              value={Math.round(selectedElement?.rotation || 0)}
              onChange={(e) => handleUpdate({ rotation: Number(e.target.value) })}
              className="w-full px-2 py-1 border rounded text-sm"
              min="0"
              max="360"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedElement?.opacity || 1}
              onChange={(e) => handleUpdate({ opacity: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="border-t pt-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => duplicateElements(selectedIds)}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
          >
            <Copy size={14} />
            Duplicate
          </button>
          <button
            onClick={() => deleteElements(selectedIds)}
            className="flex items-center justify-center gap-1 px-2 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => toggleVisibility(selectedIds[0])}
            className="flex items-center justify-center gap-1 px-2 py-2 border rounded hover:bg-gray-50 text-sm"
          >
            {selectedElement?.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
            {selectedElement?.visible === false ? 'Show' : 'Hide'}
          </button>
          <button
            onClick={() => toggleLock(selectedIds[0])}
            className="flex items-center justify-center gap-1 px-2 py-2 border rounded hover:bg-gray-50 text-sm"
          >
            {selectedElement?.locked ? <Unlock size={14} /> : <Lock size={14} />}
            {selectedElement?.locked ? 'Unlock' : 'Lock'}
          </button>
        </div>
      </section>
    </div>
  );
}
