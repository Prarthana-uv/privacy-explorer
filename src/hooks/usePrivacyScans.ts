import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { trackerData, categoryBreakdown, recommendations as mockRecommendations } from '@/data/mockPrivacyData';

interface ScanData {
  privacyScore: number;
  totalTrackers: number;
  totalCookies: number;
  totalPermissions: number;
  fingerprintingScripts: number;
  trackers: typeof trackerData;
}

export const usePrivacyScans = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const scansQuery = useQuery({
    queryKey: ['privacy-scans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('privacy_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('scan_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const latestScan = scansQuery.data?.[0];

  const createScanMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');

      // Simulate scan data (in real app, this would come from browser extension)
      const totalTrackers = trackerData.reduce((sum, t) => sum + t.count, 0);
      const scanData: ScanData = {
        privacyScore: Math.floor(Math.random() * 30) + 50, // 50-80 range
        totalTrackers,
        totalCookies: Math.floor(Math.random() * 500) + 200,
        totalPermissions: Math.floor(Math.random() * 15) + 5,
        fingerprintingScripts: Math.floor(Math.random() * 10) + 3,
        trackers: trackerData,
      };

      // Get AI analysis
      let aiAnalysis = '';
      try {
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-privacy', {
          body: { scanData },
        });
        if (analysisError) throw analysisError;
        aiAnalysis = analysisData.analysis;
      } catch (error) {
        console.error('AI analysis failed:', error);
        aiAnalysis = 'AI analysis unavailable.';
      }

      // Insert scan
      const { data: scan, error: scanError } = await supabase
        .from('privacy_scans')
        .insert({
          user_id: user.id,
          privacy_score: scanData.privacyScore,
          total_trackers: scanData.totalTrackers,
          total_cookies: scanData.totalCookies,
          total_permissions: scanData.totalPermissions,
          fingerprinting_scripts: scanData.fingerprintingScripts,
          ai_analysis: aiAnalysis,
        })
        .select()
        .single();

      if (scanError) throw scanError;

      // Insert detected trackers
      const trackersToInsert = trackerData.map((t) => ({
        scan_id: scan.id,
        user_id: user.id,
        tracker_name: t.name,
        tracker_category: t.category,
        risk_level: t.risk,
        count: t.count,
      }));

      const { error: trackersError } = await supabase
        .from('detected_trackers')
        .insert(trackersToInsert);

      if (trackersError) console.error('Error inserting trackers:', trackersError);

      // Insert recommendations
      const recsToInsert = mockRecommendations.slice(0, 4).map((r) => ({
        scan_id: scan.id,
        user_id: user.id,
        title: r.title,
        description: r.description,
        impact: r.impact,
        action_label: r.action,
      }));

      const { error: recsError } = await supabase
        .from('privacy_recommendations')
        .insert(recsToInsert);

      if (recsError) console.error('Error inserting recommendations:', recsError);

      return { scan, aiAnalysis };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy-scans'] });
      toast({ title: 'Scan Complete', description: 'Your privacy analysis is ready.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Scan Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    scans: scansQuery.data || [],
    latestScan,
    isLoading: scansQuery.isLoading,
    runScan: createScanMutation.mutate,
    isScanning: createScanMutation.isPending,
  };
};
