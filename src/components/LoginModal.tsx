import React, { useState } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { X, LogIn, Loader2, Mail, Lock, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const { supabase } = useSupabase();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string; errorType?: string }>({});

  // Check if Supabase is connected
  const isSupabaseConnected = !!supabase && 
    !!import.meta.env.VITE_SUPABASE_URL && 
    !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    // Clear general error when user modifies form
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined, errorType: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConnected) {
      toast.error('Please connect to Supabase first');
      return;
    }
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: undefined, errorType: undefined }));
    
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      const result = await login(formData.email, formData.password, supabase);
      
      if (result.success) {
        toast.success('Login successful!');
        onClose();
      } else {
        const errorMessage = result.error || 'Login failed';
        setErrors(prev => ({ 
          ...prev, 
          general: errorMessage,
          errorType: result.errorType 
        }));
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Login failed. Please try again.';
      setErrors(prev => ({ ...prev, general: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderErrorMessage = () => {
    if (!errors.general) return null;

    const isEmailNotConfirmed = errors.errorType === 'email_not_confirmed';
    const isInvalidCredentials = errors.errorType === 'invalid_credentials';

    return (
      <div className={`border rounded-md p-4 flex items-start ${
        isEmailNotConfirmed ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
      }`}>
        {isEmailNotConfirmed ? (
          <Mail className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
        )}
        <div className={`text-sm ${isEmailNotConfirmed ? 'text-amber-800' : 'text-red-700'}`}>
          <p className="font-medium">
            {isEmailNotConfirmed ? 'Email Confirmation Required' : 'Login Failed'}
          </p>
          <p className="mt-1">{errors.general}</p>
          
          {isEmailNotConfirmed && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-amber-700">
                <strong>Next steps:</strong>
              </p>
              <ul className="text-xs text-amber-700 space-y-1 ml-4">
                <li className="flex items-start">
                  <CheckCircle className="h-3 w-3 mt-0.5 mr-2 flex-shrink-0" />
                  Check your email inbox for a confirmation message
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-3 w-3 mt-0.5 mr-2 flex-shrink-0" />
                  Click the confirmation link in the email
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-3 w-3 mt-0.5 mr-2 flex-shrink-0" />
                  Return here and try signing in again
                </li>
              </ul>
              <p className="text-xs text-amber-600 mt-2">
                Don't see the email? Check your spam folder or contact your administrator.
              </p>
            </div>
          )}
          
          {isInvalidCredentials && (
            <p className="mt-2 text-xs text-red-600">
              Make sure you have created an admin account in Supabase Authentication or contact your administrator.
            </p>
          )}
        </div>
      </div>
    );
  };

  // Show Supabase connection prompt if not connected
  if (!isSupabaseConnected) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slideUp">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Supabase Setup Required
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-purple-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <ExternalLink className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect to Supabase</h3>
              <p className="text-sm text-gray-600">
                To enable authentication, you need to connect this project to Supabase first.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                How to connect:
              </h4>
              <ol className="text-sm text-blue-700 space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="font-medium mr-2">1.</span>
                  Click the "Connect to Supabase\" button in the top-right corner of the editor
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">2.</span>
                  Follow the setup instructions to create your Supabase project
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">3.</span>
                  Once connected, you'll be able to sign in and manage members
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">
                Admin Account Setup:
              </h4>
              <p className="text-sm text-yellow-700">
                After connecting to Supabase, create an admin account using the email: <strong>gamedenoffiz@gmail.com</strong>
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slideUp">
        <div className="bg-gradient-to-r from-gray-800 to-black px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center">
            <LogIn className="h-5 w-5 mr-2" />
            Admin Sign In
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {renderErrorMessage()}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
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
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-black bg-white ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="gamedenoffiz@gmail.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-black bg-white ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;