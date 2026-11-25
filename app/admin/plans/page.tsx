'use client';

import {
    Crown,
    Check,
    X,
    Info,
    Plus,
    MoreVertical,
    Calendar,
    Users,
    Zap,
    Star,
    CheckCircle2,
    ShieldCheck,
    Loader2,
    Settings2,
    Edit3,
    Power
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlans, Plan, PlanStatus } from '@/hooks/usePlans';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const planSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    monthly_price: z.coerce.number().min(0, "Price must be 0 or greater"),
    listing_limit: z.coerce.number().min(-1),
    duration_days: z.coerce.number().min(1),
    featured_ads_limit: z.coerce.number().min(0),
    boosted_ads_limit: z.coerce.number().min(0),
    has_verified_badge: z.boolean().default(false),
    level: z.coerce.number().min(0),
    status: z.enum(['active', 'inactive']).default('active'),
});

type PlanFormValues = z.infer<typeof planSchema>;

export default function PlansPage() {
    const [statusFilter, setStatusFilter] = useState<PlanStatus | 'all'>('all');
    const { data: plans, isLoading, createPlan, updatePlan, updatePlanStatus } = usePlans(statusFilter);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    const form = useForm<PlanFormValues>({
        resolver: zodResolver(planSchema) as any,
        defaultValues: {
            name: "",
            monthly_price: 0,
            listing_limit: 0,
            duration_days: 30,
            featured_ads_limit: 0,
            boosted_ads_limit: 0,
            has_verified_badge: false,
            level: 1,
            status: 'active',
        },
    });

    const onSubmit = async (values: PlanFormValues) => {
        if (editingPlan) {
            await updatePlan.mutateAsync({ id: editingPlan.id, data: values });
        } else {
            await createPlan.mutateAsync(values);
        }
        setIsDialogOpen(false);
        setEditingPlan(null);
        form.reset();
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        form.reset({
            name: plan.name,
            monthly_price: Number(plan.monthly_price) || 0,
            listing_limit: plan.listing_limit,
            duration_days: plan.duration_days,
            featured_ads_limit: plan.featured_ads_limit,
            boosted_ads_limit: plan.boosted_ads_limit,
            has_verified_badge: plan.has_verified_badge,
            level: plan.level,
            status: plan.status ?? 'active',
        });
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingPlan(null);
        form.reset({
            name: "",
            monthly_price: 0,
            listing_limit: 0,
            duration_days: 30,
            featured_ads_limit: 0,
            boosted_ads_limit: 0,
            has_verified_badge: false,
            level: 1,
            status: 'active',
        });
        setIsDialogOpen(true);
    };

    const handleToggleStatus = async (plan: Plan) => {
        const nextStatus: PlanStatus = plan.status === 'active' ? 'inactive' : 'active';
        await updatePlanStatus.mutateAsync({ id: plan.id, status: nextStatus });
    };

    if (isLoading) {
        return (
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64 rounded-xl" />
                        <Skeleton className="h-5 w-96 rounded-lg" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-80 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    const plansList = Array.isArray(plans) ? plans : [];

    return (
        <div className="space-y-8 pb-20 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Crown className="text-[#CC9933] w-5 h-5" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Membership Tiers</h3>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">Subscription Plans</h2>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                        Configure and manage the membership tiers available to vendors and individual users.
                        Define listing capacities, promotion limits, and verification privileges.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200/60">
                        {(['all', 'active', 'inactive'] as const).map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                                    statusFilter === status
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500 hover:text-slate-800"
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <Button
                        onClick={handleCreate}
                        className="bg-[#003399] hover:bg-blue-800 rounded-2xl px-8 h-14 font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/10"
                    >
                        <Plus size={16} className="mr-2" />
                        Add New Plan
                    </Button>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {plansList.map((plan: Plan) => {
                    const isInactive = plan.status === 'inactive';
                    return (
                    <Card key={plan.id} className={cn(
                        "rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden bg-white group hover:border-[#003399]/20 transition-all duration-500",
                        isInactive && "opacity-75 bg-slate-50/50"
                    )}>
                    <CardHeader className="p-6 pb-4 border-b border-slate-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 group-hover:scale-110">
                            <Crown size={80} />
                        </div>
                            <div className="flex items-start justify-between gap-2 relative z-10">
                                <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                                    <Badge className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl border-0",
                                        plan.level > 0 ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-400"
                                    )}>
                                        Level {plan.level} Tier
                                    </Badge>
                                    <Badge className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl border-0",
                                        isInactive ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600"
                                    )}>
                                        {isInactive ? 'Inactive' : 'Active'}
                                    </Badge>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger render={
                                        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100">
                                            <MoreVertical size={18} className="text-slate-700" />
                                        </Button>
                                    } />
                                    <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 p-2 min-w-[180px]">
                                        <DropdownMenuItem
                                            onClick={() => handleEdit(plan)}
                                            className="rounded-xl font-bold text-xs uppercase tracking-wider py-3 cursor-pointer"
                                        >
                                            <Edit3 size={14} className="mr-2 text-blue-600" />
                                            Modify Plan
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleToggleStatus(plan)}
                                            disabled={updatePlanStatus.isPending}
                                            className="rounded-xl font-bold text-xs uppercase tracking-wider py-3 cursor-pointer"
                                        >
                                            <Power size={14} className={cn("mr-2", isInactive ? "text-emerald-600" : "text-rose-600")} />
                                            {isInactive ? 'Enable Plan' : 'Disable Plan'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="mt-8 relative z-10">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-2xl font-black text-[#003399]">₦{parseFloat(String(plan.monthly_price)).toLocaleString()}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ monthly</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400">
                                            <Zap size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Listing Capacity</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900">
                                        {plan.listing_limit === -1 ? 'Unlimited' : `${plan.listing_limit} Listings`}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Featured Ads</span>
                                        <span className="text-base font-black text-slate-900">{plan.featured_ads_limit}</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Boosted Ads</span>
                                        <span className="text-base font-black text-slate-900">{plan.boosted_ads_limit}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    {plan.has_verified_badge ? (
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <CheckCircle2 size={14} />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-rose-50 text-rose-300 flex items-center justify-center">
                                            <X size={14} />
                                        </div>
                                    )}
                                    <span className={cn(
                                        "text-xs font-bold uppercase tracking-widest",
                                        plan.has_verified_badge ? "text-slate-900" : "text-slate-400"
                                    )}>
                                        Verified Identity Badge
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                                        {plan.duration_days} Day Period
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3 border-t border-slate-50">
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        onClick={() => handleEdit(plan)}
                                        className="flex-1 h-10 rounded-xl bg-[#003399] hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm"
                                    >
                                        <Edit3 size={14} className="mr-1.5" />
                                        Modify Plan
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleToggleStatus(plan)}
                                        disabled={updatePlanStatus.isPending}
                                        className={cn(
                                            "h-10 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider",
                                            isInactive
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                        )}
                                    >
                                        <Power size={14} className="mr-1.5" />
                                        {isInactive ? 'Enable' : 'Disable'}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Calendar size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {plan.updated_at ? `Modified: ${format(new Date(plan.updated_at), 'MMM dd, yyyy')}` : `ID: #${plan.id}`}
                                        </span>
                                    </div>
                                    <ShieldCheck size={18} className="text-slate-100" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    );
                })}
            </div>

            {/* Plan Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-10 border-b border-slate-50 bg-white">
                        <DialogHeader className="space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Crown className="w-4 h-4 text-[#003399]" />
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subscription Management</span>
                            </div>
                            <DialogTitle className="text-2xl font-bold text-slate-900">
                                {editingPlan ? 'Edit Membership Plan' : 'Add New Plan'}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium text-sm">
                                {editingPlan
                                    ? `Update the features and pricing for the ${editingPlan.name} membership tier.`
                                    : 'Create a new membership level to define user and vendor privileges.'}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-10 bg-white">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="col-span-3">
                                                <FormLabel className="text-xs font-bold text-slate-700">Plan Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Executive Vendor" className="h-11 rounded-xl border-slate-200 focus:border-[#003399] transition-all" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="monthly_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold text-slate-700">Monthly Price (₦)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="h-11 rounded-xl border-slate-200 focus:border-[#003399] transition-all" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="level"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold text-slate-700">Display Priority</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="h-11 rounded-xl border-slate-200 focus:border-[#003399] transition-all" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="listing_limit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Listing Capacity</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="h-12 rounded-xl border-slate-200 focus:border-[#003399]/40 focus:ring-0 transition-all" {...field} />
                                                </FormControl>
                                                <FormDescription className="text-[10px] font-bold text-slate-300 uppercase">-1 for unlimited</FormDescription>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="duration_days"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Duration (Days)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="h-12 rounded-xl border-slate-200 focus:border-[#003399]/40 focus:ring-0 transition-all" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="featured_ads_limit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Featured Listings</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="h-12 rounded-xl border-slate-200 focus:border-[#003399]/40 focus:ring-0 transition-all" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="boosted_ads_limit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Boosted Listings</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="h-12 rounded-xl border-slate-200 focus:border-[#003399]/40 focus:ring-0 transition-all" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="has_verified_badge"
                                        render={({ field }) => (
                                            <FormItem className="col-span-3 flex flex-row items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/30">
                                                <div className="space-y-1">
                                                    <FormLabel className="text-sm font-bold text-slate-900">Include Verified Badge</FormLabel>
                                                    <FormDescription className="text-xs text-slate-500">Automatically grant verified status to subscribers on this plan.</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem className="col-span-3 flex flex-row items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/30">
                                                <div className="space-y-1">
                                                    <FormLabel className="text-sm font-bold text-slate-900">Plan Status</FormLabel>
                                                    <FormDescription className="text-xs text-slate-500">Enable or disable this plan for new subscriptions.</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value === 'active'}
                                                        onCheckedChange={(checked) => field.onChange(checked ? 'active' : 'inactive')}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <DialogFooter className="pt-8 border-t border-slate-50 mt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="rounded-xl font-bold text-xs uppercase tracking-widest h-12 px-8 text-slate-500"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createPlan.isPending || updatePlan.isPending}
                                        className="bg-[#003399] hover:bg-blue-800 rounded-xl px-12 h-12 font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-900/10 transition-all"
                                    >
                                        {createPlan.isPending || updatePlan.isPending ? (
                                            <Loader2 size={16} className="animate-spin mr-2" />
                                        ) : null}
                                        {editingPlan ? 'Save Changes' : 'Create Plan'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
