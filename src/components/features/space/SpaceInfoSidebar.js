import React from 'react';

const SpaceInfoSidebar = ({ activeSpaceMembers, currentUser, setIsMembersModalOpen }) => {
    return (
        <div className="details-sidebar">
            <div className="info-card">
                <h3 className="info-card-title">WORKSPACE INFO</h3>
                <div className="info-row">
                    <span className="info-label">Owner</span>
                    {activeSpaceMembers.find(m => m.role === 'Owner') && (
                        <div className="user-row">
                            <div className="user-avatar-sm" style={{ background: activeSpaceMembers.find(m => m.role === 'Owner').avatarColor }}>
                                {activeSpaceMembers.find(m => m.role === 'Owner').initials}
                            </div>
                            <span>{activeSpaceMembers.find(m => m.role === 'Owner').name}</span>
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
                    {(currentUser.role === 'Owner' || currentUser.role === 'Admin') && (
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
                        {currentUser.role === 'Owner' || currentUser.role === 'Admin' ? 'Manage Members' : 'View Members'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default SpaceInfoSidebar;
