import React, { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { X, Calendar, Clock, Save, Loader2 } from 'lucide-react';
import { Member } from '../types/member';
import toast from 'react-hot-toast';

interface AddPlayModalProps {
  member: Member;
  onClose: () => void;
  onSave: () => void;
}

const AddPlayModal: React.FC<AddPlayModalProps> = ({ member, onClose, onSave }) => {
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [playDate, setPlayDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [playTime, setPlayTime] = useState<string>(
    new Date().toTimeString().split(' ')[0].substring(0, 5)
  );
  const [playCount, setPlayCount] = useState<number>(0);
  const [isFreePlay, setIsFreePlay] = useState<boolean>(false);

  useEffect(() => {
    // Add event listener to close modal on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    // Fetch play count for this member
    fetchPlayCount();
    
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const fetchPlayCount = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('play_history')
        .select('*')
        .eq('member_id', member.id);
        
      if (error) throw error;
      
      const count = data.length;
      setPlayCount(count);
      
      // Check if this would be a free play (every 6th play: 6, 12, 18, etc.)
      const nextPlayCount = count + 1;
      if (nextPlayCount > 0 && nextPlayCount % 6 === 0) {
        setIsFreePlay(true);
      }
    } catch (error) {
      console.error('Error fetching play count:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      // Combine date and time
      const playDateTime = new Date(`${playDate}T${playTime}`);
      
      // Insert new play record
      const { error } = await supabase
        .from('play_history')
        .insert([{
          member_id: member.id,
          play_date: playDateTime.toISOString(),
          is_free_play: isFreePlay
        }]);
        
      if (error) throw error;
      
      toast.success('Play record added successfully!');
      onSave();
    } catch (error) {
      console.error('Error adding play record:', error);
      toast.error('Failed to add play record. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slideUp">
        <div className="bg-indigo-600 px-6 py-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white hero-text flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Add Play Record
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-indigo-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">{member.full_name}</h3>
            <p className="text-sm text-gray-500">Card: {member.card_number}</p>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Current play count: <span className="font-semibold">{playCount + 1}</span>
              </p>
              
              {isFreePlay && (
                <div className="mt-2 rounded-md bg-green-50 p-3 text-sm text-green-700 flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  This will be a free play!
                </div>
              )}
              
              {!isFreePlay && playCount > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  {6 - ((playCount + 1) % 6)} more plays until free play.
                </p>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="playDate" className="block text-sm font-medium text-gray-700">
                  Play Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="playDate"
                    name="playDate"
                    value={playDate}
                    onChange={(e) => setPlayDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="playTime" className="block text-sm font-medium text-gray-700">
                  Play Time
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="playTime"
                    name="playTime"
                    value={playTime}
                    onChange={(e) => setPlayTime(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Add Play
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlayModal;