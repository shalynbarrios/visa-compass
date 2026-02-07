import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { authClient } from '@/auth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';
  const session = authClient.useSession();
  const isAuthenticated = !session.isPending && !!session.data;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/travel-check', label: 'Travel Check' },
  ];

  const handleBeginClick = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    navigate('/');
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all",
      isLanding ? "bg-primary/95 border-primary/20" : "bg-card/95 border-border"
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            isLanding ? "bg-accent" : "bg-primary"
          )}>
            <Shield className={cn(
              "h-5 w-5",
              isLanding ? "text-accent-foreground" : "text-primary-foreground"
            )} />
          </div>
          <span className={cn(
            "font-serif text-lg font-semibold",
            isLanding ? "text-primary-foreground" : "text-foreground"
          )}>
            SourceControl
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent",
                isLanding ? "text-primary-foreground/80" : "text-muted-foreground",
                location.pathname === link.href && "text-accent"
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Button
                variant={isLanding ? "heroOutline" : "accentSolid"}
                size="sm"
                onClick={() => navigate('/app')}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className={cn(
                  "gap-2",
                  isLanding ? "text-primary-foreground hover:text-primary-foreground/80" : ""
                )}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant={isLanding ? "heroOutline" : "accentSolid"}
              size="sm"
              onClick={handleBeginClick}
            >
              Begin
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className={cn("h-6 w-6", isLanding ? "text-primary-foreground" : "text-foreground")} />
          ) : (
            <Menu className={cn("h-6 w-6", isLanding ? "text-primary-foreground" : "text-foreground")} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={cn(
          "md:hidden border-t",
          isLanding ? "bg-primary border-primary/20" : "bg-card border-border"
        )}>
          <nav className="container mx-auto flex flex-col gap-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isLanding ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Button
                  variant={isLanding ? "hero" : "accentSolid"}
                  onClick={() => {
                    navigate('/app');
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "gap-2 justify-start",
                    isLanding ? "text-primary-foreground hover:text-primary-foreground/80" : ""
                  )}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant={isLanding ? "hero" : "accentSolid"}
                onClick={() => {
                  handleBeginClick();
                  setMobileMenuOpen(false);
                }}
              >
                Begin
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
