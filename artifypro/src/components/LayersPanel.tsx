import { useState, useRef } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown, Folder, FolderOpen } from 'lucide-react';

export default function LayersPanel() {
  const elements = useEditorStore((state) => state.elements);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const selectElement = useEditorStore((state) => state.selectElement);
  const toggleVisibility = useEditorStore((state) => state.toggleVisibility);
  const toggleLock = useEditorStore((state) => state.toggleLock);
  const reorderLayers = useEditorStore((state) => state.reorderLayers);
  const bringToFront = useEditorStore((state) => state.bringToFront);
  const sendToBack = useEditorStore((state) => state.sendToBack);
  const groupElements = useEditorStore((state) => state.groupElements);
  const ungroupElement = useEditorStore((state) => state.ungroupElement);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  // Reverse array so top layers appear at top of list
  const reversedElements = [...elements].reverse();

  const handleMoveUp = (index: number, el: any) => {
    const actualIndex = elements.findIndex((e) => e.id === el.id);
    if (actualIndex < elements.length - 1) {
      bringToFront(el.id);
    }
  };

  const handleMoveDown = (index: number, el: any) => {
    const actualIndex = elements.findIndex((e) => e.id === el.id);
    if (actualIndex > 0) {
      sendToBack(el.id);
    }
  };

  const handleDoubleClick = (el: any) => {
    setEditingId(el.id);
    setEditName(el.name || `Element ${el.type}`);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const handleNameSubmit = (id: string) => {
    // Update element name in store (would need to add name to DesignElement and store)
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="space-y-2">
      {/* Group/Ungroup buttons */}
      {selectedIds.length > 1 && (
        <button
          onClick={() => groupElements(selectedIds)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
        >
          <FolderOpen size={14} />
          Group (Cmd+G)
        </button>
      )}

      {selectedIds.length === 1 && (
        <button
          onClick={() => ungroupElement(selectedIds[0])}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 text-sm"
        >
          <Folder size={14} />
          Ungroup (Cmd+Shift+G)
        </button>
      )}

      {/* Layers List */}
      <div className="space-y-1">
        {reversedElements.map((el, index) => {
          const isSelected = selectedIds.includes(el.id);
          const actualIndex = elements.findIndex((e) => e.id === el.id);
          
          return (
            <div
              key={el.id}
              onClick={() => selectElement(el.id, !isSelected)}
              className={`group flex items-center gap-2 p-2 rounded cursor-pointer ${
                isSelected
                  ? 'bg-blue-100 border border-blue-300'
                  : 'hover:bg-gray-100 border border-transparent'
              }`}
            >
              {/* Layer icon */}
              <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                {el.type === 'text' ? 'T' : el.type === 'frame' ? 'F' : el.type === 'image' ? 'I' : 'R'}
              </div>

              {/* Layer name */}
              {editingId === el.id ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleNameSubmit(el.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSubmit(el.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="flex-1 px-1 py-0.5 text-sm border rounded"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div
                  onDoubleClick={() => handleDoubleClick(el)}
                  className="flex-1 text-sm truncate"
                  title={el.name}
                >
                  {el.name || `Element ${el.type}`}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleVisibility(el.id); }}
                  className="p-1 hover:bg-gray-200 rounded"
                  title={el.visible === false ? 'Show' : 'Hide'}
                >
                  {el.visible === false ? <EyeOff size={12} /> : <Eye size={12} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLock(el.id); }}
                  className="p-1 hover:bg-gray-200 rounded"
                  title={el.locked ? 'Unlock' : 'Lock'}
                >
                  {el.locked ? <Lock size={12} /> : <Unlock size={12} />}
                </button>
                <div className="flex flex-col">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveUp(index, el); }}
                    className="p-0.5 hover:bg-gray-200 rounded"
                    title="Move up"
                  >
                    <ChevronUp size={10} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoveDown(index, el); }}
                    className="p-0.5 hover:bg-gray-200 rounded"
                    title="Move down"
                  >
                    <ChevronDown size={10} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {elements.length === 0 && (
        <div className="text-sm text-gray-400 text-center py-8">
          No layers yet. Add elements to start designing.
        </div>
      )}
    </div>
  );
}
