import React, { useState } from 'react';
import { X, UserCog, Trash2, Check, Loader } from 'lucide-react';
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

    // Local state
    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [viewingProfileId, setViewingProfileId] = useState(null);
    const [activeTab, setActiveTab] = useState('members');
    const [requests, setRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);

    // Fetch requests logic
    const { fetchSpaceRequests, approveRequest, rejectRequest } = useSpacesStore();

    React.useEffect(() => {
        if (isMembersModalOpen && activeTab === 'requests' && activeSpace) {
            loadRequests();
        }
    }, [isMembersModalOpen, activeTab, activeSpace]);

    const loadRequests = async () => {
        setLoadingRequests(true);
        try {
            const data = await fetchSpaceRequests(activeSpace.id);
            setRequests(data);
        } catch (err) {
            console.error('Failed to load requests');
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleApprove = async (requestId) => {
        try {
            await approveRequest(activeSpace.id, requestId);
            setRequests(prev => prev.filter(r => r.id !== requestId));
            // Ideally trigger refresh of members list here
        } catch (err) {
            console.error('Failed to approve', err);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await rejectRequest(activeSpace.id, requestId);
            setRequests(prev => prev.filter(r => r.id !== requestId));
        } catch (err) {
            console.error('Failed to reject', err);
        }
    };

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

    const handleTransferOwnership = async (newOwnerId) => {
        try {
            await useSpacesStore.getState().transferOwnership(activeSpace.id, user.id, newOwnerId);

            // Close modal to force refresh or update local state
            // For now, simple alert and close
            closeMembersModal();
        } catch (err) {
            console.error('Failed to transfer ownership:', err);
            alert('Failed to transfer ownership');
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

                {/* Tabs for Owners */}
                {canManageMembers && (
                    <div className="px-6 pt-4 flex gap-2 border-b-2 border-gray-100">
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`px-4 py-2 font-bold text-sm rounded-t-xl border-t-2 border-x-2 transition-all ${activeTab === 'members'
                                ? 'bg-white border-black border-b-white -mb-0.5 z-10'
                                : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            Members ({activeSpace.members?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`px-4 py-2 font-bold text-sm rounded-t-xl border-t-2 border-x-2 transition-all ${activeTab === 'requests'
                                ? 'bg-white border-black border-b-white -mb-0.5 z-10'
                                : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            Requests
                            {activeSpace.requestsCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {activeSpace.requestsCount}
                                </span>
                            )}
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'members' && (
                        <>
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
                                                value={member.role} // controlled component
                                                onChange={(e) => {
                                                    const newRole = e.target.value;
                                                    if (newRole === 'TRANSFER_OWNERSHIP') {
                                                        // Confirm transfer
                                                        openConfirmation({
                                                            title: 'Transfer Ownership?',
                                                            message: `Are you sure you want to transfer ownership of this space to ${member.name}? You will lose ownership and become an Admin.`,
                                                            confirmText: 'Transfer Ownership',
                                                            cancelText: 'Cancel',
                                                            type: 'danger',
                                                            onConfirm: () => handleTransferOwnership(member.userId)
                                                        });
                                                    } else {
                                                        handleRoleChange(member.id, newRole);
                                                    }
                                                }}
                                                disabled={!canManageMembers || member.role === 'Owner' || member.userId === user?.id}
                                                className="bg-white border-2 border-black rounded-lg px-2 py-1 text-sm font-bold outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {member.role === 'Owner' ? (
                                                    <option value="Owner">Owner</option>
                                                ) : (
                                                    <>
                                                        <option value="Admin">Admin</option>
                                                        <option value="Member">Member</option>
                                                        {currentUserMember?.role === 'Owner' && (
                                                            <option value="TRANSFER_OWNERSHIP" className="text-red-600 font-bold">👑 Make Owner</option>
                                                        )}
                                                    </>
                                                )}
                                            </select>
                                            {canManageMembers && member.id !== currentUserMember?.id && member.role !== 'Owner' && (
                                                <button onClick={() => handleKick(member.id)} className="p-2 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Remove member">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'requests' && (
                        <div className="space-y-4">
                            {loadingRequests ? (
                                <div className="flex justify-center py-8"><Loader className="animate-spin text-gray-400" /></div>
                            ) : requests.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <p className="font-bold">No pending join requests</p>
                                </div>
                            ) : (
                                requests.map(req => (
                                    <div key={req.id} className="flex items-center justify-between bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-100 flex items-center justify-center font-bold">
                                                {req.avatarImage ? (
                                                    <img src={req.avatarImage} alt={req.name} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    req.name?.[0]?.toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold">{req.name}</p>
                                                <p className="text-xs text-gray-500 font-bold">@{req.username}</p>
                                                <p className="text-xs text-gray-400">Requested {new Date(req.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(req.id)}
                                                className="p-2 bg-green-100 text-green-700 border-2 border-green-200 rounded-lg hover:bg-green-200 transition-colors"
                                                title="Approve"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleReject(req.id)}
                                                className="p-2 bg-red-100 text-red-700 border-2 border-red-200 rounded-lg hover:bg-red-200 transition-colors"
                                                title="Reject"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

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
