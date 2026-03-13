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
}

export function ShortcutRow({ shortcut, index, onClick, onContextMenu, tabIndex = 0 }: ShortcutRowProps) {
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onContextMenu) {
      event.preventDefault();
      onContextMenu(event, shortcut, index);
    }
  };

  return (
    <div
      tabIndex={tabIndex}
      onClick={() => onClick(shortcut)}
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
