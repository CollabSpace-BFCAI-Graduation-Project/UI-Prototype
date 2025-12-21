import React from 'react';

const BoardGrid = () => {
    return (
        <>
            <div className="files-toolbar">
                <div className="files-controls">
                    <button className="btn-icon-sm active">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h6v6H4zm0 10h6v6H4zM14 4h6v6h-6zm0 10h6v6h-6z" /></svg>
                    </button>
                    <button className="btn-icon-sm">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" /></svg>
                    </button>
                </div>
            </div>

            <div className="files-grid">
                {[
                    { title: 'Product Roadmap', collaborators: 5, author: 'Sarah Chen', time: '1 hour ago' },
                    { title: 'UI Design Sprint', collaborators: 8, author: 'Mike Ross', time: '3 hours ago' },
                    { title: 'Marketing Strategy', collaborators: 4, author: 'Jessica Day', time: '1 day ago' },
                    { title: 'Team Brainstorming', collaborators: 12, author: 'Tom Wilson', time: '2 days ago' },
                ].map((board, i) => (
                    <div key={i} className="board-card">
                        <div className="board-thumbnail">
                            <svg width="64" height="64" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <div className="board-info">
                            <h3 className="board-title">{board.title}</h3>
                            <span className="board-time">{board.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default BoardGrid;
