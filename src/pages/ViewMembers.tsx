import React, { useState, useEffect } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { CreditCard as Edit, Trash2, Search, ArrowUp, ArrowDown, Loader2, CalendarDays, History, Clock, RefreshCw, Download } from 'lucide-react';
import { Member, MemberWithPlayCount } from '../types/member';
import toast from 'react-hot-toast';
import EditMemberModal from '../components/EditMemberModal';
import AddPlayModal from '../components/AddPlayModal';
import PlayHistoryModal from '../components/PlayHistoryModal';
import ConfirmDialog from '../components/ConfirmDialog';
import * as XLSX from 'xlsx';

const ViewMembers: React.FC = () => {
  const { supabase } = useSupabase();
  const [members, setMembers] = useState<MemberWithPlayCount[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Start with false
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Member>('full_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [addPlayMember, setAddPlayMember] = useState<Member | null>(null);
  const [viewHistoryMember, setViewHistoryMember] = useState<Member | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [resettingMember, setResettingMember] = useState<Member | null>(null);

  useEffect(() => {
    if (supabase) {
      fetchMembers();
    }
  }, [supabase]);

  const fetchMembers = async () => {
    if (!supabase) {
      console.error('Supabase client not available');
      return;
    }

    setIsLoading(true);
    try {
      // Fetch members data
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (membersError) {
        console.error('Error fetching members:', membersError);
        throw membersError;
      }

      // Fetch play history data
      const { data: playHistoryData, error: playHistoryError } = await supabase
        .from('play_history')
        .select('*')
        .order('play_date', { ascending: false });

      if (playHistoryError) {
        console.error('Error fetching play history:', playHistoryError);
        throw playHistoryError;
      }

      // Combine members with their play counts
      const membersWithPlayCount = (membersData || []).map((member) => {
        const memberPlays = (playHistoryData || []).filter(play => play.member_id === member.id);
        const lastPlayed = memberPlays.length > 0 
          ? new Date(Math.max(...memberPlays.map(play => new Date(play.play_date).getTime())))
          : undefined;
          
        return {
          ...member,
          play_count: memberPlays.length,
          last_played: lastPlayed ? lastPlayed.toISOString() : undefined
        };
      });

      setMembers(membersWithPlayCount);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '').replace(/^(\+91|91)?/, '91');
    return cleanPhone;
  };

  const sendRenewalWhatsAppMessage = (member: Member, newStartDate: Date, newEndDate: Date) => {
    const whatsappPhone = formatPhoneForWhatsApp(member.phone);
    
    const message = `Hi ${member.full_name},

🎉 GREAT NEWS! Your GAME_DEN membership has been renewed! 🎮

Here are your updated membership details:

Name: ${member.full_name}
Card No: ${member.card_number}
New Validity: ${formatDate(newStartDate)} to ${formatDate(newEndDate)}

MEMBERSHIP BENEFITS CONTINUE:
                * 20% discount on all games
                * Play 5 times & get 1 time FREE
                * Priority booking access

TERMS AND CONDITIONS:
        * A purchased card may be used by any player;
however, only up to four (4) players may use the card at the same time.

Thank you for renewing your membership with us! 🎮

Ready to game? DM for booking 🕹
Instagram: 
https://www.instagram.com/game_den__?igsh=MWk5eDhqenE4bGpldg%3D%3D&utm_source=qr

— GAME_DEN Team 🎮!!`;

    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleResetValidity = async () => {
    if (!supabase || !resettingMember) return;

    try {
      const now = new Date();
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

      const { error } = await supabase
        .from('members')
        .update({
          validity_start: now.toISOString(),
          validity_end: sixMonthsLater.toISOString()
        })
        .eq('id', resettingMember.id);

      if (error) throw error;

      toast.success('Validity reset successfully');
      
      // Send WhatsApp renewal message
      sendRenewalWhatsAppMessage(resettingMember, now, sixMonthsLater);
      
      fetchMembers();
    } catch (error) {
      console.error('Error resetting validity:', error);
      toast.error('Failed to reset validity. Please try again.');
    } finally {
      setResettingMember(null);
    }
  };

  const handleSort = (field: keyof Member) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteMember = async () => {
    if (!supabase || !deletingMember) return;

    try {
      // Delete play history first (foreign key constraint)
      const { error: playHistoryError } = await supabase
        .from('play_history')
        .delete()
        .eq('member_id', deletingMember.id);

      if (playHistoryError) throw playHistoryError;

      // Then delete the member
      const { error: memberError } = await supabase
        .from('members')
        .delete()
        .eq('id', deletingMember.id);

      if (memberError) throw memberError;

      toast.success('Member deleted successfully');
      setMembers(members.filter(m => m.id !== deletingMember.id));
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member. Please try again.');
    } finally {
      setDeletingMember(null);
    }
  };

  const getValidityStatus = (validityEnd: string) => {
    const now = new Date();
    const endDate = new Date(validityEnd);
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return { status: 'expired', text: 'Expired', className: 'status-expired badge-pulse' };
    } else if (daysLeft <= 30) {
      return { status: 'expiring', text: `${daysLeft} days left`, className: 'status-expiring badge-pulse' };
    } else {
      return { status: 'active', text: `${daysLeft} days left`, className: 'status-active' };
    }
  };

  const formatDateDisplay = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const exportToExcel = async () => {
    if (members.length === 0) {
      toast.error('No members to export');
      return;
    }

    setIsExporting(true);
    
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      // Prepare data for export
      const exportData = members.map(member => ({
        'Card Number': member.card_number,
        'Full Name': member.full_name,
        'Phone': member.phone,
        'Email': member.email,
        'Validity Start': formatDateDisplay(member.validity_start),
        'Validity End': formatDateDisplay(member.validity_end),
        'Status': getValidityStatus(member.validity_end).text,
        'Total Plays': member.play_count,
        'Free Plays Available': Math.floor(member.play_count / 6),
        'Member Since': formatDateDisplay(member.created_at)
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Auto-adjust column widths
      const colWidths = [
        { wch: 15 }, // Card Number
        { wch: 25 }, // Full Name
        { wch: 15 }, // Phone
        { wch: 30 }, // Email
        { wch: 15 }, // Validity Start
        { wch: 15 }, // Validity End
        { wch: 15 }, // Status
        { wch: 12 }, // Total Plays
        { wch: 18 }, // Free Plays Available
        { wch: 15 }, // Member Since
      ];
      worksheet['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `GameDen_Members_${currentDate}.xlsx`;

      // Download the file
      XLSX.writeFile(workbook, filename);
      toast.success(`✅ ${members.length} members exported successfully as ${filename}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export members. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    return (
      member.full_name.toLowerCase().includes(searchLower) ||
      member.card_number.includes(searchTerm) ||
      member.phone.includes(searchTerm) ||
      member.email.toLowerCase().includes(searchLower)
    );
  }).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Show connection error if Supabase is not available
  if (!supabase) {
    return (
      <div className="space-y-6">
        <div className="glass-effect rounded-lg shadow-lg overflow-hidden neon-border">
          <div className="gaming-gradient px-6 py-4">
            <h1 className="text-xl font-bold text-white animate-pulse-glow hero-text">Member List</h1>
          </div>
          <div className="p-6">
            <div className="text-center py-10 text-red-400">
              <p className="text-lg font-medium mb-2 premium-text">Database Connection Error</p>
              <p className="text-sm premium-text">Unable to connect to the database. Please check your connection and try again.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 accent-silver text-black rounded-lg hover:accent-platinum transition-colors premium-text"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="glass-effect rounded-2xl shadow-2xl overflow-hidden neon-border card-hover">
        <div className="gaming-gradient px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white animate-pulse-glow hero-text">Member List</h1>
            <p className="text-sm text-gray-300 mt-1 premium-text">
              {members.length} total member{members.length !== 1 ? 's' : ''} • {filteredMembers.length} displayed
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={exportToExcel}
              disabled={isExporting || members.length === 0}
              className="glass-effect hover:bg-green-600/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 premium-text border border-green-500/30 hover:border-green-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin spinner-glow" />
              ) : (
                <Download className="h-5 w-5 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export Excel'}
            </button>
            <button
              onClick={fetchMembers}
              className="glass-effect hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all duration-300 hover:scale-105 hover:shadow-lg premium-text border border-white/30 hover:border-white/50"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>
        
        <div className="p-8">
          <div className="mb-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-hover:text-gray-300 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by name, card number, phone, or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-12 pr-4 py-4 w-full bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white text-white placeholder-gray-400 premium-text transition-all hover:border-white/50 text-lg"
            />
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <Loader2 className="h-12 w-12 text-white animate-spin spinner-glow mb-4" />
              <span className="text-lg text-gray-300 premium-text animate-pulse">Loading members...</span>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-10 text-gray-300">
              <p className="text-lg font-medium mb-2 premium-text">
                {searchTerm ? 'No members found matching your search.' : 'No members found.'}
              </p>
              {!searchTerm && (
                <p className="text-sm premium-text">Create your first member to get started!</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/30">
                <thead className="bg-black/30">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer premium-text"
                      onClick={() => handleSort('full_name')}
                    >
                      <div className="flex items-center">
                        <span>Name</span>
                        {sortField === 'full_name' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer premium-text"
                      onClick={() => handleSort('card_number')}
                    >
                      <div className="flex items-center">
                        <span>Card</span>
                        {sortField === 'card_number' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                          </span>
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider premium-text">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider premium-text">
                      Validity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider premium-text">
                      Play Count
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider premium-text">
                      Last Played
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider premium-text">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/30">
                  {filteredMembers.map((member) => {
                    const validity = getValidityStatus(member.validity_end);
                    return (
                      <tr key={member.id} className="hover:bg-white/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white premium-text">{member.full_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300 premium-text">{member.card_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300 premium-text">{member.phone}</div>
                          <div className="text-sm text-gray-300 premium-text">{member.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${validity.className} premium-text`}>
                              <Clock className="w-3 h-3 mr-1" />
                              {validity.text}
                            </div>
                            <div className="text-xs text-gray-300 space-y-1 premium-text">
                              <div>From: {formatDateDisplay(member.validity_start)}</div>
                              <div>Until: {formatDateDisplay(member.validity_end)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`text-sm font-medium premium-text ${(member.play_count + 1) % 6 === 0 && member.play_count > 0 ? 'text-green-400' : 'text-white'}`}>
                              {member.play_count + 1}
                              {(member.play_count + 1) % 6 === 0 && member.play_count > 0 ? 
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 premium-text">
                                  Free Play!
                                </span> : 
                                member.play_count > 0 ?
                                <span className="ml-2 text-xs text-gray-300 premium-text">
                                  {6 - ((member.play_count + 1) % 6)} until free
                                </span> : null
                              }
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300 premium-text">
                            {member.last_played ? formatDateTime(member.last_played) : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setViewHistoryMember(member)}
                              className="text-white hover:text-gray-200 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all hover:scale-110 hover:shadow-lg"
                              title="View History"
                            >
                              <History className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setAddPlayMember(member)}
                              className="text-white hover:text-gray-200 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all hover:scale-110 hover:shadow-lg"
                              title="Add Play"
                            >
                              <CalendarDays className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setResettingMember(member)}
                              className="text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-800/40 p-2 rounded-lg transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30"
                              title="Reset Validity"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingMember(member)}
                              className="text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-800/40 p-2 rounded-lg transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30"
                              title="Edit Member"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeletingMember(member)}
                              className="text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-800/40 p-2 rounded-lg transition-all hover:scale-110 hover:shadow-lg hover:shadow-red-500/30"
                              title="Delete Member"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={(updatedMember) => {
            setMembers(members.map(m => m.id === updatedMember.id ? { ...updatedMember, play_count: m.play_count, last_played: m.last_played } : m));
            setEditingMember(null);
          }}
        />
      )}

      {addPlayMember && (
        <AddPlayModal
          member={addPlayMember}
          onClose={() => setAddPlayMember(null)}
          onSave={() => {
            fetchMembers();
            setAddPlayMember(null);
          }}
        />
      )}

      {viewHistoryMember && (
        <PlayHistoryModal
          member={viewHistoryMember}
          onClose={() => setViewHistoryMember(null)}
        />
      )}

      {deletingMember && (
        <ConfirmDialog
          title="Delete Member"
          message={`Are you sure you want to delete ${deletingMember.full_name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
          onConfirm={handleDeleteMember}
          onCancel={() => setDeletingMember(null)}
        />
      )}

      {resettingMember && (
        <ConfirmDialog
          title="Reset Validity"
          message={`Are you sure you want to reset the validity for ${resettingMember.full_name}? This will set a new 6-month period starting from today and send a renewal confirmation via WhatsApp.`}
          confirmText="Reset & Send Message"
          cancelText="Cancel"
          confirmColor="indigo"
          onConfirm={handleResetValidity}
          onCancel={() => setResettingMember(null)}
        />
      )}
    </div>
  );
};

export default ViewMembers;