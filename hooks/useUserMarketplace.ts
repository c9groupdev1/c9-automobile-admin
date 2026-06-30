import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface ListingQueryParams {
    page?: number;
    perPage?: number;
    search?: string;
    make?: string;
    model?: string;
    condition?: string;
    registrationStatus?: string;
    transmission?: string;
    fuelType?: string;
    stateId?: number | string;
    minPrice?: number | string;
    maxPrice?: number | string;
    sort?: string;
}

export function useUserMarketplaceListings(params?: ListingQueryParams) {
    return useQuery({
        queryKey: ['marketplace-listings', params],
        queryFn: async () => {
            const response = await api.get('/listings', { params });
            return response.data;
        },
    });
}

export function useUserMarketplaceListing(id: string) {
    return useQuery({
        queryKey: ['marketplace-listing', id],
        queryFn: async () => {
            if (!id) return null;
            const response = await api.get(`/listings/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });
}

export function useHomeExploration() {
    return useQuery({
        queryKey: ['home-exploration'],
        queryFn: async () => {
            const response = await api.get('/listings/home');
            return response.data.data;
        },
    });
}

export function useVendorProfile(vendorId: string, params?: { page?: number; perPage?: number }) {
    return useQuery({
        queryKey: ['vendor-profile', vendorId, params],
        queryFn: async () => {
            if (!vendorId) return null;
            const response = await api.get(`/vendors/${vendorId}`, { params });
            return response.data.data;
        },
        enabled: !!vendorId,
    });
}

export function useMyListings(params?: ListingQueryParams) {
    return useQuery({
        queryKey: ['my-listings', params],
        queryFn: async () => {
            const response = await api.get('/user/listings', { params });
            return response.data;
        },
    });
}

export function useFavoriteListings(params?: ListingQueryParams) {
    return useQuery({
        queryKey: ['favorite-listings', params],
        queryFn: async () => {
            const response = await api.get('/user/favorites', { params });
            return response.data;
        },
    });
}

export function useToggleFavorite() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (listingId: string) => {
            const response = await api.post(`/user/listings/${listingId}/favorite`);
            return response.data;
        },
        onSuccess: (data, listingId) => {
            queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
            queryClient.invalidateQueries({ queryKey: ['marketplace-listing', listingId] });
            queryClient.invalidateQueries({ queryKey: ['favorite-listings'] });
            queryClient.invalidateQueries({ queryKey: ['home-exploration'] });
        },
        onError: (error: any) => {
            toast.error('Favorite Toggle Failed', {
                description: error.response?.data?.message || 'Could not update your bookmarks.'
            });
        }
    });
}

export function useListingReviews(listingId: string, page?: number) {
    return useQuery({
        queryKey: ['listing-reviews', listingId, page],
        queryFn: async () => {
            if (!listingId) return null;
            const response = await api.get(`/listings/${listingId}/reviews`, { params: { page } });
            return response.data;
        },
        enabled: !!listingId,
    });
}

export function usePostListingReview() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ listingId, rating, comment }: { listingId: string; rating: number; comment: string }) => {
            const response = await api.post(`/user/listings/${listingId}/reviews`, { rating, comment });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['marketplace-listing', variables.listingId] });
            queryClient.invalidateQueries({ queryKey: ['listing-reviews', variables.listingId] });
            toast.success('Review Posted', {
                description: 'Your rating and comment have been shared.'
            });
        },
        onError: (error: any) => {
            toast.error('Review Failed', {
                description: error.response?.data?.message || 'Could not submit your review.'
            });
        }
    });
}

export function useDeleteListing() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (listingId: string) => {
            const response = await api.delete(`/user/listings/${listingId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-listings'] });
            queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
            toast.success('Listing Deleted', {
                description: 'Your vehicle listing has been removed.'
            });
        },
        onError: (error: any) => {
            toast.error('Deletion Failed', {
                description: error.response?.data?.message || 'Could not delete the listing.'
            });
        }
    });
}

export function useUpdateListingStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status, reason }: { id: string; status: string; reason?: string }) => {
            const response = await api.patch(`/user/listings/${id}/status`, { status, reason });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['my-listings'] });
            queryClient.invalidateQueries({ queryKey: ['marketplace-listing', variables.id] });
            toast.success('Status Updated', {
                description: `Listing is now marked as ${variables.status.toLowerCase()}.`
            });
        },
        onError: (error: any) => {
            toast.error('Update Failed', {
                description: error.response?.data?.message || 'Could not modify listing status.'
            });
        }
    });
}

export function useReportListing() {
    return useMutation({
        mutationFn: async ({ listingId, reason, description }: { listingId: string; reason: string; description: string }) => {
            const response = await api.post(`/listings/${listingId}/report`, { reason, description });
            return response.data;
        },
        onSuccess: () => {
            toast.success('Report Submitted', {
                description: 'Thank you. The listing has been flagged for administrative review.'
            });
        },
        onError: (error: any) => {
            toast.error('Report Failed', {
                description: error.response?.data?.message || 'Could not file the report.'
            });
        }
    });
}

export function useBlockedUsers() {
    return useQuery({
        queryKey: ['blocked-users'],
        queryFn: async () => {
            const response = await api.get('/user/blocks');
            return response.data.data;
        },
    });
}

export function useBlockUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await api.post(`/user/blocks/${userId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
            queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
            toast.success('User Blocked', {
                description: 'You will no longer see listings from this member.'
            });
        },
        onError: (error: any) => {
            toast.error('Action Failed', {
                description: error.response?.data?.message || 'Could not block this user.'
            });
        }
    });
}

export function useUnblockUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await api.delete(`/user/blocks/${userId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
            queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
            toast.success('User Unblocked', {
                description: 'Member listings are now visible to you again.'
            });
        },
        onError: (error: any) => {
            toast.error('Action Failed', {
                description: error.response?.data?.message || 'Could not unblock this user.'
            });
        }
    });
}
