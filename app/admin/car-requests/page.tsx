'use client';

import { useState } from 'react';
import {
  AdminCarRequest,
  AdminCarRequestStatus,
  CarRequestPlatformSettings,
  useAdminCarRequests,
  useCarRequestSettings,
  useUpdateCarRequestSettings,
} from '@/hooks/useCarRequests';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCw, Save } from 'lucide-react';

const STATUS_FILTERS: { key: AdminCarRequestStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'draft', label: 'Draft' },
  { key: 'matched', label: 'Matched' },
  { key: 'fulfilled', label: 'Fulfilled' },
  { key: 'expired', label: 'Expired' },
  { key: 'cancelled', label: 'Cancelled' },
];

const STATUS_STYLES: Record<AdminCarRequestStatus, string> = {
  draft: 'bg-slate-100 text-slate-700',
  active: 'bg-blue-100 text-blue-700',
  matched: 'bg-indigo-100 text-indigo-700',
  fulfilled: 'bg-emerald-100 text-emerald-700',
  expired: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminCarRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<AdminCarRequestStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState('15');

  const {
    data: requestsRes,
    isLoading: requestsLoading,
    isFetching: requestsFetching,
    refetch: refetchRequests,
  } = useAdminCarRequests({
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    perPage: parseInt(perPage, 10),
    page,
  });

  const { data: settingsData, isLoading: settingsLoading } = useCarRequestSettings();
  const updateSettings = useUpdateCarRequestSettings();

  const [draftSettings, setDraftSettings] = useState<
    Partial<CarRequestPlatformSettings>
  >({});

  const settingsForm: CarRequestPlatformSettings = {
    car_request_max_active_per_user:
      draftSettings.car_request_max_active_per_user ??
      settingsData?.car_request_max_active_per_user ??
      1,
    car_request_default_expiration_days:
      draftSettings.car_request_default_expiration_days ??
      settingsData?.car_request_default_expiration_days ??
      7,
    car_request_max_responses_per_request:
      draftSettings.car_request_max_responses_per_request ??
      settingsData?.car_request_max_responses_per_request ??
      -1,
    car_request_allow_renewal:
      draftSettings.car_request_allow_renewal ??
      settingsData?.car_request_allow_renewal ??
      true,
    car_request_expiring_soon_hours:
      draftSettings.car_request_expiring_soon_hours ??
      settingsData?.car_request_expiring_soon_hours ??
      24,
  };

  const rawPayload = requestsRes?.data ?? requestsRes;
  const requests: AdminCarRequest[] = Array.isArray(rawPayload?.data)
    ? rawPayload.data
    : Array.isArray(rawPayload)
    ? rawPayload
    : [];
  const currentPage = rawPayload?.meta?.current_page ?? rawPayload?.current_page ?? page;
  const lastPage = rawPayload?.meta?.last_page ?? rawPayload?.last_page ?? 1;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(settingsForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Car Requests</h1>
          <p className="text-sm text-muted-foreground">
            Monitor buyer vehicle requests and configure platform-wide request limits.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchRequests()}
          disabled={requestsFetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${requestsFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">All Car Requests</TabsTrigger>
          <TabsTrigger value="settings">Platform Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((item) => (
                <Button
                  key={item.key}
                  size="sm"
                  variant={statusFilter === item.key ? 'default' : 'outline'}
                  onClick={() => {
                    setStatusFilter(item.key);
                    setPage(1);
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Rows per page:
              </span>
              <Select
                value={perPage}
                onValueChange={(value) => {
                  setPerPage(value || '15');
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-[110px]">
                  <SelectValue placeholder="15 / page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {requestsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : requests.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  No car requests found for this filter.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Category & Specs</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Offers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Dates</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req) => {
                      const stateName =
                        typeof req.state === 'string' ? req.state : req.state?.name;
                      const locationLabel = [req.preferredLocation, stateName]
                        .filter(Boolean)
                        .join(', ');
                      const specs = [req.condition, req.transmission, req.fuelType]
                        .filter(Boolean)
                        .join(' · ');

                      return (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">
                            {req.make} {req.model}
                            {(req.yearFrom || req.yearTo) && (
                              <span className="block text-xs text-muted-foreground">
                                {req.yearFrom || '?'} - {req.yearTo || '?'}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="capitalize">
                              {req.vehicleCategory || req.vehicleGroup || '—'}
                            </span>
                            {specs && (
                              <span className="block text-xs capitalize text-muted-foreground">
                                {specs}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {req.buyer?.name || '—'}
                            {req.buyer?.email && (
                              <span className="block text-xs text-muted-foreground">
                                {req.buyer.email}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {req.minBudget || req.maxBudget
                              ? `${req.currency || 'NGN'} ${Number(req.minBudget || 0).toLocaleString()} - ${Number(req.maxBudget || 0).toLocaleString()}`
                              : 'Flexible'}
                          </TableCell>
                          <TableCell>{locationLabel || 'Any'}</TableCell>
                          <TableCell>{req.responsesCount ?? 0}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={STATUS_STYLES[req.status] || ''}
                            >
                              {req.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            <div>
                              {req.createdAt
                                ? new Date(req.createdAt).toLocaleDateString()
                                : '—'}
                            </div>
                            {req.expiresAt && (
                              <div className="text-[11px] opacity-80">
                                Exp: {new Date(req.expiresAt).toLocaleDateString()}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {lastPage > 1 && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {lastPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= lastPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Car Request Platform Settings</CardTitle>
              <CardDescription>
                Configure active limits, expiration windows, and renewal rules. Use -1 for
                unlimited.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <form onSubmit={handleSaveSettings} className="space-y-5 max-w-xl">
                  <div className="space-y-2">
                    <Label htmlFor="maxActive">Max Active Requests Per User</Label>
                    <Input
                      id="maxActive"
                      type="number"
                      value={settingsForm.car_request_max_active_per_user}
                      onChange={(e) =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          car_request_max_active_per_user: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expDays">Default Expiration Days</Label>
                    <Input
                      id="expDays"
                      type="number"
                      min={1}
                      value={settingsForm.car_request_default_expiration_days}
                      onChange={(e) =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          car_request_default_expiration_days: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxResponses">Max Vendor Responses Per Request</Label>
                    <Input
                      id="maxResponses"
                      type="number"
                      value={settingsForm.car_request_max_responses_per_request}
                      onChange={(e) =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          car_request_max_responses_per_request: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expSoonHours">Expiring-Soon Alert (Hours Before)</Label>
                    <Input
                      id="expSoonHours"
                      type="number"
                      min={1}
                      value={settingsForm.car_request_expiring_soon_hours}
                      onChange={(e) =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          car_request_expiring_soon_hours: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <Label htmlFor="allowRenewal">Allow Buyer Request Renewal</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow buyers to renew expired car requests.
                      </p>
                    </div>
                    <Switch
                      id="allowRenewal"
                      checked={settingsForm.car_request_allow_renewal}
                      onCheckedChange={(checked) =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          car_request_allow_renewal: checked,
                        }))
                      }
                    />
                  </div>

                  <Button type="submit" disabled={updateSettings.isPending}>
                    {updateSettings.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Settings
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
