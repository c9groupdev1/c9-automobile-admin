import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface SubscriptionPlan {
    id: number;
    name: string;
    level: number;
    listingLimit: number;
    featuredAdsLimit: number;
    boostedAdsLimit: number;
}

export interface ActiveSubscription {
    id: number;
    status: string;
    startsAt: string;
    expiresAt: string;
    featuredAdsUsed: number;
    boostedAdsUsed: number;
    plan: SubscriptionPlan;
}

export interface KYCData {
    type: string;
    status: string;
    businessName: string | null;
    businessAddress: string | null;
    address: string | null;
    phoneNumber: string | null;
    rcNumber: string | null;
    selfiePicture: string | null;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    referralCode: string;
    canRefer: boolean;
    kycVerified: boolean;
    hasVerifiedBadge: boolean;
    kycStatus: string;
    roles: string[];
    createdAt: string;
    permissions: string[];
    favoritesCount: number;
    listingsCount: number;
    activeListingsCount: number;
    remainingListings: number;
    totalListingViews: number;
    kyc?: KYCData | null;
    activeSubscription?: ActiveSubscription | null;
    vendorProfile?: any | null;
}

export function useUserProfile() {
    return useQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const response = await api.get<{ success: boolean; data: UserProfile }>('/user/profile');
            return response.data.data;
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<UserProfile>) => {
            const response = await api.post('/user/profile', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            toast.success('Profile Updated', {
                description: 'Your account information has been successfully synchronized.'
            });
        },
        onError: (error: any) => {
            toast.error('Update Failed', {
                description: error.response?.data?.message || 'Verification logic rejected the changes.'
            });
        }
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/user/change-password', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Security Protocol Updated', {
                description: 'Your access credentials have been successfully modified.'
            });
        },
        onError: (error: any) => {
            toast.error('Security Update Failed', {
                description: error.response?.data?.message || 'Current password verification failed.'
            });
        }
    });
}

export function useDeleteAccount() {
    return useMutation({
        mutationFn: async () => {
            const response = await api.delete('/user/profile/delete');
            return response.data;
        },
        onSuccess: () => {
            toast.success('Account Terminated', {
                description: 'Your record has been successfully purged from the ecosystem.'
            });
            // Logout logic will be handled by the caller or interceptor
        },
        onError: (error: any) => {
            toast.error('Termination Failed', {
                description: error.response?.data?.message || 'Security protocol prevented account purging.'
            });
        }
    });
}

export function useContactSupport() {
    return useMutation({
        mutationFn: async (data: { subject: string; message: string }) => {
            const response = await api.post('/user/support/message', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Message Transmitted', {
                description: 'Your support enquiry has been queued for review.'
            });
        },
        onError: (error: any) => {
            toast.error('Transmission Failed', {
                description: error.response?.data?.message || 'Support node communication error.'
            });
        }
    });
}

export function useUpdateVendorProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/user/vendor-profile', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            toast.success('Professional Info Updated', {
                description: 'Your professional credentials have been successfully updated.'
            });
        },
        onError: (error: any) => {
            toast.error('Update Failed', {
                description: error.response?.data?.message || 'Verification logic rejected the profile details.'
            });
        }
    });
}
