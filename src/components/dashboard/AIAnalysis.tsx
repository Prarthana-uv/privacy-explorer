import { Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAnalysisProps {
  analysis: string | null;
  isLoading?: boolean;
}

const AIAnalysis = ({ analysis, isLoading }: AIAnalysisProps) => {
  if (!analysis && !isLoading) return null;

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">AI Privacy Analysis</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
          <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
          <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
        </div>
      ) : (
        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-lg font-bold text-foreground mt-4 mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-semibold text-foreground mt-3 mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold text-foreground mt-2 mb-1">{children}</h3>,
              p: ({ children }) => <p className="text-sm text-muted-foreground mb-2">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 mb-3">{children}</ol>,
              li: ({ children }) => <li className="text-sm text-muted-foreground">{children}</li>,
              strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
            }}
          >
            {analysis || ''}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
