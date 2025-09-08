import React from 'react';
import { QrCode } from 'lucide-react';

interface MembershipCardProps {
  cardNumber?: string;
  showBack?: boolean;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ cardNumber = '____', showBack = false }) => {
  if (showBack) {
    return (
      <div className="w-full max-w-md mx-auto aspect-[1.586] rounded-xl overflow-hidden relative gaming-gradient">
        <img 
          src="https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Card Background" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="relative h-full flex flex-col justify-between p-6 text-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 cyber-text">GAME DEN</h2>
            <div className="w-24 h-24 mx-auto gaming-gradient rounded-lg p-2">
              <div className="w-full h-full bg-white/90 rounded flex items-center justify-center">
                <QrCode className="w-16 h-16 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <p className="text-xl font-semibold">* 20% DISCOUNT</p>
              <p className="text-xl font-semibold">* PLAY 5 TIME's, GET 1 TIME FREE</p>
            </div>
            
            <div className="text-sm opacity-80">
              <p>Contact: +91 93442 01886</p>
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto aspect-[1.586] rounded-xl overflow-hidden relative gaming-gradient">
      <img 
        src="https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
        alt="Card Background" 
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
      />
      <div className="relative h-full flex flex-col justify-between p-6 text-white">
        <div>
          <h2 className="text-4xl font-bold mb-6 text-center animate-pulse-glow">LOYALTY PASS</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm opacity-80">CARD NO:</p>
              <p className="text-2xl font-mono">{cardNumber}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div 
                key={num} 
                className="aspect-square border-2 border-white/50 rounded flex items-center justify-center text-xl font-bold"
              >
                {num}
              </div>
            ))}
          </div>
          
          <div className="border-2 border-green-500 rounded w-24 mx-auto">
            <p className="text-center text-green-500 font-bold py-1">FREE</p>
          </div>
          
          <div className="text-sm opacity-80">
            <p className="text-center">Card Usage Policy:</p>
            <p className="text-center">A purchased card may be used by any player;</p>
            <p className="text-center">however, only up to four (4) players may use the card at the same time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;