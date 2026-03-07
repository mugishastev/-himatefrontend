import React from 'react';
import { ConversationList } from '../../features/conversations/components/ConversationList';
import { ContactList } from '../../features/contacts/components/ContactList';
import { ProfileView } from '../../features/users/components/ProfileView';
import { ChatWindow } from '../../features/messages/components/ChatWindow';
import { SidebarNav } from './SidebarNav';
import { NewConversationModal } from '../../features/conversations/components/NewConversationModal';
import { CreateGroupModal } from '../../features/conversations/components/CreateGroupModal';
import { AddContactModal } from '../../features/contacts/components/AddContactModal';
import { UserProfileModal } from '../../features/users/components/UserProfileModal';
import { useUIStore } from '../../store/ui.store';
import { NotificationList } from '../../features/notifications/components/NotificationList';
import { StatusFeed } from '../../features/status/components/StatusFeed';
import { InfoSidebar } from '../../features/messages/components/InfoSidebar';
import { useNotifications } from '../../hooks/useNotifications';
import { useConversations } from '../../hooks/useConversations';


export const DashboardLayout: React.FC = () => {
    const { isSidebarOpen, currentView, activeModal, viewingUserId, closeModal } = useUIStore();

    // Kick off global notification and conversation fetching on mount
    useNotifications();
    useConversations();

    const renderSideView = () => {
        switch (currentView) {
            case 'CHATS':
                return <ConversationList />;
            case 'CONTACTS':
                return <ContactList />;
            case 'STATUS':
                return <StatusFeed refreshKey={0} />;
            case 'NOTIFICATIONS':
                return null;
            case 'PROFILE':
                return <ProfileView />;
            case 'NOTIFICATIONS':
                return null;
            default:
                return <ConversationList />;
        }
    };

    const renderMainView = () => {
        if (currentView === 'STATUS') {
            // Status list is in the side panel, main area shows a welcome placeholder
            return (
                <div className="flex-1 h-full bg-[#f0f2f5] flex flex-col items-center justify-center gap-4 text-center px-8">
                    <div className="w-24 h-24 rounded-full bg-brand/10 flex items-center justify-center">
                        <svg className="w-12 h-12 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium text-[#111b21] mb-2">Click a status to view</h3>
                        <p className="text-[#667781] text-sm max-w-xs">Select a status update from the left to see it in full screen.</p>
                    </div>
                </div>
            );
        }
        if (currentView === 'NOTIFICATIONS') {
            return (
                <div className="flex-1 p-6 bg-bg-secondary overflow-y-auto">
                    <div className="max-w-3xl mx-auto space-y-4">
                        <h2 className="text-2xl font-black text-text-primary tracking-tight">Notifications</h2>
                        <NotificationList />
                    </div>
                </div>
            );
        }
        return <ChatWindow />;
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#d1d7db]">
            {/* ── Three-pane app shell ────────────────────────────────── */}
            <div className="flex-1 flex overflow-hidden lg:p-3">
                <div className="flex-1 flex overflow-hidden bg-[#f0f2f5] lg:rounded-lg lg:shadow-2xl ring-1 ring-black/10">
                    {/* Narrow left nav */}
                    <SidebarNav />

                    {/* Conversation / contact list / status / profile pane */}
                    {currentView !== 'NOTIFICATIONS' && (
                        <aside className={`${isSidebarOpen ? (currentView === 'STATUS' ? 'w-[380px]' : 'w-[420px]') : 'w-0'} shrink-0 transition-all duration-300 overflow-hidden border-r border-[#d1d7db] bg-white flex flex-col`}>
                            {renderSideView()}
                        </aside>
                    )}

                    {/* Main content */}
                    <main className="flex-1 flex flex-col min-w-0 bg-[#efeae2] relative overflow-hidden">
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.06]"
                            style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}
                        />
                        <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
                            {renderMainView()}
                        </div>
                    </main>

                    {/* Right info pane */}
                    <InfoSidebar />
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'NEW_CONVERSATION' && (
                <NewConversationModal onClose={closeModal} />
            )}
            {activeModal === 'CREATE_GROUP' && (
                <CreateGroupModal onClose={closeModal} />
            )}
            {activeModal === 'ADD_CONTACT' && (
                <AddContactModal
                    onClose={closeModal}
                    onSuccess={() => {
                        // ContactList will re-fetch contacts next time it mounts/re-renders
                        closeModal();
                    }}
                />
            )}
            {activeModal === 'USER_PROFILE' && viewingUserId && (
                <UserProfileModal userId={viewingUserId} onClose={closeModal} />
            )}
        </div>
    );
};

export default DashboardLayout;
