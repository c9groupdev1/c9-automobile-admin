import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface User {
    id: string;
    name: string;
    email: string;
    kycStatus: string;
    roles: string[];
    lastLoginAt: string | null;
    createdAt: string;
}

export function useUsers(params?: { page?: number; search?: string; status?: string }) {
    return useQuery({
        queryKey: ['users', params],
        queryFn: async () => {
            const response = await api.get('/admin/users/index', { params });
            return response.data; // Expecting { data: User[], meta: { current_page, last_page, total } }
        },
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { name: string; email: string; role: string }) => {
            const response = await api.post('/admin/users/store', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

export function useUpdateUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const response = await api.post(`/admin/users/${id}/status`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}
