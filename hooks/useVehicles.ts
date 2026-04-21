import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface VehicleMake {
    id: string;
    name: string;
    logo?: string | null;
    status: number;
    models_count?: number;
    created_at: string;
    updated_at: string;
}

export interface VehicleModel {
    id: string;
    vehicle_make_id: string;
    name: string;
    status: number;
    make?: VehicleMake;
    created_at: string;
    updated_at: string;
}

export const useVehicleMakes = (search?: string) => {
    return useQuery({
        queryKey: ['vehicle-makes', search],
        queryFn: async () => {
            const { data } = await api.get('/admin/vehicle/makes', {
                params: { search }
            });
            return data.data;
        },
    });
};

export const useCreateMake = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<VehicleMake>) => {
            const { data: response } = await api.post('/admin/vehicle/makes', data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-makes'] });
        },
    });
};

export const useUpdateMake = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<VehicleMake> & { id: string }) => {
            const { data: response } = await api.put(`/admin/vehicle/makes/${id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-makes'] });
        },
    });
};

export const useDeleteMake = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/admin/vehicle/makes/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-makes'] });
        },
    });
};

export const useVehicleModels = (search?: string) => {
    return useQuery({
        queryKey: ['vehicle-models', search],
        queryFn: async () => {
            const { data } = await api.get('/admin/vehicle/models', {
                params: { search }
            });
            return data.data;
        },
    });
};

export const useCreateModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<VehicleModel>) => {
            const { data: response } = await api.post('/admin/vehicle/models', data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-models'] });
        },
    });
};

export const useUpdateModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<VehicleModel> & { id: string }) => {
            const { data: response } = await api.put(`/admin/vehicle/models/${id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-models'] });
        },
    });
};

export const useDeleteModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/admin/vehicle/models/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-models'] });
        },
    });
};
