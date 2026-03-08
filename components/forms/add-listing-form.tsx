'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateListing } from '@/hooks/useListings';
import { Loader2, Upload, X, Car, Plus, Coins, FileText, Zap, Compass } from 'lucide-react';

const formSchema = z.object({
    listingTypeId: z.string().min(1, { message: 'Required' }),
    title: z.string().min(3, { message: 'Title is too short' }),
    description: z.string().min(10, { message: 'Description should be more detailed' }),
    amount: z.string().min(1, { message: 'Required' }),
    isNegotiable: z.boolean(),
    make: z.string().min(1, { message: 'Required' }),
    model: z.string().min(1, { message: 'Required' }),
    year: z.string().min(1, { message: 'Required' }),
    transmission: z.string().min(1, { message: 'Required' }),
    fuelType: z.string().min(1, { message: 'Required' }),
    mileage: z.string().min(1, { message: 'Required' }),
});

type FormValues = z.infer<typeof formSchema>;

export function AddListingForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createListing = useCreateListing();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            listingTypeId: '1',
            title: '',
            description: '',
            amount: '',
            isNegotiable: false,
            make: '',
            model: '',
            year: new Date().getFullYear().toString(),
            transmission: 'automatic',
            fuelType: 'petrol',
            mileage: '',
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        addImages(files);
    };

    const addImages = (files: File[]) => {
        setImages((prev) => [...prev, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previews[index]);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    async function onSubmit(values: FormValues) {
        if (images.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            const keyMap: Record<string, string> = {
                listingTypeId: 'listing_type_id',
                isNegotiable: 'is_negotiable',
                fuelType: 'fuel_type',
            };

            Object.entries(values).forEach(([key, value]) => {
                const apiKey = keyMap[key] || key;
                if (key === 'isNegotiable') {
                    formData.append(apiKey, value ? '1' : '0');
                } else {
                    formData.append(apiKey, String(value));
                }
            });

            images.forEach((image) => {
                formData.append('images[]', image);
            });

            await createListing.mutateAsync(formData);
            toast.success('Listing initialized successfully');
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to initialize listing protocol');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Primary Asset Identity */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Car className="text-[#0066CC] w-5 h-5" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Asset Identity</h3>
                        </div>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Listing Handle</FormLabel>
                                    <FormControl>
                                        <Input placeholder="2020 Toyota Camry XLE" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-semibold" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="make"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Make</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Toyota" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Model</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Camry" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Year</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold text-center" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-center gap-2 mb-2 pt-2">
                            <Compass className="text-[#00AAFF] w-5 h-5" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Vehicle Specs</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="transmission"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transmission</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-2xl border-slate-100">
                                                <SelectItem value="automatic">Automatic</SelectItem>
                                                <SelectItem value="manual">Manual</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fuelType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fuel Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold">
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-2xl border-slate-100">
                                                <SelectItem value="petrol">Petrol</SelectItem>
                                                <SelectItem value="diesel">Diesel</SelectItem>
                                                <SelectItem value="electric">Electric</SelectItem>
                                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="mileage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mileage (KM)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input type="number" placeholder="45000" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-semibold" />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-slate-300">KM</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Operational & Descriptive Data */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="text-[#00AAFF] w-5 h-5" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Asset Parameters</h3>
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Full Specification</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Provide a comprehensive breakdown of the vehicle condition, history, and key tech stack..."
                                            className="min-h-[120px] rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all font-medium p-4"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-6 pt-2">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Asset Valuation ($)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                                <Input type="number" placeholder="5,000,000" {...field} className="h-14 rounded-xl bg-slate-50 border-slate-100 focus:bg-white pl-8 transition-all font-bold text-xl text-[#0066CC]" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isNegotiable"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-2xl border border-slate-100 p-4 bg-slate-50/50">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="w-5 h-5 rounded-md border-slate-300 data-[state=checked]:bg-[#0066CC]"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-bold text-slate-700 cursor-pointer">Negotiable Valuation</FormLabel>
                                            <p className="text-[10px] text-slate-400 font-medium">Permit buyers to propose alternative asset valuations.</p>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="listingTypeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Listing Protocol</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-semibold">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                            <SelectItem value="1">Standard Vehicle Listing</SelectItem>
                                            <SelectItem value="2">Luxury Collection</SelectItem>
                                            <SelectItem value="3">Auction Protocol</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Asset Visualization */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Upload className="text-[#0066CC] w-5 h-5" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Visual Documentation</h3>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Min 2 Assets Recommended</span>
                    </div>

                    <div
                        className="group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-[#0066CC] hover:bg-blue-50/50 transition-all duration-300"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                            e.preventDefault(); e.stopPropagation();
                            const files = Array.from(e.dataTransfer.files);
                            addImages(files);
                        }}
                    >
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#0066CC] group-hover:text-white transition-all shadow-sm">
                            <Upload size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-slate-900">Upload Asset Media</p>
                            <p className="text-xs font-medium text-slate-400 mt-1">Drag and drop high-resolution JPG/PNG files.</p>
                        </div>
                        <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                    </div>

                    {previews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-xl group">
                                    <img src={preview} alt="Asset Preview" className="object-cover w-full h-full transition-transform group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(index); }} className="bg-white/20 backdrop-blur-md text-white rounded-xl p-2 hover:bg-rose-500 transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-8 border-t border-slate-100">
                    <Button type="submit" className="w-full h-16 rounded-[1.5rem] text-lg font-bold bg-[#0066CC] hover:bg-blue-700 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Synchronizing Network Protocol...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-5 w-5" />
                                Finalize Asset Deployment
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
