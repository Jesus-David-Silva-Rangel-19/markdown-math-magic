
import { toast } from "sonner";

export type FormatAction = 
  | 'bold' 
  | 'italic' 
  | 'underline' 
  | 'heading1' 
  | 'heading2' 
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'heading6'
  | 'paragraph'
  | 'code'
  | 'quote'
  | 'bullet'
  | 'number'
  | 'checklist';

export type Font = 
  | 'labrada'
  | 'alegreya'
  | 'patua-one'
  | 'special-elite'
  | 'copse'
  | 'im-fell-dw-pica-sc'
  | 'young-serif'
  | 'belgrano'
  | 'jetbrains-mono';

export const fontDisplayNames: Record<Font, string> = {
  'labrada': 'Labrada',
  'alegreya': 'Alegreya',
  'patua-one': 'Patua One',
  'special-elite': 'Special Elite',
  'copse': 'Copse',
  'im-fell-dw-pica-sc': 'IM DW Pica SC',
  'young-serif': 'Young Serif',
  'belgrano': 'Belgrano',
  'jetbrains-mono': 'JetBrains Mono'
};

export function applyFormat(
  text: string, 
  selectionStart: number, 
  selectionEnd: number, 
  action: FormatAction
): { text: string; newCursorPosition: number } {
  let prefix = '';
  let suffix = '';
  let content = text.substring(selectionStart, selectionEnd);
  let newCursorPosition = selectionEnd;
  
  // Handle special case for empty selection
  if (selectionStart === selectionEnd) {
    switch (action) {
      case 'bold':
        content = 'bold text';
        newCursorPosition = selectionStart + 2 + content.length;
        break;
      case 'italic':
        content = 'italic text';
        newCursorPosition = selectionStart + 1 + content.length;
        break;
      case 'underline':
        content = 'underlined text';
        newCursorPosition = selectionStart + 2 + content.length;
        break;
      case 'code':
        content = 'code';
        newCursorPosition = selectionStart + 1 + content.length;
        break;
      case 'quote':
        content = 'quote';
        break;
      case 'bullet':
        content = 'Bullet point';
        break;
      case 'number':
        content = 'Numbered point';
        break;
      case 'checklist':
        content = 'Task';
        break;
      default:
        content = '';
    }
  }

  // Apply the formatting
  switch (action) {
    case 'bold':
      prefix = '**';
      suffix = '**';
      break;
    case 'italic':
      prefix = '*';
      suffix = '*';
      break;
    case 'underline':
      prefix = '__';
      suffix = '__';
      break;
    case 'heading1':
      prefix = '# ';
      suffix = '';
      break;
    case 'heading2':
      prefix = '## ';
      suffix = '';
      break;
    case 'heading3':
      prefix = '### ';
      suffix = '';
      break;
    case 'heading4':
      prefix = '#### ';
      suffix = '';
      break;
    case 'heading5':
      prefix = '##### ';
      suffix = '';
      break;
    case 'heading6':
      prefix = '###### ';
      suffix = '';
      break;
    case 'paragraph':
      prefix = '\n';
      suffix = '\n';
      break;
    case 'code':
      if (content.includes('\n')) {
        prefix = '```\n';
        suffix = '\n```';
      } else {
        prefix = '`';
        suffix = '`';
      }
      break;
    case 'quote':
      prefix = '> ';
      suffix = '';
      break;
    case 'bullet':
      prefix = '- ';
      suffix = '';
      break;
    case 'number':
      prefix = '1. ';
      suffix = '';
      break;
    case 'checklist':
      prefix = '- [ ] ';
      suffix = '';
      break;
  }

  // Handle special case for headings that should be on their own line
  const isHeading = action.startsWith('heading');
  const isListItem = ['bullet', 'number', 'checklist'].includes(action);
  
  if (isHeading || isListItem) {
    // Check if we're already at the start of a line
    const textBeforeSelection = text.substring(0, selectionStart);
    const isAtStartOfLine = selectionStart === 0 || textBeforeSelection.endsWith('\n');
    
    if (!isAtStartOfLine) {
      prefix = '\n' + prefix;
    }
    
    // For list items, ensure there's a line break after
    if (isListItem) {
      const textAfterSelection = text.substring(selectionEnd);
      const hasLineBreakAfter = selectionEnd === text.length || textAfterSelection.startsWith('\n');
      
      if (!hasLineBreakAfter) {
        suffix = suffix + '\n';
      }
    }
  }

  // Insert the formatted text
  const newText = 
    text.substring(0, selectionStart) + 
    prefix + content + suffix + 
    text.substring(selectionEnd);
  
  // If we didn't have a selection, set the cursor inside the formatting marks
  if (selectionStart === selectionEnd && content) {
    newCursorPosition = selectionStart + prefix.length + content.length;
  } else {
    newCursorPosition = selectionStart + prefix.length + content.length + suffix.length;
  }

  return { text: newText, newCursorPosition };
}

export function insertLatexFormula(
  text: string, 
  selectionStart: number, 
  selectionEnd: number
): { text: string; newCursorPosition: number } {
  const selected = text.substring(selectionStart, selectionEnd);
  const formula = selected || 'E = mc^2';
  
  // Inline formula (if single line) or block formula
  const isInline = !formula.includes('\n');
  
  const prefix = isInline ? '$' : '$$\n';
  const suffix = isInline ? '$' : '\n$$';
  
  const newText = 
    text.substring(0, selectionStart) + 
    prefix + formula + suffix + 
    text.substring(selectionEnd);
  
  // Position cursor at the end of the formula
  const newCursorPosition = selectionStart + prefix.length + formula.length;
  
  return { text: newText, newCursorPosition };
}

export function handleCopyToClipboard(text: string): void {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success("Copied to clipboard", {
        duration: 2000,
      });
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
      toast.error("Failed to copy to clipboard", {
        duration: 2000,
      });
    });
}
