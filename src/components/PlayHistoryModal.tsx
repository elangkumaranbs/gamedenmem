import React, { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { X, Calendar, Clock, Loader2 } from 'lucide-react';
import { Member, PlayHistory } from '../types/member';
import toast from 'react-hot-toast';

interface PlayHistoryModalProps {
  member: Member;
  onClose: () => void;
}

const PlayHistoryModal: React.FC<PlayHistoryModalProps> = ({ member, onClose }) => {
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [playHistory, setPlayHistory] = useState<PlayHistory[]>([]);

  useEffect(() => {
    fetchPlayHistory();
    
    // Add event listener to close modal on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const fetchPlayHistory = async () => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('play_history')
        .select('*')
        .eq('member_id', member.id)
        .order('play_date', { ascending: false });
        
      if (error) throw error;
      
      setPlayHistory(data);
    } catch (error) {
      console.error('Error fetching play history:', error);
      toast.error('Failed to load play history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Play History</h2>
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
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading play history...</span>
            </div>
          ) : playHistory.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No play history found.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {playHistory.map((play, index) => (
                <div 
                  key={play.id}
                  className={`bg-gray-50 rounded-lg p-4 ${
                    play.is_free_play ? 'border-2 border-green-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(play.play_date)}
                        </p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(play.play_date)}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        play.is_free_play 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {play.is_free_play ? 'Free Play' : `Play #${playHistory.length - index}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayHistoryModal;