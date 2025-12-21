import React, { useState, useEffect } from 'react';
import { spacesApi } from '../../services/api';
import '../../styles/modals.css';

const GRADIENT_OPTIONS = [
    { id: 'g1', gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
    { id: 'g2', gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)' },
    { id: 'g3', gradient: 'linear-gradient(135deg, #e6b980 0%, #eacda3 100%)' },
    { id: 'g4', gradient: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)' },
    { id: 'g5', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'g6', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 'g7', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 'g8', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
];

const CATEGORY_OPTIONS = [
    { value: 'TECH', label: 'Tech' },
    { value: 'CREATIVE', label: 'Creative' },
    { value: 'MEETING', label: 'Meeting' },
    { value: 'EDUCATION', label: 'Education' },
];

const SpaceSettingsModal = ({
    isOpen,
    onClose,
    space,
    onSpaceUpdate,
    onSpaceDelete,
    isOwner
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('TECH');
    const [thumbnail, setThumbnail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (space) {
            setName(space.name || '');
            setDescription(space.description || '');
            setCategory(space.category || 'TECH');
            setThumbnail(space.thumbnail || GRADIENT_OPTIONS[0].gradient);
        }
    }, [space]);

    const handleSave = async () => {
        if (!name.trim()) {
            alert('Space name is required');
            return;
        }

        setIsSaving(true);
        try {
            const updatedSpace = await spacesApi.update(space.id, {
                name: name.trim(),
                description: description.trim(),
                category,
                thumbnail
            });
            onSpaceUpdate(updatedSpace);
            onClose();
        } catch (err) {
            console.error('Failed to update space:', err);
            alert('Failed to update space settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await spacesApi.delete(space.id);
            onSpaceDelete(space.id);
            onClose();
        } catch (err) {
            console.error('Failed to delete space:', err);
            alert('Failed to delete space');
        }
    };

    if (!isOpen || !space) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-settings" onClick={e => e.stopPropagation()}>
                <div className="modal-header header-bordered">
                    <h2 className="modal-title-sm">Space Settings</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body settings-body">
                    {/* Name */}
                    <div className="form-group">
                        <label className="form-label">Space Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter space name"
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input form-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this space for?"
                            rows={3}
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            className="form-input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {CATEGORY_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Thumbnail */}
                    <div className="form-group">
                        <label className="form-label">Thumbnail</label>
                        <div className="gradient-picker">
                            {GRADIENT_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    className={`gradient-option ${thumbnail === opt.gradient ? 'selected' : ''}`}
                                    style={{ background: opt.gradient }}
                                    onClick={() => setThumbnail(opt.gradient)}
                                    type="button"
                                />
                            ))}
                        </div>
                        <div className="thumbnail-preview" style={{ background: thumbnail }}>
                            <span>{name || 'Preview'}</span>
                        </div>
                    </div>

                    {/* Danger Zone - Owner Only */}
                    {isOwner && (
                        <div className="danger-zone">
                            <h3 className="danger-zone-title">Danger Zone</h3>
                            {!showDeleteConfirm ? (
                                <button
                                    className="btn-danger-outline"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    Delete Space
                                </button>
                            ) : (
                                <div className="delete-confirm">
                                    <p>Are you sure? This action cannot be undone.</p>
                                    <div className="delete-confirm-actions">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setShowDeleteConfirm(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={handleDelete}
                                        >
                                            Yes, Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving || !name.trim()}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpaceSettingsModal;
