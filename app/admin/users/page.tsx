'use client';

import {
    Users as UsersIcon,
    ShieldCheck,
    UserX,
    UserCheck,
    BarChart3,
    Gavel,
    Search,
    Download,
    Filter,
    RefreshCcw,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Loader2,
    UserPlus,
    Save,
    Shield,
    User,
    CreditCard,
    Camera,
    FileText
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Button } from '@/components/ui/button';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useUsers, useUserAnalysis, useResetPassword, useUpdateUserStatus, useRoles } from '@/hooks/useUsers';
import { useDebounce } from '@/hooks/use-debounce';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserForm } from '@/components/forms/user-form';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { usePermissions } from '@/hooks/use-permissions';

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [accountStatus, setAccountStatus] = useState<string>('all-status');
    const [verificationStatus, setVerificationStatus] = useState<string>('all-verification');
    const [userType, setUserType] = useState<string>('all-types');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<{ id: string; name: string; email: string; role: string } | undefined>();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [perPage, setPerPage] = useState('10');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const resetPassword = useResetPassword();
    const updateStatus = useUpdateUserStatus();
    const { data: roles } = useRoles();

    const { data: analysis, isLoading: loadingAnalysis } = useUserAnalysis();
    const { data: usersData, isLoading: loadingUsers, refetch } = useUsers({
        page,
        search: debouncedSearch,
        accountStatus: accountStatus === 'all-status' ? undefined : accountStatus,
        verificationStatus: verificationStatus === 'all-verification' ? undefined : verificationStatus,
        userType: userType === 'all-types' ? undefined : userType,
        perPage: parseInt(perPage),
        sortBy,
        sortOrder,
    });

    const handleResetPassword = async (id: string) => {
        try {
            await resetPassword.mutateAsync(id);
            toast.success('Password reset notification sent');
        } catch (error) {
            toast.error('Failed to send reset notification');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
        try {
            await updateStatus.mutateAsync({ id, status: newStatus });
            toast.success(`User ${newStatus.toLowerCase()} successfully`);
        } catch (error) {
            toast.error(`Failed to ${newStatus.toLowerCase()} user`);
        }
    };

    const users = usersData?.data || [];
    const meta = usersData?.meta;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h2>
                    <p className="text-slate-500 font-medium text-sm">Manage all registered customers and personal user accounts across the platform</p>
                </div>
                <div className="flex items-center gap-2">
                    <PermissionGuard permission="user.create">
                        <Button
                            onClick={() => {
                                setEditingUser(undefined);
                                setIsFormOpen(true);
                            }}
                            className="bg-[#003399] hover:bg-blue-800 rounded-xl px-6 h-12 font-bold text-xs shadow-lg shadow-blue-900/10"
                        >
                            <UserPlus size={16} className="mr-2" />
                            Add New User
                        </Button>
                    </PermissionGuard>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                <StatsCard
                    title="Total Users"
                    value={loadingAnalysis || !analysis ? '...' : analysis.totalUsers?.toLocaleString()}
                    description="Total reg. users"
                    icon={UsersIcon}
                    iconBg="bg-blue-50"
                    iconColor="text-[#003399]"
                />
                <StatsCard
                    title="Verified Users"
                    value={loadingAnalysis || !analysis ? '...' : analysis.verifiedUsers?.toLocaleString()}
                    description="KYC verified"
                    icon={UserCheck}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                />
                <StatsCard
                    title="Pending KYC"
                    value={loadingAnalysis || !analysis ? '...' : analysis.pendingKyc?.toLocaleString()}
                    description="Awaiting review"
                    icon={ShieldCheck}
                    iconBg="bg-orange-50"
                    iconColor="text-orange-500"
                />
                <StatsCard
                    title="Suspended"
                    value={loadingAnalysis || !analysis ? '...' : analysis.suspendedAccounts?.toLocaleString()}
                    description="Account restrictions"
                    icon={UserX}
                    iconBg="bg-rose-50"
                    iconColor="text-rose-500"
                />
                <StatsCard
                    title="Active Monthly"
                    value={loadingAnalysis || !analysis ? '...' : analysis.activeThisMonth?.toLocaleString()}
                    description="Activity this month"
                    icon={BarChart3}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-500"
                />
                {/* <StatsCard
                    title="Auction Participants"
                    value={loadingAnalysis || !analysis ? '...' : analysis.auctionParticipants?.toLocaleString()}
                    description="Registered bidders"
                    icon={Gavel}
                    iconBg="bg-violet-50"
                    iconColor="text-violet-600"
                /> */}
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px] group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#003399] transition-colors" />
                        <Input
                            placeholder="Search by name, email, phone number, user ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-12 pl-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 transition-all text-sm font-medium"
                        />
                    </div>

                    <Select value={accountStatus} onValueChange={(v) => setAccountStatus(v || 'all-status')}>
                        <SelectTrigger className="w-[180px] h-12 rounded-xl bg-slate-50 border-transparent font-bold text-xs text-slate-600">
                            <SelectValue placeholder="Account Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="all-status">Account Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={verificationStatus} onValueChange={(v) => setVerificationStatus(v || 'all-verification')}>
                        <SelectTrigger className="w-[180px] h-12 rounded-xl bg-slate-50 border-transparent font-bold text-xs text-slate-600">
                            <SelectValue placeholder="Verification Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="all-verification">Verification Status</SelectItem>
                            <SelectItem value="approved">Verified</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="not_submitted">Not Submitted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={userType} onValueChange={(v) => setUserType(v || 'all-types')}>
                        <SelectTrigger className="w-[180px] h-12 rounded-xl bg-slate-50 border-transparent font-bold text-xs text-slate-600">
                            <SelectValue placeholder="User Protocol" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="all-types">All Protocol Types</SelectItem>
                            {roles?.map((role: any) => (
                                <SelectItem key={role.id} value={role.name} className="capitalize">{role.name.replace('_', ' ')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between pt-2">
                    {/* <Button className="bg-[#003399] hover:bg-blue-800 rounded-xl px-6 h-11 font-bold text-xs shadow-lg shadow-blue-900/10">
                        <Download size={16} className="mr-2" />
                        Export Users
                    </Button> */}
                    <div className="flex items-center gap-2">
                        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <SheetTrigger
                                render={<Button variant="ghost" size="sm" className="text-slate-500 font-bold text-[10px] uppercase tracking-widest"><Filter size={14} className="mr-2" /> All Filters</Button>}
                            />
                            <SheetContent className="w-[400px] sm:w-[540px] rounded-l-[3rem] border-l-slate-100 p-10 flex flex-col">
                                <SheetHeader className="mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003399] mb-4">
                                        <Filter size={24} />
                                    </div>
                                    <SheetTitle className="text-2xl font-black text-slate-900">Advanced Filters</SheetTitle>
                                    <SheetDescription className="text-slate-500 font-medium">Refine user entries using comprehensive parameters</SheetDescription>
                                </SheetHeader>

                                <div className="flex-1 space-y-8 overflow-y-auto pr-4 -mr-4">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sorting Configuration</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Select value={sortBy} onValueChange={(v) => setSortBy(v || 'created_at')}>
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-xs">
                                                    <SelectValue placeholder="Sort By" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-slate-100">
                                                    <SelectItem value="created_at">Join Date</SelectItem>
                                                    <SelectItem value="fullName">Full Name</SelectItem>
                                                    <SelectItem value="emailAddress">Email Address</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select value={sortOrder} onValueChange={(v: any) => setSortOrder(v || 'desc')}>
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-xs">
                                                    <SelectValue placeholder="Order" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-slate-100">
                                                    <SelectItem value="desc">Descending</SelectItem>
                                                    <SelectItem value="asc">Ascending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Database Entry Volume</label>
                                        <Select value={perPage} onValueChange={(v) => setPerPage(v || '10')}>
                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold text-xs">
                                                <SelectValue placeholder="Users Per Page" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-100">
                                                <SelectItem value="10">10 Entries per page</SelectItem>
                                                <SelectItem value="25">25 Entries per page</SelectItem>
                                                <SelectItem value="50">50 Entries per page</SelectItem>
                                                <SelectItem value="100">100 Entries per page</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex gap-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 rounded-xl font-bold border-slate-100 text-slate-600"
                                        onClick={() => {
                                            setAccountStatus('all-status');
                                            setVerificationStatus('all-verification');
                                            setUserType('all-types');
                                            setSortBy('created_at');
                                            setSortOrder('desc');
                                            setPerPage('10');
                                        }}
                                    >
                                        Reset Filters
                                    </Button>
                                    <Button
                                        className="flex-1 h-12 rounded-xl font-bold bg-[#003399] hover:bg-blue-800"
                                        onClick={() => setIsFilterOpen(false)}
                                    >
                                        Apply Filters
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-slate-500 font-bold text-[10px] uppercase tracking-widest"><RefreshCcw size={14} className="mr-2" /> Refresh</Button>
                    </div>
                </div>
            </div>

            {/* Users Table Card */}
            <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white min-h-[400px]">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">All Users</h3>
                    {loadingUsers && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                </div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-50">
                                <TableHead className="w-12 px-8 py-4">
                                    <Checkbox className="rounded-md border-slate-300" />
                                </TableHead>
                                {/* <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User ID</TableHead> */}
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Type</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">KYC Status</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Account Status</TableHead>
                                <TableHead className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-slate-50/50 border-slate-50 group transition-colors">
                                        <TableCell className="px-8 py-5">
                                            <Checkbox className="rounded-md border-slate-300 group-hover:border-[#003399]" />
                                        </TableCell>
                                        {/* <TableCell className="px-4 py-5">
                                            <span className="text-[10px] font-bold text-slate-400 tracking-tight uppercase truncate max-w-[80px] block" title={user.id}>
                                                {user.id?.split('-')?.[0] || 'USER'}...
                                            </span>
                                        </TableCell> */}
                                        <TableCell className="px-4 py-5">
                                            <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                                <Avatar className="h-9 w-9 rounded-xl border border-white shadow-sm ring-1 ring-slate-100">
                                                    {user.avatar && <AvatarImage src={`${STORAGE_URL}${user.avatar}`} className="object-cover" />}
                                                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-[10px]">{user.fullName[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{user.fullName}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-4 py-5 text-xs font-medium text-slate-500">{user.emailAddress}</TableCell>
                                        <TableCell className="px-4 py-5 text-xs font-medium text-slate-500">{user.phoneNumber || 'N/A'}</TableCell>
                                        <TableCell className="px-4 py-5 text-xs font-medium text-slate-500">{user.location || 'N/A'}</TableCell>
                                        <TableCell className="px-4 py-5">
                                            <span className={cn(
                                                "text-[10px] font-bold",
                                                user.accountType === 'Verified User' ? "text-[#003399]" :
                                                    user.accountType === 'admin' ? "text-rose-600" :
                                                        "text-slate-500"
                                            )}>
                                                {user.accountType}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-5 text-center">
                                            <Badge className={cn(
                                                "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border-0 pointer-events-none",
                                                user.kycStatus.toLowerCase() === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                                    user.kycStatus.toLowerCase() === 'pending' ? 'bg-orange-50 text-orange-500' :
                                                        user.kycStatus.toLowerCase() === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'
                                            )}>
                                                {user.kycStatus === 'Not Submitted' ? 'Not Submitted' : user.kycStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-5 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <div className={cn(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    user.accountStatus === 'Active' ? 'bg-emerald-500' :
                                                        user.accountStatus === 'Suspended' ? 'bg-rose-500' : 'bg-slate-400'
                                                )}></div>
                                                <span className={cn(
                                                    "text-xs font-bold",
                                                    user.accountStatus === 'Active' ? 'text-emerald-600' :
                                                        user.accountStatus === 'Suspended' ? 'text-rose-600' : 'text-slate-500'
                                                )}>{user.accountStatus}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    render={<Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></Button>}
                                                />
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-100 shadow-2xl p-2">
                                                    <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Administrative Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-slate-50" />
                                                    <PermissionGuard permission="user.update">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setEditingUser({
                                                                    id: user.id,
                                                                    name: user.fullName,
                                                                    email: user.emailAddress,
                                                                    role: user.accountType
                                                                });
                                                                setIsFormOpen(true);
                                                            }}
                                                            className="px-3 py-3 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                                                        >
                                                            <User size={14} className="text-[#003399]" />
                                                            Modify User Profile
                                                        </DropdownMenuItem>
                                                    </PermissionGuard>
                                                    <PermissionGuard permission="user.update">
                                                        <DropdownMenuItem
                                                            onClick={() => handleResetPassword(user.id)}
                                                            className="px-3 py-3 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                                                        >
                                                            <Shield size={14} className="text-orange-500" />
                                                            Force Credentials Reset
                                                        </DropdownMenuItem>
                                                    </PermissionGuard>
                                                    <DropdownMenuSeparator className="bg-slate-50" />
                                                    <PermissionGuard permission="user.suspend">
                                                        <DropdownMenuItem
                                                            onClick={() => handleToggleStatus(user.id, user.accountStatus)}
                                                            className={cn(
                                                                "px-3 py-3 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-3 transition-colors",
                                                                user.accountStatus === 'Active' ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                                                            )}
                                                        >
                                                            {user.accountStatus === 'Active' ? (
                                                                <>
                                                                    <UserX size={14} />
                                                                    Suspend Protocol Access
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <UserCheck size={14} />
                                                                    Restore Account Access
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </PermissionGuard>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : !loadingUsers ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="h-24 text-center text-slate-400 font-medium">
                                        No users found matches the criteria.
                                    </TableCell>
                                </TableRow>
                            ) : null}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {meta && (
                    <div className="px-8 py-6 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Showing {meta.from}-{meta.to} of {meta.total?.toLocaleString()} users
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl border-slate-100 hover:bg-slate-50 disabled:opacity-30"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <div className="flex gap-1">
                                {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => {
                                    const p = i + 1;
                                    return (
                                        <Button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={cn(
                                                "h-9 w-9 rounded-xl font-bold text-xs",
                                                page === p ? "bg-[#003399] text-white shadow-lg shadow-blue-900/10" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                            )}
                                        >
                                            {p}
                                        </Button>
                                    );
                                })}
                                {meta.last_page > 5 && <div className="px-2 self-end text-slate-400 font-bold mb-1">...</div>}
                                {meta.last_page > 5 && (
                                    <Button
                                        onClick={() => setPage(meta.last_page)}
                                        className={cn(
                                            "h-9 px-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-xs hover:bg-slate-100",
                                            page === meta.last_page && "bg-[#003399] text-white shadow-lg shadow-blue-900/10"
                                        )}
                                    >
                                        {meta.last_page}
                                    </Button>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-xl border-slate-100 hover:bg-slate-50 disabled:opacity-30"
                                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                disabled={page === meta.last_page}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent className="w-[400px] sm:w-[540px] rounded-l-[3rem] border-l-slate-100 p-10 flex flex-col">
                    <SheetHeader className="mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003399] mb-4">
                            {editingUser ? <Save size={24} /> : <UserPlus size={24} />}
                        </div>
                        <SheetTitle className="text-2xl font-black text-slate-900">{editingUser ? 'Modify User Profile' : 'Initialize New User'}</SheetTitle>
                        <SheetDescription className="text-slate-500 font-medium">{editingUser ? `Updating access and credentials for User ID: ${editingUser.id}` : 'Configure access clearance and identities for a new protocol member'}</SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto pr-4 -mr-4">
                        <UserForm
                            initialData={editingUser}
                            onSuccess={() => {
                                setIsFormOpen(false);
                                refetch();
                            }}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
