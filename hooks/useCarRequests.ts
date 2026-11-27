import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export type AdminCarRequestStatus =
  | 'draft'
  | 'active'
  | 'matched'
  | 'fulfilled'
  | 'expired'
  | 'cancelled';

export interface AdminCarRequest {
  id: string;
  vehicleGroup?: string | null;
  vehicleCategory: string;
  make: string;
  model: string;
  yearFrom?: number | null;
  yearTo?: number | null;
  minBudget?: number | string | null;
  maxBudget?: number | string | null;
  currency?: string;
  condition?: string | null;
  transmission?: string | null;
  fuelType?: string | null;
  stateId?: number | null;
  state?: string | { id: number; name: string } | null;
  preferredLocation?: string | null;
  additionalRequirements?: string | null;
  status: AdminCarRequestStatus;
  publishedAt?: string | null;
  expiresAt?: string | null;
  renewalCount?: number;
  responsesCount?: number;
  buyer?: {
    id: string;
    name: string;
    email?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface AdminCarRequestsParams {
  status?: AdminCarRequestStatus;
  perPage?: number;
  page?: number;
}

export interface CarRequestPlatformSettings {
  car_request_max_active_per_user: number;
  car_request_default_expiration_days: number;
  car_request_max_responses_per_request: number;
  car_request_allow_renewal: boolean;
  car_request_expiring_soon_hours: number;
}

export function useAdminCarRequests(params: AdminCarRequestsParams = {}) {
  return useQuery({
    queryKey: ['admin-car-requests', params],
    queryFn: async () => {
      const response = await api.get('/admin/car-requests', { params });
      return response.data;
    },
  });
}

export function useCarRequestSettings() {
  return useQuery<CarRequestPlatformSettings>({
    queryKey: ['admin-car-request-settings'],
    queryFn: async () => {
      const response = await api.get('/admin/car-requests/settings');
      const payload = response.data;
      return payload?.data ?? payload;
    },
  });
}

export function useUpdateCarRequestSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CarRequestPlatformSettings>) => {
      const response = await api.put('/admin/car-requests/settings', data);
      return response.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-car-request-settings'] });
      toast.success('Settings Updated', {
        description: res?.message || 'Car Request platform settings have been saved.',
      });
    },
    onError: (error: unknown) => {
      const apiMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message;
      toast.error('Update Failed', {
        description: apiMessage || 'Failed to update Car Request settings.',
      });
    },
  });
}
