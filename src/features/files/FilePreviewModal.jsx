import React from 'react';
import { FileText, Image as ImageIcon, Film, Presentation, Download, Trash2, ExternalLink } from 'lucide-react';
import { useUIStore, useAuthStore, useSpacesStore } from '../../store';
import { getFileUrl, formatRelativeTime } from '../../shared/utils/helpers';
import api from '../../services/api';
import ModalWrapper from '../../shared/components/ModalWrapper';
import Button, { CloseButton } from '../../shared/components/Button';
import { ADMIN_ROLES } from '../../shared/constants';

export default function FilePreviewModal() {
    const { viewingFile, setViewingFile, openConfirmation } = useUIStore();
    const { user } = useAuthStore();
    const { activeSpace } = useSpacesStore();

    if (!viewingFile) return null;

    const onClose = () => setViewingFile(null);

    // Permission check using constants
    const userMember = activeSpace?.members?.find(m => m.userId === user?.id);
    const isUploader = viewingFile.uploadedBy === user?.id;
    const canDelete = isUploader || activeSpace?.ownerId === user?.id || ADMIN_ROLES.includes(userMember?.role);

    const fileUrl = getFileUrl(viewingFile.downloadUrl);
    const downloadApiUrl = api.files.download(viewingFile.id);
    const fileType = viewingFile.type?.toLowerCase();
    const isOfficeDoc = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileType);
    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(fileType);
    const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(fileType);
    const isPdf = fileType === 'pdf';

    const handleView = () => {
        if (!fileUrl) return;
        if (isOfficeDoc) {
            window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=false`, '_blank');
        } else {
            window.open(fileUrl, '_blank');
        }
    };

    const handleDownload = () => {
        if (!downloadApiUrl) return;
        const link = document.createElement('a');
        link.href = downloadApiUrl;
        link.download = viewingFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = () => {
        const displayName = viewingFile.name.length > 30 ? viewingFile.name.substring(0, 30) + '...' : viewingFile.name;
        openConfirmation({
            title: 'Delete File?',
            message: `Are you sure you want to delete "${displayName}"? This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger',
            onConfirm: async () => {
                try {
                    await api.files.delete(viewingFile.id, user?.id);
                    setViewingFile(null);
                    await useSpacesStore.getState().fetchSpaces();
                } catch (err) {
                    console.error('Failed to delete file:', err);
                }
            }
        });
    };

    const PreviewIcon = () => {
        if (['ppt', 'pptx'].includes(fileType)) return <Presentation size={80} className="text-orange-300" />;
        if (isPdf) return <FileText size={80} className="text-red-400" />;
        return <FileText size={80} className="text-blue-300" />;
    };

    return (
        <ModalWrapper isOpen={!!viewingFile} onClose={onClose} size="lg" zLevel="high">
            {/* Preview Area */}
            <div className="h-64 bg-gray-100 border-b-2 border-black flex items-center justify-center relative overflow-hidden">
                {isImage && fileUrl ? (
                    <img src={fileUrl} alt={viewingFile.name} className="max-w-full max-h-full object-contain" />
                ) : isVideo && fileUrl ? (
                    <video src={fileUrl} controls className="max-w-full max-h-full">Your browser does not support video.</video>
                ) : (
                    <div className="text-center">
                        <PreviewIcon />
                        <p className="font-mono text-xs text-gray-400 mt-2">
                            {isPdf ? 'PDF Document' : ['ppt', 'pptx'].includes(fileType) ? 'Presentation' : 'No preview'}
                        </p>
                    </div>
                )}
                <CloseButton onClick={onClose} className="absolute top-4 right-4" />
            </div>

            {/* Details */}
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-black line-clamp-2 mb-1" title={viewingFile.name}>
                        {viewingFile.name.replace(/([_\-])/g, '$1\u200B')}
                    </h2>
                    <p className="text-gray-500 font-medium mb-4">
                        Uploaded by <span className="text-black font-bold">{viewingFile.uploaderName}</span> • {viewingFile.time || formatRelativeTime(viewingFile.createdAt)}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant="primary" onClick={handleView} icon={<ExternalLink />}>View</Button>
                        <Button variant="warning" onClick={handleDownload} icon={<Download />}>Download</Button>
                        {canDelete && (
                            <Button variant="danger" onClick={handleDelete} icon={<Trash2 />}>Delete</Button>
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
        </ModalWrapper>
    );
}
