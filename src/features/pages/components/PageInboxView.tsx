import React, { useEffect, useState } from 'react';
import { pagesApi } from '../../../api/pages.api';
import { useUIStore } from '../../../store/ui.store';

interface Ticket {
    id: string;
    userName: string;
    lastMessage: string;
    time: string;
    status: 'UNASSIGNED' | 'VIP' | 'RESOLVED';
    unread: boolean;
    rawConversation: any;
}

export const PageInboxView: React.FC = () => {
    const { setView } = useUIStore();
    const [activeTab, setActiveTab] = useState<'UNASSIGNED' | 'VIP' | 'RESOLVED'>('UNASSIGNED');
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIncomingSupport = async () => {
            try {
                const myPages = await pagesApi.getMyPages();
                if (myPages.length > 0) {
                    const pageId = myPages[0].id; // Handling first page for demo
                    const convs = await pagesApi.getPageConversations(pageId);
                    
                    const mappedTickets: Ticket[] = convs.map(c => {
                        const lastMsg = c.messages[0];
                        const otherParticipant = c.participants.find((p: any) => p.user.id !== myPages[0].ownerId);
                        
                        return {
                            id: c.id.toString(),
                            userName: otherParticipant?.user?.username || 'Guest',
                            lastMessage: lastMsg?.content || 'Started a conversation',
                            time: lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                            status: 'UNASSIGNED', // Real status logic could be added to Conversation schema
                            unread: lastMsg ? !lastMsg.isRead : false,
                            rawConversation: c
                        };
                    });
                    setTickets(mappedTickets);
                }
            } catch (err) {
                console.error('Failed to load support tickets:', err);
            } finally {
                setLoading(true); // Should be false but keeping it simple
                setLoading(false);
            }
        };
        fetchIncomingSupport();
    }, []);

    const filteredTickets = tickets.filter(t => t.status === activeTab);

    if (loading) return <div className="flex-1 flex items-center justify-center bg-bg-secondary text-brand font-bold">Synchronizing CRM Tickets...</div>;

    return (
        <div className="flex h-full w-full bg-bg-secondary overflow-hidden">
            {/* Inbox Sidebar Options */}
            <div className="w-[300px] flex-shrink-0 bg-white border-r border-border-light flex flex-col z-10">
                <div className="p-4 border-b border-border-light flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setView('CREATOR_STUDIO')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                            <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-bold text-text-primary">CRM Inbox</h2>
                    </div>
                </div>

                <div className="flex px-4 py-2 gap-2 border-b border-gray-100 overflow-x-auto hide-scrollbar">
                    {(['UNASSIGNED', 'VIP', 'RESOLVED'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 ${
                                activeTab === tab ? 'bg-brand text-white shadow-md' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                            }`}
                        >
                            {tab.charAt(0) + tab.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredTickets.map(ticket => (
                        <div
                            key={ticket.id}
                            onClick={() => setActiveTicket(ticket)}
                            className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${activeTicket?.id === ticket.id ? 'bg-brand/5' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-text-primary text-[15px]">{ticket.userName}</span>
                                <span className="text-xs text-text-secondary">{ticket.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-text-secondary truncate pr-4">{ticket.lastMessage}</p>
                                {ticket.unread && <span className="w-2.5 h-2.5 rounded-full bg-brand shrink-0"></span>}
                            </div>
                        </div>
                    ))}
                    {filteredTickets.length === 0 && (
                        <div className="p-8 text-center text-text-secondary text-sm font-medium">
                            No tickets in this category.
                        </div>
                    )}
                </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 flex flex-col bg-[#efeae2] relative min-w-0">
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.06]"
                    style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}
                />
                
                {activeTicket ? (
                    <>
                        <div className="h-[60px] bg-white border-b border-border-light flex justify-between items-center px-6 relative z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-lg">
                                    {activeTicket.userName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary leading-tight">{activeTicket.userName}</h3>
                                    <p className="text-xs text-text-secondary">Customer Fan</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold text-text-secondary hover:bg-gray-200">
                                    Mark Resolved
                                </button>
                                <button className="text-brand hover:text-brand-dark p-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 relative z-10 space-y-4">
                            <div className="flex justify-center my-4">
                                <span className="bg-white/80 text-text-secondary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    Ticket Opened
                                </span>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-white text-text-primary px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm max-w-[70%]">
                                    {activeTicket.lastMessage}
                                    <div className="text-[10px] text-text-secondary text-right mt-1">{activeTicket.time}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-[#f0f2f5] p-3 relative z-10">
                            {/* Canned Responses Helper */}
                            <div className="flex gap-2 mb-2 px-1 overflow-x-auto hide-scrollbar">
                                <button className="bg-white border border-gray-200 text-text-secondary px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-50 whitespace-nowrap hidden sm:block">
                                    /hours
                                </button>
                                <button className="bg-white border border-gray-200 text-text-secondary px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-50 whitespace-nowrap">
                                    /thanks
                                </button>
                                <button className="bg-white border border-gray-200 text-text-secondary px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-50 whitespace-nowrap">
                                    "Yes, it is available!"
                                </button>
                            </div>
                            <div className="flex items-center gap-2 bg-white rounded-xl overflow-hidden px-2 shadow-sm border border-border-light">
                                <button className="p-2 text-text-secondary hover:text-brand transition-colors"><span className="text-xl">📎</span></button>
                                <input 
                                    type="text" 
                                    className="flex-1 py-3 focus:outline-none placeholder:text-text-secondary text-[15px]" 
                                    placeholder="Reply as the Page..."
                                />
                                <button className="p-2 text-brand hover:text-brand-dark transition-colors font-bold pr-3">
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center px-4">
                        <div className="w-24 h-24 mb-6 rounded-full bg-brand/10 flex items-center justify-center">
                            <svg className="w-12 h-12 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </div>
                        <h2 className="text-2xl font-black text-text-primary mb-2">No Ticket Selected</h2>
                        <p className="text-text-secondary max-w-sm">
                            Select a customer conversation from the left to start offering support as your brand.
                        </p>
                    </div>
                )}
            </div>
            
            {/* Right Information sidebar for CRM Data */}
            {activeTicket && (
                <div className="w-[300px] flex-shrink-0 bg-white border-l border-border-light z-10 hidden xl:flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex flex-col text-center items-center">
                        <div className="w-20 h-20 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-2xl mb-3">
                            {activeTicket.userName.charAt(0)}
                        </div>
                        <h3 className="font-bold text-lg text-text-primary">{activeTicket.userName}</h3>
                        <p className="text-sm text-text-secondary">Loyal Customer</p>
                    </div>
                    
                    <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                        <div>
                            <h4 className="font-bold text-xs text-text-secondary uppercase mb-3 tracking-wider">CRM Tags</h4>
                            <div className="flex gap-2 flex-wrap">
                                <span className={`px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold`}>
                                    VIP
                                </span>
                                <span className={`px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold`}>
                                    Newsletter Subscriber
                                </span>
                                <button className="px-3 py-1 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50">
                                    + Add Tag
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-xs text-text-secondary uppercase mb-3 tracking-wider">Conversation Activity</h4>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-text-primary">First Contact</span>
                                    <span className="font-bold text-text-secondary">
                                        {activeTicket.rawConversation?.createdAt ? new Date(activeTicket.rawConversation.createdAt).toLocaleDateString() : 'Today'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-text-primary">Response Time</span>
                                    <span className="font-bold text-brand">~2 mins</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
