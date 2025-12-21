import React from 'react';

export default function SpaceStats({ memberCount, userCount }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-gray-500 font-bold text-sm uppercase mb-1">Total Members</h3>
                <p className="text-3xl font-black text-gray-900">{memberCount}</p>
            </div>
            <div className="bg-pink-50 border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-gray-500 font-bold text-sm uppercase mb-1">Active Now</h3>
                <p className="text-3xl font-black text-gray-900">{userCount}</p>
            </div>
        </div>
    );
}
