import React, { useState, useRef, useEffect } from 'react';
import { Search, Grid, List, ChevronDown, Check } from 'lucide-react';

function FilterDropdown({ value, options, onChange, color = "purple" }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value) || options[0];

    return (
        <div className="relative min-w-[180px]" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border-2 border-black font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all ${isOpen ? `ring-2 ring-${color}-300` : ''}`}
            >
                <span className="truncate mr-2">{selectedOption.label}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-bold flex items-center justify-between hover:bg-gray-50 transition-colors ${value === option.value ? `bg-${color}-50 text-${color}-900` : 'text-gray-700'}`}
                        >
                            <span>{option.label}</span>
                            {value === option.value && <Check size={14} className={`text-${color}-600`} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SpaceFilters({
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode
}) {
    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'CREATIVE', label: '🎨 Creative' },
        { value: 'TECH', label: '💻 Tech' },
        { value: 'EDUCATION', label: '📚 Education' },
        { value: 'MEETING', label: '☕️ Meeting' }
    ];

    const statusOptions = [
        { value: 'all', label: 'Any Status' },
        { value: 'online', label: '🟢 Online' },
        { value: 'offline', label: '⚫️ Offline' }
    ];

    return (
        <div className="bg-white border-2 border-black rounded-2xl p-4 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row gap-4 items-center justify-between sticky top-4 z-30">
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl border-2 border-black w-full lg:w-auto overflow-x-auto no-scrollbar">
                {['all', 'member', 'favorites', 'owned'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${activeTab === tab
                            ? 'bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                            : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                <FilterDropdown
                    value={activeCategory}
                    onChange={setActiveCategory}
                    options={categoryOptions}
                    color="purple"
                />

                <FilterDropdown
                    value={activeStatus}
                    onChange={setActiveStatus}
                    options={statusOptions}
                    color="green"
                />

                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search spaces..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-pink-300 font-medium placeholder-gray-400"
                    />
                </div>

                <div className="flex bg-white rounded-xl border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                    <button onClick={() => setViewMode('grid')} className={`p-2.5 hover:bg-gray-100 transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}><Grid size={20} /></button>
                    <div className="w-0.5 bg-black"></div>
                    <button onClick={() => setViewMode('list')} className={`p-2.5 hover:bg-gray-100 transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}><List size={20} /></button>
                </div>
            </div>
        </div>
    );
}
