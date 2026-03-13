import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface KycRequest {
    id: string | number;
    user_id: string;
    type: 'individual' | 'business';
    business_name: string | null;
    business_address: string | null;
    address: string;
    phone_number: string;
    rc_number: string | null;
    rc_certificate: string | null;
    means_of_identity_type: string;
    id_number: string;
    means_of_identity: string;
    selfie_picture: string;
    vetted_by: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'vetted';
    comments: string | null;
    created_at: string;
    updated_at: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
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
        mutationFn: async ({ id, status, comments }: { id: string | number; status: string; comments: string }) => {
            const response = await api.post(`/admin/kyc/${id}/review`, { status, comments });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kyc'] });
        },
    });
}
