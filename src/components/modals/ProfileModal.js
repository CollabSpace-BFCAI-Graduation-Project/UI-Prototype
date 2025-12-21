import React, { useState, useEffect, useRef } from 'react';
import '../../styles/modals.css';
import { usersApi, getImageUrl } from '../../services/api';

const ProfileModal = ({ isOpen, onClose, currentUser, setCurrentUser, onLogout }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser.name,
        bio: currentUser.bio || '',
        email: currentUser.email || 'john@example.com',
    });
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        setFormData({
            name: currentUser.name,
            bio: currentUser.bio || '',
            email: currentUser.email || 'john@example.com',
        });
    }, [currentUser]);

    const avatarColors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ec4899',
        '#8b5cf6', '#06b6d4', '#ef4444', '#6366f1'
    ];

    if (!isOpen) return null;

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = {
                name: formData.name,
                bio: formData.bio,
                initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            };
            const updatedUser = await usersApi.update(currentUser.id, updates);
            setCurrentUser(updatedUser);
            localStorage.setItem('collabspace_user', JSON.stringify(updatedUser));
        } catch (err) {
            console.error('Failed to update profile:', err);
            const updatedUser = { ...currentUser, ...formData, initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) };
            setCurrentUser(updatedUser);
            localStorage.setItem('collabspace_user', JSON.stringify(updatedUser));
        }
        setSaving(false);
        setIsEditing(false);
    };

    const handleColorChange = async (color) => {
        const updatedUser = { ...currentUser, avatarColor: color, avatarImage: null };
        setCurrentUser(updatedUser);
        localStorage.setItem('collabspace_user', JSON.stringify(updatedUser));
        try {
            await usersApi.update(currentUser.id, { avatarColor: color, avatarImage: null });
        } catch (err) {
            console.error('Failed to update avatar color:', err);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Max 2MB
        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be less than 2MB');
            return;
        }

        // Convert to base64 and upload
        const reader = new FileReader();
        reader.onload = async (event) => {
            const imageData = event.target?.result;

            try {
                const updatedUser = await usersApi.uploadAvatar(currentUser.id, imageData);
                setCurrentUser(updatedUser);
                localStorage.setItem('collabspace_user', JSON.stringify(updatedUser));
            } catch (err) {
                console.error('Failed to upload avatar:', err);
                alert('Failed to upload image. Please try again.');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = async () => {
        try {
            const updatedUser = await usersApi.deleteAvatar(currentUser.id);
            setCurrentUser(updatedUser);
            localStorage.setItem('collabspace_user', JSON.stringify(updatedUser));
        } catch (err) {
            console.error('Failed to remove avatar:', err);
            alert('Failed to remove image. Please try again.');
        }
    };

    const handleSignOut = () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            onClose();
            if (onLogout) onLogout();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal profile-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Profile</h2>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="profile-content">
                    <div className="profile-avatar-section">
                        {/* Avatar with image or initials */}
                        <div className="avatar-wrapper">
                            {currentUser.avatarImage ? (
                                <img
                                    src={getImageUrl(currentUser.avatarImage)}
                                    alt="Profile"
                                    className="profile-avatar-large profile-image"
                                />
                            ) : (
                                <div className="profile-avatar-large" style={{ background: currentUser.avatarColor }}>
                                    {currentUser.initials}
                                </div>
                            )}
                            <button
                                className="avatar-upload-btn"
                                onClick={() => fileInputRef.current?.click()}
                                title="Upload photo"
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </div>

                        {/* Show remove button if image exists */}
                        {currentUser.avatarImage && (
                            <button className="btn btn-secondary btn-sm remove-image-btn" onClick={handleRemoveImage}>
                                Remove Photo
                            </button>
                        )}

                        {/* Color picker - only show if no image */}
                        {!currentUser.avatarImage && (
                            <div className="avatar-color-picker">
                                <span className="picker-label">Avatar Color</span>
                                <div className="color-options">
                                    {avatarColors.map(color => (
                                        <button
                                            key={color}
                                            className={`color-option ${currentUser.avatarColor === color ? 'active' : ''}`}
                                            style={{ background: color }}
                                            onClick={() => handleColorChange(color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="profile-info-section">
                        {isEditing ? (
                            <div className="profile-form">
                                <div className="form-group">
                                    <label>Display Name</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Your name" />
                                </div>
                                <div className="form-group">
                                    <label>Bio</label>
                                    <textarea value={formData.bio} onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))} placeholder="Tell us about yourself" rows={3} />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={formData.email} disabled className="disabled" />
                                    <span className="form-hint">Email cannot be changed</span>
                                </div>
                                <div className="form-actions">
                                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                                </div>
                            </div>
                        ) : (
                            <div className="profile-display">
                                <div className="profile-name">{currentUser.name}</div>
                                {currentUser.email && <div className="profile-email">{currentUser.email}</div>}
                                {currentUser.bio && <div className="profile-bio">{currentUser.bio}</div>}
                                <button className="btn btn-secondary edit-btn" onClick={() => setIsEditing(true)}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="profile-actions">
                        <div className="action-row danger" onClick={handleSignOut}>
                            <div className="action-info">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Sign Out</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
