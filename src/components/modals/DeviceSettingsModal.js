import React, { useState, useEffect } from 'react';
import '../../styles/modals.css';

const DeviceSettingsModal = ({ isOpen, onClose, onJoin }) => {
    const [devices, setDevices] = useState({
        microphones: [
            { id: 'mic1', name: 'Default - Built-in Microphone', isDefault: true },
            { id: 'mic2', name: 'External Microphone', isDefault: false },
        ],
        speakers: [
            { id: 'spk1', name: 'Default - Built-in Speakers', isDefault: true },
            { id: 'spk2', name: 'External Speakers', isDefault: false },
        ],
        cameras: [
            { id: 'cam1', name: 'FaceTime HD Camera', isDefault: true },
            { id: 'cam2', name: 'External Webcam', isDefault: false },
        ],
    });

    const [selectedMic, setSelectedMic] = useState('mic1');
    const [selectedSpeaker, setSelectedSpeaker] = useState('spk1');
    const [selectedCamera, setSelectedCamera] = useState('cam1');
    const [micEnabled, setMicEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [micLevel, setMicLevel] = useState(0);

    // Simulate microphone level visualization
    useEffect(() => {
        if (!isOpen || !micEnabled) {
            setMicLevel(0);
            return;
        }

        const interval = setInterval(() => {
            setMicLevel(Math.random() * 100);
        }, 100);

        return () => clearInterval(interval);
    }, [isOpen, micEnabled]);

    if (!isOpen) return null;

    const handleJoin = () => {
        const preferences = {
            microphone: selectedMic,
            speaker: selectedSpeaker,
            camera: selectedCamera,
            micEnabled,
            cameraEnabled,
        };
        localStorage.setItem('devicePreferences', JSON.stringify(preferences));
        onJoin();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal device-settings-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Join Session</h2>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="device-content">
                    {/* Camera Preview */}
                    <div className="camera-preview-section">
                        <div className={`camera-preview ${!cameraEnabled ? 'disabled' : ''}`}>
                            {cameraEnabled ? (
                                <div className="preview-placeholder">
                                    <div className="preview-avatar">
                                        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <p>Camera Preview</p>
                                </div>
                            ) : (
                                <div className="preview-disabled">
                                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l18 18" />
                                    </svg>
                                    <p>Camera Off</p>
                                </div>
                            )}
                        </div>
                        <div className="preview-controls">
                            <button
                                className={`preview-btn ${!micEnabled ? 'off' : ''}`}
                                onClick={() => setMicEnabled(!micEnabled)}
                            >
                                {micEnabled ? (
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                    </svg>
                                )}
                            </button>
                            <button
                                className={`preview-btn ${!cameraEnabled ? 'off' : ''}`}
                                onClick={() => setCameraEnabled(!cameraEnabled)}
                            >
                                {cameraEnabled ? (
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Device Selectors */}
                    <div className="device-selectors">
                        <div className="device-group">
                            <label>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                                Microphone
                            </label>
                            <select value={selectedMic} onChange={e => setSelectedMic(e.target.value)}>
                                {devices.microphones.map(mic => (
                                    <option key={mic.id} value={mic.id}>{mic.name}</option>
                                ))}
                            </select>
                            {micEnabled && (
                                <div className="mic-level">
                                    <div className="mic-level-bar" style={{ width: `${micLevel}%` }}></div>
                                </div>
                            )}
                        </div>

                        <div className="device-group">
                            <label>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                                Speaker
                            </label>
                            <select value={selectedSpeaker} onChange={e => setSelectedSpeaker(e.target.value)}>
                                {devices.speakers.map(spk => (
                                    <option key={spk.id} value={spk.id}>{spk.name}</option>
                                ))}
                            </select>
                            <button className="test-btn">Test Audio</button>
                        </div>

                        <div className="device-group">
                            <label>
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Camera
                            </label>
                            <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)}>
                                {devices.cameras.map(cam => (
                                    <option key={cam.id} value={cam.id}>{cam.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleJoin}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Join Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeviceSettingsModal;
