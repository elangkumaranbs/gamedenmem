import React from 'react';
import { TowerControl as GameController, Mail, Phone, Map, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="relative">
                <GameController className="h-8 w-8 mr-3 text-white animate-float" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-lg"></div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent premium-text">
                GameDen
              </h2>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed premium-text">
              Your ultimate gaming destination with premium PlayStation consoles and exclusive membership benefits. 
              Experience next-level gaming with our PS3 and PS3 Pro stations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="group relative">
                <div className="w-10 h-10 accent-silver rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Facebook className="h-5 w-5 text-black" />
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a href="#" className="group relative">
                <div className="w-10 h-10 accent-silver rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Instagram className="h-5 w-5 text-black" />
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a href="#" className="group relative">
                <div className="w-10 h-10 accent-silver rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <Twitter className="h-5 w-5 text-black" />
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white hero-text">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group premium-text">
                  <span className="w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                  Home
                </a>
              </li>
              <li>
                <a href="/create-member" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group premium-text">
                  <span className="w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                  New Member
                </a>
              </li>
              <li>
                <a href="/view-members" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group premium-text">
                  <span className="w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                  View Members
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group premium-text">
                  <span className="w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                  About Us
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white hero-text">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start group">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600/20 to-gray-400/20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Map className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm leading-relaxed premium-text">
                    1E Shanthi Nagar, PB Complex<br />
                    Sathy Main Road, (Opp) Water Tank<br />
                    Gobichettipalayam - 638 452
                  </p>
                </div>
              </div>
              
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600/20 to-gray-400/20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-400 premium-text">+91 93442 01886</p>
              </div>
              
              <div className="flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600/20 to-gray-400/20 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-gray-400 premium-text">info@gameden.com</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0 premium-text">
            © {new Date().getFullYear()} GameDen. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 premium-text">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 premium-text">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors duration-300 premium-text">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;