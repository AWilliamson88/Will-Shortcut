import type React from 'react';
import type { KeyboardShortcuts } from '../types';
import { SHORTCUT_ACTION_MAP } from '../utils/shortcutActions';

interface ShortcutContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onRename: () => void;
  onDelete: () => void;
  onAddAbove: () => void;
  onAddBelow: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onClose: () => void;
  keyboardShortcuts?: KeyboardShortcuts;
}

export function ShortcutContextMenu({
  isOpen,
  x,
  y,
  canMoveUp,
  canMoveDown,
  onRename,
  onDelete,
  onAddAbove,
  onAddBelow,
  onMoveUp,
  onMoveDown,
  onClose,
  keyboardShortcuts,
}: ShortcutContextMenuProps) {
  if (!isOpen) return null;

  const handleOverlayContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onClose();
  };

	  const moveUpLabel = SHORTCUT_ACTION_MAP.move_up.label;
	  const moveDownLabel = SHORTCUT_ACTION_MAP.move_down.label;
	  const deleteLabel = SHORTCUT_ACTION_MAP.delete.label;

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={onClose}
      onContextMenu={handleOverlayContextMenu}
    >
	      <div
	        className="absolute z-50 bg-gray-800 border border-gray-700 rounded shadow-lg py-1 text-sm text-white min-w-[220px]"
	        style={{ top: y, left: x }}
	        onClick={(event) => event.stopPropagation()}
	      >
	        <button
		          type="button"
		          onClick={() => {
		            onRename();
		            onClose();
		          }}
		          className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-700 transition-colors"
		        >
		          <span>Edit shortcut</span>
		          <span className="ml-4 text-xs text-gray-400">
		            {keyboardShortcuts?.duplicate || ''}
		          </span>
		        </button>
		
	        <button
	          type="button"
	          onClick={() => {
	            onAddAbove();
	            onClose();
	          }}
	          className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-700 transition-colors"
	        >
	          <span>Add new above</span>
	          <span className="ml-4 text-xs text-gray-400">
		            {keyboardShortcuts?.add_above || ''}
		          </span>
	        </button>
	
	        <button
	          type="button"
	          onClick={() => {
	            onAddBelow();
	            onClose();
	          }}
	          className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-700 transition-colors"
	        >
	          <span>Add new below</span>
	          <span className="ml-4 text-xs text-gray-400">
		            {keyboardShortcuts?.add_below || ''}
		          </span>
	        </button>
	
	        <div className="my-1 border-t border-gray-700" />
	
	        <button
	          type="button"
	          onClick={() => {
	            onMoveUp();
	            onClose();
	          }}
	          disabled={!canMoveUp}
	          className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-700 transition-colors disabled:text-gray-500 disabled:hover:bg-gray-800 disabled:cursor-not-allowed"
	          title={moveUpLabel}
	        >
	          <span>{moveUpLabel}</span>
	          <span className="ml-4 text-xs text-gray-400">
		            {keyboardShortcuts?.move_up || ''}
		          </span>
	        </button>
	
	        <button
	          type="button"
	          onClick={() => {
	            onMoveDown();
	            onClose();
	          }}
	          disabled={!canMoveDown}
	          className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-gray-700 transition-colors disabled:text-gray-500 disabled:hover:bg-gray-800 disabled:cursor-not-allowed"
	          title={moveDownLabel}
	        >
	          <span>{moveDownLabel}</span>
	          <span className="ml-4 text-xs text-gray-400">
		            {keyboardShortcuts?.move_down || ''}
		          </span>
	        </button>
	
	        <div className="my-1 border-t border-gray-700" />
	
	        <button
	          type="button"
	          onClick={() => {
	            onDelete();
	            onClose();
	          }}
	          className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-red-700 text-red-300 hover:text-red-100 transition-colors"
	          title={deleteLabel}
	        >
	          <span>{deleteLabel}</span>
	          <span className="ml-4 text-xs text-red-200">
		            {keyboardShortcuts?.delete || ''}
		          </span>
	        </button>
	      </div>
    </div>
  );
}
