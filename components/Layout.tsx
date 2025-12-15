import React from 'react';
import { Menu, X } from 'lucide-react';
import { PageView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}


const SignInModal: React.FC<{ onClose: () => void; onLogin: (username: string) => void; onSwitchToSignUp: () => void }> = ({ onClose, onLogin, onSwitchToSignUp }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      // Mock successful login - extract name from email or use default
      const name = email.split('@')[0] || 'Nomad';
      onLogin(name.charAt(0).toUpperCase() + name.slice(1));
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h3>
        <p className="text-slate-500 mb-6">Sign in to access your saved trips and community.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="hello@nomad.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-2"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account? <button onClick={onSwitchToSignUp} className="text-indigo-600 font-bold hover:underline">Join now</button>
        </div>
      </div>
    </div>
  );
};

const SignUpModal: React.FC<{ onClose: () => void; onLogin: (username: string) => void; onSwitchToSignIn: () => void }> = ({ onClose, onLogin, onSwitchToSignIn }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock registration delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin(name || 'Nomad');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h3>
        <p className="text-slate-500 mb-6">Join thousands of digital nomads exploring the world.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Alex Nomad"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="hello@nomad.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Join Now'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <button onClick={onSwitchToSignIn} className="text-indigo-600 font-bold hover:underline">Sign In</button>
        </div>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showSignIn, setShowSignIn] = React.useState(false);
  const [showSignUp, setShowSignUp] = React.useState(false);
  const [user, setUser] = React.useState<string | null>(null);

  const navItems: { label: string; value: PageView }[] = [
    { label: 'Destinations', value: 'DESTINATIONS' },
    { label: 'Community', value: 'COMMUNITY' },
    { label: 'Resources', value: 'RESOURCES' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-auto py-4">
            <div className="flex items-center">
              <div
                className="flex-shrink-0 flex items-center gap-4 cursor-pointer group"
                onClick={() => onNavigate('HOME')}
              >
                <img src="/logo.png" alt="NomadNest Logo" className="h-32 w-auto object-contain group-hover:opacity-90 transition-opacity" />
                <span className="font-bold text-4xl text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">NomadNest</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => onNavigate(item.value)}
                  className={`font-medium transition-colors ${currentPage === item.value
                    ? 'text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600'
                    }`}
                >
                  {item.label}
                </button>
              ))}
              {user ? (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {user.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-900">{user}</span>
                  <button
                    onClick={() => setUser(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 ml-2"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSignIn(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Sign In
                </button>
              )}
            </div>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-500 hover:text-slate-700 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    onNavigate(item.value);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentPage === item.value
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="NomadNest Logo" className="h-24 w-auto object-contain" />
              <span className="font-bold text-lg text-white">NomadNest</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Making global movement accessible and stress-free. Get real-time visa requirements, safety updates, and cultural insights powered by Gemini AI.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('HOME')} className="hover:text-white transition-colors">Visa Checker</button></li>
              <li><button onClick={() => onNavigate('DESTINATIONS')} className="hover:text-white transition-colors">Destinations</button></li>
              <li><button onClick={() => onNavigate('RESOURCES')} className="hover:text-white transition-colors">Resources</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-xs text-center">
          &copy; {new Date().getFullYear()} NomadNest AI. All rights reserved.
        </div>
      </footer>

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onLogin={(username) => setUser(username)}
          onSwitchToSignUp={() => {
            setShowSignIn(false);
            setShowSignUp(true);
          }}
        />
      )}

      {showSignUp && (
        <SignUpModal
          onClose={() => setShowSignUp(false)}
          onLogin={(username) => setUser(username)}
          onSwitchToSignIn={() => {
            setShowSignUp(false);
            setShowSignIn(true);
          }}
        />
      )}
    </div>
  );
};

export default Layout;
