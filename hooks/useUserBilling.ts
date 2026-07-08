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
