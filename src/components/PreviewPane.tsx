
import React, { useEffect, useRef } from 'react';
import { Font } from '@/utils/markdownUtils';
import { cn } from '@/lib/utils';
import { Heart, Rocket } from 'lucide-react';
import { Button } from './ui/button';

// We'll use react-markdown with remark-math and rehype-katex plugins
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import html2pdf from 'html2pdf.js';

interface PreviewPaneProps {
  content: string;
  readingFont: Font;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ content, readingFont }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when content changes and the user is already at the bottom
  useEffect(() => {
    if (previewRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = previewRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      
      if (isAtBottom) {
        setTimeout(() => {
          if (previewRef.current) {
            previewRef.current.scrollTop = previewRef.current.scrollHeight;
          }
        }, 0);
      }
    }
  }, [content]);

  const handleDownloadPDF = () => {
    if (contentRef.current) {
      const element = contentRef.current;
      const opt = {
        margin: 10,
        filename: 'markdown-document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <div className="preview-pane h-full flex flex-col">
      <div className="bg-gray-50 p-2 text-center border-b rounded-t-lg flex justify-between items-center">
        <div className="w-24"></div>
        <h3 className="text-sm font-medium text-gray-600">Preview</h3>
        <div className="w-24">
          <Button 
            onClick={handleDownloadPDF} 
            variant="ghost" 
            size="sm" 
            className="text-gray-600"
          >
            PDF
          </Button>
        </div>
      </div>
      <div 
        ref={previewRef}
        className={cn(
          "preview-content prose prose-gray max-w-none overflow-auto flex-1 animate-fade-in",
          `font-${readingFont}`
        )}
      >
        <div ref={contentRef}>
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({node, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                return !match ? (
                  <code className="font-jetbrains-mono" {...props}>
                    {children}
                  </code>
                ) : (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    className="font-jetbrains-mono"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
      <footer className="bg-gray-50 p-4 border-t text-center text-sm text-gray-600">
        <p className="flex items-center justify-center gap-1 mb-2">
          Desarrollado con <Heart className="text-red-500" size={16} /> por Jesús David Silva Rangel <Rocket className="text-blue-500" size={16} />
        </p>
        <div className="flex justify-center space-x-4">
          <a href="https://www.linkedin.com/in/jesusdavidsilva/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
            LinkedIn
          </a>
          <a href="https://github.com/jesusdavidsilva" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
            GitHub
          </a>
          <a href="https://twitter.com/jesusdavidsilva" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            X
          </a>
        </div>
      </footer>
    </div>
  );
};

export default PreviewPane;
