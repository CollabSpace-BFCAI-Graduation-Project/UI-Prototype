import React, { useState } from 'react';
import '../../styles/modals.css';

const ProfileModal = ({ isOpen, onClose, currentUser, setCurrentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser.name,
        bio: currentUser.bio || '',
        email: currentUser.email || 'john@example.com',
    });
    const [saving, setSaving] = useState(false);

    const avatarColors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ec4899',
        '#8b5cf6', '#06b6d4', '#ef4444', '#6366f1'
    ];

    if (!isOpen) return null;

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentUser(prev => ({
            ...prev,
            name: formData.name,
            bio: formData.bio,
            initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        }));
        setSaving(false);
        setIsEditing(false);
    };

    const handleColorChange = (color) => {
        setCurrentUser(prev => ({ ...prev, avatarColor: color }));
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
                    {/* Avatar Section */}
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large" style={{ background: currentUser.avatarColor }}>
                            {currentUser.initials}
                        </div>
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
                    </div>

                    {/* Profile Info */}
                    <div className="profile-info-section">
                        {isEditing ? (
                            <div className="profile-form">
                                <div className="form-group">
                                    <label>Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                        placeholder="Tell us about yourself"
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="disabled"
                                    />
                                    <span className="form-hint">Email cannot be changed</span>
                                </div>
                                <div className="form-actions">
                                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="profile-display">
                                <div className="profile-name">{currentUser.name}</div>
                                <div className="profile-role">{currentUser.role}</div>
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

                    {/* Account Actions */}
                    <div className="profile-actions">
                        <div className="action-row">
                            <div className="action-info">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Account Settings</span>
                            </div>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div className="action-row danger">
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
