import React from 'react';
import { ConversationList } from '../../features/conversations/components/ConversationList';
import { ContactList } from '../../features/contacts/components/ContactList';
import { ProfileView } from '../../features/users/components/ProfileView';
import { ChatWindow } from '../../features/messages/components/ChatWindow';
import { SidebarNav } from './SidebarNav';
import { NewConversationModal } from '../../features/conversations/components/NewConversationModal';
import { AddContactModal } from '../../features/contacts/components/AddContactModal';
import { useUIStore } from '../../store/ui.store';
import { NotificationList } from '../../features/notifications/components/NotificationList';
import { StatusComposer } from '../../features/status/components/StatusComposer';
import { StatusFeed } from '../../features/status/components/StatusFeed';
import { useState } from 'react';

export const DashboardLayout: React.FC = () => {
    const { isSidebarOpen, toggleSidebar, currentView, activeModal, closeModal } = useUIStore();
    const [statusRefreshKey, setStatusRefreshKey] = useState(0);

    const renderSideView = () => {
        switch (currentView) {
            case 'CHATS':
                return <ConversationList />;
            case 'CONTACTS':
                return <ContactList />;
            case 'STATUS':
                return null;
            case 'NOTIFICATIONS':
                return null;
            case 'PROFILE':
                return null; // Side view is empty for profile to focus on center
            default:
                return <ConversationList />;
        }
    };

    const renderMainView = () => {
        if (currentView === 'PROFILE') {
            return <ProfileView />;
        }
        if (currentView === 'STATUS') {
            return (
                <div className="flex-1 p-6 bg-bg-secondary overflow-y-auto">
                    <div className="max-w-3xl mx-auto space-y-4">
                        <StatusComposer onCreated={() => setStatusRefreshKey((k) => k + 1)} />
                        <StatusFeed refreshKey={statusRefreshKey} />
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
        <div className="flex h-screen bg-bg-secondary overflow-hidden">
            {/* Main Navigation Sidebar */}
            <SidebarNav />

            {/* Sidebar Toggle (Mobile) */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden absolute bottom-6 right-6 z-50 w-14 h-14 bg-brand rounded-full shadow-lg text-white flex items-center justify-center"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            {/* Secondary Sidebar (Conversations/Contacts) */}
            {currentView !== 'PROFILE' && currentView !== 'NOTIFICATIONS' && currentView !== 'STATUS' && (
                <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-20`}>
                    {renderSideView()}
                </aside>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {renderMainView()}
            </main>

            {/* Modals */}
            {activeModal === 'NEW_CONVERSATION' && (
                <NewConversationModal onClose={closeModal} />
            )}
            {activeModal === 'ADD_CONTACT' && (
                <AddContactModal onClose={closeModal} />
            )}
        </div>
    );
};

export default DashboardLayout;
