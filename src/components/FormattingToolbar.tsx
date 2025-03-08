
import React from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { insertLatexFormula, FormatAction } from '@/utils/markdownUtils';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3, 
  Hash,
  Code,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  FileText,
  Calculator,
  Copy,
  Download
} from 'lucide-react';
import { handleCopyToClipboard } from '@/utils/markdownUtils';
import { toast } from "sonner";

interface FormattingToolbarProps {
  onFormat: (action: FormatAction) => void;
  onInsertLatex: () => void;
  markdownContent: string;
}

const FormattingToolbar: React.FC<FormattingToolbarProps> = ({ 
  onFormat, 
  onInsertLatex,
  markdownContent 
}) => {
  const formatButtons = [
    { icon: <Bold size={18} />, action: 'bold' as FormatAction, tooltip: 'Bold (Ctrl+B)' },
    { icon: <Italic size={18} />, action: 'italic' as FormatAction, tooltip: 'Italic (Ctrl+I)' },
    { icon: <Underline size={18} />, action: 'underline' as FormatAction, tooltip: 'Underline' },
    { icon: <Heading1 size={18} />, action: 'heading1' as FormatAction, tooltip: 'Heading 1' },
    { icon: <Heading2 size={18} />, action: 'heading2' as FormatAction, tooltip: 'Heading 2' },
    { icon: <Heading3 size={18} />, action: 'heading3' as FormatAction, tooltip: 'Heading 3' },
    { icon: <Hash size={18} />, action: 'heading4' as FormatAction, tooltip: 'Heading 4' },
    { icon: <Hash size={16} />, action: 'heading5' as FormatAction, tooltip: 'Heading 5' },
    { icon: <Hash size={14} />, action: 'heading6' as FormatAction, tooltip: 'Heading 6' },
    { icon: <FileText size={18} />, action: 'paragraph' as FormatAction, tooltip: 'Paragraph' },
    { icon: <Code size={18} />, action: 'code' as FormatAction, tooltip: 'Code Block' },
    { icon: <Quote size={18} />, action: 'quote' as FormatAction, tooltip: 'Citation Block' },
    { icon: <List size={18} />, action: 'bullet' as FormatAction, tooltip: 'Bullet List' },
    { icon: <ListOrdered size={18} />, action: 'number' as FormatAction, tooltip: 'Numbered List' },
    { icon: <CheckSquare size={18} />, action: 'checklist' as FormatAction, tooltip: 'Checklist' },
  ];

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Document downloaded", {
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-lg">
      <TooltipProvider>
        {formatButtons.map((button, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => onFormat(button.action)}
              >
                {button.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{button.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onInsertLatex}
            >
              <Calculator size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Insert LaTeX Formula</p>
          </TooltipContent>
        </Tooltip>

        <div className="ml-auto flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleCopyToClipboard(markdownContent)}
              >
                <Copy size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy to Clipboard</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleDownload}
              >
                <Download size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Markdown</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default FormattingToolbar;
