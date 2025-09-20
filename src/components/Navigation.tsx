import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Home, Trophy } from 'lucide-react';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <Trophy className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">ScoutFutbol</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate('/about')}>
              About
            </Button>
            <Button variant="ghost" onClick={() => navigate('/contact')}>
              Contact
            </Button>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth?mode=signup')}>
                  Join ScoutFutbol
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};