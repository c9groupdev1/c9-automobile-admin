import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AmbassadorStats {
  id: string;
  name: string;
  email: string;
  total_count: number;
  current_month_count: number;
  filtered_count: number;
}

export interface ReferralStatsResponse {
  success: boolean;
  total_count: number;
  current_month_count: number;
  filtered_count: number;
  data: {
    current_page: number;
    data: AmbassadorStats[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

export interface ReferralFilters {
  search?: string;
  ambassadorName?: string;
  dateFrom?: string;
  dateTo?: string;
  month?: string;
  year?: string;
  page?: number;
  perPage?: number;
}

export const useReferralStats = (filters: ReferralFilters) => {
  return useQuery({
    queryKey: ['referral-stats', filters],
    queryFn: async () => {
      const { data } = await api.get<ReferralStatsResponse>('/admin/referrals/stats', {
        params: filters,
      });
      return data;
    },
  });
};
