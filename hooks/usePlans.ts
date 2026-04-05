import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

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
    return useQuery({
        queryKey: ['admin-plans'],
        queryFn: async () => {
            const response = await api.get('/plans');
            const data = response.data;
            return Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        },
    });
}
