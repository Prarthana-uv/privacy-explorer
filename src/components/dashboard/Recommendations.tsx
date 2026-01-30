import { Lightbulb, ArrowRight, Zap, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  action: string;
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const Recommendations = ({ recommendations }: RecommendationsProps) => {
  const getImpactStyles = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'medium':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'low':
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Zap className="w-3 h-3" />;
      case 'medium':
        return <Shield className="w-3 h-3" />;
      case 'low':
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Recommendations</h2>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div 
            key={rec.id}
            className="group p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-200 cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">{rec.title}</h4>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getImpactStyles(rec.impact)}`}>
                    {getImpactIcon(rec.impact)}
                    {rec.impact} impact
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="shrink-0 text-primary hover:text-primary hover:bg-primary/10 group-hover:translate-x-1 transition-transform"
              >
                {rec.action}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
