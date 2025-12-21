import React from 'react';
import { UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';

export default function UploadCard({
    uploadState,
    uploadProgress,
    triggerFileUpload,
    fileInputRef,
    handleFileSelect
}) {
    return (
        <div
            onClick={uploadState === 'idle' ? triggerFileUpload : undefined}
            className="border-2 border-dashed border-gray-400 bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-all group min-h-[160px]"
        >
            {/* Hidden Input */}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />

            {uploadState === 'idle' ? (
                <>
                    <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center mb-3 group-hover:border-blue-500 group-hover:scale-110 transition-all"><UploadCloud size={24} /></div>
                    <p className="font-bold">Click to Upload</p>
                    <p className="text-xs text-gray-500">Real files supported!</p>
                </>
            ) : uploadState === 'uploading' ? (
                <div className="w-full">
                    <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-3" />
                    <div className="w-full h-3 bg-gray-200 rounded-full border-2 border-black overflow-hidden relative">
                        <div className="h-full bg-blue-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="text-xs font-bold mt-2 animate-pulse">Uploading...</p>
                </div>
            ) : (
                <div className="animate-in zoom-in">
                    <CheckCircle2 size={48} className="text-green-500 mx-auto mb-2" />
                    <p className="font-black text-green-600">Done!</p>
                </div>
            )}
        </div>
    );
}
