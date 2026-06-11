import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface ListingListing {
    id: string;
    image: string | null;
    title: string;
    isFeatured: boolean;
    isVerified: boolean;
    isFlagged: boolean;
    avatar: string | null;
    name: string;
    type: string;
    brandModel: string;
    yearModel: string;
    price: string;
    condition: string | null;
    city: string | null;
    area: string | null;
    status: string;
    formatted: string;
    relative: string;
}

// For compatibility with components expecting the old structure
export interface Listing {
    id: string;
    title: string;
    description: string;
    amount: number;
    listingTypeId: string | number;
    is_negotiable: boolean | number;
    status: string;
    car?: {
        make: string;
        model: string;
        year: number;
        transmission: string;
        fuel_type: string;
        mileage: number;
    };
    media?: Array<{ id: string; path: string }>;
    user?: {
        name: string;
        email: string;
    };
}

export interface ListingsResponse {
    success: boolean;
    data: {
        data: ListingListing[];
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
            links: Array<{ url: string | null; label: string; active: boolean }>;
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
    message: string;
}

export function useListings(params?: {
    page?: number;
    q?: string;
    search?: string;
    status?: string;
    make?: string;
    model?: string;
    year?: string | number;
    condition?: string;
    transmission?: string;
    fuelType?: string;
    driveType?: string;
    isRegistered?: boolean;
    isFeatured?: boolean;
    stateId?: string | number;
    userId?: string;
    minAmount?: number;
    maxAmount?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    perPage?: number;
}) {
    const apiParams = { ...params };
    if (apiParams.search && !apiParams.q) {
        apiParams.q = apiParams.search;
    }
    return useQuery({
        queryKey: ['listings', apiParams],
        queryFn: async () => {
            const response = await api.get<ListingsResponse>('/admin/listings/vehicles', { params: apiParams });
            return response.data.data;
        },
    });
}

export interface ListingAnalysisData {
    totalVehicleListings: number;
    draftListings: number;
    pendingReview: number;
    approvedListings: number;
    rejectedListings: number;
    featuredListings: number;
    flaggedListings: number;
}

export function useListingAnalysis() {
    return useQuery({
        queryKey: ['listings-analysis'],
        queryFn: async () => {
            const response = await api.get<{
                success: boolean;
                data: ListingAnalysisData;
            }>('/admin/listings/vehicles/analysis');
            return response.data.data;
        },
    });
}

export interface ListingDetail {
    id: string;
    status: string;
    title: string;
    amount: number;
    viewCounts: number;
    badges: {
        pendingReview: boolean;
        verifiedSeller: boolean;
        featuredListing: boolean;
    };
    header: {
        title: string;
        price: string;
        location: string;
        basicSpecs: string;
        submittedDate: string;
        publishedDate: string;
        lastUpdated: string;
    };
    vehicleInformation: {
        make: string;
        model: string;
        year: string;
        trimVariant: string;
        bodyType: string;
        condition: string;
        transmission: string;
        fuelType: string;
        engineType: string;
        driveType: string | null;
        exteriorColor: string;
        interiorColor: string;
        registrationStatus: string;
        vinChassisNumber: string | null;
        videoUrl: string | null;
        inspectionAccepted: boolean;
        negotiable: string;
        location: {
            city: string | null;
            area: string | null;
            landmark: string | null;
            fullAddress: string | null;
        };
    };
    contentQuality: {
        descriptionProfessionalism: string;
        imageCount: number;
        isFlagged: boolean;
    };
    complianceReview: {
        kycVerified: boolean;
        vinProvided: boolean;
    };
    description: string;
    carFeatures: string[];
    mediaReview: {
        images: Array<{
            id: string;
            url: string;
            isPrimary: boolean;
        }>;
        // API may return paginated shape; normalized by useListing
        rawImages?: unknown;
    };
    sellerInformation: {
        name: string;
        email: string;
        phone: string;
        verified: boolean;
        phoneStatus: string;
        totalActiveListings: number;
        memberSince: string;
        sellerType: string;
        location: string;
    };
}

export function useListing(id: string) {
    return useQuery({
        queryKey: ['listing', id],
        queryFn: async () => {
            const response = await api.get<{ success: boolean; data: any; message: string }>(`/admin/listings/vehicles/${id}/show`);
            const raw = response.data.data;

            // Normalize mediaReview.images — backend may return a paginated object
            // { data: [...], meta: {...} } or a plain array
            const rawImages = raw?.mediaReview?.images;
            let normalizedImages: Array<{ id: string; url: string; isPrimary: boolean }> = [];

            if (Array.isArray(rawImages)) {
                normalizedImages = rawImages;
            } else if (rawImages && Array.isArray(rawImages?.data)) {
                // Paginated response — only first page returned; fetch all below
                normalizedImages = rawImages.data;
            }

            return {
                ...raw,
                mediaReview: {
                    ...raw?.mediaReview,
                    images: normalizedImages,
                },
            } as ListingDetail;
        },
        enabled: !!id,
    });
}

/**
 * Dedicated hook to fetch ALL images for a listing.
 * Use this if the main show endpoint paginates/limits images.
 */
export function useListingImages(id: string) {
    return useQuery({
        queryKey: ['listing-images', id],
        queryFn: async () => {
            const response = await api.get<{ success: boolean; data: any; message: string }>(
                `/admin/listings/vehicles/${id}/show`,
                { params: { per_page: 100, include_all_media: true } }
            );
            const raw = response.data.data;
            const rawImages = raw?.mediaReview?.images;

            if (Array.isArray(rawImages)) return rawImages;
            if (rawImages && Array.isArray(rawImages?.data)) return rawImages.data;
            return [] as Array<{ id: string; url: string; isPrimary: boolean }>;
        },
        enabled: !!id,
    });
}

export function useCreateListing() {
    return {
        mutateAsync: async (data: FormData) => {
            const response = await api.post('/admin/listings/vehicles', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
    };
}

export function useUpdateListing() {
    return {
        mutateAsync: async ({ id, data }: { id: string; data: FormData }) => {
            const response = await api.post(`/admin/listings/vehicles/${id}/update`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
    };
}

export function useDeleteListing() {
    return {
        mutateAsync: async (id: string) => {
            const response = await api.delete(`/admin/listings/vehicles/${id}/delete`);
            return response.data;
        },
    };
}

export const useListingTypes = () => {
    return useQuery({
        queryKey: ['listing-types'],
        queryFn: async () => {
            const response = await api.get('/listing-types');
            return response.data;
        },
    });
};

export function useUpdateListingStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status, comments }: { id: string; status: string; comments?: string }) => {
            const response = await api.post(`/admin/listings/vehicles/${id}/review`, { 
                status,
                comments 
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['listings'] });
            queryClient.invalidateQueries({ queryKey: ['listing', variables.id] });
        },
    });
}

export function useVerifyVin() {
    return useMutation({
        mutationFn: async (vin: string) => {
            const response = await api.post<{
                success: boolean;
                data: any;
                message: string;
            }>('/listings/vin/verify', { vin });
            return response.data;
        },
    });
}

export function useExportListings() {
    return useMutation({
        mutationFn: async (params?: any) => {
            const response = await api.get('/admin/listings/vehicles/export', {
                params,
                responseType: 'blob',
            });
            return response.data;
        },
        onSuccess: (data) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `listings-export-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
    });
}

