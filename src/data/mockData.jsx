import { Zap, Monitor, Coffee, BookOpen } from 'lucide-react';

export const INITIAL_SPACES = [
    {
        id: 1,
        name: 'The Chill Zone',
        thumbnail: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)',
        type: 'MEETING',
        isOnline: true,
        userCount: 6,
        memberCount: 24,
        isFavorite: true,
        description: "Weekly syncs and coffee chats ☕️",
        files: [
            { id: 'f1', name: 'Q3_Goals.pdf', type: 'doc', user: 'Alex', time: '2h ago', size: '2.4 MB' },
            { id: 'f2', name: 'Team_Photo.png', type: 'image', user: 'Sarah', time: '5h ago', size: '4.1 MB' }
        ],
        members: [
            { id: 1, name: 'Maryam', role: 'Owner', avatar: 'bg-pink-200' },
            { id: 2, name: 'Alex', role: 'Admin', avatar: 'bg-purple-300' },
            { id: 3, name: 'Sarah', role: 'Member', avatar: 'bg-green-300' },
            { id: 4, name: 'Mike', role: 'Viewer', avatar: 'bg-blue-300' },
        ]
    },
    {
        id: 2,
        name: 'Design Studio',
        thumbnail: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        type: 'CREATIVE',
        isOnline: false,
        userCount: 0,
        memberCount: 8,
        isFavorite: false,
        description: "Where the magic happens ✨",
        files: [
            { id: 'f3', name: 'Logo_V2.svg', type: 'image', user: 'Mike', time: '1d ago', size: '150 KB' },
            { id: 'f4', name: 'Brand_Guidelines.pdf', type: 'doc', user: 'Maryam', time: '2d ago', size: '12 MB' },
            { id: 'f6', name: 'Pitch_Deck.pptx', type: 'presentation', user: 'Maryam', time: '3d ago', size: '5.5 MB' }
        ],
        members: [
            { id: 1, name: 'Maryam', role: 'Owner', avatar: 'bg-pink-200' },
            { id: 4, name: 'Mike', role: 'Admin', avatar: 'bg-blue-300' },
        ]
    },
    {
        id: 3,
        name: 'Dev Bunker',
        thumbnail: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        type: 'TECH',
        isOnline: true,
        userCount: 12,
        memberCount: 42,
        isFavorite: false,
        description: "Code, debug, repeat 🐛",
        files: [],
        members: []
    },
    {
        id: 4,
        name: 'Library',
        thumbnail: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        type: 'EDUCATION',
        isOnline: false,
        userCount: 0,
        memberCount: 156,
        isFavorite: true,
        description: "Resources and docs 📚",
        files: [
            { id: 'f5', name: 'Onboarding_Video.mp4', type: 'video', user: 'Admin', time: '1w ago', size: '450 MB' },
            { id: 'f7', name: 'Curriculum_2025.docx', type: 'doc', user: 'Admin', time: '2w ago', size: '1.2 MB' }
        ],
        members: []
    }
];

export const SPACE_TEMPLATES = [
    { id: 't1', name: 'Art Gallery', category: 'CREATIVE', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', icon: <Zap size={24} /> },
    { id: 't2', name: 'Cyber Lab', category: 'TECH', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', icon: <Monitor size={24} /> },
    { id: 't3', name: 'Cozy Lounge', category: 'MEETING', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', icon: <Coffee size={24} /> },
    { id: 't4', name: 'Classroom', category: 'EDUCATION', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', icon: <BookOpen size={24} /> },
];

export const INITIAL_CHAT_HISTORY = {
    1: [
        { id: 1, user: 'Alex', avatarColor: 'bg-purple-300', text: 'Hey team! Anyone up for a coffee break? ☕️', time: '10:42 AM', isMe: false },
        { id: 2, user: 'Sarah', avatarColor: 'bg-green-300', text: 'I need 5 mins then I am in!', time: '10:43 AM', isMe: false },
    ],
    2: [
        { id: 1, user: 'Mike', avatarColor: 'bg-blue-300', text: 'Just uploaded the new logo vector. Check files tab!', time: '09:00 AM', isMe: false },
        { id: 2, user: 'Maryam', avatarColor: 'bg-pink-200', text: 'Got it, looks sharp! 🎨', time: '09:15 AM', isMe: true },
    ],
    3: [
        { id: 1, user: 'DevBot', avatarColor: 'bg-gray-300', text: 'Build failed: error in main.js line 42 🐛', time: '11:00 AM', isMe: false },
        { id: 2, user: 'Alex', avatarColor: 'bg-purple-300', text: 'On it. Looking into the CI pipeline now.', time: '11:02 AM', isMe: false },
    ]
};
