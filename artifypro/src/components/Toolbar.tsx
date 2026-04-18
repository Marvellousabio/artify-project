import {
  MousePointer2,
  Square,
  Circle,
  Type,
  Image,
  Frame,
  Minus,
  Grid3X3,
  Undo2,
  Redo2,
  Copy,
  Clipboard,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { Tool } from '@/types';

interface ToolButtonProps {
  tool: Tool;
  icon: React.ReactNode;
  label: string;
}

function ToolButton({ tool, icon, label }: ToolButtonProps) {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  return (
    <button
      onClick={() => setActiveTool(tool)}
      title={label}
      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
        activeTool === tool
          ? 'bg-blue-500 text-white'
          : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      {icon}
    </button>
  );
}

export default function Toolbar() {
  const showGrid = useEditorStore((state) => state.showGrid);
  const toggleGrid = useEditorStore((state) => state.toggleGrid);
  const canUndo = useEditorStore((state) => state.canUndo());
  const canRedo = useEditorStore((state) => state.canRedo());
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mb-2">
        <span className="text-white font-bold text-sm">A</span>
      </div>

      <div className="flex flex-col gap-1">
        <ToolButton tool="select" icon={<MousePointer2 size={20} />} label="Select (V)" />
        <ToolButton tool="rectangle" icon={<Square size={20} />} label="Rectangle (R)" />
        <ToolButton tool="ellipse" icon={<Circle size={20} />} label="Ellipse (E)" />
        <ToolButton tool="text" icon={<Type size={20} />} label="Text (T)" />
        <ToolButton tool="image" icon={<Image size={20} />} label="Image (I)" />
        <ToolButton tool="frame" icon={<Frame size={20} />} label="Frame (F)" />
        <ToolButton tool="line" icon={<Minus size={20} />} label="Line (L)" />
      </div>

      <div className="w-8 h-px bg-gray-200 my-2" />

      <div className="flex flex-col gap-1">
        <button
          onClick={undo}
          disabled={!canUndo()}
          title="Undo (Cmd+Z)"
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Undo2 size={20} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          title="Redo (Cmd+Shift+Z)"
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Redo2 size={20} />
        </button>
      </div>

      <div className="w-8 h-px bg-gray-200 my-2" />

      <div className="flex flex-col gap-1">
        <button
          onClick={toggleGrid}
          title={`Toggle Grid (G) - ${showGrid ? 'ON' : 'OFF'}`}
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
            showGrid
              ? 'bg-green-500 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <Grid3X3 size={20} />
        </button>
      </div>
    </div>
  );
}
