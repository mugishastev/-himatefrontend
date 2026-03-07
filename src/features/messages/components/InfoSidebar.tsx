import React from 'react';
import { useUIStore } from '../../../store/ui.store';
import { useConversationStore } from '../../../store/conversation.store';
import { useAuthStore } from '../../../store/auth.store';
import { UserAvatar } from '../../users/components/UserAvatar';

export const InfoSidebar: React.FC = () => {
    const { isInfoPaneOpen, infoPaneType, setInfoPane } = useUIStore();
    const { activeConversationId, conversations } = useConversationStore();
    const { user: currentUser } = useAuthStore();

    const activeConversation = conversations.find(c => String(c.id) === String(activeConversationId));

    if (!isInfoPaneOpen || !activeConversation) return null;

    const otherParticipant = activeConversation.participants.find(
        (p) => String(p.userId) !== String(currentUser?.id)
    );

    const displayName = (activeConversation.isGroup
        ? activeConversation.title
        : otherParticipant?.user.username) || 'Contact';

    return (
        <aside className="w-[400px] h-full bg-white border-l border-[#d1d7db] flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
            <header className="h-[60px] bg-[#f0f2f5] flex items-center px-6 shrink-0 border-b border-gray-100">
                <button
                    onClick={() => setInfoPane(false)}
                    className="mr-6 text-[#54656f] hover:text-[#111b21] transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="font-medium text-[#111b21] text-lg">
                    {infoPaneType === 'GROUP' ? 'Group info' : 'Contact info'}
                </h3>
            </header>

            <div className="flex-1 overflow-y-auto no-scrollbar bg-[#f0f2f5] space-y-3 pb-10">
                {/* Profile Section */}
                <div className="bg-white p-8 flex flex-col items-center shadow-sm">
                    <div className="w-52 h-52 rounded-full overflow-hidden mb-5">
                        {activeConversation.isGroup ? (
                            <div className="w-full h-full bg-brand/10 flex items-center justify-center text-4xl font-bold text-brand">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        ) : (
                            otherParticipant?.user && <UserAvatar user={otherParticipant.user} size="full" showStatus={false} />
                        )}
                    </div>
                    <h2 className="text-2xl font-normal text-[#111b21] mb-1">{displayName}</h2>
                    {!activeConversation.isGroup && (
                        <p className="text-[#667781] text-lg font-normal">
                            {otherParticipant?.user.email}
                        </p>
                    )}
                </div>

                {/* About/Description Section */}
                <div className="bg-white p-6 shadow-sm">
                    <h4 className="text-[#667781] text-sm font-medium mb-4 uppercase tracking-wide">
                        {activeConversation.isGroup ? 'Group Description' : 'About'}
                    </h4>
                    <p className="text-[#111b21] text-[15px]">
                        {activeConversation.isGroup
                            ? 'Connect with friends in this secure group chat.'
                            : 'Hey there! I am using Himate.'}
                    </p>
                </div>

                {/* Participants Section for Groups */}
                {activeConversation.isGroup && (
                    <div className="bg-white shadow-sm flex-1">
                        <div className="p-6 pb-2">
                            <h4 className="text-[#667781] text-sm font-medium uppercase tracking-wide">
                                {activeConversation.participants.length} Participants
                            </h4>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {activeConversation.participants.map((p) => (
                                <div key={p.id} className="p-4 px-6 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                                        <UserAvatar user={p.user} size="sm" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h5 className="font-medium text-[#111b21] truncate">
                                                {Number(p.userId) === Number(currentUser?.id) ? 'You' : p.user.username}
                                            </h5>
                                            {p.isAdmin && (
                                                <span className="text-[10px] text-[#00a884] border border-[#00a884] px-1 rounded font-medium">Group Admin</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[#667781] truncate">Available</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Media/Links Section Placeholder */}
                <div className="bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[#667781] text-sm font-medium uppercase tracking-wide">Media, links and docs</h4>
                        <span className="text-xs text-[#667781] cursor-pointer hover:underline">0 {'>'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-gray-300">
                            <svg className="w-8 h-8 font-bold" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white shadow-sm">
                    <button className="w-full text-left p-6 flex items-center gap-6 text-[#ea0038] hover:bg-gray-50 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        <span className="font-normal">{activeConversation.isGroup ? 'Exit group' : 'Block contact'}</span>
                    </button>
                    <button className="w-full text-left p-6 flex items-center gap-6 text-[#ea0038] hover:bg-gray-50 transition-colors border-t border-gray-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        <span className="font-normal text-brand-dark">{activeConversation.isGroup ? 'Report group' : 'Report contact'}</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};
