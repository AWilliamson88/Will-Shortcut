import type React from 'react';

// Normalized representation of a single key combination
export type NormalizedHotkey = {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
  key: string;
};

// Internal helper type that works for both DOM and React keyboard events
export type KeyboardLikeEvent = KeyboardEvent | React.KeyboardEvent<any>;

function parseCombo(raw: string | undefined | null): NormalizedHotkey | null {
  if (!raw) return null;

  // Only use the first segment if a sequence like "Ctrl+K, Ctrl+C" is provided
  const firstPart = raw.split(',')[0]?.trim();
  if (!firstPart) return null;

  const parts = firstPart
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean);

  let ctrl = false;
  let alt = false;
  let shift = false;
  let meta = false;
  let key: string | null = null;

  for (const part of parts) {
    const p = part.toLowerCase();

    // Modifiers
    if (p === 'ctrl' || p === 'control') {
      ctrl = true;
      continue;
    }
    if (p === 'alt') {
      alt = true;
      continue;
    }
    if (p === 'shift') {
      shift = true;
      continue;
    }
    if (p === 'meta' || p === 'win' || p === 'cmd' || p === 'command') {
      meta = true;
      continue;
    }

    // Arrow keys (support a few common labels)
    if (p === 'arrowup' || p === 'up' || p === '\u2191') {
      key = 'ArrowUp';
      continue;
    }
    if (p === 'arrowdown' || p === 'down' || p === '\u2193') {
      key = 'ArrowDown';
      continue;
    }
    if (p === 'arrowleft' || p === 'left' || p === '\u2190') {
      key = 'ArrowLeft';
      continue;
    }
    if (p === 'arrowright' || p === 'right' || p === '\u2192') {
      key = 'ArrowRight';
      continue;
    }

    // Function keys
    if (/^f[1-9]\d?$/.test(p)) {
      key = p.toUpperCase();
      continue;
    }

    // Other common specials
    if (p === 'delete' || p === 'del') {
      key = 'Delete';
      continue;
    }
    if (p === 'backspace') {
      key = 'Backspace';
      continue;
    }
    if (p === 'space' || p === 'spacebar') {
      key = ' ';
      continue;
    }
    if (p === 'tab') {
      key = 'Tab';
      continue;
    }
    if (p === 'enter' || p === 'return') {
      key = 'Enter';
      continue;
    }
    if (p === 'esc' || p === 'escape') {
      key = 'Escape';
      continue;
    }

    // Single characters (letters, digits, punctuation)
    if (p.length === 1) {
      key = p.toUpperCase();
      continue;
    }

    // Fallback: use the raw token as the key name
    key = part;
  }

  if (!key && !ctrl && !alt && !shift && !meta) {
    return null;
  }

  return {
    ctrl,
    alt,
    shift,
    meta,
    key: key ?? '',
  };
}

function normalizeEvent(event: KeyboardLikeEvent): NormalizedHotkey {
  const e: any = event as any;
  const rawKey: string = e.key;
  let key: string;

  if (rawKey === ' ') key = ' ';
  else if (rawKey === 'Escape') key = 'Escape';
  else if (rawKey === 'Backspace') key = 'Backspace';
  else if (rawKey === 'Delete') key = 'Delete';
  else if (rawKey === 'Tab') key = 'Tab';
  else if (rawKey === 'Enter') key = 'Enter';
  else if (rawKey === 'ArrowUp') key = 'ArrowUp';
  else if (rawKey === 'ArrowDown') key = 'ArrowDown';
  else if (rawKey === 'ArrowLeft') key = 'ArrowLeft';
  else if (rawKey === 'ArrowRight') key = 'ArrowRight';
  else if (rawKey.length === 1) key = rawKey.toUpperCase();
  else key = rawKey;

  return {
    ctrl: !!e.ctrlKey,
    alt: !!e.altKey,
    shift: !!e.shiftKey,
    meta: !!e.metaKey,
    key,
  };
}

export function eventMatchesCombo(
  event: KeyboardLikeEvent,
  combo: string | undefined | null,
): boolean {
  const parsed = parseCombo(combo);
  if (!parsed) return false;

  const ev = normalizeEvent(event);

  return (
    parsed.ctrl === ev.ctrl &&
    parsed.alt === ev.alt &&
    parsed.shift === ev.shift &&
    parsed.meta === ev.meta &&
    parsed.key === ev.key
  );
}

