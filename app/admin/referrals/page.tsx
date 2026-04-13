'use client';

import {
  BarChart3,
  Search,
  Filter,
  Users,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Download,
  Loader2,
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useReferralStats, ReferralFilters } from '@/hooks/useReferrals';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReferralsPage() {
  const [filters, setFilters] = useState<ReferralFilters>({
    page: 1,
    perPage: 10,
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
  });

  const [localFilters, setLocalFilters] = useState<ReferralFilters>(filters);

  const { data: statsData, isLoading, isFetching } = useReferralStats(filters);

  const handleLocalFilterChange = (key: keyof ReferralFilters, value: string | number | null) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value ?? undefined }));
  };

  const handleApplyFilters = () => {
    setFilters({ ...localFilters, page: 1 });
  };

  const handlePaginationChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };
  const ambassadors = statsData?.data?.data || [];
  const meta = statsData?.data;

  const monthOptions = [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    label: String(currentYear - i),
    value: String(currentYear - i),
  }));

  if (isLoading) {
    return (
      <div className="space-y-8 pb-20">
        <Skeleton className="h-20 w-1/3 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-[2.5rem]" />)}
        </div>
        <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="text-[#003399] w-5 h-5" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Growth Analysis</h3>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Referral Analytics</h2>
          <p className="text-slate-500 font-medium mt-2 max-w-2xl">
            Monitor ambassador performance, track global referral trends, and analyze growth metrics across the C9x ecosystem.
          </p>
        </div>
        <Button variant="outline" className="h-14 rounded-2xl border-slate-200 font-black text-xs uppercase tracking-widest gap-2 px-8 bg-white shadow-sm hover:border-[#003399] hover:text-[#003399] transition-all">
          <Download size={16} />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Global Referrals', value: statsData?.total_count || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Total tracked conversions' },
          { label: 'Active Month', value: statsData?.current_month_count || 0, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Referrals recorded this month' },
          { label: 'Filtered Result', value: statsData?.filtered_count || 0, icon: Filter, color: 'text-amber-500', bg: 'bg-amber-50', desc: 'Matching current view params' }
        ].map((stat, i) => (
          <Card key={i} className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="text-3xl font-black text-slate-900 line-clamp-1">{stat.value.toLocaleString()}</div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1">{stat.label}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-2">{stat.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advanced Filters */}
      <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="p-10 border-b border-slate-50 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <Filter size={16} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Search Protocol</h3>
          </div>
          <Button
            onClick={handleApplyFilters}
            disabled={isFetching}
            className="h-12 px-8 rounded-2xl bg-[#003399] hover:bg-blue-800 text-white font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-2 shadow-lg shadow-blue-900/10 transition-all active:scale-95"
          >
            {isFetching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </Button>
        </CardHeader>
        <CardContent className="p-10 bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Search Ambassador</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#003399] transition-colors" size={16} />
                <Input
                  placeholder="Name"
                  value={localFilters.search || ''}
                  className="h-12 pl-12 rounded-2xl bg-white border-slate-100 focus:border-[#003399]/30 transition-all font-bold text-xs"
                  onChange={(e) => handleLocalFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Period Month</label>
              <Select value={localFilters.month} onValueChange={(v) => handleLocalFilterChange('month', v)}>
                <SelectTrigger className="h-12 rounded-2xl bg-white border-slate-100 font-bold text-xs">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100">
                  <SelectItem value="all">Full Academic Year</SelectItem>
                  {monthOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Period Year</label>
              <Select value={localFilters.year} onValueChange={(v) => handleLocalFilterChange('year', v)}>
                <SelectTrigger className="h-12 rounded-2xl bg-white border-slate-100 font-bold text-xs">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100">
                  {yearOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Filter by Referrer</label>
              <Input
                placeholder="Referrer Name..."
                value={localFilters.ambassadorName || ''}
                className="h-12 rounded-2xl bg-white border-slate-100 focus:border-[#003399]/30 transition-all font-bold text-xs"
                onChange={(e) => handleLocalFilterChange('ambassadorName', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="py-8 px-10 text-[11px] font-black uppercase tracking-widest text-slate-400 w-[30%]">Ambassador Profile</TableHead>
                  <TableHead className="py-8 px-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Lifetime Traffic</TableHead>
                  <TableHead className="py-8 px-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Current Cycle</TableHead>
                  <TableHead className="py-8 px-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Filtered Target</TableHead>
                  <TableHead className="py-8 px-10 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Integrity Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ambassadors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-[400px] text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200">
                          <Users size={40} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-900 font-black text-lg uppercase tracking-tight">No Ambassador Intelligence</p>
                          <p className="text-slate-500 font-medium text-sm">Synchronize filters or check production logs for connectivity.</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  ambassadors.map((amb) => (
                    <TableRow key={amb.id} className="group border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-7 px-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003399] shrink-0 font-black text-sm">
                            {amb.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-slate-900 text-sm truncate uppercase tracking-tight">{amb.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 truncate mt-1 lowercase">{amb.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-7 px-8">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-black text-slate-900 tabular-nums">{amb.total_count}</span>
                          <Badge variant="secondary" className="bg-blue-50 text-[#003399] text-[9px] font-black uppercase px-2 py-0 border-0">Global</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-7 px-8">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-black text-slate-900 tabular-nums">{amb.current_month_count}</span>
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase px-2 py-0 border-0">Month</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-7 px-8">
                        <div className="flex items-center gap-3">
                          <span className="text-base font-black text-slate-900 tabular-nums">{amb.filtered_count}</span>
                          <Badge variant="secondary" className="bg-amber-50 text-amber-600 text-[9px] font-black uppercase px-2 py-0 border-0">Filtered</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-7 px-10 text-right">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 shadow-sm">
                          <CheckCircle2 size={12} />
                          <span className="text-[9px] font-black uppercase tracking-[0.1em]">Verified Profile</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Reviewing <span className="text-slate-900">{meta?.from || 0} - {meta?.to || 0}</span> of <span className="text-slate-900 font-black">{meta?.total || 0}</span> intelligence nodes
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                disabled={filters.page === 1}
                onClick={() => handlePaginationChange(filters.page! - 1)}
                className="h-12 rounded-2xl border-slate-100 font-black text-xs uppercase tracking-widest px-6"
              >
                Previous Sequence
              </Button>
              <Button
                variant="outline"
                disabled={!meta?.next_page_url}
                onClick={() => handlePaginationChange(filters.page! + 1)}
                className="h-12 rounded-2xl border-slate-100 font-black text-xs uppercase tracking-widest px-6"
              >
                Next Node
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
