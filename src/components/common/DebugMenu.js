import React, { useState } from 'react';

const DebugMenu = ({ currentUser, setCurrentUser, activeSpaceMembers }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '90px',
                    zIndex: 10000,
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#2563eb', // Blue primary
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isOpen ? 'rotate(45deg)' : 'none'
                }}
                onClick={() => setIsOpen(!isOpen)}
                title="Debug Tools"
            >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '90px',
                    left: '90px',
                    zIndex: 10000,
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid #e5e7eb',
                    width: '320px',
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transformOrigin: 'bottom left'
                }}>
                    <div style={{
                        padding: '16px',
                        background: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
                            🛠️ Debug Tools
                        </h3>
                        <span style={{ fontSize: '11px', color: '#64748b', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                            DEV
                        </span>
                    </div>

                    <div style={{ padding: '16px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                color: '#94a3b8',
                                marginBottom: '12px',
                                letterSpacing: '0.05em'
                            }}>
                                Active User
                            </label>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {activeSpaceMembers.map(member => (
                                    <button
                                        key={member.id}
                                        onClick={() => {
                                            setCurrentUser(member);
                                            // Don't close immediately to allow rapid switching if needed, 
                                            // or we can close it. Let's keep it open for "debug" feel.
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: member.id === currentUser.id ? '1px solid #3b82f6' : '1px solid transparent',
                                            background: member.id === currentUser.id ? '#eff6ff' : 'transparent',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            width: '100%',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => {
                                            if (member.id !== currentUser.id) e.currentTarget.style.background = '#f1f5f9';
                                        }}
                                        onMouseLeave={e => {
                                            if (member.id !== currentUser.id) e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: member.avatarColor,
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                        }}>
                                            {member.initials}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                                {member.name} {member.id === currentUser.id && <span style={{ fontSize: '10px' }}> (You)</span>}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                {member.role}
                                            </div>
                                        </div>
                                        {member.id === currentUser.id && (
                                            <div style={{ color: '#3b82f6' }}>
                                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                            <button
                                onClick={() => console.log('Current App State:', { currentUser, activeSpaceMembers })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: '#f1f5f9',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#475569',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Log State to Console
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
        </>
    );
};

export default DebugMenu;
