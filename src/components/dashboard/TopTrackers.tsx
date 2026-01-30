import { Activity, ExternalLink } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Tracker {
  name: string;
  count: number;
  category: string;
  risk: 'low' | 'medium' | 'high';
}

interface TopTrackersProps {
  trackers: Tracker[];
}

const TopTrackers = ({ trackers }: TopTrackersProps) => {
  const maxCount = Math.max(...trackers.map(t => t.count));

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-destructive';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-success';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Top Trackers</h2>
      </div>

      <div className="space-y-4">
        {trackers.slice(0, 6).map((tracker, index) => (
          <div 
            key={tracker.name}
            className="group cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {tracker.name}
                </span>
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${getRiskColor(tracker.risk)}`}>
                  {tracker.risk}
                </span>
                <span className="text-sm font-mono text-muted-foreground">
                  {tracker.count}
                </span>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(tracker.risk)}`}
                style={{ 
                  width: `${(tracker.count / maxCount) * 100}%`,
                  transitionDelay: `${index * 100}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTrackers;
