import React from 'react';
import UnityLoadingScreen from './components/UnityLoadingScreen';
import UnityWorldCanvas from './components/UnityWorldCanvas';
import SessionControlBar from './components/SessionControlBar';

export default function UnitySessionView({
    loadingProgress,
    onLeave
}) {
    const isLoading = loadingProgress < 100;

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center text-white">
            {isLoading ? (
                <UnityLoadingScreen progress={loadingProgress} />
            ) : (
                <div className="w-full h-full relative">
                    {/* 3D World Canvas Placeholder */}
                    <UnityWorldCanvas />

                    {/* Game UI Overlay - Top */}
                    <div className="absolute top-4 left-4 p-4">
                        <button
                            onClick={onLeave}
                            className="bg-red-500 border-2 border-black text-white font-bold px-4 py-2 rounded-lg hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                        >
                            LEAVE WORLD
                        </button>
                    </div>

                    {/* Game UI Overlay - Bottom Control Bar */}
                    <SessionControlBar />
                </div>
            )}
        </div>
    );
}
