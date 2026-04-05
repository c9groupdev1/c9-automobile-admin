import { useQuery } from '@tanstack/react-query';
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
    user?: {
        id: string;
        name: string;
        email: string;
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

export function usePaymentHistory(page: number = 1) {
    return useQuery({
        queryKey: ['payments-history', page],
        queryFn: async () => {
            const response = await api.get('/admin/payments/history', { params: { page } });
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
