import React, { useState } from 'react';
import { spaceMembersApi } from '../../services/api';
import '../../styles/modals.css';

const MembersModal = ({
    isOpen,
    onClose,
    activeSpaceMembers,
    setActiveSpaceMembers,
    currentUser,
    memberRoleFilter,
    setMemberRoleFilter,
    setIsCreateModalOpen,
    setCreateStep,
    setInviteMode
}) => {
    const [memberSearch, setMemberSearch] = useState('');

    // Find permission for current user in this space
    const currentMember = activeSpaceMembers.find(m => m.userId === currentUser.id);
    const userRole = currentMember ? currentMember.role : 'Member';
    const isOwnerOrAdmin = userRole === 'Owner' || userRole === 'Admin';
    const isOwner = userRole === 'Owner';

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-members" onClick={e => e.stopPropagation()}>
                <div className="modal-header header-bordered">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h2 className="modal-title-sm">
                            {isOwnerOrAdmin ? 'Manage Members' : 'Members'}
                        </h2>
                        <span className="member-count-badge">{activeSpaceMembers.length} Members</span>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="modal-sub-header">
                    <div className="search-box sm">
                        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search members"
                            value={memberSearch}
                            onChange={(e) => setMemberSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="files-filter"
                        value={memberRoleFilter}
                        onChange={(e) => setMemberRoleFilter(e.target.value)}
                        style={{ marginLeft: '10px', height: '38px' }}
                    >
                        <option value="All">All Roles</option>
                        <option value="Owner">Owner</option>
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                    </select>

                    {/* Conditionally render the Invite New Members button */}
                    {isOwnerOrAdmin && (
                        <button className="btn btn-primary-sm" onClick={() => { onClose(); setIsCreateModalOpen(true); setCreateStep(3); setInviteMode('email'); }} style={{ marginLeft: '10px', padding: '0.5rem' }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                    )}
                </div>

                <div className="modal-body scrollable members-list-view">
                    {activeSpaceMembers
                        .filter(m => memberRoleFilter === 'All' || m.role === memberRoleFilter)
                        .filter(m => m.name.toLowerCase().includes(memberSearch.toLowerCase()))
                        .map(member => (
                            <div key={member.id} className="member-row-large">
                                <div className="member-info-large">
                                    <div className="user-avatar" style={{ background: member.avatarColor }}>{member.initials}</div>
                                    <div className="member-details">
                                        <span className="member-name-lg">{member.name}</span>
                                        <span className="member-email-lg">{member.name.toLowerCase().replace(' ', '.')}@example.com</span>
                                    </div>
                                </div>
                                <div className="member-actions">
                                    {isOwnerOrAdmin ? (
                                        <>
                                            <select
                                                className="role-select"
                                                value={member.role}
                                                disabled={!isOwner && member.role === 'Owner'} // Only owner can change owner role
                                                onChange={async (e) => {
                                                    const newRole = e.target.value;
                                                    try {
                                                        if (newRole === 'Owner') {
                                                            if (window.confirm(`Transfer ownership to ${member.name}? The current owner will become an Admin.`)) {
                                                                // 1. Demote current owner to Admin
                                                                const currentOwner = activeSpaceMembers.find(m => m.role === 'Owner');
                                                                if (currentOwner) {
                                                                    await spaceMembersApi.updateRole(currentOwner.spaceId, currentOwner.memberId, 'Admin');
                                                                }
                                                                // 2. Promote new owner
                                                                await spaceMembersApi.updateRole(member.spaceId, member.memberId, 'Owner');

                                                                setActiveSpaceMembers(prev => prev.map(m => {
                                                                    if (m.id === member.id) return { ...m, role: 'Owner' };
                                                                    if (m.role === 'Owner') return { ...m, role: 'Admin' };
                                                                    return m;
                                                                }));
                                                            }
                                                        } else {
                                                            await spaceMembersApi.updateRole(member.spaceId, member.memberId, newRole);
                                                            setActiveSpaceMembers(prev => prev.map(m => m.id === member.id ? { ...m, role: newRole } : m));
                                                        }
                                                    } catch (err) {
                                                        console.error('Failed to update role:', err);
                                                        alert('Failed to update role');
                                                    }
                                                }}
                                            >
                                                <option value="Owner">Owner</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Member">Member</option>
                                            </select>
                                            <button
                                                className={`btn-icon-danger ${member.role === 'Owner' || member.id === currentMember?.id ? 'invisible' : ''}`}
                                                title="Remove Member"
                                                onClick={async () => {
                                                    if (member.role !== 'Owner') {
                                                        if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
                                                            try {
                                                                await spaceMembersApi.removeMember(member.spaceId, member.memberId);
                                                                setActiveSpaceMembers(prev => prev.filter(m => m.id !== member.id));
                                                            } catch (err) {
                                                                console.error('Failed to remove member:', err);
                                                                alert('Failed to remove member');
                                                            }
                                                        }
                                                    }
                                                }}
                                            >
                                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </>
                                    ) : (
                                        <span className="member-role" style={{ marginRight: '1rem' }}>{member.role}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default MembersModal;
