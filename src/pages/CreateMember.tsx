import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../context/SupabaseContext';
import { Save, User, CreditCard, Phone, Mail, Loader2, Shuffle, Shield, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import MembershipCard from '../components/MembershipCard';
import OTPVerification from '../components/OTPVerification';

interface FormData {
  full_name: string;
  card_number: string;
  phone: string;
  email: string;
}

const CreateMember: React.FC = () => {
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingCard, setIsCheckingCard] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    card_number: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
      isValid = false;
    }

    if (!formData.card_number.trim()) {
      newErrors.card_number = 'Card number is required';
      isValid = false;
    } else if (!/^\d{4}$/.test(formData.card_number)) {
      newErrors.card_number = 'Card number must be exactly 4 digits';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Indian phone number';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!isPhoneVerified) {
      newErrors.phone = 'Phone number must be verified';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const checkCardNumberExists = async (cardNumber: string): Promise<boolean> => {
    if (!supabase) return false;
    
    const { data } = await supabase
      .from('members')
      .select('card_number')
      .eq('card_number', cardNumber)
      .maybeSingle();
      
    return !!data;
  };

  const generateRandomCardNumber = async () => {
    setIsCheckingCard(true);
    try {
      let cardNumber: string;
      let exists: boolean;
      
      do {
        cardNumber = Math.floor(1000 + Math.random() * 9000).toString();
        exists = await checkCardNumberExists(cardNumber);
      } while (exists);
      
      setFormData(prev => ({ ...prev, card_number: cardNumber }));
      // Clear any existing card number error
      setErrors(prev => ({ ...prev, card_number: undefined }));
    } catch (error) {
      console.error('Error generating card number:', error);
      toast.error('Failed to generate card number');
    } finally {
      setIsCheckingCard(false);
    }
  };

  const handleVerifyPhone = () => {
    if (!formData.phone.trim()) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
      return;
    }
    
    if (!/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid Indian phone number' }));
      return;
    }

    setShowOTPVerification(true);
  };

  const handleOTPVerified = () => {
    setIsPhoneVerified(true);
    setShowOTPVerification(false);
    setErrors(prev => ({ ...prev, phone: undefined }));
    toast.success('Phone number verified successfully!');
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Reset phone verification if phone number changes
    if (name === 'phone' && isPhoneVerified) {
      setIsPhoneVerified(false);
    }

    // Check card number for duplicates as user types
    if (name === 'card_number' && value.length === 4) {
      setIsCheckingCard(true);
      try {
        const exists = await checkCardNumberExists(value);
        if (exists) {
          setErrors(prev => ({
            ...prev,
            card_number: 'This card number is already in use'
          }));
        }
      } catch (error) {
        console.error('Error checking card number:', error);
      } finally {
        setIsCheckingCard(false);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const redirectToWhatsApp = (name: string, phone: string, cardNumber: string) => {
    const cleanPhone = phone.replace(/\D/g, '').replace(/^(\+91|91)?/, '91');
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
    
    const message = `Hi ${name},

Welcome to GAME_DEN🎮!

Here are your membership card details:

Name: ${name}
Card No: ${cardNumber} 
Validity: ${formatDate(startDate)} to ${formatDate(endDate)}

OFFERS FOR MEMBERSHIP CARD HOLDERS:
                * 20% discount.
                * Play 5 hour's & 
                   get 1 time FREE…

TERMS AND CONDITIONS:
        * A purchased card may be used by any player;
however, only up to four (4) players may use the card at the same time.

If you have any questions or need assistance, feel free to reply to this message.

DM for booking 🕹
Instagram: 
https://www.instagram.com/game_den__?igsh=MWk5eDhqenE4bGpldg%3D%3D&utm_source=qr

Thank you for joining us!
— GAME_DEN🎮!!`;

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      // Final check for card number duplicate before submission
      const exists = await checkCardNumberExists(formData.card_number);
      if (exists) {
        setErrors(prev => ({
          ...prev,
          card_number: 'This card number is already in use'
        }));
        setIsLoading(false);
        return;
      }
      
      // Insert new member
      const { error } = await supabase
        .from('members')
        .insert([formData]);
        
      if (error) throw error;
      
      toast.success('Member created successfully!');
      redirectToWhatsApp(formData.full_name, formData.phone, formData.card_number);
    } catch (error) {
      console.error('Error creating member:', error);
      toast.error('Failed to create member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fadeIn">
      <div className="glass-effect rounded-2xl shadow-2xl overflow-hidden neon-border card-hover">
        <div className="gaming-gradient px-8 py-6">
          <h1 className="text-3xl font-bold text-white hero-text animate-pulse-glow">Create New Member</h1>
          <p className="text-gray-300 mt-2 premium-text">Fill in the details to create a new gaming membership</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-7">
            <div className="group">
              <label htmlFor="full_name" className="block text-sm font-semibold text-white mb-2 premium-text tracking-wide">
                Full Name
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
                </div>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 bg-white/10 border rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white text-white premium-text transition-all ${
                    errors.full_name ? 'border-red-500' : 'border-white/30 hover:border-white/50'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.full_name && (
                <p className="mt-2 text-sm text-red-400 premium-text animate-slideUp">{errors.full_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="card_number" className="block text-sm font-medium text-white mb-1 premium-text">
                Card Number (4 digits)
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="card_number"
                  name="card_number"
                  value={formData.card_number}
                  onChange={handleChange}
                  maxLength={4}
                  className={`block w-full pl-10 pr-12 py-2 bg-white/10 border rounded-md focus:ring-white focus:border-white text-white premium-text ${
                    errors.card_number ? 'border-red-500' : 'border-white/30'
                  }`}
                  placeholder="1234"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    type="button"
                    onClick={generateRandomCardNumber}
                    disabled={isCheckingCard}
                    className="pr-3 hover:text-gray-300 text-gray-400 transition-colors"
                    title="Generate random card number"
                  >
                    {isCheckingCard ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Shuffle className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.card_number && (
                <p className="mt-1 text-sm text-red-500 premium-text">{errors.card_number}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white mb-1 premium-text">
                Phone Number (Indian Format)
              </label>
              <div className="flex space-x-2">
                <div className="relative rounded-md shadow-sm flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 bg-white/10 border rounded-md focus:ring-white focus:border-white text-white premium-text ${
                      errors.phone ? 'border-red-500' : isPhoneVerified ? 'border-green-500' : 'border-white/30'
                    }`}
                    placeholder="+91 9876543210"
                  />
                  {isPhoneVerified && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleVerifyPhone}
                  disabled={!formData.phone.trim() || isPhoneVerified}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center premium-text ${
                    isPhoneVerified 
                      ? 'bg-green-600 text-white cursor-not-allowed' 
                      : 'accent-silver hover:accent-platinum text-black hover-scale disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {isPhoneVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500 premium-text">{errors.phone}</p>
              )}
              {isPhoneVerified && (
                <p className="mt-1 text-sm text-green-500 flex items-center premium-text">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Phone number verified successfully
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1 premium-text">
                Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 bg-white/10 border rounded-md focus:ring-white focus:border-white text-white premium-text ${
                    errors.email ? 'border-red-500' : 'border-white/30'
                  }`}
                  placeholder="john.doe@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 premium-text">{errors.email}</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isLoading || !isPhoneVerified}
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-black accent-silver hover:accent-platinum focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/30 premium-text btn-ripple"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-6 w-6 mr-2 spinner-glow" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-6 w-6 mr-2" />
                    Create Member
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Membership Card Preview */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center text-white hero-text">Your Membership Card Preview</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <MembershipCard cardNumber={formData.card_number || '____'} />
          <MembershipCard showBack />
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPVerification && (
        <OTPVerification
          phoneNumber={formData.phone}
          onVerified={handleOTPVerified}
          onCancel={() => setShowOTPVerification(false)}
        />
      )}
    </div>
  );
};

export default CreateMember;