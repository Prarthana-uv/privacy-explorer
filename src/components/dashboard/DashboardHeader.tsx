import { Shield, RefreshCw, Download, Settings, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { usePrivacyScans } from '@/hooks/usePrivacyScans';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const DashboardHeader = () => {
  const { user, signOut, loading } = useAuth();
  const { runScan, isScanning } = usePrivacyScans();
  const navigate = useNavigate();
  const [scanUrl, setScanUrl] = useState('');

  const handleScan = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!scanUrl.trim()) {
      alert('Please enter a URL to scan.');
      return;
    }
    runScan(scanUrl);
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-primary/10 glow-primary">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Privacy <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user ? `Welcome, ${user.email}` : 'Analyze and protect your digital footprint'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <Input
              type="url"
              placeholder="Enter website URL to scan (e.g., https://example.com)"
              value={scanUrl}
              onChange={(e) => setScanUrl(e.target.value)}
              className="min-w-[300px]"
            />
            <Button 
              variant="outline" 
              size="sm"
              className="border-border hover:border-primary/50 hover:bg-primary/5"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-border hover:border-primary/50 hover:bg-primary/5"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </>
        )}
        <Button 
          onClick={handleScan}
          disabled={isScanning}
          className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Scan Now'}
        </Button>
        {!loading && (
          user ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={signOut}
              className="border-border hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/auth')}
              className="border-border hover:border-primary/50 hover:bg-primary/5"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
