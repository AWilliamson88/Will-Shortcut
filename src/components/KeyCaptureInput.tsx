import { useState, useRef, useEffect } from 'react';
import { Keyboard, Type } from 'lucide-react';

interface KeyCaptureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onRequestNextField?: () => void; 
  disableToggle?: boolean;
}

export function KeyCaptureInput({ value, onChange, placeholder, onRequestNextField, disableToggle = false }: KeyCaptureInputProps) {
	  const [isCaptureMode, setIsCaptureMode] = useState(true); // true = capture, false = plain text
	  const [isCapturing, setIsCapturing] = useState(false);
    const [currentKeys, setCurrentKeys] = useState<string>('');
    const [capturedSequence, setCapturedSequence] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

	  useEffect(() => {
	    // Only attach listeners while actively capturing in capture mode
	    if (!isCapturing || !isCaptureMode) {
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

        // Normalise the main key so Shift does not change the base character
        // (e.g. Ctrl+Shift+"\\" should be shown as Ctrl+Shift+\\, not Ctrl+Shift+|)

        // First handle non-character special keys by their `key` value
        const specialKeyMap: { [key: string]: string } = {
          ' ': 'Space',
          Enter: 'Enter',
          Escape: 'Esc',
          Backspace: 'Backspace',
          Delete: 'Delete',
          Tab: 'Tab',
          ArrowUp: '↑',
          ArrowDown: '↓',
          ArrowLeft: '←',
          ArrowRight: '→',
        };

        // Printable keys where Shift normally changes the symbol – use `code`
        // to map back to the unshifted/base key.
        const printableFromCode: { [code: string]: string } = {
          Backquote: '`',
          Minus: '-',
          Equal: '=',
          BracketLeft: '[',
          BracketRight: ']',
          Backslash: '\\',
          Semicolon: ';',
          Quote: "'",
          Comma: ',',
          Period: '.',
          Slash: '/',
          Digit0: '0',
          Digit1: '1',
          Digit2: '2',
          Digit3: '3',
          Digit4: '4',
          Digit5: '5',
          Digit6: '6',
          Digit7: '7',
          Digit8: '8',
          Digit9: '9',
        };

        let keyLabel: string;

        if (mainKey in specialKeyMap) {
          keyLabel = specialKeyMap[mainKey];
        } else if (printableFromCode[(e as KeyboardEvent).code]) {
          // Use the unshifted printable symbol based on the physical key
          keyLabel = printableFromCode[(e as KeyboardEvent).code];
        } else if (mainKey.length === 1) {
          // Letters and any other single-char keys that aren't in the map
          keyLabel = mainKey.toUpperCase();
        } else {
          // Fallback: use the raw key name
          keyLabel = mainKey;
        }

        keys.push(keyLabel);
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
	  }, [isCapturing, isCaptureMode, currentKeys, capturedSequence, onChange]);

	  // Build display value showing sequence + current keys (only in capture mode)
	  const displayValue = isCaptureMode && isCapturing
	    ? [...capturedSequence, currentKeys].filter(Boolean).join(', ')
	    : value;
	
	  const showPrompt = isCaptureMode && isCapturing && capturedSequence.length === 0 && !currentKeys;

	  return (
	    <div className="flex items-center gap-2">
	      <div className="relative flex-1">
	        <input
	          ref={inputRef}
	          type="text"
	          value={displayValue}
	          onChange={(e) => {
	            // In plain text mode, always allow manual editing
	            if (!isCaptureMode) {
	              onChange(e.target.value);
	            }
	          }}
	          onFocus={() => {
	            if (isCaptureMode) {
	              setIsCapturing(true);
	            }
	          }}
	          onBlur={() => {
	            if (isCaptureMode) {
	              setIsCapturing(false);
	              setCurrentKeys('');
	              setCapturedSequence([]);
	            }
	          }}
	          placeholder={
	            placeholder ||
	            (isCaptureMode
	              ? 'Click to capture'
	              : 'Type key combination (e.g. Ctrl+Shift+[ )')
	          }
	          readOnly={isCaptureMode && isCapturing}
	          className={`w-full bg-gray-900 text-white px-3 py-2 rounded border ${
	            isCaptureMode && isCapturing ? 'border-blue-500' : 'border-gray-700'
	          } focus:outline-none ${
	            isCaptureMode && isCapturing ? 'cursor-pointer' : 'cursor-text'
	          }`}
	        />
	        {showPrompt && (
	          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 rounded pointer-events-none">
	            <span className="text-sm text-blue-400">Press any key combination...</span>
	          </div>
	        )}
	      </div>
	      {/* Mode toggle button, now outside the input field */}
        {!disableToggle && (
          <button
            type="button"
            onClick={() => {
              setIsCapturing(false);
              setCurrentKeys('');
              setCapturedSequence([]);
              setIsCaptureMode((prev) => !prev);
              inputRef.current?.focus();
            }}
            className="inline-flex items-center justify-center p-2 rounded border border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
            title={isCaptureMode ? 'Switch to manual entry' : 'Switch to key capture'}
          >
            {isCaptureMode ? (
              <Keyboard className="w-4 h-4" />
            ) : (
              <Type className="w-4 h-4" />
            )}
          </button>
        )}
	    </div>
	  );
}