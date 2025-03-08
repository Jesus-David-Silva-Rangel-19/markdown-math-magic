
import React, { useState, useRef, useEffect, useCallback } from 'react';
import FormattingToolbar from './FormattingToolbar';
import PreviewPane from './PreviewPane';
import FontSelector from './FontSelector';
import { applyFormat, insertLatexFormula, FormatAction, Font } from '@/utils/markdownUtils';
import { cn } from '@/lib/utils';

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('# Welcome to Markdown Editor\n\nStart typing here...\n\n## LaTeX Support\n\nYou can write math formulas like $E = mc^2$ or:\n\n$$\n\\frac{d}{dx}\\left( \\int_{a}^{x} f(t)\\,dt\\right) = f(x)\n$$\n\n## Features\n\n- **Bold** and *italic* text\n- Lists and checkboxes\n- [x] Todo items\n- Code blocks\n\n```javascript\nfunction hello() {\n  console.log("Hello, world!");\n}\n```\n\n> Block quotes for citations\n');
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [selectionEnd, setSelectionEnd] = useState<number>(0);
  const [writingFont, setWritingFont] = useState<Font>('labrada');
  const [readingFont, setReadingFont] = useState<Font>('labrada');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('mouseup', handleSelectionChange);
      textarea.addEventListener('keyup', handleSelectionChange);
      textarea.addEventListener('select', handleSelectionChange);
      
      return () => {
        textarea.removeEventListener('mouseup', handleSelectionChange);
        textarea.removeEventListener('keyup', handleSelectionChange);
        textarea.removeEventListener('select', handleSelectionChange);
      };
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        handleFormat('bold');
      }
      else if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        handleFormat('italic');
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [markdown, selectionStart, selectionEnd]);

  const handleFormat = useCallback((action: FormatAction) => {
    if (textareaRef.current) {
      const { text, newCursorPosition } = applyFormat(
        markdown,
        selectionStart, 
        selectionEnd, 
        action
      );
      
      setMarkdown(text);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          setSelectionStart(newCursorPosition);
          setSelectionEnd(newCursorPosition);
        }
      }, 0);
    }
  }, [markdown, selectionStart, selectionEnd]);

  const handleInsertLatex = useCallback(() => {
    if (textareaRef.current) {
      const { text, newCursorPosition } = insertLatexFormula(
        markdown,
        selectionStart, 
        selectionEnd
      );
      
      setMarkdown(text);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          setSelectionStart(newCursorPosition);
          setSelectionEnd(newCursorPosition);
        }
      }, 0);
    }
  }, [markdown, selectionStart, selectionEnd]);

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-black">Markdown Editor</h1>
        <div className="flex flex-wrap gap-4">
          <FontSelector 
            label="Writing Font" 
            value={writingFont} 
            onChange={setWritingFont} 
          />
          <FontSelector 
            label="Reading Font" 
            value={readingFont} 
            onChange={setReadingFont} 
          />
        </div>
      </div>

      <div className="editor-container h-[calc(100vh-180px)]">
        <div className="editor-pane flex flex-col">
          <FormattingToolbar 
            onFormat={handleFormat} 
            onInsertLatex={handleInsertLatex}
            markdownContent={markdown}
          />
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            onSelect={handleSelectionChange}
            className={cn(
              "editor-textarea flex-1",
              `font-${writingFont}`
            )}
            spellCheck="true"
          />
        </div>

        <PreviewPane 
          content={markdown} 
          readingFont={readingFont} 
        />
      </div>
    </div>
  );
};

export default MarkdownEditor;
