import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

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
    return useQuery({
        queryKey: ['admin-promotions-config'],
        queryFn: async () => {
            const response = await api.get('/promotions');
            const data = response.data;
            return Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        },
    });
}
