import { useState, useRef } from 'react';

export default function useFileUpload({ activeSpace, setActiveSpace, setSpaces }) {
    const [uploadState, setUploadState] = useState('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Determine mock type based on basic extension check or default to 'doc'
        let mockType = 'doc';
        if (file.type.startsWith('image/')) mockType = 'image';
        else if (file.type.startsWith('video/')) mockType = 'video';
        else if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) mockType = 'presentation';

        // Start Animation
        setUploadState('uploading');
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.floor(Math.random() * 25);
            });
        }, 400);

        setTimeout(() => {
            clearInterval(interval);
            setUploadProgress(100);
            setUploadState('success');

            const newFile = {
                id: `f${Date.now()}`,
                name: file.name,
                type: mockType,
                user: 'Maryam',
                time: 'Just now',
                size: (file.size / 1024 / 1024).toFixed(1) + ' MB'
            };

            setSpaces(prevSpaces => prevSpaces.map(s => {
                if (s.id === activeSpace.id) {
                    const updatedSpace = { ...s, files: [newFile, ...s.files] };
                    setActiveSpace(updatedSpace);
                    return updatedSpace;
                }
                return s;
            }));

            setTimeout(() => {
                setUploadState('idle');
                setUploadProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
            }, 2000);
        }, 2500);
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return {
        uploadState,
        uploadProgress,
        fileInputRef,
        handleFileSelect,
        triggerFileUpload
    };
}
