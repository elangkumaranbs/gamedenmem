import React, { useState, useEffect } from 'react';
import { MessageCircle, Shield, Loader2, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
  onCancel: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ phoneNumber, onVerified, onCancel }) => {
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    generateOTP();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsExpired(true);
    }
  }, [timeLeft]);

  const generateOTP = () => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOTP);
    setTimeLeft(300);
    setIsExpired(false);
    setOtp('');
    toast.success('New OTP generated! Please send it via WhatsApp.');
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '').replace(/^(\+91|91)?/, '91');
    return cleanPhone;
  };

  const openWhatsApp = () => {
    const whatsappPhone = formatPhoneForWhatsApp(phoneNumber);
    const message = `Your GameDen verification code is: ${generatedOTP}

This code will expire in ${Math.floor(timeLeft / 60)} minutes.

Please enter this code on the registration page to complete your membership.

- GameDen Team`;

    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    if (isExpired) {
      toast.error('OTP has expired. Please generate a new one.');
      return;
    }

    setIsVerifying(true);

    try {
      if (otp === generatedOTP) {
        toast.success('Phone number verified successfully!');
        onVerified();
      } else {
        toast.error('Invalid OTP. Please check and try again.');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-black border border-white/20 rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-black via-gray-900 to-black px-6 py-4 flex justify-between items-center border-b border-white/20">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            WhatsApp Verification
          </h2>
        </div>
        
        <div className="p-6 bg-black">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black border border-white/30 rounded-full flex items-center justify-center mb-4 mx-auto">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Verify Your Phone Number</h3>
            <p className="text-sm text-gray-300">
              We'll send a verification code to <strong className="text-white">{phoneNumber}</strong> via WhatsApp
            </p>
          </div>

          {/* Admin Panel - OTP Display */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-yellow-400 mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Admin: Send this OTP via WhatsApp
            </h4>
            <div className="bg-white rounded border border-gray-300 p-3 mb-3">
              <div className="text-2xl font-mono font-bold text-center text-black tracking-wider select-all">
                {generatedOTP}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={openWhatsApp}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send via WhatsApp
              </button>
              <button
                onClick={generateOTP}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors"
                title="Generate new OTP"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* User Input */}
          <div className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono tracking-wider placeholder-gray-400"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div className="text-center">
              {isExpired ? (
                <p className="text-red-400 text-sm">
                  OTP has expired. Please generate a new one.
                </p>
              ) : (
                <p className="text-gray-300 text-sm">
                  Code expires in: <span className="font-mono font-medium text-yellow-400">{formatTime(timeLeft)}</span>
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-600 bg-gray-800 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                disabled={isVerifying || !otp || otp.length !== 6 || isExpired}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;