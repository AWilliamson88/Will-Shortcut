import type React from 'react';
import type { Shortcut } from '../types';

interface ShortcutRowProps {
  shortcut: Shortcut;
  index: number;
  onClick: (shortcut: Shortcut) => void;
  onContextMenu?: (
    event: React.MouseEvent<HTMLDivElement>,
    shortcut: Shortcut,
    index: number
  ) => void;
  tabIndex?: number;
  onMoveUp?: (shortcut: Shortcut) => void;
  onMoveDown?: (shortcut: Shortcut) => void;
}

export function ShortcutRow({ shortcut, index, onClick, onContextMenu, tabIndex = 0, onMoveUp, onMoveDown }: ShortcutRowProps) {
  // Keep onClick in the props for future use; prevent unused parameter warning
  void onClick;

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onContextMenu) {
      event.preventDefault();
      onContextMenu(event, shortcut, index);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      !event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.metaKey
    ) {
      return;
    }

    if (event.key === 'ArrowUp' && onMoveUp) {
      event.preventDefault();
      event.stopPropagation();
      onMoveUp(shortcut);
    } else if (event.key === 'ArrowDown' && onMoveDown) {
      event.preventDefault();
      event.stopPropagation();
      onMoveDown(shortcut);
    }
  };

  return (
    <div
	      tabIndex={tabIndex}
	      data-shortcut-id={shortcut.id}
      //onClick={() => onClick(shortcut)}
      onKeyDown={handleKeyDown}
      onContextMenu={handleContextMenu}
      className={`bg-gray-${index % 2 === 0 ? '7' : '8'}00 px-1 hover:bg-gray-600 transition-colors cursor-pointer`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-sm text-gray-300">{shortcut.description}</span>
        <kbd className="px-2 py-1 rounded text-base font-mono text-right">
          {shortcut.key_combo.split(',').map((part, idx, arr) => (
            <span key={idx} className="whitespace-nowrap">
              {part.trim()}
              {idx < arr.length - 1 ? ', ' : ''}
            </span>
          ))}
        </kbd>
      </div>
    </div>
  );
}
