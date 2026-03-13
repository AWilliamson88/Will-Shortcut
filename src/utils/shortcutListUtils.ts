import type { Shortcut } from '../types';

/**
 * Return a new array of shortcuts sorted by their `order` value.
 */
export function sortShortcuts(shortcuts: Shortcut[]): Shortcut[] {
	return [...shortcuts].sort((a, b) => a.order - b.order);
}

/**
 * Normalize `order` so that shortcuts are 0..n-1 in the *current array order*.
 *
 * NOTE: This function does NOT sort – it simply reindexes the array it is
 * given. Callers that care about `order` should explicitly call
 * `sortShortcuts` first, then pass the sorted array here.
 */
export function normalizeShortcutOrder(shortcuts: Shortcut[]): Shortcut[] {
	return shortcuts.map((shortcut, index) => ({
		...shortcut,
		order: index,
	}));
}

/**
 * Remove a shortcut by id and re-pack ordering.
 */
export function deleteShortcut(shortcuts: Shortcut[], shortcutId: string): Shortcut[] {
	const sorted = sortShortcuts(shortcuts);
	const filtered = sorted.filter((s) => s.id !== shortcutId);
	return normalizeShortcutOrder(filtered);
}

/**
 * Update an existing shortcut (matched by id) and normalize ordering.
 * If the shortcut is not found, the original array is returned.
 */
export function updateShortcut(shortcuts: Shortcut[], updated: Shortcut): Shortcut[] {
	const sorted = sortShortcuts(shortcuts);
	const exists = sorted.some((s) => s.id === updated.id);
	if (!exists) return normalizeShortcutOrder(sorted);

	const mapped = sorted.map((s) => (s.id === updated.id ? updated : s));
	return normalizeShortcutOrder(mapped);
}

/**
 * Insert a shortcut at a given index (0-based) and normalize ordering.
 * If index is out of range, it will be clamped to the valid range.
 */
export function insertShortcutAt(shortcuts: Shortcut[], shortcut: Shortcut, index: number): Shortcut[] {
	const sorted = sortShortcuts(shortcuts);
	const clampedIndex = Math.max(0, Math.min(index, sorted.length));

	const next = [...sorted];
	next.splice(clampedIndex, 0, shortcut);
	return normalizeShortcutOrder(next);
}

/**
 * Move a shortcut from one position to another (both 0-based indices).
 * Indices are interpreted relative to the sorted order.
 */
export function moveShortcut(shortcuts: Shortcut[], fromIndex: number, toIndex: number): Shortcut[] {
	const sorted = sortShortcuts(shortcuts);

	if (
		fromIndex < 0 ||
		fromIndex >= sorted.length ||
		toIndex < 0 ||
		toIndex >= sorted.length ||
		fromIndex === toIndex
	) {
		return normalizeShortcutOrder(sorted);
	}

	const next = [...sorted];
	const [moved] = next.splice(fromIndex, 1);
	next.splice(toIndex, 0, moved);
	return normalizeShortcutOrder(next);
}
