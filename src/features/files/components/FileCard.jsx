import React from 'react';

export default function FileCard({ file, getFileIcon, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-white border-2 border-black rounded-2xl p-4 flex flex-col justify-between hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer min-h-[160px]"
        >
            <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-transparent">{getFileIcon(file.type)}</div>
                <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded border border-gray-200 uppercase">{file.type}</span>
            </div>
            <div>
                <p className="font-bold text-sm truncate leading-tight mb-1" title={file.name}>{file.name}</p>
                <p className="text-xs text-gray-500">{file.size} • {file.uploaderName}</p>
            </div>
        </div>
    );
}
