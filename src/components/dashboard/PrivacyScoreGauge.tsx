import { useEffect, useState } from 'react';
import { Shield, TrendingUp } from 'lucide-react';

interface PrivacyScoreGaugeProps {
  score: number;
  previousScore?: number;
}

const PrivacyScoreGauge = ({ score, previousScore = 58 }: PrivacyScoreGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedDash, setAnimatedDash] = useState(0);

  const circumference = 2 * Math.PI * 90;
  const targetDash = (score / 100) * circumference;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedScore(Math.round(score * eased));
      setAnimatedDash(targetDash * eased);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score, targetDash]);

  const getScoreColor = () => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getGradientId = () => {
    if (score >= 80) return 'scoreGradientGreen';
    if (score >= 60) return 'scoreGradientYellow';
    return 'scoreGradientRed';
  };

  const improvement = score - previousScore;

  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Privacy Score</h2>
      </div>

      <div className="relative w-52 h-52">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="scoreGradientGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(142, 72%, 45%)" />
              <stop offset="100%" stopColor="hsl(160, 80%, 40%)" />
            </linearGradient>
            <linearGradient id="scoreGradientYellow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(38, 92%, 50%)" />
              <stop offset="100%" stopColor="hsl(28, 90%, 50%)" />
            </linearGradient>
            <linearGradient id="scoreGradientRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0, 72%, 55%)" />
              <stop offset="100%" stopColor="hsl(350, 80%, 50%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(222, 30%, 18%)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Animated progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={`url(#${getGradientId()})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - animatedDash}
            filter="url(#glow)"
            className="transition-all duration-100"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold font-mono ${getScoreColor()}`}>
            {animatedScore}
          </span>
          <span className="text-sm text-muted-foreground mt-1">out of 100</span>
          <span className={`text-sm font-medium mt-2 ${getScoreColor()}`}>
            {getScoreLabel()}
          </span>
        </div>
      </div>

      {improvement !== 0 && (
        <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
          <TrendingUp className={`w-4 h-4 ${improvement > 0 ? 'text-success' : 'text-destructive rotate-180'}`} />
          <span className={`text-sm font-medium ${improvement > 0 ? 'text-success' : 'text-destructive'}`}>
            {improvement > 0 ? '+' : ''}{improvement} from last scan
          </span>
        </div>
      )}
    </div>
  );
};

export default PrivacyScoreGauge;
