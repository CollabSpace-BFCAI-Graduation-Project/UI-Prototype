import React from 'react';
import { Users } from 'lucide-react';

export default function TeamView() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-32 h-32 bg-blue-200 rounded-full border-4 border-black flex items-center justify-center mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"><Users size={64} /></div>
            <h2 className="text-4xl font-black mb-4">Team Directory</h2>
            <p className="text-xl font-medium text-gray-500 max-w-md">Manage your team members here.</p>
        </div>
    );
}
