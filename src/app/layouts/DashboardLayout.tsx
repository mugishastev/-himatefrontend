import React from 'react';
import { ConversationList } from '../../features/conversations/components/ConversationList';
import { ContactList } from '../../features/contacts/components/ContactList';
import { ProfileView } from '../../features/users/components/ProfileView';
import { SettingsView } from '../../features/settings/components/SettingsView';
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
import { ImageViewerModal } from '../../features/messages/components/ImageViewerModal';
import { useNotifications } from '../../hooks/useNotifications';
import { useConversations } from '../../hooks/useConversations';


export const DashboardLayout: React.FC = () => {
    const { currentView, activeModal, viewingUserId, closeModal } = useUIStore();

    // Kick off global notification and conversation fetching on mount
    useNotifications();
    useConversations();

    const renderMainView = () => {
        switch (currentView) {
            case 'CHATS':
                return (
                    <>
                        <aside className="w-[380px] flex-shrink-0 flex flex-col bg-white border-r border-[#d1d7db] z-10 transition-all duration-300">
                            <ConversationList />
                        </aside>
                        <main className="flex-1 flex flex-col min-w-0 bg-[#efeae2] relative z-0">
                            <div
                                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                                style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}
                            />
                            <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
                                <ChatWindow />
                            </div>
                        </main>
                    </>
                );
            case 'CONTACTS':
                return (
                    <div className="flex-1 bg-white overflow-y-auto w-full">
                        <ContactList />
                    </div>
                );
            case 'STATUS':
                return (
                    <div className="flex-1 bg-[#111b21]">
                        <StatusFeed refreshKey={0} />
                    </div>
                );
            case 'PROFILE':
                return (
                    <div className="flex-1 bg-white overflow-y-auto w-full">
                        <ProfileView />
                    </div>
                );
            case 'SETTINGS':
                return (
                    <div className="flex-1 bg-white overflow-y-auto w-full">
                        <SettingsView />
                    </div>
                );
            case 'NOTIFICATIONS':
                return (
                    <div className="flex-1 p-6 bg-bg-secondary overflow-y-auto">
                        <div className="max-w-3xl mx-auto space-y-4">
                            <h2 className="text-2xl font-black text-text-primary tracking-tight">Notifications</h2>
                            <NotificationList />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#d1d7db]">
            {/* ── Three-pane app shell ────────────────────────────────── */}
            <div className="flex-1 flex overflow-hidden lg:p-3">
                <div className="flex-1 flex overflow-hidden bg-[#f0f2f5] lg:rounded-lg lg:shadow-2xl ring-1 ring-black/10">
                    {/* Narrow left nav */}
                    <SidebarNav />

                    {/* Dynamic Main App Area */}
                    {renderMainView()}

                    {/* Right info pane (only visible when in CHATS and InfoSidebar is toggled) */}
                    {currentView === 'CHATS' && <InfoSidebar />}
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
            {activeModal === 'IMAGE_VIEWER' && (
                <ImageViewerModal />
            )}
        </div>
    );
};

export default DashboardLayout;
