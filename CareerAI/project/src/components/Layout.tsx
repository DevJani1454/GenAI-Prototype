import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Brain,
  LayoutDashboard,
  Target,
  TrendingUp,
  BookOpen,
  Users,
  MessageSquare,
  Award,
  Gamepad2,
  Settings,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();

        setIsAdmin(data?.is_admin || false);
      }
    };

    checkAdmin();
  }, [user]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Skills', href: '/skills', icon: TrendingUp },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Mentors', href: '/mentors', icon: Users },
    { name: 'AI Coach', href: '/chat', icon: MessageSquare },
    { name: 'Credentials', href: '/credentials', icon: Award },
    { name: 'VR Simulations', href: '/vr', icon: Gamepad2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">CareerAI</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="flex pt-16 lg:pt-0">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b hidden lg:block">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">CareerAI</span>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-purple-600 hover:bg-purple-50 transition mb-2"
                >
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Admin Panel</span>
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
