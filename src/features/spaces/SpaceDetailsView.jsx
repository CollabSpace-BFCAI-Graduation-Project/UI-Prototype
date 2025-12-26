import React from 'react';
import { ArrowLeft, Gamepad2, MessageSquare, Link, FileText, Users, Eye, Settings, LogOut } from 'lucide-react';
import SpaceStats from './components/SpaceStats';
import { getFileIcon, isImageThumbnail, getSpaceThumbnailStyle, getSpaceThumbnailUrl } from '../../shared/utils/helpers';
import { useSpacesStore, useUIStore, useChatStore, useAuthStore } from '../../store';
import api from '../../services/api';

export default function SpaceDetailsView() {
    // Get state directly from stores
    const { activeSpace, setActiveSpace } = useSpacesStore();
    const {
        setCurrentView,
        openInviteModal,
        openFilesModal,
        openMembersModal,
        setViewingFile,
        setUnityLoadingProgress,
        openSpaceSettingsModal,
        openConfirmation,
        openJoinSessionModal // Add join session modal
    } = useUIStore();
    const { setActiveChatSpace } = useChatStore();
    const { user } = useAuthStore();

    if (!activeSpace) return null;

    const onBack = () => {
        setActiveSpace(null);
        setCurrentView('dashboard');
    };

    const onLaunchUnity = () => {
        // Open the pre-join modal first
        openJoinSessionModal();
    };

    const onStartUnitySession = () => {
        setUnityLoadingProgress(0);
        setCurrentView('unity-view');
        const interval = setInterval(() => {
            const current = useUIStore.getState().unityLoadingProgress;
            if (current >= 100) {
                clearInterval(interval);
                return;
            }
            useUIStore.setState({ unityLoadingProgress: current + 5 });
        }, 100);
    };

    const onTextChat = () => {
        setActiveChatSpace(activeSpace);
        setCurrentView('chat');
    };

    const handleLeaveSpace = () => {
        openConfirmation({
            title: 'Leave Space?',
            message: `Are you sure you want to leave ${activeSpace.name}? You will need to be re-invited to join again.`,
            confirmText: 'Leave Space',
            cancelText: 'Cancel',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await api.members.leave(activeSpace.id, user.id);
                    // Refresh spaces list to reflect removal
                    await useSpacesStore.getState().fetchSpaces();
                    setActiveSpace(null);
                    setCurrentView('dashboard');
                } catch (err) {
                    console.error('Failed to leave space:', err);
                }
            }
        });
    };

    // Check if user can access settings (Admin or Owner)
    const userMember = activeSpace.members?.find(m => m.userId === user?.id);
    const userRole = userMember?.role || null;
    const isOwner = userRole === 'Owner' || activeSpace.ownerId === user?.id;
    const isAdmin = userRole === 'Admin';
    const canAccessSettings = isOwner || isAdmin;
    const isPrivate = activeSpace.visibility === 'private';
    const canInvite = !isPrivate || canAccessSettings;

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-500 font-bold hover:text-black hover:-translate-x-1 transition-all"><ArrowLeft size={20} /> Back to Dashboard</button>

            {/* Hero */}
            <div
                className="w-full h-64 rounded-3xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-8"
                style={getSpaceThumbnailStyle(activeSpace.thumbnail)}
            >
                {/* Show image if thumbnail is a URL */}
                {isImageThumbnail(activeSpace.thumbnail) && (
                    <img
                        src={getSpaceThumbnailUrl(activeSpace.thumbnail)}
                        alt={activeSpace.name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Settings Button - Only for Admin/Owner */}
                {canAccessSettings && (
                    <button
                        onClick={openSpaceSettingsModal}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none group"
                        title="Space Settings"
                    >
                        <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                )}

                <div className="absolute bottom-6 left-6 md:left-10 text-white drop-shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-white/90 text-black border-2 border-black px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">{activeSpace.category}</span>
                        {activeSpace.isOnline && <span className="bg-green-400 text-black border-2 border-black px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider animate-pulse">LIVE NOW</span>}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 text-shadow-lg">{activeSpace.name}</h1>
                    <p className="text-white/90 font-bold text-lg max-w-2xl">{activeSpace.description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">


                    {/* Quick Actions */}
                    <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-wrap gap-4">
                        <button onClick={onLaunchUnity} className="flex-1 min-w-[200px] bg-green-400 text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-green-300 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 group">
                            <Gamepad2 size={24} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-lg">Join Space (3D)</span>
                        </button>
                        <button onClick={onTextChat} className="flex-1 min-w-[140px] bg-yellow-300 text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-yellow-200 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2">
                            <MessageSquare size={20} /> Text Chat
                        </button>
                        {canInvite && (
                            <button onClick={openInviteModal} className="flex-1 min-w-[140px] bg-white text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-gray-50 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2">
                                <Link size={20} /> Invite
                            </button>
                        )}
                        {!isOwner && userMember && (
                            <button onClick={handleLeaveSpace} className="flex-1 min-w-[140px] bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl border-2 border-red-500 hover:bg-red-200 shadow-[1px_1px_0px_0px_rgba(239,68,68,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2">
                                <LogOut size={20} /> Leave
                            </button>
                        )}
                    </div>
                    {/* RECENT FILES */}
                    <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black flex items-center gap-2"><FileText size={20} /> Shared Files</h3>
                            <button onClick={openFilesModal} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">View All <ArrowLeft size={16} className="rotate-180" /></button>
                        </div>
                        <div className="space-y-3">
                            {activeSpace.files && activeSpace.files.length > 0 ? (
                                activeSpace.files.slice(0, 3).map((file, i) => (
                                    <div key={i} onClick={() => setViewingFile(file)} className="flex items-center gap-4 p-3 rounded-xl border-2 border-transparent hover:border-black hover:bg-gray-50 transition-all cursor-pointer group">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            {getFileIcon(file.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate" title={file.name}>{file.name}</p>
                                            <p className="text-xs text-gray-500 font-medium">Shared by {file.uploaderName} • {file.time}</p>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-200 rounded-lg transition-colors"><Eye size={18} /></button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400 font-medium italic">No files shared yet. Be the first! 📂</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Info */}
                <div className="space-y-6">
                    {/* Stats */}
                    <SpaceStats
                        memberCount={activeSpace.memberCount || 0}
                        fileCount={activeSpace.fileCount || 0}
                        ownerName={activeSpace.members?.find(m => m.userId === activeSpace.ownerId)?.name}
                        createdAt={activeSpace.createdAt}
                    />

                    <div onClick={openMembersModal} className="bg-white border-2 border-black rounded-2xl p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-gray-50 transition-colors group">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-black flex items-center gap-2"><Users size={20} /> Members</h3>
                            <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(activeSpace.members || []).slice(0, 6).map((m, i) => (
                                <div key={i} className={`w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-bold text-xs ${m.avatar}`}>{m.name?.[0] || '?'}</div>
                            ))}
                            <div className="w-10 h-10 rounded-xl bg-black text-white border-2 border-black flex items-center justify-center font-bold text-xs">+{(activeSpace.memberCount || 0) - (activeSpace.members?.length || 0)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
