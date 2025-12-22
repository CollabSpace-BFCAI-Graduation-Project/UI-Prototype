import React from 'react';
import { X, FileText } from 'lucide-react';
import FileCard from './components/FileCard';
import UploadCard from './components/UploadCard';
import { getFileIcon } from '../../shared/utils/helpers';
import { useUIStore, useSpacesStore } from '../../store';
import useFileUpload from './hooks/useFileUpload';

export default function FilesModal() {
    // Get state from stores
    const {
        isFilesModalOpen,
        closeFilesModal,
        fileFilter,
        setFileFilter,
        setViewingFile
    } = useUIStore();

    const { activeSpace } = useSpacesStore();

    // File upload hook
    const {
        uploadState,
        uploadProgress,
        fileInputRef,
        handleFileSelect,
        triggerFileUpload
    } = useFileUpload({ activeSpace });

    if (!isFilesModalOpen || !activeSpace) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeFilesModal}></div>
            <div className="relative w-full max-w-3xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col h-[600px] animate-in zoom-in-95 duration-200">

                {/* Header with Filter */}
                <div className="p-6 border-b-2 border-black bg-blue-50 rounded-t-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-black flex items-center gap-2"><FileText size={24} /> File Library</h2>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Workspace: {activeSpace.name}</p>
                        </div>
                        <button onClick={closeFilesModal} className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
                    </div>
                    {/* Filter Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {['all', 'image', 'video', 'doc', 'presentation'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFileFilter(f)}
                                className={`px-3 py-1 rounded-full text-xs font-bold border-2 capitalize transition-all ${fileFilter === f ? 'bg-black text-white border-black' : 'bg-white border-transparent hover:border-black text-gray-500 hover:text-black'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {/* Upload Card */}
                        <UploadCard
                            uploadState={uploadState}
                            uploadProgress={uploadProgress}
                            triggerFileUpload={triggerFileUpload}
                            fileInputRef={fileInputRef}
                            handleFileSelect={handleFileSelect}
                        />

                        {/* File Cards Filtered */}
                        {activeSpace.files && activeSpace.files
                            .filter(f => {
                                if (fileFilter === 'all') return true;
                                const ext = f.type?.toLowerCase();
                                if (fileFilter === 'image') {
                                    return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'fig'].includes(ext);
                                }
                                if (fileFilter === 'video') {
                                    return ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv'].includes(ext);
                                }
                                if (fileFilter === 'doc') {
                                    return ['doc', 'docx', 'pdf', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'csv'].includes(ext);
                                }
                                if (fileFilter === 'presentation') {
                                    return ['ppt', 'pptx', 'odp', 'key'].includes(ext);
                                }
                                return false;
                            })
                            .map((file, i) => (
                                <FileCard
                                    key={i}
                                    file={file}
                                    getFileIcon={getFileIcon}
                                    onClick={() => setViewingFile(file)}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

