import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsBar from '@/components/dashboard/StatsBar';
import PrivacyScoreGauge from '@/components/dashboard/PrivacyScoreGauge';
import TrackerBreakdown from '@/components/dashboard/TrackerBreakdown';
import WeeklyActivity from '@/components/dashboard/WeeklyActivity';
import RiskCard from '@/components/dashboard/RiskCard';
import Recommendations from '@/components/dashboard/Recommendations';
import TopTrackers from '@/components/dashboard/TopTrackers';
import AIAnalysis from '@/components/dashboard/AIAnalysis';
import { useAuth } from '@/contexts/AuthContext';
import { usePrivacyScans } from '@/hooks/usePrivacyScans';

import {
  privacyScore,
  categoryBreakdown,
  weeklyActivity,
  riskCategories,
  recommendations,
  trackerData,
} from '@/data/mockPrivacyData';

const Index = () => {
  const { user } = useAuth();
  const { latestScan, isLoading, isScanning } = usePrivacyScans();

  // Use real data if available, otherwise use mock data
  const currentScore = latestScan?.privacy_score ?? privacyScore;
  const aiAnalysis = latestScan?.ai_analysis ?? null;

  // Update risk categories with real data if available
  const currentRiskCategories = latestScan ? [
    {
      id: 'trackers',
      title: 'Third-Party Trackers',
      count: latestScan.total_trackers,
      level: latestScan.total_trackers > 2000 ? 'high' : latestScan.total_trackers > 1000 ? 'medium' : 'low' as 'low' | 'medium' | 'high',
      description: `Tracking scripts detected across domains`,
      icon: 'Eye',
    },
    {
      id: 'cookies',
      title: 'Persistent Cookies',
      count: latestScan.total_cookies,
      level: latestScan.total_cookies > 500 ? 'high' : latestScan.total_cookies > 200 ? 'medium' : 'low' as 'low' | 'medium' | 'high',
      description: 'Cookies that persist across sessions',
      icon: 'Cookie',
    },
    {
      id: 'permissions',
      title: 'Browser Permissions',
      count: latestScan.total_permissions,
      level: latestScan.total_permissions > 10 ? 'medium' : 'low' as 'low' | 'medium' | 'high',
      description: 'Location, camera, and mic access granted',
      icon: 'Shield',
    },
    {
      id: 'fingerprinting',
      title: 'Fingerprinting Scripts',
      count: latestScan.fingerprinting_scripts,
      level: latestScan.fingerprinting_scripts > 5 ? 'high' : latestScan.fingerprinting_scripts > 2 ? 'medium' : 'low' as 'low' | 'medium' | 'high',
      description: 'Canvas and WebGL fingerprinting detected',
      icon: 'Fingerprint',
    },
  ] : riskCategories;

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-destructive/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <DashboardHeader />
        <StatsBar />

        {/* AI Analysis Section */}
        {user && (
          <AIAnalysis analysis={aiAnalysis} isLoading={isScanning} />
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Privacy Score */}
          <div className="lg:col-span-1">
            <PrivacyScoreGauge score={currentScore} />
          </div>

          {/* Tracker Breakdown */}
          <div className="lg:col-span-1">
            <TrackerBreakdown data={categoryBreakdown} />
          </div>

          {/* Top Trackers */}
          <div className="lg:col-span-1">
            <TopTrackers trackers={trackerData} />
          </div>
        </div>

        {/* Risk Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Risk Analysis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentRiskCategories.map((category, index) => (
              <RiskCard
                key={category.id}
                title={category.title}
                count={category.count}
                level={category.level}
                description={category.description}
                icon={category.icon}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <WeeklyActivity data={weeklyActivity} />

          {/* Recommendations */}
          <Recommendations recommendations={recommendations} />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Privacy Dashboard v1.0 • Your data stays on your device • 
            <span className="text-primary ml-1">Learn more about digital privacy</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
