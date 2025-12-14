import React from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { PageView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems: { label: string; value: PageView }[] = [
    { label: 'Destinations', value: 'DESTINATIONS' },
    { label: 'Community', value: 'COMMUNITY' },
    { label: 'Resources', value: 'RESOURCES' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div 
                className="flex-shrink-0 flex items-center gap-2 cursor-pointer" 
                onClick={() => onNavigate('HOME')}
              >
                <Globe className="h-8 w-8 text-indigo-600" />
                <span className="font-bold text-xl text-slate-900 tracking-tight">NomadNest</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => onNavigate(item.value)}
                  className={`font-medium transition-colors ${
                    currentPage === item.value
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                Sign In
              </button>
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
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    currentPage === item.value
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
              <Globe className="h-6 w-6 text-indigo-400" />
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
    </div>
  );
};

export default Layout;
