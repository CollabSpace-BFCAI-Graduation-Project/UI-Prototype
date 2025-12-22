import React from 'react';
import { X, FileText, Image as ImageIcon, Film, Presentation, Download, Trash2, ExternalLink } from 'lucide-react';
import { useUIStore, useAuthStore, useSpacesStore } from '../../store';
import { getFileUrl } from '../../shared/utils/helpers';
import api from '../../services/api';

export default function FilePreviewModal() {
    const { viewingFile, setViewingFile, openConfirmation } = useUIStore();
    const { user } = useAuthStore();
    const { activeSpace } = useSpacesStore();

    if (!viewingFile) return null;

    const onClose = () => setViewingFile(null);

    // Calculate delete permission
    const userMember = activeSpace?.members?.find(m => m.userId === user?.id);
    const isOwner = activeSpace?.ownerId === user?.id;
    const isAdmin = userMember?.role === 'Admin' || userMember?.role === 'Owner';
    const isUploader = viewingFile.uploadedBy === user?.id;
    const canDelete = isUploader || isOwner || isAdmin;

    // Get the file URL
    const fileUrl = getFileUrl(viewingFile.downloadUrl);
    const downloadApiUrl = api.files.download(viewingFile.id);
    const fileType = viewingFile.type?.toLowerCase();
    const isPresentation = ['ppt', 'pptx', 'odp'].includes(fileType);
    const isOfficeDoc = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileType);

    const handleView = () => {
        if (fileUrl) {
            // For presentations and Office docs, try to open in Google Docs Viewer
            // Note: This requires the file to be publicly accessible on the internet
            if (isOfficeDoc) {
                // Google Docs Viewer - works with public URLs
                const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=false`;
                window.open(googleViewerUrl, '_blank');
            } else {
                // For other files, open directly
                window.open(fileUrl, '_blank');
            }
        }
    };

    const handleDownload = () => {
        // Use the download API endpoint which triggers actual download
        if (downloadApiUrl) {
            const link = document.createElement('a');
            link.href = downloadApiUrl;
            link.download = viewingFile.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDelete = () => {
        // Truncate long filenames for the confirmation message
        const displayName = viewingFile.name.length > 30
            ? viewingFile.name.substring(0, 30) + '...'
            : viewingFile.name;

        openConfirmation({
            title: 'Delete File?',
            message: `Are you sure you want to delete "${displayName}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await api.files.delete(viewingFile.id, user?.id);
                    setViewingFile(null); // Close modal
                    await useSpacesStore.getState().fetchSpaces();
                } catch (err) {
                    console.error('Failed to delete file:', err);
                    alert('Failed to delete file. ' + (err.message || ''));
                }
            }
        });
    };


    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(fileType);
    const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(fileType);
    const isPdf = fileType === 'pdf';

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[0px_0px_0px_4px_rgba(255,255,255,0.2)] animate-in zoom-in-95">
                <div className="h-64 bg-gray-100 border-b-2 border-black flex items-center justify-center relative overflow-hidden">
                    {isImage && fileUrl ? (
                        <img
                            src={fileUrl}
                            alt={viewingFile.name}
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : isVideo && fileUrl ? (
                        <video
                            src={fileUrl}
                            controls
                            className="max-w-full max-h-full"
                        >
                            Your browser does not support video playback.
                        </video>
                    ) : isPdf ? (
                        <div className="text-center">
                            <FileText size={80} className="text-red-400 mx-auto mb-2" />
                            <p className="font-mono text-xs text-gray-400">PDF Document</p>
                        </div>
                    ) : ['ppt', 'pptx'].includes(fileType) ? (
                        <div className="text-center">
                            <Presentation size={80} className="text-orange-300 mx-auto mb-2" />
                            <p className="font-mono text-xs text-gray-400">Presentation File</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <FileText size={80} className="text-blue-300 mx-auto mb-2" />
                            <p className="font-mono text-xs text-gray-400">No preview available</p>
                        </div>
                    )}
                    <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
                </div>
                <div className="p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black line-clamp-2 mb-1" title={viewingFile.name}>
                            {/* Insert zero-width space after underscores and hyphens to allow line breaks */}
                            {viewingFile.name.replace(/([_\-])/g, '$1\u200B')}
                        </h2>
                        <p className="text-gray-500 font-medium mb-4">Uploaded by <span className="text-black font-bold">{viewingFile.uploaderName}</span> • {viewingFile.time}</p>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={handleView}
                                className="bg-blue-400 text-white px-4 py-2 rounded-xl border-2 border-black font-bold hover:bg-blue-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 flex items-center gap-2"
                            >
                                <ExternalLink size={18} /> View
                            </button>
                            <button
                                onClick={handleDownload}
                                className="bg-yellow-300 text-black px-4 py-2 rounded-xl border-2 border-black font-bold hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 flex items-center gap-2"
                            >
                                <Download size={18} /> Download
                            </button>
                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-400 text-white px-4 py-2 rounded-xl border-2 border-black font-bold hover:bg-red-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 flex items-center gap-2"
                                >
                                    <Trash2 size={18} /> Delete
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-100">
                        <h4 className="font-bold text-sm uppercase text-gray-400 mb-2">File Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><p className="text-gray-500">File Type</p><p className="font-bold uppercase">{viewingFile.type}</p></div>
                            <div><p className="text-gray-500">Size</p><p className="font-bold">{viewingFile.size}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
