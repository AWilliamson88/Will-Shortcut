import { useState, useRef, useEffect } from 'react';

interface KeyCaptureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onRequestNextField?: () => void; // new
}

export function KeyCaptureInput({ value, onChange, placeholder, onRequestNextField }: KeyCaptureInputProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentKeys, setCurrentKeys] = useState<string>('');
  const [capturedSequence, setCapturedSequence] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isCapturing) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const mainKey = e.key;

      // Backspace: delete last character instead of capturing it
      if (mainKey === 'Backspace' &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        !e.metaKey) 
      {
        // If we’re in the middle of a combo, clear the current combo first
        if (currentKeys) {
          setCurrentKeys('');
          return;
        }

        if (capturedSequence.length === 0) {
          return;
        }

        const newSequence = capturedSequence.slice(0, -1);
        setCapturedSequence(newSequence);

        const finalValue = newSequence.join(', ');
        onChange(finalValue);

        return;
      }

      // Bare Enter / Tab: move focus to next field instead of capturing
      const isBareEnterOrTab =
        (mainKey === 'Enter' || mainKey === 'Tab') &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey &&
        !e.metaKey;

      if (isBareEnterOrTab) {
        const sequence = [...capturedSequence];
        if (currentKeys) {
          sequence.push(currentKeys);
        }

        if (sequence.length > 0) {
          const finalSequence = sequence.join(', ');
          onChange(finalSequence);
        }

        setIsCapturing(false);
        setCapturedSequence([]);
        setCurrentKeys('');

        if (onRequestNextField) {
          onRequestNextField();
        }

        return;
      }
      
      // Require at least one modifier (Ctrl/Shift/Alt/Win)
      const hasModifier = e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;
      if (!hasModifier) {
        // No modifier held → ignore this key for capturing
        setCurrentKeys('');
        return;
      }

      const keys: string[] = [];

      
      
      if (!['Control', 'Shift', 'Alt', 'Meta'].includes(mainKey)) {
        // Add modifiers
        if (e.ctrlKey) keys.push('Ctrl');
        if (e.shiftKey) keys.push('Shift');
        if (e.altKey) keys.push('Alt');
        if (e.metaKey) keys.push('Win');

        console.log("Mainkey: ", mainKey);
        console.log("Keys: ", keys);
        // Capitalize single letters
        if (mainKey.length === 1) {
          console.log("Push Mainkey");
          keys.push(mainKey.toUpperCase());
        } else {
          console.log("Push special key");
          // Handle special keys
          const specialKeyMap: { [key: string]: string } = {
            ' ': 'Space',
            'Enter': 'Enter',
            'Escape': 'Esc',
            'Backspace': 'Backspace',
            'Delete': 'Delete',
            'Tab': 'Tab',
            'ArrowUp': 'Up',
            'ArrowDown': 'Down',
            'ArrowLeft': 'Left',
            'ArrowRight': 'Right',
            '`': '`',
            '-': '-',
            '=': '=',
            '[': '[',
            ']': ']',
            '\\': '\\',
            ';': ';',
            "'": "'",
            ',': ',',
            '.': '.',
            '/': '/',
          };

          keys.push(specialKeyMap[mainKey] || mainKey);
        }
      }

      // Update the display in real-time
      console.log("Update the display in real-time");
      const combo = keys.join('+');
      setCurrentKeys(combo);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!currentKeys) {
        return;
      }

      let newSequence: string[];

      if (capturedSequence.length >= 2) {
        // This is the 3rd (or later) sequence → start fresh
        newSequence = [currentKeys];
      } else {
        // 1st or 2nd sequence → append
        newSequence = [...capturedSequence, currentKeys];
      }

      setCapturedSequence(newSequence);
      setCurrentKeys('');

      const finalValue = newSequence.join(', ');
      onChange(finalValue);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCapturing, currentKeys, capturedSequence, onChange]);

  // Build display value showing sequence + current keys
  console.log("display value showing");
  console.log("Captured Sequence: ", capturedSequence);
  const displayValue = isCapturing
    ? [...capturedSequence, currentKeys].filter(Boolean).join(', ')
    : value;

  const showPrompt = isCapturing && capturedSequence.length === 0 && !currentKeys;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={(e) => {
          if (!isCapturing) {
            onChange(e.target.value);
          }
        }}
        onFocus={() => setIsCapturing(true)}
        onBlur={() => {
          setIsCapturing(false);
          setCurrentKeys('');
          setCapturedSequence([]);
        }}
        placeholder={placeholder || "Click to capture or type manually"}
        readOnly={isCapturing}
        className={`w-full bg-gray-900 text-white px-3 py-2 rounded border ${
          isCapturing ? 'border-blue-500' : 'border-gray-700'
        } focus:outline-none ${isCapturing ? 'cursor-pointer' : 'cursor-text'}`}
      />
      {showPrompt && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 rounded pointer-events-none">
          <span className="text-sm text-blue-400">Press any key combination...</span>
        </div>
      )}
    </div>
  );
}