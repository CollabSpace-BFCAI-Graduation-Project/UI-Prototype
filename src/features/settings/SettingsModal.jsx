import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Settings, Bell, LogOut, User, Shield, Trash2, Save, Camera, ZoomIn, ZoomOut, Check } from 'lucide-react';
import api from '../../services/api';
import { formatDate, getImageUrl } from '../../shared/utils/helpers';
import { useUIStore, useAuthStore } from '../../store';

// Allowed file types and max size
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Simple Image Cropper Component
function ImageCropper({ imageUrl, onCrop, onCancel }) {
    const canvasRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imgRef = useRef(new Image());

    useEffect(() => {
        imgRef.current.src = imageUrl;
        imgRef.current.onload = () => drawImage();
    }, [imageUrl]);

    useEffect(() => {
        drawImage();
    }, [zoom, offset]);

    const drawImage = () => {
        const canvas = canvasRef.current;
        if (!canvas || !imgRef.current.complete) return;

        const ctx = canvas.getContext('2d');
        // Use higher resolution for output (512x512) but display at 200x200
        const outputSize = 512;
        const displaySize = 200;
        const scale_factor = outputSize / displaySize;

        canvas.width = outputSize;
        canvas.height = outputSize;

        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, outputSize, outputSize);

        const img = imgRef.current;
        const scale = Math.max(outputSize / img.width, outputSize / img.height) * zoom;
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (outputSize - w) / 2 + (offset.x * scale_factor);
        const y = (outputSize - h) / 2 + (offset.y * scale_factor);

        ctx.drawImage(img, x, y, w, h);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        const rect = e.target.getBoundingClientRect();
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleCrop = () => {
        const canvas = canvasRef.current;
        // Use PNG for better quality (lossless)
        const croppedData = canvas.toDataURL('image/png');
        onCrop(croppedData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Crop Avatar</h3>

                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <canvas
                            ref={canvasRef}
                            className="rounded-full border-4 border-black cursor-move"
                            style={{ width: 200, height: 200 }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        />
                        <div className="absolute inset-0 rounded-full border-4 border-dashed border-pink-400 pointer-events-none" />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 mb-4">
                    <button
                        onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <span className="text-sm font-medium w-16 text-center">{Math.round(zoom * 100)}%</span>
                    <button
                        onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <ZoomIn size={20} />
                    </button>
                </div>

                <p className="text-xs text-gray-500 text-center mb-4">Drag to reposition • Zoom to resize</p>

                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl border-2 border-black hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCrop}
                        className="flex-1 py-2 px-4 bg-green-500 text-white font-bold rounded-xl border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        <Check size={18} /> Apply
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SettingsModal() {
    // Get state directly from stores
    const {
        isSettingsModalOpen,
        closeSettingsModal,
        settingsTab,
        setSettingsTab
    } = useUIStore();

    const {
        user,
        logout,
        updateProfile
    } = useAuthStore();

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
    const [uploadError, setUploadError] = useState('');
    const [cropperImage, setCropperImage] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
    const [privacySettings, setPrivacySettings] = useState({
        showEmail: false,
        profileVisibility: 'public'
    });
    const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
    const [privacyMessage, setPrivacyMessage] = useState('');
    const fileInputRef = useRef(null);

    // Fetch privacy settings when modal opens
    useEffect(() => {
        if (user?.id && isSettingsModalOpen) {
            api.users.getProfile(user.id, user.id).then(profile => {
                if (profile) {
                    setPrivacySettings({
                        showEmail: profile.showEmail === 1 || profile.showEmail === true,
                        profileVisibility: profile.profileVisibility || 'public'
                    });
                }
            }).catch(console.error);
        }
    }, [user?.id, isSettingsModalOpen]);

    const handleSavePrivacy = async () => {
        setIsSavingPrivacy(true);
        setPrivacyMessage('');
        try {
            await api.users.updatePrivacy(user.id, privacySettings);
            setPrivacyMessage('Privacy settings saved!');
            setTimeout(() => setPrivacyMessage(''), 3000);
        } catch (err) {
            console.error('Failed to save privacy:', err);
            setPrivacyMessage('Failed to save settings');
        } finally {
            setIsSavingPrivacy(false);
        }
    };

    // Validation functions
    const validateName = (name) => {
        if (!name || name.trim().length < 2) return 'Name must be at least 2 characters';
        if (name.trim().length > 30) return 'Name must be less than 30 characters';
        return null;
    };

    const validateUsername = (username) => {
        if (!username || username.length < 3) return 'Username must be at least 3 characters';
        if (username.length > 20) return 'Username must be less than 20 characters';
        if (!/^[a-z0-9_]+$/.test(username)) return 'Username can only contain lowercase letters, numbers, and underscores';
        return null;
    };

    const validateBio = (bio) => {
        if (bio && bio.length > 160) return 'Bio must be less than 160 characters';
        return null;
    };

    // Real-time validation on field change
    const handleFieldChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));

        let error = null;
        if (field === 'name') error = validateName(value);
        else if (field === 'username') error = validateUsername(value);
        else if (field === 'bio') error = validateBio(value);

        setValidationErrors(prev => ({
            ...prev,
            [field]: error
        }));
    };

    const hasValidationErrors = () => {
        return Object.values(validationErrors).some(err => err !== null);
    };

    // Initialize form with user data when modal opens or user changes
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                username: user.username || '',
                bio: user.bio || ''
            });
        }
    }, [user, isSettingsModalOpen]);

    if (!isSettingsModalOpen) return null;

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    const handleSaveProfile = async () => {
        // Validate all fields before saving
        const nameError = validateName(profileData.name);
        const usernameError = validateUsername(profileData.username);
        const bioError = validateBio(profileData.bio);

        const errors = {
            name: nameError,
            username: usernameError,
            bio: bioError
        };
        setValidationErrors(errors);

        // Check if any errors exist
        if (Object.values(errors).some(err => err !== null)) {
            setSaveMessage('');
            return;
        }

        setIsSaving(true);
        setSaveMessage('');
        try {
            await updateProfile({
                ...profileData,
                name: profileData.name.trim()
            });
            setSaveMessage('Profile updated successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (err) {
            setSaveMessage('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        try {
            await api.users.delete(user.id);
            logout();
        } catch (err) {
            console.error('Failed to delete account:', err);
        }
        setShowDeleteConfirm(false);
    };

    const handleAvatarClick = () => {
        setUploadError('');
        fileInputRef.current?.click();
    };

    // Shared file processing logic
    const processAvatarFile = (file) => {
        if (!file || !user?.id) return;

        setUploadError('');

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setUploadError('Invalid file type. Please use JPG, PNG, WebP, or GIF.');
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            setUploadError('File too large. Maximum size is 2MB.');
            return;
        }

        // Read and show cropper
        const reader = new FileReader();
        reader.onload = () => {
            setCropperImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        processAvatarFile(file);
        e.target.value = '';
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingAvatar(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingAvatar(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingAvatar(false);

        const file = e.dataTransfer.files?.[0];
        processAvatarFile(file);
    };

    const handleCropComplete = async (croppedImageData) => {
        setCropperImage(null);
        setIsUploadingAvatar(true);
        setUploadError('');
        try {
            const updated = await api.users.uploadAvatar(user.id, croppedImageData);
            const stored = JSON.parse(localStorage.getItem('collabspace_user') || '{}');
            stored.avatarImage = updated.avatarImage;
            localStorage.setItem('collabspace_user', JSON.stringify(stored));
            setSaveMessage('Avatar updated successfully!');
            setTimeout(() => window.location.reload(), 500);
        } catch (err) {
            console.error('Failed to upload avatar:', err);
            setUploadError('Failed to upload avatar. Please try again.');
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
        { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'general', label: 'General', icon: Settings }
    ];

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSettingsModal}></div>
            <div className="relative w-full max-w-4xl bg-[#FFFDF5] border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row h-[600px] overflow-hidden animate-in zoom-in-95">
                <button onClick={closeSettingsModal} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>

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
                            onClick={logout}
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

                            {/* Avatar Section with Drag & Drop */}
                            <div
                                className={`flex items-center gap-6 p-4 rounded-2xl border-2 border-dashed transition-all ${isDraggingAvatar
                                    ? 'border-pink-500 bg-pink-50 scale-[1.02]'
                                    : 'border-transparent'
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div
                                    onClick={handleAvatarClick}
                                    className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-4xl font-black text-white relative group cursor-pointer overflow-hidden transition-all ${isDraggingAvatar ? 'border-pink-500 scale-110' : 'border-black'
                                        }`}
                                    style={{ backgroundColor: user?.avatarColor || '#ec4899' }}
                                >
                                    {user?.avatarImage ? (
                                        <img src={getImageUrl(user.avatarImage)} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        initials
                                    )}
                                    <div className={`absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center ${isDraggingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                        }`}>
                                        {isUploadingAvatar ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : isDraggingAvatar ? (
                                            <div className="text-white text-center">
                                                <Camera size={24} className="mx-auto mb-1" />
                                                <span className="text-xs font-bold">Drop here</span>
                                            </div>
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
                                    <p className="text-sm text-gray-500 mt-1">
                                        JPG, PNG, WebP, GIF. Max 2MB
                                        <span className="block text-xs text-gray-400">or drag & drop an image</span>
                                    </p>
                                    {uploadError && (
                                        <p className="text-sm text-red-500 font-medium mt-1">{uploadError}</p>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarUpload}
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="hidden"
                                />
                            </div>

                            {/* Image Cropper Modal */}
                            {cropperImage && (
                                <ImageCropper
                                    imageUrl={cropperImage}
                                    onCrop={handleCropComplete}
                                    onCancel={() => setCropperImage(null)}
                                />
                            )}

                            {/* Profile Form */}
                            <div className="bg-white border-2 border-black rounded-2xl p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-bold mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => handleFieldChange('name', e.target.value)}
                                            maxLength={30}
                                            className={`w-full border-2 rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-pink-300 ${validationErrors.name ? 'border-red-500 bg-red-50' : 'border-black'
                                                }`}
                                        />
                                        {validationErrors.name && (
                                            <p className="text-xs text-red-500 mt-1">{validationErrors.name}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">{profileData.name.length}/30 characters</p>
                                    </div>
                                    <div>
                                        <label className="block font-bold mb-2">Username</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                                            <input
                                                type="text"
                                                value={profileData.username}
                                                onChange={(e) => handleFieldChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                                maxLength={20}
                                                className={`w-full border-2 rounded-xl p-3 pl-8 font-medium outline-none focus:ring-2 focus:ring-pink-300 ${validationErrors.username ? 'border-red-500 bg-red-50' : 'border-black'
                                                    }`}
                                            />
                                        </div>
                                        {validationErrors.username && (
                                            <p className="text-xs text-red-500 mt-1">{validationErrors.username}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">{profileData.username.length}/20 characters</p>
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
                                        onChange={(e) => handleFieldChange('bio', e.target.value)}
                                        rows={3}
                                        maxLength={160}
                                        placeholder="Tell us about yourself..."
                                        className={`w-full border-2 rounded-xl p-3 font-medium outline-none focus:ring-2 focus:ring-pink-300 resize-none ${validationErrors.bio ? 'border-red-500 bg-red-50' : 'border-black'
                                            }`}
                                    />
                                    {validationErrors.bio && (
                                        <p className="text-xs text-red-500 mt-1">{validationErrors.bio}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">{profileData.bio?.length || 0}/160 characters</p>
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

                    {/* Privacy Tab */}
                    {settingsTab === 'privacy' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-black">Privacy Settings</h3>

                            {/* Profile Visibility */}
                            <div className="bg-white border-2 border-black rounded-2xl p-6">
                                <h4 className="font-bold mb-4">Profile Visibility</h4>
                                <p className="text-sm text-gray-500 mb-4">Control who can see your full profile information.</p>

                                <div className="space-y-3">
                                    {[
                                        { value: 'public', label: 'Public', desc: 'Anyone can view your profile' },
                                        { value: 'members', label: 'Members Only', desc: 'Only people in your shared spaces' },
                                        { value: 'private', label: 'Private', desc: 'Only you can see your profile' }
                                    ].map(option => (
                                        <label
                                            key={option.value}
                                            className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${privacySettings.profileVisibility === option.value
                                                    ? 'border-pink-500 bg-pink-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="profileVisibility"
                                                value={option.value}
                                                checked={privacySettings.profileVisibility === option.value}
                                                onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                                                className="mt-1"
                                            />
                                            <div>
                                                <div className="font-bold">{option.label}</div>
                                                <div className="text-sm text-gray-500">{option.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Data Sharing */}
                            <div className="bg-white border-2 border-black rounded-2xl p-6">
                                <h4 className="font-bold mb-4">Data Sharing</h4>
                                <p className="text-sm text-gray-500 mb-4">Choose what information others can see on your profile.</p>

                                <label className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer">
                                    <div>
                                        <div className="font-bold">Show Email</div>
                                        <div className="text-sm text-gray-500">Display your email address on your profile</div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={privacySettings.showEmail}
                                            onChange={(e) => setPrivacySettings(prev => ({ ...prev, showEmail: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                                    </div>
                                </label>
                            </div>

                            {/* Account Info */}
                            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                                <h4 className="font-bold mb-4 text-gray-600">Account Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-500">User ID</span>
                                        <span className="font-mono font-bold">{user?.id?.slice(0, 8)}...</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-500">Member since</span>
                                        <span className="font-bold">{formatDate(user?.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {privacyMessage && (
                                <div className={`text-sm font-bold ${privacyMessage.includes('saved') ? 'text-green-600' : 'text-red-500'}`}>
                                    {privacyMessage}
                                </div>
                            )}

                            <button
                                onClick={handleSavePrivacy}
                                disabled={isSavingPrivacy}
                                className="bg-black text-white px-6 py-3 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] hover:shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSavingPrivacy ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <><Save size={18} /> Save Privacy Settings</>
                                )}
                            </button>

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
