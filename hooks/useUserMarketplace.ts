import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
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
    sortOrder?: string;
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

export function useInfiniteUserMarketplaceListings(params?: ListingQueryParams) {
    return useInfiniteQuery({
        queryKey: ['infinite-marketplace-listings', params],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await api.get('/listings', { 
                params: { ...params, page: pageParam } 
            });
            return response.data;
        },
        getNextPageParam: (lastPage: any) => {
            const meta = lastPage.data?.meta || lastPage.meta;
            if (meta && meta.current_page < meta.last_page) {
                return meta.current_page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
}

export function useUserMarketplaceListing(slugOrId: string) {
    return useQuery({
        queryKey: ['marketplace-listing', slugOrId],
        queryFn: async () => {
            if (!slugOrId) return null;
            // The backend expects the slug
            const response = await api.get(`/listings/slug/${slugOrId}`);
            return response.data.data;
        },
        enabled: !!slugOrId,
    });
}

export function useRecommendedListings(params?: { page?: number; perPage?: number }) {
    return useQuery({
        queryKey: ['recommended-listings', params],
        queryFn: async () => {
            const response = await api.get('/listings/recommended', { params });
            return response.data;
        },
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
        onMutate: async (listingId) => {
            await queryClient.cancelQueries({ queryKey: ['marketplace-listings'] });
            await queryClient.cancelQueries({ queryKey: ['home-exploration'] });

            const previousListings = queryClient.getQueryData(['marketplace-listings']);
            const previousExploration = queryClient.getQueryData(['home-exploration']);

            const updateItem = (item: any) => {
                if (item.id === listingId) {
                    return { ...item, isFavorite: !(item.isFavorite || item.isFavorited), isFavorited: !(item.isFavorite || item.isFavorited) };
                }
                return item;
            };

            queryClient.setQueriesData({ queryKey: ['marketplace-listings'] }, (oldData: any) => {
                if (!oldData) return oldData;
                if (oldData.data && oldData.data.data && Array.isArray(oldData.data.data)) {
                    return { ...oldData, data: { ...oldData.data, data: oldData.data.data.map(updateItem) } };
                } else if (oldData.data && Array.isArray(oldData.data)) {
                    return { ...oldData, data: oldData.data.map(updateItem) };
                } else if (Array.isArray(oldData)) {
                    return oldData.map(updateItem);
                }
                return oldData;
            });

            queryClient.setQueriesData({ queryKey: ['home-exploration'] }, (oldData: any) => {
                if (!oldData) return oldData;
                
                // home-exploration returns an object with arrays: featuredVehicles, boostedVehicles, mostViewedVehicles, recentlyAdded
                const newData = { ...oldData };
                if (Array.isArray(newData.featuredVehicles)) {
                    newData.featuredVehicles = newData.featuredVehicles.map(updateItem);
                }
                if (Array.isArray(newData.boostedVehicles)) {
                    newData.boostedVehicles = newData.boostedVehicles.map(updateItem);
                }
                if (Array.isArray(newData.mostViewedVehicles)) {
                    newData.mostViewedVehicles = newData.mostViewedVehicles.map(updateItem);
                }
                if (Array.isArray(newData.recentlyAdded)) {
                    newData.recentlyAdded = newData.recentlyAdded.map(updateItem);
                }
                
                // Fallback for generic nested arrays if the structure changes
                if (newData.data && Array.isArray(newData.data)) {
                    newData.data = newData.data.map(updateItem);
                }
                
                return newData;
            });

            queryClient.setQueriesData({ queryKey: ['recommended-listings'] }, (oldData: any) => {
                if (!oldData) return oldData;
                if (oldData.data && oldData.data.data && Array.isArray(oldData.data.data)) {
                    return { ...oldData, data: { ...oldData.data, data: oldData.data.data.map(updateItem) } };
                } else if (oldData.data && Array.isArray(oldData.data)) {
                    return { ...oldData, data: oldData.data.map(updateItem) };
                } else if (Array.isArray(oldData)) {
                    return oldData.map(updateItem);
                }
                return oldData;
            });

            queryClient.setQueriesData({ queryKey: ['marketplace-listing'] }, (oldData: any) => {
                if (!oldData) return oldData;
                if (oldData.id === listingId) {
                    return { ...oldData, isFavorite: !(oldData.isFavorite || oldData.isFavorited), isFavorited: !(oldData.isFavorite || oldData.isFavorited) };
                }
                return oldData;
            });

            return { previousListings, previousExploration };
        },
        onError: (error: any, listingId, context: any) => {
            if (context?.previousListings) {
                queryClient.setQueriesData({ queryKey: ['marketplace-listings'] }, context.previousListings);
            }
            if (context?.previousExploration) {
                queryClient.setQueriesData({ queryKey: ['home-exploration'] }, context.previousExploration);
            }
            toast.error('Favorite Toggle Failed', {
                description: error.response?.data?.message || 'Could not update your bookmarks.'
            });
        },
        onSettled: (data, error, listingId) => {
            queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
            queryClient.invalidateQueries({ queryKey: ['marketplace-listing', listingId] });
            queryClient.invalidateQueries({ queryKey: ['favorite-listings'] });
            queryClient.invalidateQueries({ queryKey: ['home-exploration'] });
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
