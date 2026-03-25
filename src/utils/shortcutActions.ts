import type { KeyboardShortcuts } from '../types';

export type ShortcutActionId = keyof KeyboardShortcuts;

export interface ShortcutActionConfig {
	id: ShortcutActionId;
	label: string;
	description: string;
}

export const SHORTCUT_ACTIONS: ShortcutActionConfig[] = [
	{
		id: 'add_new',
		label: 'Add new shortcut',
		description: 'Opens the "Add shortcut" dialog while the popup is focused.',
	},
	{
		id: 'move_up',
		label: 'Move up',
		description: 'When a list row is focused, moves that shortcut up.',
	},
	{
		id: 'move_down',
		label: 'Move down',
		description: 'When a list row is focused, moves that shortcut down.',
	},
	{
		id: 'delete',
		label: 'Delete shortcut',
		description: 'Deletes the focused shortcut from the list.',
	},
	{
		id: 'duplicate',
		label: 'Duplicate shortcut',
		description: '(Reserved) Will duplicate the focused shortcut.',
	},
	{
		id: 'add_above',
		label: 'Add new above',
		description: 'Opens the "Add shortcut" dialog with the new shortcut positioned above the focused row.',
	},
	{
		id: 'add_below',
		label: 'Add new below',
		description: 'Opens the "Add shortcut" dialog with the new shortcut positioned below the focused row.',
	},
];

export const SHORTCUT_ACTION_MAP: Record<ShortcutActionId, ShortcutActionConfig> =
	SHORTCUT_ACTIONS.reduce((acc, action) => {
		acc[action.id] = action;
		return acc;
	}, {} as Record<ShortcutActionId, ShortcutActionConfig>);

