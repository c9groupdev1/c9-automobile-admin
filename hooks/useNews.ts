import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_path: string | null;
  send_email: boolean;
  send_popup: boolean;
  is_published: boolean;
  published_at: string | null;
  admin_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  admin?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface NewsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: NewsItem[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: any[];
    total: number;
    to: number | null;
  };
}

export const useNewsList = (params: { page?: number; perPage?: number }) => {
  return useQuery({
    queryKey: ['news-list', params],
    queryFn: async () => {
      const { data } = await api.get<NewsResponse>('/admin/news', { params });
      return data.data;
    },
  });
};

export const useNewsItem = (id: string) => {
  return useQuery({
    queryKey: ['news-item', id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: NewsItem }>(`/admin/news/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/admin/news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-list'] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      // Note: Some APIs require POST with _method=PUT for multipart updates, 
      // but according to screenshot it says PUT api/admin/news/{id}
      // If PUT doesn't support multipart on this server, we'd use POST with _method=PUT.
      // We'll stick to PUT as per docs.
      const { data } = await api.post(`/admin/news/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: { _method: 'PUT' } // Common Laravel pattern for multipart PUT
      });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['news-list'] });
      queryClient.invalidateQueries({ queryKey: ['news-item', variables.id] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/news/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-list'] });
    },
  });
};

export const usePublishNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/admin/news/${id}/publish`);
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['news-list'] });
      queryClient.invalidateQueries({ queryKey: ['news-item', id] });
    },
  });
};

export const useNotifyNews = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/admin/news/${id}/notify`);
      return data;
    },
  });
};
