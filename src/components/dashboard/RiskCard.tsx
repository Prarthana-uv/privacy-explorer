import { Eye, Cookie, Shield, Fingerprint, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface RiskCardProps {
  title: string;
  count: number;
  level: 'low' | 'medium' | 'high';
  description: string;
  icon: string;
  index: number;
}

const iconMap: Record<string, any> = {
  Eye,
  Cookie,
  Shield,
  Fingerprint,
};

const RiskCard = ({ title, count, level, description, icon, index }: RiskCardProps) => {
  const IconComponent = iconMap[icon] || Shield;

  const getLevelStyles = () => {
    switch (level) {
      case 'high':
        return {
          badge: 'bg-destructive/20 text-destructive border-destructive/30',
          glow: 'glow-danger',
          icon: 'text-destructive',
          indicator: AlertTriangle,
        };
      case 'medium':
        return {
          badge: 'bg-warning/20 text-warning border-warning/30',
          glow: 'glow-warning',
          icon: 'text-warning',
          indicator: AlertCircle,
        };
      case 'low':
        return {
          badge: 'bg-success/20 text-success border-success/30',
          glow: 'glow-success',
          icon: 'text-success',
          indicator: CheckCircle,
        };
    }
  };

  const styles = getLevelStyles();
  const IndicatorIcon = styles.indicator;

  return (
    <div 
      className="glass-card p-5 group hover:border-primary/30 transition-all duration-300 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-secondary ${styles.icon}`}>
          <IconComponent className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${styles.badge}`}>
          <IndicatorIcon className="w-3 h-3" />
          {level.charAt(0).toUpperCase() + level.slice(1)} Risk
        </div>
      </div>

      <h3 className="text-foreground font-semibold mb-1">{title}</h3>
      <p className="text-3xl font-bold font-mono text-foreground mb-2">
        {count.toLocaleString()}
      </p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default RiskCard;
