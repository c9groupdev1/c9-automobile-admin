import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Plan {
    id: number;
    name: string;
    monthly_price: string;
    listing_limit: number;
    duration_days: number;
    featured_ads_limit: number;
    boosted_ads_limit: number;
    has_verified_badge: boolean;
    level: number;
    created_at: string;
    updated_at: string;
}

export function usePlans() {
    const queryClient = useQueryClient();

    const plansQuery = useQuery({
        queryKey: ['admin-plans'],
        queryFn: async () => {
            const response = await api.get('/admin/plans');
            const data = response.data;
            return Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        },
    });

    const createPlan = useMutation({
        mutationFn: async (data: Partial<Plan>) => {
            const response = await api.post('/admin/plans', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
            toast.success('Protocol Initialized', {
                description: 'New subscription tier has been integrated into the ecosystem.'
            });
        },
        onError: (error: any) => {
            toast.error('Initialization Failed', {
                description: error.response?.data?.message || 'Verification protocol error.'
            });
        }
    });

    const updatePlan = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Plan> }) => {
            const response = await api.put(`/admin/plans/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
            toast.success('Protocol Modified', {
                description: 'Subscription tier parameters have been successfully updated.'
            });
        },
        onError: (error: any) => {
            toast.error('Modification Failed', {
                description: error.response?.data?.message || 'Validation logic rejected the updates.'
            });
        }
    });

    return {
        ...plansQuery,
        createPlan,
        updatePlan
    };
}
