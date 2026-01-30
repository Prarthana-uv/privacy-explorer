import { Globe, Cookie, Clock, ShieldAlert } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
}

const StatItem = ({ icon, label, value, subtext }: StatItemProps) => (
  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
    <div className="p-2 rounded-lg bg-background/50">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold font-mono text-foreground">{value}</p>
      {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
    </div>
  </div>
);

const StatsBar = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatItem 
        icon={<Globe className="w-5 h-5 text-primary" />}
        label="Sites Visited"
        value="1,247"
        subtext="Last 30 days"
      />
      <StatItem 
        icon={<Cookie className="w-5 h-5 text-warning" />}
        label="Active Cookies"
        value="759"
        subtext="23 persistent"
      />
      <StatItem 
        icon={<ShieldAlert className="w-5 h-5 text-destructive" />}
        label="Trackers Found"
        value="2,593"
        subtext="47 domains"
      />
      <StatItem 
        icon={<Clock className="w-5 h-5 text-success" />}
        label="Last Scan"
        value="2h ago"
        subtext="Auto-scan enabled"
      />
    </div>
  );
};

export default StatsBar;
