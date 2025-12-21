import React from 'react';
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
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-members" onClick={e => e.stopPropagation()}>
                <div className="modal-header header-bordered">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h2 className="modal-title-sm">
                            {currentUser.role === 'Owner' || currentUser.role === 'Admin' ? 'Manage Members' : 'Members'}
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
                        <input type="text" className="search-input" placeholder="Search members" />
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
                    {(currentUser.role === 'Owner' || currentUser.role === 'Admin') && (
                        <button className="btn btn-primary-sm" onClick={() => { onClose(); setIsCreateModalOpen(true); setCreateStep(3); setInviteMode('email'); }} style={{ marginLeft: '10px', padding: '0.5rem' }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                    )}
                </div>

                <div className="modal-body scrollable members-list-view">
                    {activeSpaceMembers
                        .filter(m => memberRoleFilter === 'All' || m.role === memberRoleFilter)
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
                                    {currentUser.role === 'Owner' || currentUser.role === 'Admin' ? (
                                        <>
                                            <select
                                                className="role-select"
                                                value={member.role}
                                                disabled={member.role === 'Owner'}
                                                onChange={(e) => {
                                                    const newRole = e.target.value;
                                                    if (newRole === 'Owner') {
                                                        if (window.confirm(`Transfer ownership to ${member.name}? The current owner will become an Admin.`)) {
                                                            setActiveSpaceMembers(prev => prev.map(m => {
                                                                if (m.id === member.id) return { ...m, role: 'Owner' };
                                                                if (m.role === 'Owner') return { ...m, role: 'Admin' };
                                                                return m;
                                                            }));
                                                        }
                                                    } else {
                                                        setActiveSpaceMembers(prev => prev.map(m => m.id === member.id ? { ...m, role: newRole } : m));
                                                    }
                                                }}
                                            >
                                                <option value="Owner">Owner</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Member">Member</option>
                                            </select>
                                            <button
                                                className={`btn-icon-danger ${member.role === 'Owner' ? 'invisible' : ''}`}
                                                title="Remove Member"
                                                onClick={() => {
                                                    if (member.role !== 'Owner') {
                                                        if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
                                                            setActiveSpaceMembers(prev => prev.filter(m => m.id !== member.id));
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
