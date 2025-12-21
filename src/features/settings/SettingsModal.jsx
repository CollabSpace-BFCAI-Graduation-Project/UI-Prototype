import React, { useState, useEffect, useRef } from 'react';
import { X, Settings, Bell, LogOut, User, Shield, Trash2, Save, Camera } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../shared/utils/helpers';

export default function SettingsModal({
    isOpen,
    onClose,
    settingsTab,
    setSettingsTab,
    user,
    onLogout,
    onUpdateProfile,
    onDeleteAccount
}) {
    const [profileData, setProfileData] = useState({
        name: '',
        username: '',
        bio: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    // Initialize form with user data when modal opens or user changes
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                username: user.username || '',
                bio: user.bio || ''
            });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    const handleSaveProfile = async () => {
        if (!onUpdateProfile) return;
        setIsSaving(true);
        setSaveMessage('');
        try {
            await onUpdateProfile(profileData);
            setSaveMessage('Profile updated successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (err) {
            setSaveMessage('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE' || !onDeleteAccount) return;
        await onDeleteAccount();
        setShowDeleteConfirm(false);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File too large. Max 5MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setIsUploadingAvatar(true);
        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onload = async () => {
                const imageData = reader.result;
                const updated = await api.users.uploadAvatar(user.id, imageData);
                // Update localStorage and reload
                const stored = JSON.parse(localStorage.getItem('collabspace_user') || '{}');
                stored.avatarImage = updated.avatarImage;
                localStorage.setItem('collabspace_user', JSON.stringify(stored));
                window.location.reload();
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('Failed to upload avatar:', err);
            alert('Failed to upload avatar');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!user?.id) return;
        setIsUploadingAvatar(true);
        try {
            await api.users.deleteAvatar(user.id);
            const stored = JSON.parse(localStorage.getItem('collabspace_user') || '{}');
            stored.avatarImage = null;
            localStorage.setItem('collabspace_user', JSON.stringify(stored));
            window.location.reload();
        } catch (err) {
            console.error('Failed to remove avatar:', err);
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'account', label: 'Account', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'general', label: 'General', icon: Settings }
    ];

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl bg-[#FFFDF5] border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row h-[600px] overflow-hidden animate-in zoom-in-95">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>

                {/* Hidden file input for avatar */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                />

                {/* Sidebar */}
                <div className="w-full md:w-64 bg-white border-b-2 md:border-b-0 md:border-r-2 border-black p-6 flex flex-col">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Settings size={24} /> Settings</h2>
                    <div className="space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setSettingsTab(tab.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl font-bold border-2 transition-all flex items-center gap-3 ${settingsTab === tab.id ? 'bg-yellow-300 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent border-transparent hover:bg-gray-100'}`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="mt-auto pt-6 border-t-2 border-gray-100">
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 text-red-500 font-bold hover:underline w-full px-4 py-2 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut size={18} /> Log Out
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {/* Profile Tab */}
                    {settingsTab === 'profile' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-black">Profile Settings</h3>

                            {/* Avatar Section */}
                            <div className="flex items-center gap-6">
                                <div
                                    onClick={handleAvatarClick}
                                    className="w-24 h-24 rounded-full border-4 border-black flex items-center justify-center text-4xl font-black text-white relative group cursor-pointer overflow-hidden"
                                    style={{ backgroundColor: user?.avatarColor || '#ec4899' }}
                                >
                                    {user?.avatarImage ? (
                                        <img src={`http://localhost:5000${user.avatarImage}`} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        initials
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        {isUploadingAvatar ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Camera size={24} className="text-white" />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={handleAvatarClick}
                                        disabled={isUploadingAvatar}
                                        className="bg-black text-white px-4 py-2 rounded-xl font-bold border-2 border-black hover:bg-gray-800 mb-2 block shadow-[2px_2px_0px_0px_rgba(236,72,153,1)] hover:shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] transition-all disabled:opacity-50"
                                    >
                                        {isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                                    </button>
                                    {user?.avatarImage && (
                                        <button
                                            onClick={handleRemoveAvatar}
                                            disabled={isUploadingAvatar}
                                            className="text-red-500 text-sm font-bold hover:underline"
                                        >
                                            Remove avatar
                                        </button>
                                    )}
                                    <p className="text-sm text-gray-500 mt-1">JPG, PNG. Max 5MB</p>
                                </div>
                            </div>

                            {/* Profile Form */}
                            <div className="bg-white border-2 border-black rounded-2xl p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-bold mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full border-2 border-black rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-pink-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold mb-2">Username</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                                            <input
                                                type="text"
                                                value={profileData.username}
                                                onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                                                className="w-full border-2 border-black rounded-xl p-3 pl-8 font-medium outline-none focus:ring-2 focus:ring-pink-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-bold mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full border-2 border-gray-300 bg-gray-100 rounded-xl p-3 font-medium text-gray-500"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                </div>
                                <div>
                                    <label className="block font-bold mb-2">Bio</label>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                        rows={3}
                                        placeholder="Tell us about yourself..."
                                        className="w-full border-2 border-black rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                                    />
                                </div>

                                {saveMessage && (
                                    <div className={`text-sm font-bold ${saveMessage.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                                        {saveMessage}
                                    </div>
                                )}

                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="bg-black text-white px-6 py-3 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <><Save size={18} /> Save Changes</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Account Tab */}
                    {settingsTab === 'account' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-black">Account Settings</h3>

                            {/* Account Info */}
                            <div className="bg-white border-2 border-black rounded-2xl p-6">
                                <h4 className="font-bold mb-4">Account Information</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-500">User ID</span>
                                        <span className="font-mono font-bold">{user?.id?.slice(0, 8)}...</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-500">Email</span>
                                        <span className="font-bold">{user?.email}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-500">Username</span>
                                        <span className="font-bold">@{user?.username}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-500">Member since</span>
                                        <span className="font-bold">{formatDate(user?.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-6">
                                <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                                    <Trash2 size={18} /> Danger Zone
                                </h4>
                                <p className="text-sm text-red-600 mb-4">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>

                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold border-2 border-red-600 hover:bg-red-600 transition-colors"
                                    >
                                        Delete Account
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm font-bold text-red-700">Type DELETE to confirm:</p>
                                        <input
                                            type="text"
                                            value={deleteConfirmText}
                                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                                            placeholder="Type DELETE"
                                            className="w-full border-2 border-red-400 rounded-xl p-3 font-mono font-bold outline-none focus:ring-2 focus:ring-red-300"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleDeleteAccount}
                                                disabled={deleteConfirmText !== 'DELETE'}
                                                className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold border-2 border-red-600 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Confirm Delete
                                            </button>
                                            <button
                                                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                                                className="px-4 py-2 rounded-xl font-bold border-2 border-gray-300 hover:bg-gray-100 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {settingsTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-black">Notification Settings</h3>
                            <div className="bg-white border-2 border-black rounded-2xl p-6 space-y-4">
                                {[
                                    { label: 'Email notifications', desc: 'Receive updates via email' },
                                    { label: 'Push notifications', desc: 'Browser push notifications' },
                                    { label: 'Space invites', desc: 'When someone invites you to a space' },
                                    { label: 'Chat mentions', desc: 'When someone mentions you in chat' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="font-bold">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 border-2 border-black"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* General Tab */}
                    {settingsTab === 'general' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-black">General Settings</h3>
                            <div className="bg-white border-2 border-black rounded-2xl p-6">
                                <div className="mb-4">
                                    <label className="block font-bold mb-2">Workspace Name</label>
                                    <input type="text" defaultValue={`${user?.name || 'My'}'s Workspace`} className="w-full border-2 border-black rounded-xl p-3 font-medium focus:ring-2 focus:ring-yellow-300 outline-none" />
                                </div>
                                <div>
                                    <label className="block font-bold mb-2">Theme Color</label>
                                    <div className="flex gap-2">
                                        {['#fde047', '#f9a8d4', '#93c5fd', '#86efac', '#c4b5fd'].map(color => (
                                            <div
                                                key={color}
                                                className="w-8 h-8 rounded-full border-2 border-black cursor-pointer hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
