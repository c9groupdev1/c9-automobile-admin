import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DashboardStats {
    totalUsers: { current: number; change: number };
    verifiedVendors: { current: number; change: number };
    activeListings: { current: number; change: number };
    pendingKyc: { current: number; status: string };
}

export interface LatestListing {
    id: string;
    title: string;
    amount: number;
    status: string;
    createdAt: string;
    make: string;
    model: string;
    year: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export interface PendingKyc {
    id: string;
    userId: string;
    type: string;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export interface StateListingCount {
    state: string;
    count: number;
}

export interface MonthListingCount {
    month: string;
    count: number;
}

export interface DashboardParams {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    type?: string;
}

export const useDashboardStats = (params?: DashboardParams) => {
    return useQuery({
        queryKey: ['dashboard-stats', params],
        queryFn: async () => {
            const response = await api.get('/admin/dashboard/stats/overview', { params });
            return response.data.data as DashboardStats;
        },
    });
};

export const useLatestListings = (params?: DashboardParams) => {
    return useQuery({
        queryKey: ['latest-listings', params],
        queryFn: async () => {
            const response = await api.get('/admin/dashboard/listings/latest', { params });
            return response.data.data as LatestListing[];
        },
    });
};

export const usePendingKycs = (params?: DashboardParams) => {
    return useQuery({
        queryKey: ['pending-kycs', params],
        queryFn: async () => {
            const response = await api.get('/admin/dashboard/kycs/pending', { params });
            return response.data.data as PendingKyc[];
        },
    });
};

export const useListingsByState = (params?: DashboardParams) => {
    return useQuery({
        queryKey: ['listings-by-state', params],
        queryFn: async () => {
            const response = await api.get('/admin/dashboard/charts/listings-by-state', { params });
            return response.data.data as StateListingCount[];
        },
    });
};

export const useListingsPerMonth = (params?: DashboardParams) => {
    return useQuery({
        queryKey: ['listings-per-month', params],
        queryFn: async () => {
            const response = await api.get('/admin/dashboard/charts/listings-per-month', { params });
            return response.data.data as MonthListingCount[];
        },
    });
};
