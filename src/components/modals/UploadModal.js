import React from 'react';
import '../../styles/modals.css';

const UploadModal = ({
    isOpen,
    onClose,
    handleDragOver,
    handleDrop,
    fileInputRef,
    handleFileUpload,
    uploadQueue,
    isUploading,
    setIsUploading,
    setUploadQueue,
    handleConfirmUpload,
    setIsFileTypesOpen
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-upload" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {isUploading ? (
                    <div className="upload-progress-view">
                        <h2 className="upload-title" style={{ marginBottom: '1.5rem' }}>Uploading {uploadQueue.length} files</h2>
                        <div className="upload-list" style={{ maxHeight: '300px', overflowY: 'auto', width: '100%', marginBottom: '1.5rem' }}>
                            {uploadQueue.map(file => (
                                <div key={file.id} className="upload-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', background: '#f9fafb', padding: '0.75rem', borderRadius: '8px' }}>
                                    <div className="file-icon-sm" style={{ color: file.color }}>
                                        {file.icon === 'image' && <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                                        {file.icon === 'doc' && <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                                        {file.icon === 'video' && <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{file.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{Math.round(file.progress)}%</span>
                                        </div>
                                        <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{ width: `${file.progress}%`, height: '100%', background: '#10b981', transition: 'width 0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="upload-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => { setIsUploading(false); setUploadQueue([]); }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleConfirmUpload}
                                disabled={uploadQueue.some(f => f.progress < 100)}
                            >
                                {uploadQueue.some(f => f.progress < 100) ? 'Uploading...' : 'Done'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="upload-dropzone"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <h2 className="upload-title">Drag files here</h2>
                        <p className="upload-subtitle">
                            We support 3D models, images, videos, documents, and more!
                            <button className="btn-icon-subtle" onClick={() => setIsFileTypesOpen(true)} title="View Supported File Types">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
                            </button>
                        </p>

                        <div className="upload-divider">
                            <span>or</span>
                        </div>

                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            multiple
                            onChange={(e) => handleFileUpload(e.target.files)}
                        />
                        <button
                            className="btn-black-pill"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >
                            Select From Your Device
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadModal;
