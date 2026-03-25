import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Role {
    id: string;
    name: string;
    permissions_count: number;
    permissions?: string[];
}

export interface Permission {
    id: string;
    name: string;
}

export function useRoles() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await api.get('/admin/roles');
            return response.data;
        },
    });
}

export function usePermissions() {
    return useQuery({
        queryKey: ['permissions'],
        queryFn: async () => {
            const response = await api.get('/admin/permissions');
            return response.data;
        },
    });
}

export function useAssignPermissions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ roleId, permissions }: { roleId: string; permissions: string[] }) => {
            await api.post(`/admin/roles/${roleId}/permissions`, { permissions });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    });
}

export function useCreateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (name: string) => {
            const response = await api.post('/admin/roles', { name });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    });
}

export function useCreatePermission() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (name: string) => {
            const response = await api.post('/admin/permissions', { name });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['permissions'] });
        },
    });
}
