import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export function usePublicVehicleMakes() {
    return useQuery({
        queryKey: ['public-vehicle-makes'],
        queryFn: async () => {
            const response = await api.get('/vehicle/makes');
            return response.data.data;
        },
    });
}

export function usePublicVehicleModels(makeId?: string | number) {
    return useQuery({
        queryKey: ['public-vehicle-models', makeId],
        queryFn: async () => {
            if (!makeId) return [];
            const response = await api.get(`/vehicle/makes/${makeId}/models`);
            return response.data.data;
        },
        enabled: !!makeId,
    });
}

export function useVehicleMetadata() {
    const trims = useQuery({
        queryKey: ['vehicle-trims'],
        queryFn: async () => {
            const res = await api.get('/vehicle/trims');
            return res.data.data;
        }
    });

    const engineTypes = useQuery({
        queryKey: ['vehicle-engine-types'],
        queryFn: async () => {
            const res = await api.get('/vehicle/engine-types');
            return res.data.data;
        }
    });

    const features = useQuery({
        queryKey: ['vehicle-features'],
        queryFn: async () => {
            const res = await api.get('/vehicle/features');
            return res.data.data;
        }
    });

    const fuelTypes = useQuery({
        queryKey: ['vehicle-fuel-types'],
        queryFn: async () => {
            const res = await api.get('/vehicle/fuel-types');
            return res.data.data;
        }
    });

    const transmissions = useQuery({
        queryKey: ['vehicle-transmissions'],
        queryFn: async () => {
            const res = await api.get('/vehicle/transmissions');
            return res.data.data;
        }
    });

    const states = useQuery({
        queryKey: ['public-states'],
        queryFn: async () => {
            const res = await api.get('/states');
            return res.data.data;
        }
    });

    return {
        trims,
        engineTypes,
        features,
        fuelTypes,
        transmissions,
        states,
        isLoading: trims.isLoading || engineTypes.isLoading || features.isLoading || fuelTypes.isLoading || transmissions.isLoading || states.isLoading
    };
}

export function useVerifyVin() {
    return useMutation({
        mutationFn: async (vin: string) => {
            const response = await api.post('/listings/vin/verify', { vin });
            return response.data;
        }
    });
}

export function useSubmitListingStep1() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/user/listings/car/step-1', data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['my-listings'] });
            queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
        }
    });
}

export function useSubmitListingStep2() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await api.post('/user/listings/car/step-2', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['my-listings'] });
            queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
        }
    });
}

export function useSubmitListingStep3() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/user/listings/car/step-3', data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['my-listings'] });
            queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
        }
    });
}
