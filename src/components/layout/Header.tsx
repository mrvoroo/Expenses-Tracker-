import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../shared/Button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut: doSignOut } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="p-2 rounded-lg lg:hidden hover:bg-muted"
            aria-label="القائمة"
          >
            <FiMenu className="w-6 h-6" />
          </button>
        )}
        <Link to="/" className="font-bold text-lg text-primary">
          تتبع المصاريف
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span className="hidden sm:inline text-sm text-muted-foreground flex items-center gap-1">
              <FiUser className="w-4 h-4" />
              {user.displayName || user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={doSignOut}>
              <FiLogOut className="w-4 h-4 ml-1" />
              خروج
            </Button>
          </>
        ) : (
          location.pathname !== '/login' &&
          location.pathname !== '/register' && (
            <Link to="/login">
              <Button variant="secondary" size="sm">
                تسجيل الدخول
              </Button>
            </Link>
          )
        )}
      </div>
    </header>
  );
}
