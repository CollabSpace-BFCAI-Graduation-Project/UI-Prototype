import { useState, useRef } from 'react';
import api from '../../../services/api';
import { useAuthStore, useSpacesStore } from '../../../store';

export default function useFileUpload({ activeSpace }) {
    const [uploadState, setUploadState] = useState('idle');
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !activeSpace) return;

        const user = useAuthStore.getState().user;

        // Start upload animation
        setUploadState('uploading');
        setUploadProgress(0);

        // Simulate progress while waiting for upload
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) return prev; // Cap at 90% until complete
                return prev + Math.floor(Math.random() * 15);
            });
        }, 300);

        try {
            // Real API upload
            await api.files.upload(activeSpace.id, file, user?.id);

            // Upload complete
            clearInterval(progressInterval);
            setUploadProgress(100);
            setUploadState('success');

            // Refresh spaces to get updated file list
            await useSpacesStore.getState().fetchSpaces();

            // Reset after delay
            setTimeout(() => {
                setUploadState('idle');
                setUploadProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }, 2000);

        } catch (error) {
            console.error('Upload failed:', error);
            clearInterval(progressInterval);
            setUploadState('idle');
            setUploadProgress(0);
            alert('Failed to upload file. Please try again.');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
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

