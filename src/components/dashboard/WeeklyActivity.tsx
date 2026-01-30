import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ActivityData {
  day: string;
  trackers: number;
  cookies: number;
}

interface WeeklyActivityProps {
  data: ActivityData[];
}

const WeeklyActivity = ({ data }: WeeklyActivityProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card px-4 py-3 border border-border">
          <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-xs text-muted-foreground">
              <span style={{ color: item.fill }}>{item.name}:</span> {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Weekly Activity</h2>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(222, 30%, 18%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="day" 
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(222, 30%, 14%)' }} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
            <Bar 
              dataKey="trackers" 
              name="Trackers" 
              fill="hsl(0, 72%, 55%)" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="cookies" 
              name="Cookies" 
              fill="hsl(38, 92%, 50%)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyActivity;
