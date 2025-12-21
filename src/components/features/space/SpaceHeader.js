import React from 'react';

const SpaceHeader = ({
    space,
    setActiveSpace,
    handleJoinSession,
    currentUser,
    setIsCreateModalOpen,
    setCreateStep,
    setInviteMode,
    setIsSpaceSettingsOpen,
    activeSpaceMembers
}) => {
    // Find current user's role in this space
    const currentMember = activeSpaceMembers?.find(m => m.userId === currentUser.id);
    const userRole = currentMember ? currentMember.role : null;
    const isOwnerOrAdmin = userRole === 'Owner' || userRole === 'Admin';

    return (
        <div className="details-header">
            <button className="back-link" onClick={() => setActiveSpace(null)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Dashboard
            </button>

            <div className="details-title-row">
                <div className="details-title-left">
                    <h1 className="details-space-name">{space.name}</h1>
                    <span className={`status-badge-lg ${space.isOnline ? 'online' : 'offline'}`}>
                        {space.isOnline ? 'On' : 'Off'}line ({space.isOnline ? space.userCount : 0})
                    </span>
                </div>
                <div className="details-actions">
                    <button
                        className="btn btn-primary"
                        style={{ marginRight: '0.5rem' }}
                        onClick={handleJoinSession}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Join Session
                    </button>
                    {isOwnerOrAdmin && (
                        <button className="btn btn-icon" onClick={() => { setIsCreateModalOpen(true); setCreateStep(3); setInviteMode('link'); }} title="Share Space">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        </button>
                    )}
                    {isOwnerOrAdmin && (
                        <button className="btn btn-icon" onClick={() => setIsSpaceSettingsOpen(true)} title="Space Settings">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                    )}
                </div>
            </div>
            <p className="details-description">{space.description || "A collaborative space for creative projects and design work."}</p>
        </div>
    );
};

export default SpaceHeader;
