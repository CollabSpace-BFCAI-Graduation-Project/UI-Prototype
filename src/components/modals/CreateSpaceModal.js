import React from 'react';
import '../../styles/modals.css';

const SPACE_TEMPLATES = [
    { id: 't1', name: 'Aeries Gallery', category: 'CREATIVE', gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
    { id: 't2', name: 'Tech Lab', category: 'TECH', gradient: 'linear-gradient(135deg, #000000 0%, #434343 100%)' },
    { id: 't4', name: 'Mountain Lounge', category: 'MEETING', gradient: 'linear-gradient(135deg, #e6b980 0%, #eacda3 100%)' },
    { id: 't5', name: 'Agora', category: 'EDUCATION', gradient: 'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)' },
];

const CreateSpaceModal = ({
    isOpen,
    onClose,
    createStep,
    setCreateStep,
    newSpaceName,
    setNewSpaceName,
    newSpaceDescription,
    setNewSpaceDescription,
    handleCreateConfirm,
    inviteMode,
    setInviteMode,
    handleFinalizeCreate
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleFinalizeCreate}>
            <div className={`modal-content ${createStep === 2 ? 'modal-wide' : createStep === 3 ? 'modal-compact' : ''}`} onClick={e => e.stopPropagation()}>

                {createStep === 1 && (
                    <>
                        <div className="modal-left">
                            <div className="modal-logo">
                                <div className="logo small">G</div>
                            </div>

                            <div className="modal-form-content">
                                <h2 className="modal-title">Let's build your space 🎉</h2>

                                <div className="form-group">
                                    <label className="form-label">Space Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Acme Corp"
                                        value={newSpaceName}
                                        onChange={(e) => setNewSpaceName(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="What is this space for?"
                                        value={newSpaceDescription}
                                        onChange={(e) => setNewSpaceDescription(e.target.value)}
                                    />
                                </div>

                                <button
                                    className="btn btn-primary btn-block btn-large"
                                    onClick={() => setCreateStep(2)}
                                    disabled={!newSpaceName.trim()}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>

                        <div className="modal-right">
                            <div className="preview-card">
                                <div className="preview-illustration">
                                    <div className="preview-mock-user user-1">😁</div>
                                    <div className="preview-mock-user user-2">👩‍</div>
                                    <div className="preview-mock-user user-3"></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {createStep === 2 && (
                    <div className="modal-step-2">
                        <div className="modal-header-step2">
                            <button className="back-btn" onClick={() => setCreateStep(1)}>
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h2 className="modal-title-center">Select a Template</h2>
                        </div>

                        <div className="templates-grid">
                            {SPACE_TEMPLATES.map(template => (
                                <div
                                    key={template.id}
                                    className="template-card"
                                    onClick={() => handleCreateConfirm(template)}
                                >
                                    <div className="template-thumbnail" style={{ background: template.gradient }}></div>
                                    <div className="template-info">
                                        <span className="template-name">{template.name}</span>
                                        <span className="template-category">{template.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {createStep === 3 && (
                    <div className="modal-step-3">
                        {inviteMode === 'link' ? (
                            <>
                                <div className="invite-icon-wrapper">
                                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <h2 className="modal-title-center">Invite members with this link</h2>

                                <div className="invite-link-box">
                                    <span className="invite-url">https://app.v2.gather.town/app/{Math.random().toString(36).substring(7)}</span>
                                    <button className="btn btn-primary btn-sm">Copy</button>
                                </div>

                                <div className="invite-actions">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => setInviteMode('email')}
                                    >
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Invite with email
                                    </button>
                                    <button className="btn btn-text" onClick={handleFinalizeCreate}>
                                        Skip for now
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="invite-icon-wrapper">
                                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="modal-title-center">Invite members by email</h2>
                                <div className="invite-email-container">
                                    <textarea
                                        className="invite-textarea"
                                        placeholder="example1@email.com, example2@email.com..."
                                    ></textarea>

                                </div>
                                <div className="invite-actions">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => setInviteMode('link')}
                                    >
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        Invite with link
                                    </button>
                                    <button className="btn btn-text" onClick={handleFinalizeCreate}>
                                        Skip for now
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default CreateSpaceModal;
