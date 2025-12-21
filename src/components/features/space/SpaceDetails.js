import React from 'react';
import SpaceHeader from './SpaceHeader';
import FileGrid from './FileGrid';
import SpaceInfoSidebar from './SpaceInfoSidebar';
import '../../../styles/space-details.css';

const SpaceDetails = ({
    space,
    setActiveSpace,
    currentUser,
    activeDetailTab,
    setActiveDetailTab,
    files,
    activeFileFilter,
    setActiveFileFilter,
    setIsFileTypesOpen,
    setIsUploadModalOpen,
    setIsMembersModalOpen,
    activeSpaceMembers,
    handleJoinSession,
    setIsCreateModalOpen,
    setCreateStep,
    setInviteMode
}) => {
    return (
        <div className="space-details-view">
            <div className="container">
                <SpaceHeader
                    space={space}
                    setActiveSpace={setActiveSpace}
                    handleJoinSession={handleJoinSession}
                    currentUser={currentUser}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    setCreateStep={setCreateStep}
                    setInviteMode={setInviteMode}
                />

                <div className="details-tabs">
                    <button
                        className={`detail-tab ${activeDetailTab === 'files' ? 'active' : ''}`}
                        onClick={() => setActiveDetailTab('files')}
                    >
                        FILES
                    </button>
                </div>

                <div className="details-content-layout">
                    <div className="details-main">
                        <FileGrid
                            files={files}
                            activeFileFilter={activeFileFilter}
                            setActiveFileFilter={setActiveFileFilter}
                            setIsFileTypesOpen={setIsFileTypesOpen}
                            setIsUploadModalOpen={setIsUploadModalOpen}
                        />
                    </div>

                    <SpaceInfoSidebar
                        activeSpaceMembers={activeSpaceMembers}
                        currentUser={currentUser}
                        setIsMembersModalOpen={setIsMembersModalOpen}
                    />
                </div>
            </div>
        </div>
    );
};

export default SpaceDetails;
