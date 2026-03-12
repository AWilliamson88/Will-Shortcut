import type React from 'react';

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
}: ShortcutContextMenuProps) {
  if (!isOpen) return null;

  const handleOverlayContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={onClose}
      onContextMenu={handleOverlayContextMenu}
    >
      <div
        className="absolute z-50 bg-gray-800 border border-gray-700 rounded shadow-lg py-1 text-sm text-white min-w-[180px]"
        style={{ top: y, left: x }}
        onClick={(event) => event.stopPropagation()}
      >
	        <button
	          type="button"
	          onClick={() => {
	            onRename();
	            onClose();
	          }}
	          className="w-full text-left px-3 py-1.5 hover:bg-gray-700 transition-colors"
	        >
	          Edit shortcut
	        </button>

        <button
          type="button"
          onClick={() => {
            onAddAbove();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 hover:bg-gray-700 transition-colors"
        >
          Add new above
        </button>

        <button
          type="button"
          onClick={() => {
            onAddBelow();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 hover:bg-gray-700 transition-colors"
        >
          Add new below
        </button>

        <div className="my-1 border-t border-gray-700" />

        <button
          type="button"
          onClick={() => {
            onMoveUp();
            onClose();
          }}
          disabled={!canMoveUp}
          className="w-full text-left px-3 py-1.5 hover:bg-gray-700 transition-colors disabled:text-gray-500 disabled:hover:bg-gray-800 disabled:cursor-not-allowed"
        >
          Move up
        </button>

        <button
          type="button"
          onClick={() => {
            onMoveDown();
            onClose();
          }}
          disabled={!canMoveDown}
          className="w-full text-left px-3 py-1.5 hover:bg-gray-700 transition-colors disabled:text-gray-500 disabled:hover:bg-gray-800 disabled:cursor-not-allowed"
        >
          Move down
        </button>

        <div className="my-1 border-t border-gray-700" />

        <button
          type="button"
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 hover:bg-red-700 text-red-300 hover:text-red-100 transition-colors"
        >
          Delete shortcut
        </button>
      </div>
    </div>
  );
}
