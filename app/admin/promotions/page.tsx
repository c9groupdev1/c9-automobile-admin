'use client';

import {
    Zap,
    Plus,
    MoreVertical,
    Clock,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Calendar,
    ArrowUpRight,
    Loader2,
    Settings2,
    Edit3,
    Check
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePromotions, Promotion } from '@/hooks/usePromotions';
import { Badge } from '@/components/ui/badge';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const promotionSchema = z.object({
    type: z.string().min(1, "Service designation is required"),
    duration_days: z.coerce.number().min(1, "Duration must be at least 1 day"),
    price: z.string().min(1, "Fiscal value is required"),
    priority_weight: z.coerce.number().min(1, "Priority weight must be at least 1"),
    is_available: z.boolean().default(true),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

export default function PromotionsPage() {
    const { data: promotions, isLoading, createPromotion, updatePromotion } = usePromotions();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

    const form = useForm<PromotionFormValues>({
        resolver: zodResolver(promotionSchema) as any,
        defaultValues: {
            type: "standard_boost",
            duration_days: 7,
            price: "5000",
            priority_weight: 10,
            is_available: true,
        },
    });

    const onSubmit = async (values: PromotionFormValues) => {
        if (editingPromotion) {
            await updatePromotion.mutateAsync({ id: editingPromotion.id, data: values });
        } else {
            await createPromotion.mutateAsync(values);
        }
        setIsDialogOpen(false);
        setEditingPromotion(null);
        form.reset();
    };

    const handleEdit = (promo: Promotion) => {
        setEditingPromotion(promo);
        form.reset({
            type: promo.type,
            duration_days: promo.duration_days,
            price: promo.price.toString(),
            priority_weight: promo.priority_weight,
            is_available: promo.is_available,
        });
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingPromotion(null);
        form.reset({
            type: "standard_boost",
            duration_days: 7,
            price: "5000",
            priority_weight: 10,
            is_available: true,
        });
        setIsDialogOpen(true);
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
                <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                    <div className="p-12 space-y-4">
                        <Skeleton className="h-12 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                        <Skeleton className="h-20 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    const promotionsList = Array.isArray(promotions) ? promotions : [];

    return (
        <div className="space-y-8 pb-20 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="text-amber-500 w-5 h-5" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Marketing Intelligence</h3>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">Promotional Packages</h2>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                        Manage asset boosting tiers and visibility enhancements.
                        Define pricing for 'Featured' and 'Boosted' statuses to drive marketplace engagement.
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-[#003399] hover:bg-blue-800 rounded-2xl px-8 h-14 font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/10"
                >
                    <Plus size={16} className="mr-2" />
                    Create Package
                </Button>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <Zap size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">{promotionsList.length}</div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Packages</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">{promotionsList.filter((p: Promotion) => p.is_available).length}</div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Tiers</p>
                    </div>
                </div>
                <div className="bg-[#003399] p-6 rounded-[2rem] shadow-xl shadow-blue-900/10 flex items-center gap-6 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                        <TrendingUp size={80} />
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center relative z-10">
                        <ArrowUpRight size={24} />
                    </div>
                    <div className="relative z-10">
                        <div className="text-2xl font-black">MARKET</div>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Growth Phase</p>
                    </div>
                </div>
            </div>

            {/* Promotions Table */}
            <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Promotion Identity</TableHead>
                                <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Priority Weight</TableHead>
                                <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Duration Range</TableHead>
                                <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Fiscal Value</TableHead>
                                <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Integrity Status</TableHead>
                                <TableHead className="py-7 px-8 text-right text-[11px] font-black uppercase tracking-widest text-[#0066CC]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {promotionsList.map((promo: Promotion) => (
                                <TableRow key={promo.id} className="group border-slate-50 transition-colors hover:bg-slate-50/50">
                                    <TableCell className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#003399] group-hover:text-white transition-all">
                                                <Zap size={16} />
                                            </div>
                                            <div>
                                                <div className="font-black text-slate-900 text-sm uppercase tracking-tight">{(promo.type || 'Boost').replace('_', ' ')}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Artifact ID: #{promo.id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6 px-8">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#003399]"
                                                    style={{ width: `${Math.min(promo.priority_weight, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-900">{promo.priority_weight}w</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6 px-8">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight tabular-nums">
                                            <Clock size={14} className="text-slate-300" />
                                            {promo.duration_days} Days
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-6 px-8 font-black text-[#003399] text-sm tabular-nums">
                                        ₦{parseFloat(promo.price).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="py-6 px-8">
                                        {promo.is_available ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider w-fit">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Available
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider w-fit">
                                                <XCircle className="w-3 h-3" />
                                                Suspended
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-6 px-8 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger render={
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-sm">
                                                    <MoreVertical className="w-4 h-4 text-slate-400" />
                                                </Button>
                                            } />
                                            <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 p-2 min-w-[160px]">
                                                <DropdownMenuItem
                                                    onClick={() => handleEdit(promo)}
                                                    className="rounded-xl font-bold text-xs uppercase tracking-wider py-3 cursor-pointer"
                                                >
                                                    <Edit3 size={14} className="mr-2 text-blue-600" />
                                                    Modify Package
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Sync Status */}
            <div className="flex items-center justify-between px-10 py-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Marketing Registry • Synchronization Success</span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} />
                    Last Sync: {format(new Date(), 'MMM dd, HH:mm')}
                </div>
            </div>

            {/* Promotion Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-10 border-b border-slate-50 bg-white">
                        <DialogHeader className="space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-amber-600" />
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Marketing & Visibility</span>
                            </div>
                            <DialogTitle className="text-2xl font-bold text-slate-900">
                                {editingPromotion ? 'Edit Promotion Package' : 'Create Promotion'}
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium text-sm">
                                {editingPromotion
                                    ? `Update the visibility settings and pricing for this marketing package.`
                                    : 'Create a new promotion package to help vendors increase listing exposure.'}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-10 bg-white">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem className="col-span-3">
                                                <FormLabel className="text-xs font-bold text-slate-700">Promotion Type</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 focus:border-amber-600 transition-all">
                                                            <SelectValue placeholder="Select package type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                                        <SelectItem value="standard_boost">Standard Boost</SelectItem>
                                                        <SelectItem value="premium_featured">Premium Featured</SelectItem>
                                                        <SelectItem value="homepage_spotlight">Homepage Spotlight</SelectItem>
                                                        <SelectItem value="verified_urgent">Verified Urgent</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-xs" />
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
                                                    <Input type="number" className="h-12 rounded-xl border-slate-200 focus:border-amber-500/40 focus:ring-0 transition-all" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Price (₦)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="h-12 rounded-xl border-slate-200 focus:border-amber-500/40 focus:ring-0 transition-all" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-[10px] font-bold" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="priority_weight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold text-slate-700">Display Priority (1-100)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" className="h-11 rounded-xl border-slate-200 focus:border-amber-600 transition-all" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="is_available"
                                        render={({ field }) => (
                                            <FormItem className="col-span-3 flex flex-row items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50/30 mt-auto">
                                                <div className="space-y-1">
                                                    <FormLabel className="text-sm font-bold text-slate-700">Package Availability</FormLabel>
                                                    <FormDescription className="text-xs text-slate-500">Enable this package for listing.</FormDescription>
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
                                        disabled={createPromotion.isPending || updatePromotion.isPending}
                                        className="bg-amber-600 hover:bg-amber-700 rounded-xl px-12 h-12 font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-900/10 text-white transition-all"
                                    >
                                        {(createPromotion.isPending || updatePromotion.isPending) ? (
                                            <Loader2 size={16} className="animate-spin mr-2" />
                                        ) : null}
                                        {editingPromotion ? 'Update Package' : 'Create Package'}
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
