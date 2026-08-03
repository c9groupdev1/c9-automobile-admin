import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface BillingPlan {
    id: number;
    name: string;
    monthly_price: string;
    listing_limit: number;
    duration_days: number;
    featured_ads_limit: number;
    boosted_ads_limit: number;
    has_verified_badge: boolean;
    level: number;
}

export function useBillingPlans() {
    return useQuery({
        queryKey: ['billing-plans'],
        queryFn: async () => {
            const response = await api.get<{ success: boolean; data: BillingPlan[] }>('/plans');
            const data = response.data.data;
            return Array.isArray(data) ? data : [];
        },
    });
}

export function usePromotions() {
    return useQuery({
        queryKey: ['promotions'],
        queryFn: async () => {
            const response = await api.get<{ success: boolean; data: any[] }>('/promotions');
            return response.data.data;
        },
    });
}

export function useSubscribeToPlan() {
    return useMutation({
        mutationFn: async (planId: number | string) => {
            const callback_url = typeof window !== 'undefined' ? `${window.location.origin}/account/verify` : undefined;
            const response = await api.post('/user/subscribe', { plan_id: planId, callback_url });
            return response.data;
        },
        onSuccess: (data) => {
            if (data?.data?.authorization_url) {
                window.location.href = data.data.authorization_url;
            } else {
                toast.success('Subscription Initiated', {
                    description: 'Your fiscal transition is being processed.'
                });
            }
        },
        onError: (error: any) => {
            toast.error('Subscription Failed', {
                description: error.response?.data?.message || 'Fiscal protocol validation error.'
            });
        }
    });
}

export function useVerifyPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (reference: string) => {
            const response = await api.get(`/user/payments/verify/${reference}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            queryClient.invalidateQueries({ queryKey: ['billing-plans'] });
            toast.success('Payment Verified', {
                description: 'Fiscal transaction has been successfully validated.'
            });
        },
        onError: (error: any) => {
            toast.error('Verification Failed', {
                description: error.response?.data?.message || 'Transaction integrity check failed.'
            });
        }
    });
}

export function usePurchaseBadge() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const callback_url = typeof window !== 'undefined' ? `${window.location.origin}/account/verify` : undefined;
            const response = await api.post('/user/purchase-badge', { callback_url });
            return response.data;
        },
        onSuccess: (data) => {
            if (data?.data?.authorization_url) {
                window.location.href = data.data.authorization_url;
            } else {
                toast.success('Badge Acquisition Initiated', {
                    description: 'The verification badge protocol has been started.'
                });
            }
        },
        onError: (error: any) => {
            toast.error('Acquisition Failed', {
                description: error.response?.data?.message || 'Verification badge logic error.'
            });
        }
    });
}

export function usePromoteListing() {
    return useMutation({
        mutationFn: async ({ listingId, promotionId }: { listingId: string; promotionId: string }) => {
            const callback_url = typeof window !== 'undefined' ? `${window.location.origin}/account/verify` : undefined;
            const response = await api.post(`/user/listings/${listingId}/promote`, { promotion_id: promotionId, callback_url });
            return response.data;
        },
        onSuccess: (data) => {
            if (data?.data?.authorization_url) {
                window.location.href = data.data.authorization_url;
            } else {
                toast.success('Promotion Initiated', {
                    description: 'The listing promotion sequence has been started.'
                });
            }
        },
        onError: (error: any) => {
            toast.error('Promotion Failed', {
                description: error.response?.data?.message || 'Promotion logic error.'
            });
        }
    });
}

export interface PaymentRecord {
    id: number | string;
    amount: string;
    formattedAmount: string;
    reference: string;
    transactionId: string;
    status: string;
    gateway: string;
    date: string;
    description: string;
}

export interface PaymentHistoryParams {
    page?: number;
    perPage?: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
}

export function usePaymentHistory(params: PaymentHistoryParams = {}) {
    const { page = 1, perPage, status, fromDate, toDate } = params;
    return useQuery({
        queryKey: ['payment-history', page, perPage, status, fromDate, toDate],
        queryFn: async () => {
            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            if (perPage) queryParams.append('perPage', perPage.toString());
            if (status && status !== 'all') queryParams.append('status', status);
            if (fromDate) queryParams.append('fromDate', fromDate);
            if (toDate) queryParams.append('toDate', toDate);

            const response = await api.get<{
                success: boolean;
                data: PaymentRecord[];
                meta: {
                    current_page: number;
                    last_page: number;
                    per_page: number;
                    total: number;
                    from?: number;
                    to?: number;
                };
            }>(`/user/payments?${queryParams.toString()}`);
            return response.data;
        },
    });
}

export function usePaymentDetails(id: string | number | null) {
    return useQuery({
        queryKey: ['payment-details', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get<{
                success: boolean;
                data: PaymentRecord & {
                    charges: number | string;
                    total: number | string;
                    formattedCharges: string;
                    formattedTotal: string;
                    paidAt: string | null;
                };
            }>(`/user/payments/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });
}
