import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TowerControl as GameController, LogIn, Play, ArrowRight, LogOut, User, Clock, Star, Phone, MapPin, Crown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSupabase } from '../context/SupabaseContext';
import LoginModal from '../components/LoginModal';

const Home: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { supabase } = useSupabase();
  const [scrollY, setScrollY] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    if (supabase) {
      await logout(supabase);
    }
  };

  const gameStations = [
    {
      name: 'PlayStation 4',
      image: '/ps4-controller-png-42102.png',
      price: '₹50',
      period: 'per hour',
      description: 'Classic gaming experience with thousands of titles',
      features: ['1080p Gaming', 'Blu-ray Player', 'Streaming Apps', '500GB Storage']
    },
    {
      name: 'PlayStation 4 Pro',
      image: '/ps4-controller-png-42099.png',
      price: '₹80',
      period: 'per hour',
      description: 'Enhanced performance with 4K gaming capabilities',
      features: ['4K Gaming', 'HDR Support', 'Boost Mode', '1TB Storage'],
      popular: true
    }
  ];

  const timeSlots = [
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM',
    '8:00 PM - 9:00 PM',
    '9:00 PM - 10:00 PM'
  ];

  return (
    <div className="min-h-screen text-white overflow-x-hidden premium-black-gradient">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-lg border-b border-white/20">
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between items-center py-6">
            {/* Logo - Left Side */}
            <Link to="/" className="flex items-center space-x-4 group">
              <img 
                src="/logo.png" 
                alt="GameDen Logo" 
                className="h-40 w-21 object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <img 
                src="/title.png" 
                alt="GameDen Title" 
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Auth Section - Right Side */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/create-member"
                    className="hidden md:block text-gray-300 hover:text-white transition-colors duration-300 font-medium premium-text"
                  >
                    New Member
                  </Link>
                  <Link
                    to="/view-members"
                    className="hidden md:block text-gray-300 hover:text-white transition-colors duration-300 font-medium premium-text"
                  >
                    View Members
                  </Link>
                  <div className="hidden md:flex items-center space-x-2 text-gray-300">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium premium-text">{user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-full font-medium flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg premium-text"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="accent-silver hover:accent-platinum text-black px-8 py-3 rounded-full font-bold flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/30 premium-text"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Admin Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 lg:px-12 pt-20 relative overflow-hidden hero-premium-black">
        {/* Premium Overlay Effects */}
        <div className="absolute inset-0 premium-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto relative z-10">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight hero-text">
                <span className="block text-white mb-2">GAMING</span>
                <span className="block text-white mb-2">CENTER</span>
                <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-pulse-glow elegant-text">
                  EXPERIENCE
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light premium-text">
                Book your gaming slot and experience premium PlayStation gaming at our center. Play the latest games with friends in our comfortable gaming lounge.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <button 
                onClick={() => window.open('https://gamedenbookings.netlify.app/', '_blank')}
                className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/30 overflow-hidden premium-text"
              >
                <span className="relative z-10 flex items-center">
                  Book Your Slot
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium premium-text">5 slots available today</span>
              </div>
            </div>
          </div>

          {/* Right Content - PS5 Image */}
          <div className="relative">
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
              <img 
                src="/17496583515825bmkxz2s copy.png" 
                alt="PlayStation 5 Console" 
                className="w-full max-w-lg mx-auto drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-300/20 rounded-3xl blur-3xl -z-10 animate-pulse"></div>
            </div>
            
            {/* Floating Elements - Repositioned to avoid overlap */}
            <div className="absolute -top-5 -right-5 cosmic-section rounded-2xl p-4 animate-float z-20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white premium-text">₹50</div>
                <div className="text-sm text-gray-300 premium-text">per hour</div>
              </div>
            </div>
            
            <div className="absolute -bottom-5 -left-5 cosmic-section rounded-2xl p-4 animate-float delay-1000 z-20">
              <div className="text-center">
                <div className="text-lg font-bold text-white premium-text">4K Gaming</div>
                <div className="text-sm text-gray-300 premium-text">Ultra HD</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 lg:px-12 relative premium-black-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white hero-text">
              WHY CHOOSE US
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Premium Gaming Setup */}
            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/30 icon-glow">
                <GameController className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white hero-text">Premium Gaming Setup</h3>
              <p className="text-gray-300 text-lg leading-relaxed premium-text">
                Experience gaming on high-end PlayStation consoles with 4K displays and premium sound systems in our comfortable gaming lounge.
              </p>
            </div>
            
            {/* Flexible Booking */}
            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30 icon-glow">
                <Clock className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white hero-text">Flexible Booking</h3>
              <p className="text-gray-300 text-lg leading-relaxed premium-text">
                Book your preferred time slot online or walk-in. Hourly rates with special packages for longer gaming sessions.
              </p>
            </div>
            
            {/* Largest Game Library */}
            <div className="group text-center">
              <div className="w-24 h-24 accent-silver rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-white/30 icon-glow">
                <Play className="h-12 w-12 text-black" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white hero-text">Latest Games</h3>
              <p className="text-gray-300 text-lg leading-relaxed premium-text">
                Access to 500+ games including FC24, Ghost of Tsushima, Spider-Man, and all the latest AAA titles updated regularly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-6 lg:px-12 premium-black-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white hero-text">
              HOW IT WORKS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto premium-text">
              Start gaming in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center group">
              <div className="w-20 h-20 accent-silver rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-black group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-white/30 icon-glow premium-text">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white hero-text">Choose Your Time</h3>
              <p className="text-gray-300 text-lg premium-text">
                Select your preferred gaming console and time slot from our available options
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 accent-gold rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-black group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-500/30 icon-glow premium-text">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white hero-text">Book & Confirm</h3>
              <p className="text-gray-300 text-lg premium-text">
                Reserve your slot online or call us directly to confirm your booking
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 accent-platinum rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-black group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-white/30 icon-glow premium-text">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white hero-text">Come & Play</h3>
              <p className="text-gray-300 text-lg premium-text">
                Visit our gaming center at your booked time and enjoy premium gaming experience
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => window.open('https://gamedenbookings.netlify.app/', '_blank')}
              className="accent-silver hover:accent-platinum text-black px-16 py-5 rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-white/30 premium-text"
            >
              Book Now
            </button>
          </div>
        </div>
      </section>

      {/* Gaming Stations Section */}
      <section className="py-32 px-6 lg:px-12 premium-black-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white hero-text">
              Gaming Stations
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto premium-text">
              Choose from our premium PlayStation gaming stations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {gameStations.map((station, index) => (
              <div key={index} className="group relative">
                <div className="console-card rounded-3xl p-8 transition-all duration-500 shadow-2xl hover:shadow-white/20 relative overflow-hidden">
                  {station.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="accent-gold text-black px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg premium-text">
                        <Crown className="h-4 w-4 mr-2" />
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  {/* Controller Image */}
                  <div className="relative mb-8 flex justify-center">
                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                      <img 
                        src={station.image} 
                        alt={`${station.name} Controller`}
                        className="w-64 h-64 object-contain drop-shadow-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-gray-300/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                  
                  {/* Station Info */}
                  <div className="text-center space-y-6">
                    <h3 className="text-3xl font-black text-white mb-2 hero-text">{station.name}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed premium-text">{station.description}</p>
                    
                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3">
                      {station.features.map((feature, idx) => (
                        <div key={idx} className="bg-black/50 rounded-lg p-3 text-sm text-gray-200 border border-white/20 premium-text">
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {/* Pricing */}
                    <div className="cosmic-section rounded-2xl p-6">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-5xl font-black text-white premium-text">{station.price}</span>
                        <div className="text-left">
                          <div className="text-sm text-gray-300 premium-text">per</div>
                          <div className="text-lg font-bold text-gray-200 premium-text">{station.period}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <button 
                        onClick={() => window.open('https://gamedenbookings.netlify.app/', '_blank')}
                        className="w-full accent-silver hover:accent-platinum text-black py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-white/30 premium-text"
                      >
                        Book This Station
                      </button>
                      <button className="w-full border-2 border-white/50 hover:border-white text-gray-300 hover:text-white py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center hover:bg-white/10 premium-text">
                        <Phone className="h-5 w-5 mr-2" />
                        Call to Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Time Slots Section */}
      <section className="py-32 px-6 lg:px-12 premium-black-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white hero-text">
              Available Time Slots
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto premium-text">
              Choose your preferred gaming time
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {timeSlots.map((slot, index) => (
              <div key={index} className="cosmic-section rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-white font-medium premium-text">{slot}</span>
                </div>
                <div className="text-sm text-green-400 premium-text">Available</div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="accent-silver hover:accent-platinum text-black px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/30 premium-text">
              View All Slots
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-32 px-6 lg:px-12 premium-black-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className="cosmic-section rounded-3xl p-12 shadow-2xl">
            <div className="flex justify-center mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <blockquote className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed elegant-text">
              "GameDen is the best gaming center in town! The PlayStation setups are amazing and the atmosphere is perfect for gaming with friends. Highly recommended!"
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <img 
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2" 
                alt="Customer" 
                className="w-16 h-16 rounded-full border-2 border-white/50"
              />
              <div className="text-left">
                <div className="font-bold text-white text-lg premium-text">Arjun Patel</div>
                <div className="text-gray-300 premium-text">Regular Customer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="py-32 px-6 lg:px-12 premium-black-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white hero-text">
              Visit Our Gaming Center
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-gray-300 mx-auto mb-8"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="cosmic-section rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 hero-text">Location & Hours</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 text-gray-400 mt-1" />
                  <div>
                    <p className="text-white font-medium premium-text">GameDen Gaming Center</p>
                    <p className="text-gray-300 premium-text">1E Shanthi Nagar, PB Complex</p>
                    <p className="text-gray-300 premium-text">Sathy Main Road, (Opp) Water Tank</p>
                    <p className="text-gray-300 premium-text">Gobichettipalayam - 638 452</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-gray-400 mt-1" />
                  <div>
                    <p className="text-white font-medium premium-text">Operating Hours</p>
                    <p className="text-gray-300 premium-text">Monday - Sunday: 10:00 AM - 10:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-6 w-6 text-gray-400 mt-1" />
                  <div>
                    <p className="text-white font-medium premium-text">Contact</p>
                    <p className="text-gray-300 premium-text">+91 93442 01886</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="cosmic-section rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 hero-text">Quick Booking</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => window.open('https://gamedenbookings.netlify.app/', '_blank')}
                  className="w-full accent-silver hover:accent-platinum text-black py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg premium-text"
                >
                  Book Online
                </button>
                <button className="w-full border-2 border-white/50 hover:border-white text-gray-300 hover:text-white py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center hover:bg-white/10 premium-text">
                  <Phone className="h-5 w-5 mr-2" />
                  Call to Book: +91 93442 01886
                </button>
                <div className="text-center pt-4">
                  <p className="text-gray-300 text-sm premium-text">
                    Walk-ins welcome based on availability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="premium-black-footer py-16 px-6 lg:px-12 border-t border-white/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 accent-silver rounded-xl flex items-center justify-center mr-4 icon-glow">
                  <GameController className="h-6 w-6 text-black" />
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent premium-text">
                  GameDen
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed premium-text">
                Your ultimate gaming destination with premium PlayStation gaming stations and comfortable gaming environment. Book your slot and experience next-level gaming today.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white hero-text">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => window.open('https://gamedenbookings.netlify.app/', '_blank')}
                    className="text-gray-400 hover:text-white transition-colors premium-text text-left"
                  >
                    Book a Slot
                  </button>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors premium-text">Gaming Stations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors premium-text">Membership</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors premium-text">Contact</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-white hero-text">Contact</h3>
              <div className="space-y-3 text-gray-400 premium-text">
                <p>+91 93442 01886</p>
                <p>info@gameden.com</p>
                <p>Gobichettipalayam</p>
                <p>10 AM - 10 PM Daily</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-center md:text-left mb-4 md:mb-0 premium-text">
              © {new Date().getFullYear()} GameDen Gaming Center. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors premium-text">Facebook</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors premium-text">Instagram</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors premium-text">Twitter</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default Home;