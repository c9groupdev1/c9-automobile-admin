import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface SupportEnquiry {
  id: string;
  subject: string;
  message: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'closed';
  name: string | null;
  email: string | null;
  attachment_path?: string;
  admin_note?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    fullName: string;
    emailAddress: string;
  } | null;
}

// If the response is a plain array as per sample, we adjust this.
// Keeping it flexible to handle both formats if possible, but prioritizing the sample.
export type SupportListResponse = SupportEnquiry[] | {
  success: boolean;
  data: {
    current_page: number;
    data: SupportEnquiry[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: any[];
    total: number;
    to: number | null;
  };
};

export const useSupportEnquiries = (params: { page?: number; status?: string; search?: string }) => {
  return useQuery({
    queryKey: ['support-enquiries', params],
    queryFn: async () => {
      const response = await api.get<SupportListResponse>('/admin/support', { params });
      // Handle both plain array and paginated object structure
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          total: response.data.length,
          current_page: 1,
          last_page: 1
        };
      }
      return response.data.data;
    },
  });
};

export const useSupportEnquiry = (id: string) => {
  return useQuery({
    queryKey: ['support-enquiry', id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: SupportEnquiry }>(`/admin/support/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useRespondToEnquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, message }: { id: string; status: string; message: string }) => {
      const { data } = await api.post(`/admin/support/${id}/respond`, { status, message });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['support-enquiries'] });
      queryClient.invalidateQueries({ queryKey: ['support-enquiry', variables.id] });
    },
  });
};

export const useSendSupportEnquiry = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/support', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
  });
};
