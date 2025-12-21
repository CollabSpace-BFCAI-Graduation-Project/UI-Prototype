import React from 'react';
import { X, ArrowLeft, Copy, Smile } from 'lucide-react';

export default function CreateSpaceModal({
    isOpen,
    onClose,
    createStep,
    setCreateStep,
    newSpaceName,
    setNewSpaceName,
    newSpaceDescription,
    setNewSpaceDescription,
    spaceTemplates,
    createdSpaceLink,
    onConfirm,
    onFinalize
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"><X size={20} /></button>

                {createStep === 1 && (
                    <>
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-yellow-50">
                            <div className="mb-6"><span className="inline-block px-3 py-1 bg-black text-white rounded-full text-xs font-bold mb-4">Step 1/3</span><h2 className="text-4xl font-black text-gray-900 mb-2">Let's build your<br />dream space! 🚀</h2><p className="text-gray-600 font-medium">Give it a cool name to get started.</p></div>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-bold text-gray-900 mb-2">Space Name</label><input autoFocus value={newSpaceName} onChange={(e) => setNewSpaceName(e.target.value)} className="w-full px-4 py-3 text-lg font-bold border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-shadow" placeholder="e.g. The Bat Cave" /></div>
                                <div><label className="block text-sm font-bold text-gray-900 mb-2">Description</label><textarea value={newSpaceDescription} onChange={(e) => setNewSpaceDescription(e.target.value)} className="w-full px-4 py-3 font-medium border-2 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300/50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] h-24 resize-none" placeholder="What happens in this space?" /></div>
                            </div>
                            <button disabled={!newSpaceName.trim()} onClick={() => setCreateStep(2)} className="mt-8 w-full bg-black text-white font-bold text-lg py-4 rounded-xl border-2 border-black hover:bg-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[2px] active:shadow-none">Next Step →</button>
                        </div>
                        <div className="hidden md:flex w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blue-500 items-center justify-center relative overflow-hidden border-l-4 border-black">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-90"></div>
                            <div className="relative z-10 text-center p-8">
                                <div className="bg-white border-2 border-black rounded-2xl p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] rotate-3 max-w-xs mx-auto">
                                    <div className="h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-4xl">🏰</div>
                                    <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div><div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                                </div>
                                <p className="text-white font-bold mt-8 text-xl drop-shadow-md">Previewing: {newSpaceName || 'Untitled Space'}</p>
                            </div>
                        </div>
                    </>
                )}

                {createStep === 2 && (
                    <div className="w-full h-full flex flex-col">
                        <div className="p-6 border-b-2 border-black flex items-center bg-pink-50"><button onClick={() => setCreateStep(1)} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors"><ArrowLeft size={24} /></button><div><span className="text-xs font-bold uppercase tracking-wider text-pink-600">Step 2/3</span><h2 className="text-2xl font-black">Choose a Vibe</h2></div></div>
                        <div className="flex-1 overflow-y-auto p-8 bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{spaceTemplates.map((t) => (<button key={t.id} onClick={() => onConfirm(t)} className="group text-left border-2 border-black rounded-2xl p-4 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none bg-white"><div className="h-32 rounded-xl mb-4 border-2 border-black flex items-center justify-center text-white" style={{ background: t.gradient }}>{t.icon}</div><h3 className="font-bold text-lg">{t.name}</h3><span className="text-xs font-bold text-gray-400 uppercase">{t.category}</span></button>))}</div>
                        </div>
                    </div>
                )}

                {createStep === 3 && (
                    <div className="w-full p-8 md:p-12 flex flex-col items-center justify-center text-center bg-[#FFFDF5]">
                        <div className="w-20 h-20 bg-green-400 rounded-full border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce"><Smile size={40} className="text-black" /></div>
                        <h2 className="text-3xl font-black mb-2">Space Created! 🎉</h2><p className="text-gray-600 font-medium mb-8 max-w-md">Your space is ready for action.</p>
                        <div className="w-full max-w-md bg-white border-2 border-black rounded-xl p-2 flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] mb-6"><div className="flex-1 px-4 font-mono text-sm truncate text-gray-600">{createdSpaceLink}</div><button className="bg-yellow-300 hover:bg-yellow-400 text-black p-2.5 rounded-lg border-2 border-black font-bold transition-colors"><Copy size={18} /></button></div>
                        <div className="flex gap-4"><button onClick={onFinalize} className="px-6 py-3 bg-white border-2 border-black rounded-xl font-bold hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none">Skip Invite</button><button onClick={onFinalize} className="px-6 py-3 bg-black text-white border-2 border-black rounded-xl font-bold hover:shadow-[4px_4px_0px_0px_rgba(236,72,153,1)] transition-shadow">Go to Space →</button></div>
                    </div>
                )}
            </div>
        </div>
    );
}
