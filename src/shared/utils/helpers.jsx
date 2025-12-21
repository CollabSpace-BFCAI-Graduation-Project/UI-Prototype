import { FileText, Image as ImageIcon, Film, Presentation, File } from 'lucide-react';

// API Base URL for images
const API_BASE_URL = 'http://localhost:5000';

export const getFileIcon = (type) => {
    switch (type) {
        case 'doc': return <FileText size={20} className="text-blue-500" />;
        case 'image': return <ImageIcon size={20} className="text-pink-500" />;
        case 'video': return <Film size={20} className="text-purple-500" />;
        case 'presentation': return <Presentation size={20} className="text-orange-500" />;
        default: return <File size={20} className="text-gray-500" />;
    }
};

/**
 * Get full URL for an image path from the backend
 * @param {string} path - The relative image path (e.g., "/images/avatar.jpg")
 * @returns {string|null} Full URL or null if no path
 */
export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${API_BASE_URL}${path}`;
};

/**
 * Get initials from a name (e.g., "John Doe" -> "JD")
 * @param {string} name - The full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

/**
 * Get avatar display props (image URL or initials fallback)
 * @param {object} user - User object with avatarImage, avatarColor, and name
 * @returns {object} { imageUrl, initials, backgroundColor }
 */
export const getAvatarProps = (user) => {
    return {
        imageUrl: getImageUrl(user?.avatarImage),
        initials: getInitials(user?.name),
        backgroundColor: user?.avatarColor || '#ec4899'
    };
};

/**
 * Format a date string or Date object to "21 Dec, 2025" format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return 'N/A';

    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid date';

    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${month}, ${year}`;
};

/**
 * Format a date to relative time (e.g., "2 hours ago", "Yesterday")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
    if (!date) return 'N/A';

    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid date';

    const now = new Date();
    const diffMs = now - d;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return formatDate(date);
};
