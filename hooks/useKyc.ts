import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface KycRequest {
    id: number;
    status: string;
    type: string;
    submittedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        memberSince: string;
    };
    verificationDetails: {
        phoneNumber: string;
        selfiePicture: string;
        individualInfo?: {
            address: string;
            idType: string;
            idNumber: string;
            idImage: string;
        };
        businessInfo?: {
            businessName: string;
            businessAddress: string;
            rcNumber: string;
            rcCertificate: string;
        };
    };
    reviewInfo?: {
        vettedBy: string | null;
        comments: string | null;
        updatedAt: string | null;
    };
}

export type KycDetail = KycRequest;

export interface KycResponse {
    success: boolean;
    data: {
        current_page: number;
        data: KycRequest[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: Array<{ url: string | null; label: string; active: boolean }>;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
    message: string;
}


export function useKycRequests(params?: { status?: string; page?: number }) {
    return useQuery({
        queryKey: ['kyc', params],
        queryFn: async () => {
            const response = await api.get<KycResponse>('/admin/kyc', { params });
            return response.data;
        },
    });
}

export function useKycRequest(id: string | number) {
    return useQuery({
        queryKey: ['kyc-request', id],
        queryFn: async () => {
            const response = await api.get<{ success: boolean; data: KycDetail; message: string }>(`/admin/kyc/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useReviewKyc() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status, comments }: { id: string | number; status: string; comments: string }) => {
            const response = await api.post<{ success: boolean; data: any; message: string }>(`/admin/kyc/${id}/review`, { status, comments });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['kyc'] });
            queryClient.invalidateQueries({ queryKey: ['kyc-request', variables.id] });
        },
    });
}
