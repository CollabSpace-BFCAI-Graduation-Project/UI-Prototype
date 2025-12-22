import React from 'react';
import { X, FileText, Image as ImageIcon, Film, Presentation, Download } from 'lucide-react';
import { useUIStore } from '../../store';

export default function FilePreviewModal() {
    const { viewingFile, setViewingFile } = useUIStore();

    if (!viewingFile) return null;

    const onClose = () => setViewingFile(null);

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[0px_0px_0px_4px_rgba(255,255,255,0.2)] animate-in zoom-in-95">
                <div className="h-64 bg-gray-100 border-b-2 border-black flex items-center justify-center relative pattern-dots">
                    {viewingFile.type === 'image' ? (
                        <div className="text-center">
                            <ImageIcon size={64} className="text-gray-400 mx-auto mb-2" />
                            <p className="font-mono text-xs text-gray-400">Image Preview: {viewingFile.name}</p>
                        </div>
                    ) : viewingFile.type === 'video' ? (
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                            <div className="ml-1 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent"></div>
                        </div>
                    ) : viewingFile.type === 'presentation' ? (
                        <div className="text-center">
                            <Presentation size={80} className="text-orange-300 mx-auto mb-2" />
                            <p className="font-mono text-xs text-gray-400">Slides Preview</p>
                        </div>
                    ) : (
                        <FileText size={80} className="text-blue-300" />
                    )}
                    <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>
                </div>
                <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black mb-1">{viewingFile.name}</h2>
                            <p className="text-gray-500 font-medium">Uploaded by <span className="text-black font-bold">{viewingFile.user}</span> • {viewingFile.time}</p>
                        </div>
                        <button className="bg-yellow-300 text-black px-4 py-2 rounded-xl border-2 border-black font-bold hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 flex items-center gap-2"><Download size={18} /> Download</button>
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
