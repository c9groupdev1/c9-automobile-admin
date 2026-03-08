import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface KycRequest {
    id: string;
    user_id: string;
    user: {
        name: string;
        email: string;
    };
    status: 'pending' | 'approved' | 'rejected';
    documents: Array<{
        type: string;
        url: string;
    }>;
    comments?: string;
    created_at: string;
}

export function useKycRequests(params?: { status?: string; page?: number }) {
    return useQuery({
        queryKey: ['kyc', params],
        queryFn: async () => {
            const response = await api.get('/admin/kyc', { params });
            return response.data;
        },
    });
}

export function useReviewKyc() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status, comments }: { id: string; status: string; comments: string }) => {
            const response = await api.post(`/admin/kyc/${id}/review`, { status, comments });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kyc'] });
        },
    });
}
