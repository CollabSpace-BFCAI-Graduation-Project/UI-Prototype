import React, { useState } from 'react';
import { X, UserCog, Trash2 } from 'lucide-react';
import { useUIStore, useSpacesStore, useAuthStore } from '../../store';
import api from '../../services/api';
import UserProfileModal from '../profile/UserProfileModal';

export default function MembersModal() {
    // Get state from stores
    const { isMembersModalOpen, closeMembersModal, openConfirmation } = useUIStore();
    const { activeSpace, setActiveSpace, spaces } = useSpacesStore();
    const { user } = useAuthStore();

    // Debug log
    console.log('MembersModal Render:', {
        isMembersModalOpen,
        hasActiveSpace: !!activeSpace,
        membersCount: activeSpace?.members?.length,
        firstMember: activeSpace?.members?.[0]
    });

    // Local state for quick invite
    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [viewingProfileId, setViewingProfileId] = useState(null);

    if (!isMembersModalOpen || !activeSpace) return null;

    const handleRoleChange = async (memberId, newRole) => {
        try {
            await api.members.updateRole(activeSpace.id, memberId, newRole);
        } catch (err) {
            // Fallback handled
        }

        // Update in store
        const updatedSpaces = spaces.map(s => {
            if (s.id === activeSpace.id) {
                const updatedMembers = s.members?.map(m => m.id === memberId ? { ...m, role: newRole } : m) || [];
                return { ...s, members: updatedMembers };
            }
            return s;
        });
        useSpacesStore.setState({ spaces: updatedSpaces });

        const updatedActiveSpace = updatedSpaces.find(s => s.id === activeSpace.id);
        if (updatedActiveSpace) {
            setActiveSpace(updatedActiveSpace);
        }
    };



    const handleInvite = async () => {
        if (!inviteEmail || !inviteEmail.includes('@')) return;
        setIsInviting(true);
        try {
            await api.members.invite(activeSpace.id, {
                emails: [inviteEmail],
                inviterName: user?.name,
                inviterId: user?.id
            });
            setInviteEmail('');
            // Optional: Show success feedback
        } catch (err) {
            console.error('Failed to invite:', err);
        } finally {
            setIsInviting(false);
        }
    };

    const currentUserMember = activeSpace.members?.find(m => m.userId === user?.id);
    const canManageMembers = currentUserMember?.role === 'Owner' || currentUserMember?.role === 'Admin';


    const handleKick = (memberId) => {
        if (!memberId) {
            console.error('Cannot kick member: memberId is undefined', activeSpace.members);
            return;
        }
        const memberName = activeSpace.members?.find(m => m.id === memberId)?.name || 'this member';

        openConfirmation({
            title: 'Remove Member?',
            message: `Are you sure you want to remove ${memberName} from the space? They will lose access immediately.`,
            confirmText: 'Remove',
            cancelText: 'Cancel',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await api.members.remove(activeSpace.id, memberId);

                    // Update in store
                    const updatedSpaces = spaces.map(s => {
                        if (s.id === activeSpace.id) {
                            const updatedMembers = s.members?.filter(m => m.id !== memberId) || [];
                            return { ...s, members: updatedMembers };
                        }
                        return s;
                    });
                    useSpacesStore.setState({ spaces: updatedSpaces });

                    const updatedActiveSpace = updatedSpaces.find(s => s.id === activeSpace.id);
                    if (updatedActiveSpace) {
                        setActiveSpace(updatedActiveSpace);
                    }
                } catch (err) {
                    console.error('Failed to remove member:', err);
                }
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMembersModal}></div>
            <div className="relative w-full max-w-2xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col h-[600px] animate-in zoom-in-95">
                <div className="p-6 border-b-2 border-black bg-purple-50 flex justify-between items-center rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-2"><UserCog size={24} /> Manage Members</h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Space: {activeSpace.name}</p>
                    </div>
                    <button onClick={closeMembersModal} className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex gap-2 mb-6">
                        <input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                            placeholder="Add by email..."
                            className="flex-1 border-2 border-black rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-purple-300"
                        />
                        <button
                            onClick={handleInvite}
                            disabled={!inviteEmail || isInviting}
                            className="bg-black text-white px-6 rounded-xl font-bold border-2 border-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
                        >
                            {isInviting ? 'Sending...' : 'Invite'}
                        </button>
                    </div>
                    <div className="space-y-4">
                        {activeSpace.members?.map(member => (
                            <div key={member.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border-2 border-transparent hover:border-black transition-all">
                                <div
                                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => setViewingProfileId(member.userId)}
                                    title="View profile"
                                >
                                    <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-bold ${member.avatar}`}>{member.name?.[0] || '?'}</div>
                                    <div>
                                        <p className="font-bold hover:text-pink-600 transition-colors">{member.name}</p>
                                        <p className="text-xs text-gray-500 font-bold">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        defaultValue={member.role}
                                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                        disabled={!canManageMembers || member.role === 'Owner'}
                                        className="bg-white border-2 border-black rounded-lg px-2 py-1 text-sm font-bold outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="Owner">Owner</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Member">Member</option>
                                        <option value="Viewer">Viewer</option>
                                    </select>
                                    {canManageMembers && member.role !== 'Owner' && member.userId !== user?.id && (
                                        <button
                                            onClick={() => handleKick(member.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Remove User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Profile Modal */}
            {viewingProfileId && (
                <UserProfileModal
                    userId={viewingProfileId}
                    viewerId={user?.id}
                    onClose={() => setViewingProfileId(null)}
                />
            )}
        </div>
    );
}
