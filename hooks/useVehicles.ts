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

export const useVehicleModelsByMake = (makeId?: string | number) => {
    return useQuery({
        queryKey: ['vehicle-models-by-make', makeId],
        queryFn: async () => {
            if (!makeId) return [];
            const { data } = await api.get(`/vehicle/makes/${makeId}/models`);
            return data?.data?.data || data?.data || [];
        },
        enabled: !!makeId,
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

export interface VehicleTrim {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface VehicleEngineType {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const useVehicleTrims = (search?: string) => {
    return useQuery({
        queryKey: ['vehicle-trims', search],
        queryFn: async () => {
            const { data } = await api.get('/admin/vehicle/trims', {
                params: { search }
            });
            // Try to extract array gracefully
            return data?.data?.data || data?.data || [];
        },
    });
};

export const useCreateTrim = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<VehicleTrim>) => {
            const { data: response } = await api.post('/admin/vehicle/trims', data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-trims'] });
        },
    });
};

export const useUpdateTrim = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<VehicleTrim> & { id: string }) => {
            const { data: response } = await api.put(`/admin/vehicle/trims/${id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-trims'] });
        },
    });
};

export const useDeleteTrim = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/admin/vehicle/trims/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-trims'] });
        },
    });
};

export const useVehicleEngineTypes = (search?: string) => {
    return useQuery({
        queryKey: ['vehicle-engine-types', search],
        queryFn: async () => {
            const { data } = await api.get('/admin/vehicle/engine-types', {
                params: { search }
            });
            // Try to extract array gracefully
            return data?.data?.data || data?.data || [];
        },
    });
};

export const useCreateEngineType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<VehicleEngineType>) => {
            const { data: response } = await api.post('/admin/vehicle/engine-types', data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-engine-types'] });
        },
    });
};

export const useUpdateEngineType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<VehicleEngineType> & { id: string }) => {
            const { data: response } = await api.put(`/admin/vehicle/engine-types/${id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-engine-types'] });
        },
    });
};

export const useDeleteEngineType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/admin/vehicle/engine-types/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-engine-types'] });
        },
    });
};

export interface VehicleFeature {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface VehicleFuelType {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const useVehicleFeatures = (search?: string) => {
    return useQuery({
        queryKey: ['vehicle-features', search],
        queryFn: async () => {
            const { data } = await api.get('/admin/vehicle/features', {
                params: { search }
            });
            return data?.data?.data || data?.data || [];
        },
    });
};

export const useCreateFeature = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<VehicleFeature>) => {
            const { data: response } = await api.post('/admin/vehicle/features', data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-features'] });
        },
    });
};

export const useUpdateFeature = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<VehicleFeature> & { id: string }) => {
            const { data: response } = await api.put(`/admin/vehicle/features/${id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-features'] });
        },
    });
};

export const useDeleteFeature = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/admin/vehicle/features/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-features'] });
        },
    });
};

export const useVehicleFuelTypes = (search?: string) => {
    return useQuery({
        queryKey: ['vehicle-fuel-types', search],
        queryFn: async () => {
            const { data } = await api.get('/admin/vehicle/fuel-types', {
                params: { search }
            });
            return data?.data?.data || data?.data || [];
        },
    });
};

export const useCreateFuelType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<VehicleFuelType>) => {
            const { data: response } = await api.post('/admin/vehicle/fuel-types', data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-fuel-types'] });
        },
    });
};

export const useUpdateFuelType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<VehicleFuelType> & { id: string }) => {
            const { data: response } = await api.put(`/admin/vehicle/fuel-types/${id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-fuel-types'] });
        },
    });
};

export const useDeleteFuelType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/admin/vehicle/fuel-types/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-fuel-types'] });
        },
    });
};

export interface VehicleTransmission {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const useVehicleTransmissions = (search?: string) => {
    return useQuery({
        queryKey: ['vehicle-transmissions', search],
        queryFn: async () => {
            const { data } = await api.get('/admin/vehicle/transmissions', {
                params: { search }
            });
            return data?.data?.data || data?.data || [];
        },
    });
};

export const useCreateTransmission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<VehicleTransmission>) => {
            const { data: response } = await api.post('/admin/vehicle/transmissions', data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-transmissions'] });
        },
    });
};

export const useUpdateTransmission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<VehicleTransmission> & { id: string }) => {
            const { data: response } = await api.put(`/admin/vehicle/transmissions/${id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-transmissions'] });
        },
    });
};

export const useDeleteTransmission = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/admin/vehicle/transmissions/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicle-transmissions'] });
        },
    });
};

