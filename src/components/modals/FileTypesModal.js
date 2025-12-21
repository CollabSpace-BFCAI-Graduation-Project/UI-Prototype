import React from 'react';
import '../../styles/modals.css';

const FileTypesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-file-types" onClick={e => e.stopPropagation()}>
                <div className="modal-header header-bordered">
                    <h2 className="modal-title-sm">Supported File Types</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="modal-body scrollable">
                    <div className="file-type-section">
                        <div className="section-header">
                            <h3>3D Files</h3>
                            <p className="section-note">We recommend that you use a maximum texture size of 2048x2048.</p>
                        </div>
                        <div className="file-type-grid">
                            <div className="type-item"><span className="type-label">OBJ</span><span className="type-value">100 MB</span></div>
                            <div className="type-item"><span className="type-label">glTF</span><span className="type-value">100 MB</span></div>
                            <div className="type-item"><span className="type-label">GLB</span><span className="type-value">100 MB</span></div>
                            <div className="type-item"><span className="type-label">FBX</span><span className="type-value">100 MB</span></div>
                            <div className="type-item"><span className="type-label">DAE</span><span className="type-value">60 MB</span></div>
                            <div className="type-item"><span className="type-label">PCD</span><span className="type-value">10 MB</span></div>
                            <div className="type-item"><span className="type-label">ZIP</span><span className="type-value">500 MB</span></div>
                        </div>
                    </div>

                    <div className="file-type-section">
                        <h3>Videos</h3>
                        <div className="file-type-row">
                            <span className="type-label-row">MP4, GIFs, MKV, MOV, AVI, WEBM</span>
                            <span className="type-value">1000 MB</span>
                        </div>
                    </div>

                    <div className="file-type-section">
                        <h3>Images</h3>
                        <div className="file-type-grid">
                            <div className="type-item"><span className="type-label">PNG</span><span className="type-value">10 MB</span></div>
                            <div className="type-item"><span className="type-label">JPEG</span><span className="type-value">10 MB</span></div>
                            <div className="type-item"><span className="type-label">TIFF</span><span className="type-value">10 MB</span></div>
                        </div>
                    </div>

                    <div className="file-type-section">
                        <h3>Documents</h3>
                        <div className="file-type-grid">
                            <div className="type-item"><span className="type-label">PDF</span><span className="type-value">100 MB</span></div>
                            <div className="type-item"><span className="type-label">Microsoft Word .docx</span><span className="type-value">100 MB</span></div>
                            <div className="type-item"><span className="type-label">Microsoft Powerpoint .pptx</span><span className="type-value">100 MB</span></div>
                            <div className="type-item"><span className="type-label">Microsoft Excel .xlsx</span><span className="type-value">100 MB</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileTypesModal;
