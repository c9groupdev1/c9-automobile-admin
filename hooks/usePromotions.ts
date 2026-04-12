import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Promotion {
    id: number;
    type: string;
    duration_days: number;
    price: string;
    priority_weight: number;
    created_at: string;
    updated_at: string;
    is_available: boolean;
}

export function usePromotions() {
    const queryClient = useQueryClient();

    const promotionsQuery = useQuery({
        queryKey: ['admin-promotions-config'],
        queryFn: async () => {
            const response = await api.get('/admin/promotions');
            const data = response.data;
            return Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        },
    });

    const createPromotion = useMutation({
        mutationFn: async (data: Partial<Promotion>) => {
            const response = await api.post('/admin/promotions', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-promotions-config'] });
            toast.success('Package Integrated', {
                description: 'New promotional tier has been successfully deployed.'
            });
        },
        onError: (error: any) => {
            toast.error('Deployment Failed', {
                description: error.response?.data?.message || 'Package registry error.'
            });
        }
    });

    const updatePromotion = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<Promotion> }) => {
            const response = await api.put(`/admin/promotions/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-promotions-config'] });
            toast.success('Package Modified', {
                description: 'Promotional tier parameters have been updated.'
            });
        },
        onError: (error: any) => {
            toast.error('Modification Rejected', {
                description: error.response?.data?.message || 'Validation logic failure.'
            });
        }
    });

    return {
        ...promotionsQuery,
        createPromotion,
        updatePromotion
    };
}
