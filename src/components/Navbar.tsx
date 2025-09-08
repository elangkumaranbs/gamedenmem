import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSupabase } from '../context/SupabaseContext';
import LoginModal from './LoginModal';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const { supabase } = useSupabase();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    if (supabase) {
      await logout(supabase);
    }
    closeMenu();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    ...(isAuthenticated ? [
      { name: 'New Member', path: '/create-member' },
      { name: 'View Members', path: '/view-members' },
    ] : [])
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Don't render navbar on home page as it's integrated into the page design
  if (location.pathname === '/') {
    return null;
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-gradient-to-b from-black via-black/80 to-black backdrop-blur-xl' : 'bg-gradient-to-b from-black via-black/80 to-transparent'
      }`}>
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between items-center py-6">
            {/* Logo - Left Side */}
            <Link to="/" className="flex items-center space-x-4 group" onClick={closeMenu}>
              <img 
                src="/logo.png" 
                alt="GameDen Logo" 
                className="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <img 
                src="/title.png" 
                alt="GameDen Title" 
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative transition-all duration-300 hover:text-gray-300 font-medium premium-text ${
                    isActive(link.path) 
                      ? 'text-gray-300' 
                      : 'text-white/90'
                  } group`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 transition-all duration-300 group-hover:w-full ${
                    isActive(link.path) ? 'w-full' : ''
                  }`}></span>
                </Link>
              ))}
              
              {/* Auth Button */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium premium-text">{user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-full font-medium flex items-center transition-all duration-300 transform hover:scale-105 premium-text"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="accent-silver hover:accent-platinum text-black px-6 py-2 rounded-full font-medium flex items-center transition-all duration-300 transform hover:scale-105 premium-text"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10 bg-black/50 backdrop-blur-lg">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 px-4 rounded transition-all duration-300 premium-text ${
                      isActive(link.path) 
                        ? 'bg-white/20 text-gray-300 font-medium' 
                        : 'text-white hover:bg-white/10'
                    }`}
                    onClick={closeMenu}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {/* Mobile Auth Button */}
                {isAuthenticated ? (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="px-4 py-2 text-gray-300 text-sm flex items-center premium-text">
                      <User className="h-4 w-4 mr-2" />
                      {user?.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-4 rounded text-white hover:bg-red-600/20 flex items-center premium-text"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowLoginModal(true);
                      closeMenu();
                    }}
                    className="w-full text-left py-2 px-4 rounded text-white hover:bg-white/20 flex items-center premium-text"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};

export default Navbar;