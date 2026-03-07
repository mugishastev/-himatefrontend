import React from 'react';
import { ConversationList } from '../../features/conversations/components/ConversationList';
import { ContactList } from '../../features/contacts/components/ContactList';
import { ProfileView } from '../../features/users/components/ProfileView';
import { SettingsView } from '../../features/settings/components/SettingsView';
import { CallsView } from '../../features/calls/components/CallsView';
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
            case 'CALLS':
                return (
                    <>
                        <aside className="w-[380px] flex-shrink-0 flex flex-col bg-[#111827] border-r border-[#1F2937] z-10 transition-all duration-300">
                            <CallsView />
                        </aside>
                        <main className="flex-1 flex flex-col min-w-0 bg-[#111827] relative z-0 items-center justify-center">
                            <div className="grid grid-cols-2 gap-8 max-w-lg mb-8">
                                <button className="flex flex-col items-center gap-3 group">
                                    <div className="w-20 h-20 rounded-2xl bg-[#1F2937] group-hover:bg-[#374248] flex items-center justify-center transition-colors shadow-lg border border-white/5">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[15px] font-medium">Start call</span>
                                </button>
                                <button className="flex flex-col items-center gap-3 group">
                                    <div className="w-20 h-20 rounded-2xl bg-[#1F2937] group-hover:bg-[#374248] flex items-center justify-center transition-colors shadow-lg border border-white/5">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[15px] font-medium">New call link</span>
                                </button>
                                <button className="flex flex-col items-center gap-3 group">
                                    <div className="w-20 h-20 rounded-2xl bg-[#1F2937] group-hover:bg-[#374248] flex items-center justify-center transition-colors shadow-lg border border-white/5">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6b2 2 0 00-2 2v2a2 2 0 01-2 2H2a2 2 0 01-2-2V8c0-1.1.9-2 2-2zm14 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2b2 2 0 00-2 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V8c0-1.1.9-2 2-2zM4 14a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6m14-4a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2" />
                                            <circle cx="12" cy="12" r="1.5" />
                                            <circle cx="12" cy="6" r="1.5" />
                                            <circle cx="12" cy="18" r="1.5" />
                                            <circle cx="6" cy="12" r="1.5" />
                                            <circle cx="18" cy="12" r="1.5" />
                                            <circle cx="6" cy="18" r="1.5" />
                                            <circle cx="18" cy="18" r="1.5" />
                                            <circle cx="6" cy="6" r="1.5" />
                                            <circle cx="18" cy="6" r="1.5" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[15px] font-medium">Call a number</span>
                                </button>
                                <button className="flex flex-col items-center gap-3 group">
                                    <div className="w-20 h-20 rounded-2xl bg-[#1F2937] group-hover:bg-[#374248] flex items-center justify-center transition-colors shadow-lg border border-white/5">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-[15px] font-medium">Schedule call</span>
                                </button>
                            </div>

                            <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-2 text-[#aebac1] text-[13px]">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Your personal calls are end-to-end encrypted</span>
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
