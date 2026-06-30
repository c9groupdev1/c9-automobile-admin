import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export function useConversations() {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const response = await api.get('/chat/conversations');
            return response.data;
        },
    });
}

export function useConversationDetail(conversationId: string) {
    return useQuery({
        queryKey: ['conversation-detail', conversationId],
        queryFn: async () => {
            if (!conversationId) return null;
            const response = await api.get(`/chat/conversations/${conversationId}`);
            return response.data;
        },
        enabled: !!conversationId,
    });
}

export function useChatMessages(conversationId: string) {
    return useQuery({
        queryKey: ['chat-messages', conversationId],
        queryFn: async () => {
            if (!conversationId) return null;
            const response = await api.get(`/chat/conversations/${conversationId}/messages`);
            return response.data;
        },
        enabled: !!conversationId,
    });
}

export function useSendMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ conversationId, message }: { conversationId: string; message: string }) => {
            const response = await api.post(`/chat/conversations/${conversationId}/messages`, { message });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.conversationId] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
        onError: (error: any) => {
            toast.error('Send Failed', {
                description: error.response?.data?.message || 'Could not deliver your message.'
            });
        }
    });
}

export function useStartConversation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ listingId, message }: { listingId: string; message: string }) => {
            const response = await api.post('/chat/conversations', { listingId, message });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
        onError: (error: any) => {
            toast.error('Action Failed', {
                description: error.response?.data?.message || 'Could not start conversation.'
            });
        }
    });
}
