import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export type PlanStatus = 'active' | 'inactive';

export interface Plan {
    id: number;
    name: string;
    monthly_price: string | number;
    listing_limit: number;
    duration_days: number;
    featured_ads_limit: number;
    boosted_ads_limit: number;
    has_verified_badge: boolean;
    level: number;
    status: PlanStatus;
    created_at?: string;
    updated_at?: string;
}

export interface PlanPayload {
    name: string;
    monthly_price: number;
    listing_limit: number;
    level: number;
    duration_days: number;
    featured_ads_limit: number;
    boosted_ads_limit: number;
    has_verified_badge: boolean;
    status?: PlanStatus;
}

export function usePlans(statusFilter: PlanStatus | 'all' = 'all') {
    const queryClient = useQueryClient();

    const plansQuery = useQuery<Plan[]>({
        queryKey: ['admin-plans', statusFilter],
        queryFn: async () => {
            const params = statusFilter !== 'all' ? { status: statusFilter } : undefined;
            const response = await api.get('/admin/plans', { params });
            const data = response.data;
            return Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        },
    });

    const createPlan = useMutation({
        mutationFn: async (data: PlanPayload) => {
            const response = await api.post('/admin/plans', data);
            return response.data;
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
            toast.success('Plan Created', {
                description: res?.message || 'New subscription tier has been created successfully.'
            });
        },
        onError: (error: any) => {
            toast.error('Creation Failed', {
                description: error.response?.data?.message || 'Failed to create subscription plan.'
            });
        }
    });

    const updatePlan = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<PlanPayload> }) => {
            const response = await api.put(`/admin/plans/${id}`, data);
            return response.data;
        },
        onSuccess: (res, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
            queryClient.invalidateQueries({ queryKey: ['admin-plan', variables.id] });
            toast.success('Plan Updated', {
                description: res?.message || 'Plan updated successfully.'
            });
        },
        onError: (error: any) => {
            toast.error('Update Failed', {
                description: error.response?.data?.message || 'Failed to update subscription plan.'
            });
        }
    });

    const updatePlanStatus = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: PlanStatus }) => {
            const response = await api.patch(`/admin/plans/${id}/status`, { status });
            return response.data;
        },
        onSuccess: (res, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
            queryClient.invalidateQueries({ queryKey: ['admin-plan', variables.id] });
            toast.success(variables.status === 'active' ? 'Plan Enabled' : 'Plan Disabled', {
                description: res?.message || `Plan ${variables.status === 'active' ? 'enabled' : 'disabled'} successfully.`
            });
        },
        onError: (error: any) => {
            toast.error('Status Update Failed', {
                description: error.response?.data?.message || 'Failed to update plan status.'
            });
        }
    });

    return {
        ...plansQuery,
        createPlan,
        updatePlan,
        updatePlanStatus
    };
}

export function usePlan(id?: number) {
    return useQuery<Plan | null>({
        queryKey: ['admin-plan', id],
        enabled: typeof id === 'number' && id > 0,
        queryFn: async () => {
            const response = await api.get(`/admin/plans/${id}`);
            return response.data?.data ?? response.data ?? null;
        },
    });
}
