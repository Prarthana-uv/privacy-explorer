// Mock data for the Privacy Dashboard

export const privacyScore = 67;

export const trackerData: { name: string; count: number; category: string; risk: 'low' | 'medium' | 'high' }[] = [
  { name: 'Google Analytics', count: 847, category: 'Analytics', risk: 'medium' },
  { name: 'Facebook Pixel', count: 523, category: 'Advertising', risk: 'high' },
  { name: 'Doubleclick', count: 412, category: 'Advertising', risk: 'high' },
  { name: 'Hotjar', count: 234, category: 'Analytics', risk: 'medium' },
  { name: 'Amazon Ads', count: 189, category: 'Advertising', risk: 'high' },
  { name: 'LinkedIn Insight', count: 156, category: 'Advertising', risk: 'medium' },
  { name: 'Twitter Analytics', count: 134, category: 'Social', risk: 'low' },
  { name: 'Mixpanel', count: 98, category: 'Analytics', risk: 'low' },
];

export const categoryBreakdown = [
  { name: 'Advertising', value: 45, color: 'hsl(0, 72%, 55%)' },
  { name: 'Analytics', value: 30, color: 'hsl(38, 92%, 50%)' },
  { name: 'Social Media', value: 15, color: 'hsl(174, 72%, 50%)' },
  { name: 'Essential', value: 10, color: 'hsl(142, 72%, 45%)' },
];

export const weeklyActivity = [
  { day: 'Mon', trackers: 124, cookies: 89 },
  { day: 'Tue', trackers: 156, cookies: 112 },
  { day: 'Wed', trackers: 189, cookies: 145 },
  { day: 'Thu', trackers: 203, cookies: 167 },
  { day: 'Fri', trackers: 178, cookies: 134 },
  { day: 'Sat', trackers: 89, cookies: 67 },
  { day: 'Sun', trackers: 67, cookies: 45 },
];

export const riskCategories: { id: string; title: string; count: number; level: 'low' | 'medium' | 'high'; description: string; icon: string }[] = [
  {
    id: 'trackers',
    title: 'Third-Party Trackers',
    count: 2593,
    level: 'high',
    description: 'Tracking scripts from 47 different domains',
    icon: 'Eye',
  },
  {
    id: 'cookies',
    title: 'Persistent Cookies',
    count: 759,
    level: 'medium',
    description: '23 cookies expire in over 1 year',
    icon: 'Cookie',
  },
  {
    id: 'permissions',
    title: 'Browser Permissions',
    count: 12,
    level: 'low',
    description: 'Location, camera, and mic access granted',
    icon: 'Shield',
  },
  {
    id: 'fingerprinting',
    title: 'Fingerprinting Scripts',
    count: 8,
    level: 'high',
    description: 'Canvas and WebGL fingerprinting detected',
    icon: 'Fingerprint',
  },
];

export const recommendations: { id: number; title: string; description: string; impact: 'low' | 'medium' | 'high'; action: string }[] = [
  {
    id: 1,
    title: 'Clear advertising cookies',
    description: 'Remove 523 tracking cookies from advertising networks',
    impact: 'high',
    action: 'Clear Now',
  },
  {
    id: 2,
    title: 'Enable Do Not Track',
    description: 'Request websites not to track your browsing activity',
    impact: 'medium',
    action: 'Enable',
  },
  {
    id: 3,
    title: 'Review camera permissions',
    description: '3 sites have camera access that may not need it',
    impact: 'medium',
    action: 'Review',
  },
  {
    id: 4,
    title: 'Install privacy extension',
    description: 'Block trackers automatically with a browser extension',
    impact: 'high',
    action: 'Learn More',
  },
  {
    id: 5,
    title: 'Use private browsing',
    description: 'Reduce your digital footprint for sensitive searches',
    impact: 'low',
    action: 'Open Private',
  },
];

export const recentScans = [
  { date: '2026-01-30', score: 67, issues: 47 },
  { date: '2026-01-23', score: 58, issues: 62 },
  { date: '2026-01-16', score: 52, issues: 78 },
  { date: '2026-01-09', score: 45, issues: 94 },
];
