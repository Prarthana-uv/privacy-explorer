import { Shield, RefreshCw, Download, Settings, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePrivacyScans } from '@/hooks/usePrivacyScans';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const { user, signOut, loading } = useAuth();
  const { runScan, isScanning } = usePrivacyScans();
  const navigate = useNavigate();

  const handleScan = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    runScan();
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
