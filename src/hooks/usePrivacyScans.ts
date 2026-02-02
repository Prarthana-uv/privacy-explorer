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
  trackers: { name: string; count: number; category: string; risk: 'low' | 'medium' | 'high' }[];
  url: string;
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
    mutationFn: async (url: string) => {
      if (!user) throw new Error('Must be logged in');

      // Call the analyze-privacy function with the URL to get real scan data and AI analysis
      const { data: scanResult, error: functionError } = await supabase.functions.invoke('analyze-privacy', {
        body: { url },
      });
      if (functionError) throw functionError;

      const { scanData, analysis: aiAnalysis } = scanResult;

      // Insert scan
      const { data: scan, error: scanError } = await supabase
        .from('privacy_scans')
        .insert({
          user_id: user.id,
          url: scanData.url,
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
