import React from 'react';
import { spaceMembersApi } from '../../../services/api';

const SpaceInfoSidebar = ({ activeSpaceMembers, currentUser, setIsMembersModalOpen, activeSpace, setActiveSpace }) => {
    // Find permission for current user in this space
    const currentMember = activeSpaceMembers.find(m => m.userId === currentUser.id);
    const userRole = currentMember ? currentMember.role : 'Member';
    const isOwnerOrAdmin = userRole === 'Owner' || userRole === 'Admin';
    const isOwner = userRole === 'Owner';

    // Find space owner
    const spaceOwner = activeSpaceMembers.find(m => m.role === 'Owner');

    const handleLeaveSpace = async () => {
        if (!activeSpace?.id) return;

        if (window.confirm(`Are you sure you want to leave "${activeSpace.name}"? You will need to be invited again to rejoin.`)) {
            try {
                await spaceMembersApi.leaveSpace(activeSpace.id, currentUser.id);
                alert('You have left the space.');
                setActiveSpace(null); // Go back to dashboard
            } catch (err) {
                console.error('Failed to leave space:', err);
                alert(err.message || 'Failed to leave space');
            }
        }
    };

    return (
        <div className="details-sidebar">
            <div className="info-card">
                <h3 className="info-card-title">WORKSPACE INFO</h3>
                <div className="info-row">
                    <span className="info-label">Owner</span>
                    {spaceOwner && (
                        <div className="user-row">
                            <div className="user-avatar-sm" style={{ background: spaceOwner.avatarColor || '#3b82f6' }}>
                                {spaceOwner.initials || spaceOwner.name.charAt(0)}
                            </div>
                            <span>{spaceOwner.name}</span>
                        </div>
                    )}
                </div>
                <div className="info-row">
                    <span className="info-label">Created</span>
                    <span className="info-value">Nov 15, 2024</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Storage Used</span>
                    <div className="storage-bar">
                        <div className="storage-fill" style={{ width: '25%' }}></div>
                    </div>
                    <span className="info-value-sm">184.5 MB</span>
                </div>
            </div>

            <div className="info-card">
                <div className="info-card-header">
                    <h3 className="info-card-title">MEMBERS ({activeSpaceMembers.length})</h3>
                    {isOwnerOrAdmin && (
                        <button className="btn-link" onClick={() => { setIsMembersModalOpen(true); }}>Invite</button>
                    )}
                </div>
                <div className="members-list">
                    {activeSpaceMembers.slice(0, 4).map(member => (
                        <div key={member.id} className="member-item">
                            <div className="user-avatar-sm" style={{ background: member.avatarColor }}>{member.initials}</div>
                            <div className="member-info">
                                <span className="member-name">{member.name}</span>
                                <span className="member-role">{member.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
                {activeSpaceMembers.length > 4 && (
                    <button className="btn-text-sm" style={{ marginTop: '1rem', width: '100%' }} onClick={() => setIsMembersModalOpen(true)}>
                        Show all members
                    </button>
                )}
                {activeSpaceMembers.length <= 4 && (
                    <button className="btn-text-sm" style={{ marginTop: '1rem', width: '100%' }} onClick={() => setIsMembersModalOpen(true)}>
                        {isOwnerOrAdmin ? 'Manage Members' : 'View Members'}
                    </button>
                )}
            </div>

            {/* Leave Space - only visible to non-owners */}
            {currentMember && !isOwner && (
                <button
                    className="btn-danger-outline"
                    style={{ width: '100%', marginTop: '1rem' }}
                    onClick={handleLeaveSpace}
                >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Leave Space
                </button>
            )}
        </div>
    );
};

export default SpaceInfoSidebar;
