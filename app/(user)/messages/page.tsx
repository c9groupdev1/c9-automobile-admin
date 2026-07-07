'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
    useConversations, 
    useConversationDetail, 
    useSendMessage 
} from '@/hooks/useUserMessaging';
import { useAuthStore } from '@/store/authStore';
import { formatNaira } from '@/app/(public)/page';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
    MessageSquare, 
    Send, 
    Search, 
    User, 
    Car, 
    ArrowLeft, 
    Loader2, 
    Wifi, 
    WifiOff, 
    ShieldCheck,
    AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Laravel Reverb WebSocket connection helper (ported from mobile pusherService.ts)
function subscribeToReverbChannel(
    conversationId: string, 
    token: string, 
    onNewMessage: (msg: any) => void,
    onStatusChange: (status: 'connecting' | 'connected' | 'disconnected' | 'failed') => void
) {
    const apiKey = process.env.NEXT_PUBLIC_REVERB_KEY;
    const host = process.env.NEXT_PUBLIC_REVERB_HOST;

    if (!apiKey || !host) {
        console.error('[Reverb ERROR] NEXT_PUBLIC_REVERB_KEY or NEXT_PUBLIC_REVERB_HOST environment variable is missing!');
        onStatusChange('failed');
        return () => {};
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || 'https://c9x-staging.thec9group.com';
    const wsUrl = `wss://${host}/reverb/app/${apiKey}`;
    const authEndpoint = `${apiBase}/broadcasting/auth`;

    let ws: WebSocket | null = null;
    let pingInterval: NodeJS.Timeout | null = null;
    let isClosedManually = false;

    try {
        onStatusChange('connecting');
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('[Reverb] Connection opened');
        };

        ws.onmessage = async (event) => {
            try {
                const payload = JSON.parse(event.data);
                
                // Connection established -> Auth private channel
                if (payload.event === 'pusher:connection_established') {
                    const connData = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
                    const socketId = connData.socket_id;
                    onStatusChange('connected');

                    const privateChannel = `private-conversation.${conversationId}`;
                    const params = new URLSearchParams();
                    params.append('socket_id', socketId);
                    params.append('channel_name', privateChannel);

                    // Auth with token
                    try {
                        const authResponse = await axios.post(authEndpoint, params.toString(), {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                Accept: 'application/json',
                                'Content-Type': 'application/x-www-form-urlencoded',
                            }
                        });

                        // Subscribe to channels
                        const publicChannel = `conversation.${conversationId}`;
                        
                        ws?.send(JSON.stringify({
                            event: 'pusher:subscribe',
                            data: { channel: publicChannel }
                        }));

                        ws?.send(JSON.stringify({
                            event: 'pusher:subscribe',
                            data: {
                                channel: privateChannel,
                                auth: authResponse.data.auth
                            }
                        }));

                        // Ping interval to keep alive
                        const timeout = (connData.activity_timeout || 30) * 1000;
                        const pingPeriod = Math.max(timeout - 5000, 5000);
                        if (pingInterval) clearInterval(pingInterval);
                        pingInterval = setInterval(() => {
                            if (ws && ws.readyState === WebSocket.OPEN) {
                                ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
                            }
                        }, pingPeriod);

                    } catch (authErr) {
                        onStatusChange('failed');
                        ws?.close();
                    }
                } 
                else if (payload.event === 'pusher:ping') {
                    ws?.send(JSON.stringify({ event: 'pusher:pong', data: {} }));
                }
                else if (payload.event === 'pusher_internal:subscription_succeeded') {
                    console.log('[Reverb] Subscribed to:', payload.channel);
                }
                else if (payload.event === 'pusher:error') {
                    onStatusChange('failed');
                }
                // Handle chat message event
                else if (
                    payload.channel === `conversation.${conversationId}` ||
                    payload.channel === `private-conversation.${conversationId}`
                ) {
                    try {
                        const parsedData = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
                        const msg = parsedData.message || parsedData;
                        if (msg && msg.id && String(msg.conversation_id) === String(conversationId)) {
                            onNewMessage(msg);
                        }
                    } catch (e) {}
                }
            } catch (e) {}
        };

        ws.onerror = () => {
            onStatusChange('failed');
        };

        ws.onclose = () => {
            if (pingInterval) clearInterval(pingInterval);
            if (!isClosedManually) {
                onStatusChange('disconnected');
            }
        };

    } catch (e) {
        onStatusChange('failed');
    }

    return () => {
        isClosedManually = true;
        if (pingInterval) clearInterval(pingInterval);
        if (ws) {
            ws.close();
            ws = null;
        }
    };
}

function MessagesDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const { user, token } = useAuthStore();
    
    // Conversation selection states
    const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('id'));
    const [searchQuery, setSearchQuery] = useState('');
    const [messageText, setMessageText] = useState('');
    const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'failed' | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    // Queries
    const { data: convData, isLoading: isLoadingConvs, refetch: refetchConvs } = useConversations();
    const { data: activeConvResponse, isLoading: isLoadingMsgs } = useConversationDetail(selectedId || '');
    const activeConversation = activeConvResponse?.data || activeConvResponse;

    // Send mutation
    const sendMessageMutation = useSendMessage();
    const conversations = convData?.data || [];

    // Messages are embedded inside the conversation object
    const messages = Array.isArray(activeConversation?.messages) 
        ? activeConversation.messages 
        : activeConversation?.messages?.data || [];

    // Smart Auto-complete & Reply Logic
    const AUTO_COMPLETE_MAP: Record<string, string[]> = {
        'Is it': ['still available?', 'taxed?', 'registered?', 'negotiable?'],
        'What is': ['the lowest price?', 'the mileage?', 'the condition?', 'the reason for sale?'],
        'Can I': ['inspect it?', 'pay in installments?', 'bring a mechanic?', 'test drive?'],
        'Where': ['is the location?', 'can we meet?', 'is the car parked?'],
        'How': ['much is the last price?', 'long have you had it?', 'many keys?'],
        'I am': ['interested in this car.', 'ready to buy.', 'on my way.', 'stuck in traffic.'],
        'The': ['price is okay.', 'location is far.', 'condition looks good.'],
        'Does it': ['have any issues?', 'have a service history?', 'come with a spare tire?'],
    };

    const CONTEXT_REPLIES: Record<string, string[]> = {
        'price': ['Can we do a bit lower?', 'I can offer ₦', 'That works for me.'],
        'location': ['See you there.', 'Send the address.', 'I am nearby.'],
        'available': ['Yes, I am interested.', 'When can I see it?', 'What is the location?'],
        'hi': ['Hello, I am interested in this car.', 'Hi, is this available?'],
    };

    useEffect(() => {
        if (!activeConversation) return;
        const trimmed = messageText.trim();
        const lastSellerMsg = [...messages].reverse().find((m: any) => m.sender_id !== user?.id)?.message?.toLowerCase() || '';

        let newSuggestions: string[] = [];

        if (trimmed.length > 1) {
            const matchKey = Object.keys(AUTO_COMPLETE_MAP).find(key =>
                trimmed.toLowerCase().startsWith(key.toLowerCase())
            );
            if (matchKey) {
                newSuggestions = AUTO_COMPLETE_MAP[matchKey].filter(s =>
                    !(trimmed.toLowerCase().includes(s.toLowerCase()))
                );
            }
        } else if (lastSellerMsg) {
            if (lastSellerMsg.includes('price') || lastSellerMsg.includes('amount')) {
                newSuggestions = CONTEXT_REPLIES['price'];
            } else if (lastSellerMsg.includes('where') || lastSellerMsg.includes('location') || lastSellerMsg.includes('address')) {
                newSuggestions = CONTEXT_REPLIES['location'];
            } else if (lastSellerMsg.includes('available') || lastSellerMsg.includes('still')) {
                newSuggestions = CONTEXT_REPLIES['available'];
            } else {
                newSuggestions = CONTEXT_REPLIES['hi'];
            }
        }

        setSuggestions(newSuggestions.slice(0, 3));
    }, [messageText, messages, activeConversation, user?.id]);

    // Debug activeConversation payload in browser console
    useEffect(() => {
        if (activeConversation) {
            console.log('[DEBUG] activeConversation payload keys:', Object.keys(activeConversation));
            console.log('[DEBUG] activeConversation details:', activeConversation);
            if (activeConversation.messages) {
                console.log('[DEBUG] Embedded messages found:', activeConversation.messages);
            }
        }
    }, [activeConversation]);
    
    // Scroll ref for chat window auto-scroll to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when messages load/change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // WebSocket sync hook for active conversation
    useEffect(() => {
        if (!selectedId || !token) return;

        const unsubscribe = subscribeToReverbChannel(
            selectedId,
            token,
            (newMsg) => {
                // Instantly append new message into React Query cache
                queryClient.setQueryData(['conversation-detail', selectedId], (oldData: any) => {
                    if (!oldData || !oldData.data) return oldData;
                    
                    const dataCopy = { ...oldData };
                    const convData = { ...dataCopy.data };
                    
                    let messagesList: any[] = [];
                    let isNested = false;
                    
                    if (Array.isArray(convData.messages)) {
                        messagesList = [...convData.messages];
                    } else if (convData.messages?.data) {
                        messagesList = [...convData.messages.data];
                        isNested = true;
                    }
                    
                    // Check duplicate
                    if (!messagesList.find((m: any) => String(m.id) === String(newMsg.id))) {
                        messagesList.push(newMsg);
                    }
                    
                    if (isNested) {
                        convData.messages = { ...convData.messages, data: messagesList };
                    } else {
                        convData.messages = messagesList;
                    }
                    
                    dataCopy.data = convData;
                    return dataCopy;
                });
                
                // Refresh threads preview
                refetchConvs();
            },
            (status) => {
                setWsStatus(status);
            }
        );

        return () => {
            unsubscribe();
            setWsStatus(null);
        };
    }, [selectedId, token, queryClient]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedId) return;

        const text = messageText.trim();
        setMessageText('');

        try {
            await sendMessageMutation.mutateAsync({
                conversationId: selectedId,
                message: text
            });
        } catch (error) {}
    };

    const getRelativeTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const diff = Date.now() - date.getTime();
        if (diff < 24 * 60 * 60 * 1000) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const filteredConversations = conversations.filter((item: any) => {
        const partner = item.sender?.id === user?.id ? item.receiver : item.sender;
        const partnerName = partner?.name || 'Unknown User';
        const listingTitle = item.listing?.title || 'Unknown Listing';
        return partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               listingTitle.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="bg-white border-y border-x-0 lg:border-x border-slate-100 rounded-none lg:rounded-[2rem] shadow-sm lg:shadow-md overflow-hidden flex-1 grid lg:grid-cols-[320px_1fr] relative min-h-0">
            {/* Sidebar thread lists */}
            <div className={`border-r border-slate-100 flex flex-col h-full min-h-0 ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
                {/* Search Bar */}
                <div className="p-4 border-b border-slate-100 space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Inbox</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search chats, cars..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-11 text-xs font-semibold rounded-xl bg-slate-50 border-slate-50/50"
                        />
                    </div>
                </div>

                {/* List Container */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-50/50 min-h-0">
                    {isLoadingConvs ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-[#003399]" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Loading threads...</span>
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="text-center py-20 px-4 space-y-2">
                            <MessageSquare className="mx-auto h-8 w-8 text-slate-350" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">No Messages</p>
                            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Select a vehicle to contact the seller.</p>
                        </div>
                    ) : (
                        filteredConversations.map((item: any) => {
                            const partner = item.sender?.id === user?.id ? item.receiver : item.sender;
                            const partnerName = partner?.name || 'Unknown User';
                            const listingTitle = item.listing?.title || 'Deleted Listing';
                            const isSelected = selectedId === item.id;
                            const isUnread = item.last_message?.read_at === null && item.last_message?.sender_id !== user?.id;

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedId(item.id)}
                                    className={`p-4 cursor-pointer hover:bg-slate-50/50 transition-colors flex gap-3 relative items-start ${
                                        isSelected ? 'bg-slate-50/50' : ''
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003399] flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {partnerName.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                            <h4 className="font-bold text-slate-900 text-xs truncate pr-4">{partnerName}</h4>
                                            <span className="text-[9px] font-bold text-slate-400 flex-shrink-0">
                                                {getRelativeTime(item.last_message_at)}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-bold text-[#003399] truncate mb-1">{listingTitle}</p>
                                        <p className={`text-xs truncate ${isUnread ? 'font-bold text-slate-950' : 'text-slate-500 font-medium'}`}>
                                            {item.last_message?.sender_id === user?.id ? 'You: ' : ''}
                                            {item.last_message?.message}
                                        </p>
                                    </div>
                                    {isUnread && (
                                        <span className="absolute right-4 bottom-5 w-2 h-2 rounded-full bg-[#003399]" />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Message Panel Console */}
            <div className={`flex flex-col h-full min-h-0 ${!selectedId ? 'hidden lg:flex' : 'flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Conversation Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="lg:hidden p-1 text-slate-500 hover:text-slate-800"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003399] flex items-center justify-center font-bold text-sm">
                                    {(activeConversation.sender?.id === user?.id ? activeConversation.receiver : activeConversation.sender)?.name?.charAt(0)}
                                </div>

                                <div>
                                    <div className="flex items-center gap-1">
                                        <h4 className="font-bold text-slate-950 text-xs">
                                            {(activeConversation.sender?.id === user?.id ? activeConversation.receiver : activeConversation.sender)?.name}
                                        </h4>
                                        {wsStatus === 'connected' ? (
                                            <span title="Connected to Reverb Live Link">
                                                <Wifi size={12} className="text-emerald-500" />
                                            </span>
                                        ) : (
                                            <span title="WS disconnected. Retrying sync...">
                                                <WifiOff size={12} className="text-amber-500" />
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate max-w-[130px] sm:max-w-[200px]">
                                        Listing: {activeConversation.listing?.title}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0 ml-auto">
                                <span className="text-xs font-black text-[#003399] block">{formatNaira(activeConversation.listing?.amount)}</span>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/20 min-h-0">
                            {/* Safety Notice */}
                            <div className="bg-slate-100 rounded-2xl p-4 md:p-5 mb-6 text-center max-w-lg mx-auto">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <ShieldCheck className="w-5 h-5 text-slate-600" />
                                    <h4 className="font-bold text-slate-800 text-sm">Trade Safety Notice</h4>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    C9X facilitates communication. Final vehicle inspection, negotiation, and payment happen offline. Never pay before inspection and always verify the vehicle's VIN before proceeding.
                                </p>
                            </div>

                            {/* Reported Content Warning */}
                            {(activeConversation?.is_reported || activeConversation?.listing?.is_reported) && (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 mb-6 flex items-start gap-3">
                                    <AlertCircle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-amber-900 text-sm mb-1">Safety Warning</h4>
                                        <p className="text-xs text-amber-800 leading-relaxed">
                                            This {activeConversation?.is_reported ? 'conversation' : 'listing'} has been reported for violating our community guidelines. Please proceed with extreme caution and do not share personal information or make payments.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {isLoadingMsgs && !activeConversation?.messages ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="h-6 w-6 animate-spin text-[#003399]" />
                                </div>
                            ) : (
                                messages.map((msg: any) => {
                                    const isMe = msg.sender_id === user?.id;
                                    return (
                                        <div 
                                            key={msg.id} 
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs font-semibold shadow-sm leading-relaxed ${
                                                isMe 
                                                    ? 'bg-[#003399] text-white rounded-tr-none' 
                                                    : 'bg-white text-slate-800 border border-slate-100/50 rounded-tl-none'
                                            }`}>
                                                <p>{msg.message}</p>
                                                <span className={`text-[9px] font-medium block mt-1 text-right ${
                                                    isMe ? 'text-blue-200' : 'text-slate-400'
                                                }`}>
                                                    {getRelativeTime(msg.created_at || msg.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Auto-complete & Quick Action Chips */}
                        <div className="bg-slate-50/20 px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                            {suggestions.length > 0 ? (
                                suggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                            if (messageText.trim().length > 1) {
                                                const matchKey = Object.keys(AUTO_COMPLETE_MAP).find(key =>
                                                    messageText.trim().toLowerCase().startsWith(key.toLowerCase())
                                                );
                                                if (matchKey) {
                                                    setMessageText(messageText.trim() + ' ' + suggestion);
                                                } else {
                                                    setMessageText(suggestion);
                                                }
                                            } else {
                                                setMessageText(suggestion);
                                            }
                                        }}
                                        className="whitespace-nowrap bg-white hover:bg-blue-50 text-[#003399] border border-blue-100 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
                                    >
                                        {suggestion}
                                    </button>
                                ))
                            ) : (
                                !messages.length && activeConversation?.listing?.title && (
                                    <button
                                        type="button"
                                        onClick={() => setMessageText(`Hi, is the ${activeConversation.listing.title} still available?`)}
                                        className="whitespace-nowrap bg-white hover:bg-blue-50 text-[#003399] border border-blue-100 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
                                    >
                                        👋 Is it available?
                                    </button>
                                )
                            )}
                        </div>

                        {/* Text Input Panel */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex items-center gap-3">
                            <Input
                                placeholder="Type your message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                className="flex-1 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-100 font-semibold"
                            />
                            <Button
                                type="submit"
                                disabled={!messageText.trim() || sendMessageMutation.isPending}
                                className="h-12 w-12 bg-[#003399] hover:bg-blue-800 text-white rounded-xl flex items-center justify-center p-0"
                            >
                                <Send size={18} />
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3">
                        <div className="p-4 bg-blue-50 text-[#003399] rounded-3xl">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Select a thread</h3>
                        <p className="text-slate-500 font-semibold text-xs max-w-xs leading-relaxed">
                            Click on a conversation list preview on the left panel to display active chats or initialize negotiations.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MessagesDashboardPage() {
    return (
        <div className="w-auto flex flex-col h-[calc(100dvh-64px)] lg:h-[calc(100vh-140px)] -m-5 md:-m-8 lg:m-0">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center flex-1">
                    <Loader2 className="h-8 w-8 animate-spin text-[#003399] mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading Inbox...</p>
                </div>
            }>
                <MessagesDashboardContent />
            </Suspense>
        </div>
    );
}
