import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Listing {
    id: string;
    listing_type_id: string | number;
    title: string;
    description: string;
    amount: string | number;
    status: 'available' | 'sold' | 'pending' | 'rejected';
    is_negotiable: string | number | boolean;
    is_c9_collection?: boolean;
    created_at: string;
    updated_at: string;
    car?: {
        id: number | string;
        make: string;
        model: string;
        year: string | number;
        transmission: string;
        fuel_type: string;
        mileage: number | string;
        custom_duty?: number | string;
    };
    media?: Array<{
        id: number | string;
        path: string;
        is_primary: number | boolean;
    }>;
}

export function useListings(params?: { page?: number; search?: string }) {
    return useQuery({
        queryKey: ['listings', params],
        queryFn: async () => {
            const response = await api.get('/admin/listings', { params });
            return response.data;
        },
    });
}

export function useCreateListing() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: FormData) => {
            const response = await api.post('/user/listings', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
        },
    });
}

export function useDeleteListing() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/admin/listings/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
        },
    });
}
