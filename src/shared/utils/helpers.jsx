import { FileText, Image as ImageIcon, Film, Presentation, File } from 'lucide-react';

export const getFileIcon = (type) => {
    switch (type) {
        case 'doc': return <FileText size={20} className="text-blue-500" />;
        case 'image': return <ImageIcon size={20} className="text-pink-500" />;
        case 'video': return <Film size={20} className="text-purple-500" />;
        case 'presentation': return <Presentation size={20} className="text-orange-500" />;
        default: return <File size={20} className="text-gray-500" />;
    }
};
