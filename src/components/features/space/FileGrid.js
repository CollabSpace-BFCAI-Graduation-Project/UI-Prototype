import React from 'react';

const FileGrid = ({
    files,
    activeFileFilter,
    setActiveFileFilter,
    setIsFileTypesOpen,
    setIsUploadModalOpen
}) => {
    return (
        <>
            <div className="files-toolbar">
                <div className="files-controls">
                    <button className="btn-icon-sm active">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h6v6H4zm0 10h6v6H4zM14 4h6v6h-6zm0 10h6v6h-6z" /></svg>
                    </button>
                    <button className="btn-icon-sm">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" /></svg>
                    </button>
                    <div className="files-filter" style={{ position: 'relative' }}>
                        <span style={{ textTransform: 'capitalize' }}>
                            {activeFileFilter === 'all' ? 'All Files' : (activeFileFilter === 'doc' ? 'Documents' : activeFileFilter + 's')}
                        </span>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        <select
                            value={activeFileFilter}
                            onChange={(e) => setActiveFileFilter(e.target.value)}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                opacity: 0,
                                cursor: 'pointer',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            <option value="all">All Files</option>
                            <option value="image">Images</option>
                            <option value="doc">Documents</option>
                            <option value="video">Videos</option>
                            <option value="3d">3D</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                        className="btn-icon-sm"
                        onClick={() => setIsFileTypesOpen(true)}
                        title="Supported File Types"
                        style={{ border: 'none' }}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <button
                        className="btn btn-dark"
                        onClick={() => setIsUploadModalOpen(true)}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Upload File
                    </button>
                </div>
            </div>

            <div className="files-grid">
                {files
                    .filter(file => activeFileFilter === 'all' || file.icon === activeFileFilter)
                    .map((file, i) => (
                        <div key={i} className="file-card">
                            <div className="file-preview">
                                {file.icon === 'image' && (
                                    <svg width="40" height="40" fill="none" stroke={file.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                )}
                                {file.icon === 'doc' && (
                                    <svg width="40" height="40" fill="none" stroke={file.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                )}
                                {file.icon === 'video' && (
                                    <svg width="40" height="40" fill="none" stroke={file.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                )}
                                {file.icon === '3d' && (
                                    <svg width="40" height="40" fill="none" stroke={file.color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                )}
                            </div>
                            <div className="file-info">
                                <h4 className="file-name">{file.name}</h4>
                                <span className="file-meta">{file.size}</span>
                            </div>
                            <div className="file-footer">
                                <div className="file-user">S</div>
                                <span className="file-time">{file.time}</span>
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default FileGrid;
