
import React, { useEffect, useRef } from 'react';
import { Font } from '@/utils/markdownUtils';
import { cn } from '@/lib/utils';

// We'll use react-markdown with remark-math and rehype-katex plugins
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PreviewPaneProps {
  content: string;
  readingFont: Font;
}

const PreviewPane: React.FC<PreviewPaneProps> = ({ content, readingFont }) => {
  const previewRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="preview-pane h-full flex flex-col">
      <div className="bg-gray-50 p-2 text-center border-b rounded-t-lg">
        <h3 className="text-sm font-medium text-gray-600">Preview</h3>
      </div>
      <div 
        ref={previewRef}
        className={cn(
          "preview-content prose prose-gray max-w-none overflow-auto flex-1 animate-fade-in",
          `font-${readingFont}`
        )}
      >
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
  );
};

export default PreviewPane;
