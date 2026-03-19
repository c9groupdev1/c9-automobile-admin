import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface User {
    id: string;
    fullName: string;
    avatar: string | null;
    emailAddress: string;
    phoneNumber: string | null;
    location: string | null;
    accountType: string;
    kycStatus: string;
    accountStatus: string;
    roles?: string[];
    createdAt: string;
}

export interface Role {
    id: number;
    name: string;
    permissions: string[];
}

export interface UserAnalysis {
    totalUsers: number;
    verifiedUsers: number;
    pendingKyc: number;
    suspendedAccounts: number;
    activeThisMonth: number;
    auctionParticipants: number;
}

export interface UsersResponse {
    success: boolean;
    data: {
        data: User[];
        links: {
            first: string;
            last: string;
            prev: string | null;
            next: string | null;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: { url: string | null; label: string; active: boolean }[];
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
}

export interface UserDetails {
    id: string;
    displayId: string;
    status: string;
    kycVerified: boolean;
    profile: {
        fullName: string;
        email: string;
        phoneNumber: string | null;
        address: string | null;
        avatar: string | null;
        accountType: string;
        dateJoined: string;
        lastActive: string | null;
    };
    personalInformation: {
        fullName: string;
        emailAddress: string;
        phoneNumber: string | null;
        residentialAddress: string | null;
    };
    accountInformation: {
        userId: string;
        accountType: string;
        registrationDate: string;
        lastLogin: string | null;
        emailVerification: string;
        phoneVerification: string;
        accountStatus: string;
    };
    kycStatus: any | null;
    activityOverview: {
        vehiclesPlaced: number;
        totalListings: number;
        messagesSent: number;
        favoritesCount: number;
        reviewsCount: number;
    };
    recentListings: any[];
    recentActivity: any[];
    recentTimeline: any[];
}

export function useUsers(params?: {
    page?: number;
    search?: string;
    accountStatus?: string;
    verificationStatus?: string;
    status?: string; // Add this for compatibility with the component
    userType?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    perPage?: number;
}) {
    return useQuery({
        queryKey: ['users', params],
        queryFn: async () => {
            const response = await api.get<UsersResponse>('/admin/users/index', { params });
            return response.data.data;
        },
    });
}

export function useUserDetails(id: string) {
    return useQuery({
        queryKey: ['user-details', id],
        queryFn: async () => {
            const response = await api.get<{ success: boolean; data: UserDetails }>(`/admin/users/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });
}

export function useUserAnalysis() {
    return useQuery({
        queryKey: ['users-analysis'],
        queryFn: async () => {
            const response = await api.get<{ success: boolean; data: UserAnalysis }>('/admin/users/analysis');
            return response.data.data;
        },
    });
}

export function useRoles() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const response = await api.get<{ success: boolean; data: Role[] }>('/admin/roles');
            return response.data.data;
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

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: { name?: string; email?: string; role?: string } }) => {
            const response = await api.post(`/admin/users/${id}/update`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user-details'] });
        },
    });
}

export function useResetPassword() {
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.post(`/admin/users/${id}/reset-password`);
            return response.data;
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
            queryClient.invalidateQueries({ queryKey: ['user-details'] });
        },
    });
}
