import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface PaymentHistory {
    id: number;
    amount: number;
    charges: number;
    total: number;
    formattedAmount: string;
    formattedCharges: string;
    formattedTotal: string;
    reference: string;
    transactionId: string | null;
    status: string;
    gateway: string;
    date: string;
    description: string;
    paidAt?: string | null;
    user?: {
        id: string;
        name: string;
        email: string;
        displayId?: string;
    };
}

export interface ActivePromotion {
    id: number;
    listing_id: string;
    promotion_id: number;
    status: string;
    starts_at: string;
    expires_at: string;
    listing: {
        id: string;
        title: string;
    };
    promotion: {
        id: number;
        type: string;
        duration_days: number;
        price: string;
        priority_weight: number;
    };
}

export interface PaymentHistoryFilters {
    search?: string;
    status?: string;
    expireFromDate?: string;
    expireToDate?: string;
    expiringInDays?: number | '';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export function usePaymentHistory(page: number = 1, filters: PaymentHistoryFilters = {}) {
    return useQuery({
        queryKey: ['payments-history', page, filters],
        queryFn: async () => {
            const params: Record<string, any> = { page };
            if (filters.search) params.search = filters.search;
            if (filters.status) params.status = filters.status;
            if (filters.expireFromDate) params.expireFromDate = filters.expireFromDate;
            if (filters.expireToDate) params.expireToDate = filters.expireToDate;
            if (filters.expiringInDays !== '' && filters.expiringInDays !== undefined) params.expiringInDays = filters.expiringInDays;
            if (filters.sortBy) params.sortBy = filters.sortBy;
            if (filters.sortOrder) params.sortOrder = filters.sortOrder;
            const response = await api.get('/admin/payments/history', { params });
            return response.data;
        },
    });
}

export function useActivePromotions(page: number = 1) {
    return useQuery({
        queryKey: ['active-promotions', page],
        queryFn: async () => {
            const response = await api.get('/admin/promotions/active', { params: { page } });
            return response.data;
        },
    });
}

export function usePaymentDetail(id: number | null) {
    return useQuery({
        queryKey: ['payment-detail', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get(`/admin/payments/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useDownloadReceipt() {
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.get(`/admin/payments/${id}/receipt`, {
                responseType: 'blob',
            });
            return response.data;
        },
    });
}

export function useRequeryPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.post(`/admin/payments/${id}/requery`);
            return response.data;
        },
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: ['payments-history'] });
            queryClient.invalidateQueries({ queryKey: ['payment-detail', id] });
        },
    });
}
