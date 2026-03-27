import type React from 'react';
import type { Shortcut } from '../types';
import { eventMatchesCombo } from '../utils/hotkeyUtils';

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
	onDelete?: (shortcut: Shortcut) => void;
	onAddAbove?: () => void;
	onAddBelow?: () => void;
	moveUpHotkey?: string;
	moveDownHotkey?: string;
	deleteHotkey?: string;
	addAboveHotkey?: string;
	addBelowHotkey?: string;
}

export function ShortcutRow({
	shortcut,
	index,
	onClick,
	onContextMenu,
	tabIndex = 0,
	onMoveUp,
	onMoveDown,
	onDelete,
	onAddAbove,
	onAddBelow,
	moveUpHotkey,
	moveDownHotkey,
	deleteHotkey,
	addAboveHotkey,
	addBelowHotkey,
}: ShortcutRowProps) {
	// Keep onClick in the props for future use; prevent unused parameter warning
	void onClick;

	const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
		if (onContextMenu) {
			event.preventDefault();
			onContextMenu(event, shortcut, index);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (onMoveUp && eventMatchesCombo(event, moveUpHotkey)) {
			event.preventDefault();
			event.stopPropagation();
			onMoveUp(shortcut);
			return;
		}

		if (onMoveDown && eventMatchesCombo(event, moveDownHotkey)) {
			event.preventDefault();
			event.stopPropagation();
			onMoveDown(shortcut);
			return;
		}

		if (onDelete && eventMatchesCombo(event, deleteHotkey)) {
			event.preventDefault();
			event.stopPropagation();
			onDelete(shortcut);
			return;
		}

		if (onAddAbove && eventMatchesCombo(event, addAboveHotkey)) {
			event.preventDefault();
			event.stopPropagation();
			onAddAbove();
			return;
		}

		if (onAddBelow && eventMatchesCombo(event, addBelowHotkey)) {
			event.preventDefault();
			event.stopPropagation();
			onAddBelow();
			return;
		}

		// Bare ArrowUp / ArrowDown (no modifiers): move focus between rows.
		const noModifiers =
			!event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey;

		if (noModifiers && event.key === 'ArrowUp') {
			event.preventDefault();
			event.stopPropagation();
			const current = event.currentTarget as HTMLElement;
			const prev = current.previousElementSibling as HTMLElement | null;
			prev?.focus();
			return;
		}

		if (noModifiers && event.key === 'ArrowDown') {
			event.preventDefault();
			event.stopPropagation();
			const current = event.currentTarget as HTMLElement;
			const next = current.nextElementSibling as HTMLElement | null;
			next?.focus();
			return;
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
