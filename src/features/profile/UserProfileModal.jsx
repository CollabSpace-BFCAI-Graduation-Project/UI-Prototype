import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, Calendar, Users, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { formatDate, getImageUrl } from '../../shared/utils/helpers';

export default function UserProfileModal({ userId, viewerId, onClose }) {
    const [profile, setProfile] = useState(null);
    const [sharedSpaces, setSharedSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId || !viewerId) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const [profileData, spacesData] = await Promise.all([
                    api.users.getProfile(userId, viewerId),
                    api.users.getSharedSpaces(userId, viewerId)
                ]);
                setProfile(profileData);
                setSharedSpaces(spacesData);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, viewerId]);

    if (!userId) return null;

    const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] w-full max-w-md overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
                    >
                        <X size={20} className="text-white" />
                    </button>

                    {/* Avatar */}
                    <div className="flex justify-center">
                        <div
                            className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center text-3xl font-black text-white shadow-lg"
                            style={{ backgroundColor: profile?.avatarColor || '#9ca3af' }}
                        >
                            {profile?.avatarImage ? (
                                <img
                                    src={getImageUrl(profile.avatarImage)}
                                    alt={profile?.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                initials
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">{error}</div>
                    ) : profile?.isPrivate ? (
                        /* Private Profile View */
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-black mb-1">{profile.name}</h3>
                            <p className="text-gray-500">@{profile.username}</p>
                            <p className="text-sm text-gray-400 mt-4">
                                {profile.reason === 'members_only'
                                    ? 'This profile is only visible to members of shared spaces.'
                                    : 'This profile is private.'}
                            </p>
                        </div>
                    ) : (
                        /* Public Profile View */
                        <div>
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-black">{profile.name}</h3>
                                <p className="text-gray-500">@{profile.username}</p>
                            </div>

                            {profile.bio && (
                                <p className="text-gray-600 text-center mb-6 px-4">{profile.bio}</p>
                            )}

                            <div className="space-y-3 mb-6">
                                {profile.email && (
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Mail size={16} className="text-gray-400" />
                                        <span>{profile.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span>Joined {formatDate(profile.createdAt)}</span>
                                </div>
                            </div>

                            {/* Shared Spaces */}
                            {sharedSpaces.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <Users size={14} />
                                        Shared Spaces ({sharedSpaces.length})
                                    </h4>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {sharedSpaces.map(space => (
                                            <div
                                                key={space.id}
                                                className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-lg flex-shrink-0"
                                                    style={{ background: space.thumbnailGradient || '#e5e7eb' }}
                                                />
                                                <span className="font-medium text-sm truncate flex-1">{space.name}</span>
                                                {space.category && (
                                                    <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                                                        {space.category}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
