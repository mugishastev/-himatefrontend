import React from 'react';
import { 
    MessageSquare, 
    Phone, 
    CircleFadingPlus, 
    Layout, 
    Bell, 
    Settings, 
    LogOut 
} from 'lucide-react';
import { useUIStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';
import { useConversationStore } from '../../store/conversation.store';
import { useNotificationStore } from '../../store/notification.store';
import { UserAvatar } from '../../features/users/components/UserAvatar';

export const SidebarNav: React.FC = () => {
    const { currentView, setView } = useUIStore();
    const { logout, user } = useAuthStore();
    const { conversations } = useConversationStore();
    const { unreadCount } = useNotificationStore();

    const chatUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

    const topItems = [
        {
            id: 'CHATS',
            Icon: MessageSquare,
            label: 'Chats',
            badge: chatUnread
        },
        {
            id: 'CALLS',
            Icon: Phone,
            label: 'Calls'
        },
        {
            id: 'STATUS',
            Icon: CircleFadingPlus,
            label: 'Status'
        },
        {
            id: 'PAGES',
            Icon: Layout,
            label: 'Pages'
        }
    ];

    const bottomItems = [
        {
            id: 'NOTIFICATIONS',
            Icon: Bell,
            label: 'Alerts',
            badge: unreadCount
        },
        {
            id: 'SETTINGS',
            Icon: Settings,
            label: 'Settings'
        }
    ];

    return (
        <div className="w-full md:w-[64px] h-[64px] md:h-full bg-[#111827] flex flex-row md:flex-col items-center py-0 md:py-4 px-2 md:px-0 border-t md:border-t-0 md:border-r border-[#1F2937] shrink-0 z-30 order-last md:order-first overflow-hidden">
            {/* Logo - Hidden on mobile bottom bar */}
            <div className="hidden md:flex w-10 h-10 items-center justify-center mb-6 shrink-0 cursor-pointer hover:opacity-80 transition-opacity" title="Himate">
                <img src="/logo.png" alt="Himate" className="w-8 h-8 object-contain" />
            </div>

            {/* Top Items (Main Nav) - Scrollable area for icons if they overflow */}
            <div className="flex-1 w-full flex flex-row md:flex-col gap-1 md:gap-4 items-center justify-around md:justify-start overflow-x-auto md:overflow-y-auto scrollbar-hide py-2 md:py-0">
                {topItems.map((item) => {
                    const Icon = item.Icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id as any)}
                            className="group flex flex-col items-center justify-center relative flex-1 md:flex-none h-14 md:w-12 md:h-12"
                            title={item.label}
                        >
                            <span className={`flex items-center justify-center rounded-2xl w-10 h-10 transition-all duration-200 ${isActive ? 'bg-[#1F2937] text-[#F97316] shadow-lg shadow-black/20' : 'text-[#aebac1] hover:text-[#d1d7db] hover:bg-white/5'}`}>
                                <Icon className={`w-6 h-6 ${isActive ? 'fill-[#F97316]/10' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                            </span>
                            {!!item.badge && (
                                <span className="absolute top-1 right-2 md:top-0 md:right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F97316] text-[#FFFFFF] text-[10px] font-bold flex items-center justify-center shadow-[0_0_0_2px_#111827]">
                                    {item.badge > 9 ? '9+' : item.badge}
                                </span>
                            )}
                            {/* Mobile Active Indicator */}
                            {isActive && (
                                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#F97316] md:hidden" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Bottom Items (Profile/Settings) */}
            <div className="w-auto md:w-full flex md:flex-1 flex-row md:flex-col gap-1 md:gap-4 items-center justify-end md:pb-2">
                {bottomItems.map((item) => {
                    const Icon = item.Icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id as any)}
                            className={`group flex flex-col items-center justify-center relative h-14 md:w-12 md:h-12 ${item.id === 'SETTINGS' ? 'hidden sm:flex' : 'flex'}`}
                            title={item.label}
                        >
                            <span className={`flex items-center justify-center rounded-2xl w-10 h-10 transition-all duration-200 ${isActive ? 'bg-[#1F2937] text-[#F97316] shadow-lg shadow-black/20' : 'text-[#aebac1] hover:text-[#d1d7db] hover:bg-white/5'}`}>
                                <Icon className={`w-6 h-6 ${isActive ? 'fill-[#F97316]/10' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                            </span>
                            {!!item.badge && (
                                <span className="absolute top-2 right-2 md:top-1 md:right-1 w-[10px] h-[10px] rounded-full bg-[#F97316] shadow-[0_0_0_2px_#111827]"></span>
                            )}
                            {isActive && (
                                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#F97316] md:hidden" />
                            )}
                        </button>
                    );
                })}

                <div className="hidden md:block w-8 h-[1px] bg-[#1F2937] my-2" />

                <button
                    onClick={() => setView('PROFILE')}
                    className="group flex items-center justify-center h-14 md:w-12 md:h-12 relative px-2 md:px-0"
                    title="Profile"
                >
                    <div className={`w-8 h-8 rounded-full overflow-hidden transition-all duration-200 ${currentView === 'PROFILE' ? 'ring-[2px] ring-[#F97316] ring-offset-[#111827] ring-offset-[2px]' : 'group-hover:opacity-80'}`}>
                        {user ? (
                            <UserAvatar user={user} size="sm" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#1F2937]" />
                        )}
                    </div>
                </button>

                <button
                    onClick={logout}
                    className="hidden md:flex items-center justify-center relative text-[#9CA3AF] hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors w-10 h-10 mt-1"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5 ml-1" />
                </button>
            </div>
        </div>
    );
};
