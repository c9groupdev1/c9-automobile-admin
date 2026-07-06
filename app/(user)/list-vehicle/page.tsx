'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    usePublicVehicleMakes, 
    usePublicVehicleModels, 
    useVehicleMetadata, 
    useVerifyVin, 
    useSubmitListingStep1, 
    useSubmitListingStep2, 
    useSubmitListingStep3 
} from '@/hooks/useUserListings';
import { useUserMarketplaceListing } from '@/hooks/useUserMarketplace';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Car, 
    Image as ImageIcon, 
    DollarSign, 
    Loader2, 
    ArrowRight, 
    ArrowLeft, 
    Check, 
    X, 
    Upload, 
    Star, 
    Info, 
    ShieldAlert, 
    MapPin, 
    Sliders 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface UploadImage {
    file?: File;
    url: string;
    isPrimary: boolean;
    id?: string; // For existing draft images
}

const POPULAR_COLORS = [
    'Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Brown', 'Green', 'Beige', 'Yellow',
    'Gold', 'Orange', 'Purple', 'Bronze', 'Burgundy', 'Charcoal', 'Pearl White', 'Matte Black',
    'Navy Blue', 'Sky Blue', 'Teal', 'Turquoise', 'Maroon', 'Crimson', 'Ruby Red', 'Forest Green',
    'Olive Green', 'Lime Green', 'Champagne', 'Ivory', 'Cream', 'Tan', 'Sand', 'Espresso',
    'Copper', 'Rust', 'Indigo', 'Violet', 'Magenta', 'Pink', 'Rose Gold', 'Metallic Silver',
    'Metallic Gray', 'Metallic Blue', 'Metallic Red', 'Gunmetal', 'Graphite', 'Midnight Blue',
    'Slate', 'Titanium', 'Platinum', 'Sapphire', 'Emerald', 'Topaz', 'Amethyst', 'Amber',
    'Onyx', 'Obsidian', 'Quartz', 'Cobalt', 'Denim', 'Electric Blue', 'Ocean Blue', 'Ice Blue',
    'Cherry Red', 'Wine Red', 'Mahogany', 'Auburn', 'Terracotta', 'Coral', 'Peach',
    'Mint Green', 'Sage Green', 'Khaki', 'Mustard', 'Lemon', 'Neon Yellow', 'Neon Green'
].sort();

const getColorCssValue = (colorName: string) => {
    const specialMap: Record<string, string> = {
        'Pearl White': '#F8F9FA',
        'Matte Black': '#28282B',
        'Navy Blue': '#000080',
        'Sky Blue': '#87CEEB',
        'Forest Green': '#228B22',
        'Olive Green': '#556B2F',
        'Lime Green': '#32CD32',
        'Rose Gold': '#B76E79',
        'Metallic Silver': '#A8A9AD',
        'Metallic Gray': '#8A8D8F',
        'Metallic Blue': '#32527B',
        'Metallic Red': '#A42A04',
        'Gunmetal': '#2A3439',
        'Midnight Blue': '#191970',
        'Ice Blue': '#99FFFF',
        'Cherry Red': '#D2042D',
        'Wine Red': '#722F37',
        'Mint Green': '#98FF98',
        'Sage Green': '#9DC183',
        'Neon Yellow': '#FFFF33',
        'Neon Green': '#39FF14',
        'Charcoal': '#36454F',
        'Burgundy': '#800020',
        'Teal': '#008080',
        'Turquoise': '#40E0D0',
        'Maroon': '#800000',
        'Crimson': '#DC143C',
        'Ruby Red': '#9B111E',
        'Champagne': '#F7E7CE',
        'Ivory': '#FFFFF0',
        'Cream': '#FFFDD0',
        'Tan': '#D2B48C',
        'Sand': '#C2B280',
        'Espresso': '#4E312D',
        'Copper': '#B87333',
        'Rust': '#B7410E',
        'Indigo': '#4B0082',
        'Violet': '#EE82EE',
        'Magenta': '#FF00FF',
        'Pink': '#FFC0CB',
        'Graphite': '#594D5B',
        'Slate': '#708090',
        'Titanium': '#878681',
        'Platinum': '#E5E4E2',
        'Sapphire': '#0F52BA',
        'Emerald': '#50C878',
        'Topaz': '#FFC87C',
        'Amethyst': '#9966CC',
        'Amber': '#FFBF00',
        'Onyx': '#353839',
        'Obsidian': '#4B0082',
        'Quartz': '#51484F',
        'Cobalt': '#0047AB',
        'Denim': '#1560BD',
        'Electric Blue': '#7DF9FF',
        'Ocean Blue': '#4F42B5',
        'Mahogany': '#C04000',
        'Auburn': '#A52A2A',
        'Terracotta': '#E2725B',
        'Coral': '#FF7F50',
        'Peach': '#FFE5B4',
        'Khaki': '#F0E68C',
        'Mustard': '#FFDB58',
        'Lemon': '#FFF700',
    };
    return specialMap[colorName] || colorName.toLowerCase();
};

const colorOptions = [
    ...POPULAR_COLORS.map(c => ({ 
        label: c, 
        value: c,
        icon: <div className="w-3.5 h-3.5 rounded-full border border-slate-200/50 shadow-sm flex-shrink-0" style={{ backgroundColor: getColorCssValue(c) }} />
    })),
    { 
        label: '+ Add Custom Color', 
        value: 'CUSTOM_COLOR',
        icon: <div className="w-3.5 h-3.5 rounded-full border border-slate-200 flex-shrink-0 bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500" />
    }
];

function ListVehicleFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editListingId = searchParams.get('listingId');

    // Wizard step state
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [listingId, setListingId] = useState<string | null>(editListingId);

    // Fetch existing listing details if editing
    const { data: initialListing, isLoading: isLoadingDraft } = useUserMarketplaceListing(listingId || '');

    // Form inputs state - Step 1
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [bodyType, setBodyType] = useState('');
    const [trimVariant, setTrimVariant] = useState('');
    const [condition, setCondition] = useState('Foreign Used');
    const [transmission, setTransmission] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [bodyColor, setBodyColor] = useState('');
    const [interiorColor, setInteriorColor] = useState('');
    const [isCustomBodyColor, setIsCustomBodyColor] = useState(false);
    const [isCustomInteriorColor, setIsCustomInteriorColor] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState('Unregistered');
    const [description, setDescription] = useState('');
    const [vin, setVin] = useState('');
    const [isVinVerified, setIsVinVerified] = useState(false);

    // Engine/Specs conditions
    const [engineType, setEngineType] = useState('');
    const [engineCondition, setEngineCondition] = useState('Excellent');
    const [transmissionCondition, setTransmissionCondition] = useState('Excellent');
    const [suspensionCondition, setSuspensionCondition] = useState('Excellent');
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    // Form inputs state - Step 2
    const [uploadedImages, setUploadedImages] = useState<UploadImage[]>([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]);

    // Form inputs state - Step 3
    const [amount, setAmount] = useState('');
    const [isNegotiable, setIsNegotiable] = useState(false);
    const [inspectionAccepted, setInspectionAccepted] = useState(false);
    const [stateId, setStateId] = useState<string | number>('');
    const [city, setCity] = useState('');
    const [area, setArea] = useState('');
    const [landmark, setLandmark] = useState('');

    // Queries
    const { data: makesData, isLoading: isLoadingMakes } = usePublicVehicleMakes();
    const { data: modelsData, isLoading: isLoadingModels } = usePublicVehicleModels(
        makesData?.find((m: any) => m.name === make)?.id
    );
    const { trims, engineTypes, features, fuelTypes, transmissions, states, isLoading: isLoadingMeta } = useVehicleMetadata();

    // Mutations
    const verifyVinMutation = useVerifyVin();
    const submitStep1Mutation = useSubmitListingStep1();
    const submitStep2Mutation = useSubmitListingStep2();
    const submitStep3Mutation = useSubmitListingStep3();

    // Prefill data if listingId / draft exists
    useEffect(() => {
        if (initialListing) {
            const bi = initialListing.basicInfo || initialListing.vehicleInformation || {};
            setMake(bi.make || initialListing.car?.make || '');
            setModel(bi.model || initialListing.car?.model || '');
            setYear(bi.year?.toString() || initialListing.car?.year?.toString() || '');
            setBodyType(bi.bodyType || '');
            setTrimVariant(bi.trimVariant || '');
            setCondition(bi.condition || initialListing.condition || 'Foreign Used');
            setTransmission(bi.transmission || initialListing.car?.transmission || '');
            setFuelType(bi.fuelType || initialListing.car?.fuel_type || '');
            
            const fetchedBodyColor = bi.bodyColor || bi.exteriorColor || '';
            const fetchedInteriorColor = bi.interiorColor || '';
            
            setBodyColor(fetchedBodyColor);
            setIsCustomBodyColor(fetchedBodyColor && !POPULAR_COLORS.includes(fetchedBodyColor));

            setInteriorColor(fetchedInteriorColor);
            setIsCustomInteriorColor(fetchedInteriorColor && !POPULAR_COLORS.includes(fetchedInteriorColor));

            setRegistrationStatus(bi.registrationStatus || 'Unregistered');
            setDescription(initialListing.description || '');
            setVin(bi.vinChassisNumber || '');
            setIsVinVerified(bi.isVinVerified || false);

            const spec = initialListing.specifications || {};
            setEngineType(bi.engineType || '');
            setEngineCondition(spec.engineCondition || 'Excellent');
            setTransmissionCondition(spec.transmissionCondition || 'Excellent');
            setSuspensionCondition(spec.suspensionCondition || 'Excellent');

            setSelectedFeatures(initialListing.features?.keyFeatures || initialListing.carFeatures || []);

            // Media
            if (initialListing.mediaReview?.images) {
                const draftImgs = initialListing.mediaReview.images.map((m: any) => ({
                    id: m.id,
                    url: m.url,
                    isPrimary: m.isPrimary || m.is_primary || false
                }));
                setUploadedImages(draftImgs);
            }
            setVideoUrl(bi.videoUrl || '');

            // Pricing / location
            const pl = initialListing.pricingAndLocation || {};
            setAmount(pl.amount?.toString() || '');
            setIsNegotiable(pl.isNegotiable || false);
            setInspectionAccepted(pl.inspectionAccepted || false);
            setStateId(pl.state?.id || '');
            setCity(pl.location?.city || '');
            setArea(pl.location?.area || '');
            setLandmark(pl.location?.landmark || '');
        }
    }, [initialListing]);

    // Handle VIN verification
    const handleVerifyVin = async () => {
        if (!vin || vin.length < 15 || vin.length > 17) {
            toast.error('Invalid VIN', { description: 'Please enter a valid 15-17 character VIN.' });
            return;
        }

        try {
            const res = await verifyVinMutation.mutateAsync(vin);
            if (res.success && res.data?.status) {
                const vinData = res.data.data;
                const source = res.data.source;

                if (vinData.vin) setVin(vinData.vin);

                if (source === 'local') {
                    setIsVinVerified(true);
                    toast.success('VIN Verified', { description: 'Locally assembled vehicle verified. Please enter details manually.' });
                } else {
                    setMake(vinData.make || '');
                    setYear(vinData.year || '');
                    setBodyType(vinData.body_class || '');
                    setIsVinVerified(true);
                    toast.success('VIN Verified', { 
                        description: `Vehicle identified as ${vinData.year || ''} ${vinData.make || ''} ${vinData.model || ''}. Specs prefilled.`
                    });
                }
            } else {
                toast.error('Verification Failed', { description: 'Could not identify this VIN. Enter specs manually.' });
            }
        } catch (error) {
            toast.error('Verification Error', { description: 'Glitch verifying VIN. Fill details manually.' });
        }
    };

    // Step 1 Submit
    const handleStep1Submit = async () => {
        if (!make || !model || !year || !condition || !description) {
            toast.error('Missing fields', { description: 'Please fill in all required basic vehicle specs.' });
            return;
        }

        try {
            const payload = {
                listingTypeId: '1',
                listingId: listingId || undefined,
                title: `${year} ${make} ${model}`.trim(),
                description,
                make,
                model,
                year: parseInt(year),
                bodyType: bodyType || undefined,
                trimVariant: trimVariant || undefined,
                condition,
                registrationStatus,
                transmission: transmission || undefined,
                fuelType: fuelType || undefined,
                bodyColor: bodyColor || undefined,
                interiorColor: interiorColor || undefined,
                vinChassisNumber: vin || undefined,
                engineType: engineType || undefined,
                engineCondition,
                transmissionCondition,
                suspensionCondition,
                keyFeatures: selectedFeatures.length > 0 ? selectedFeatures : undefined,
            };

            const res = await submitStep1Mutation.mutateAsync(payload);
            if (res.success) {
                setListingId(res.data.id);
                toast.success('Step 1 Saved!');
                setStep(2);
            }
        } catch (error: any) {
            toast.error('Submission Failed', { description: error.response?.data?.message || 'Could not save specs.' });
        }
    };

    // Step 2 Media handles
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImgs: UploadImage[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            newImgs.push({
                file,
                url: URL.createObjectURL(file),
                isPrimary: uploadedImages.length === 0 && i === 0, // Set first image as primary if list is empty
            });
        }
        setUploadedImages(prev => [...prev, ...newImgs]);
    };

    const handleRemoveImage = (index: number) => {
        const target = uploadedImages[index];
        if (target.id) {
            setDeletedMediaIds(prev => [...prev, target.id!]);
        }
        setUploadedImages(prev => {
            const copy = [...prev];
            copy.splice(index, 1);
            // If primary image was removed, make the first remaining image primary
            if (target.isPrimary && copy.length > 0) {
                copy[0].isPrimary = true;
            }
            return copy;
        });
    };

    const handleSetPrimaryImage = (index: number) => {
        setUploadedImages(prev => 
            prev.map((img, idx) => ({
                ...img,
                isPrimary: idx === index
            }))
        );
    };

    // Step 2 Submit
    const handleStep2Submit = async () => {
        if (uploadedImages.length === 0) {
            toast.error('Media required', { description: 'Please upload at least 1 image of your vehicle.' });
            return;
        }

        if (!listingId) return;

        try {
            const formData = new FormData();
            formData.append('listingId', listingId);

            uploadedImages.forEach((img, idx) => {
                if (img.file) {
                    formData.append('images[]', img.file);
                }
            });

            const primaryIdx = uploadedImages.findIndex(img => img.isPrimary);
            if (primaryIdx !== -1) {
                formData.append('isPrimary', String(primaryIdx));
                formData.append('is_primary', String(primaryIdx));
            }

            if (deletedMediaIds.length > 0) {
                deletedMediaIds.forEach((id, idx) => {
                    formData.append(`deletedMediaIds[${idx}]`, id);
                });
            }

            if (videoUrl) {
                formData.append('videoUrl', videoUrl);
            }

            const res = await submitStep2Mutation.mutateAsync(formData);
            if (res.success) {
                toast.success('Media Uploaded!');
                setStep(3);
            }
        } catch (error: any) {
            toast.error('Media upload failed', { description: error.response?.data?.message || 'Could not save images.' });
        }
    };

    // Step 3 Submit
    const handleStep3Submit = async () => {
        if (!amount || !stateId || !city) {
            toast.error('Missing fields', { description: 'Please fill in price, state, and city.' });
            return;
        }

        if (!listingId) return;

        try {
            const payload = {
                listingId,
                amount: parseFloat(amount),
                isNegotiable,
                inspectionAccepted,
                stateId,
                city,
                area,
                landmark: landmark || undefined,
            };

            const res = await submitStep3Mutation.mutateAsync(payload);
            if (res.success) {
                toast.success('Congratulations!', { description: 'Your vehicle has been submitted for review.' });
                router.push('/account');
            }
        } catch (error: any) {
            toast.error('Listing Failed', { description: error.response?.data?.message || 'Could not post listing.' });
        }
    };

    const handleSaveDraft = async () => {
        if (!make || !model) {
            toast.error('Incomplete Info', { description: 'Please select at least Make and Model to save a draft.' });
            return;
        }

        try {
            // Save step 1 details as draft
            const payload = {
                listingTypeId: '1',
                listingId: listingId || undefined,
                title: `${year} ${make} ${model}`.trim() || 'Untitled Vehicle Draft',
                description: description || 'Draft description',
                make,
                model,
                year: year ? parseInt(year) : 0,
                bodyType: bodyType || undefined,
                trimVariant: trimVariant || undefined,
                condition,
                registrationStatus,
                transmission: transmission || undefined,
                fuelType: fuelType || undefined,
                bodyColor: bodyColor || undefined,
                interiorColor: interiorColor || undefined,
                vinChassisNumber: vin || undefined,
                engineType: engineType || undefined,
                engineCondition,
                transmissionCondition,
                suspensionCondition,
                keyFeatures: selectedFeatures.length > 0 ? selectedFeatures : undefined,
            };

            const res = await submitStep1Mutation.mutateAsync(payload);
            if (res.success) {
                toast.success('Draft Saved!', { description: 'You can complete your listing anytime from your Account.' });
                router.push('/account');
            }
        } catch (err) {
            toast.error('Save Draft Failed');
        }
    };

    const toggleFeature = (feat: string) => {
        setSelectedFeatures(prev => 
            prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
        );
    };

    const makeOptions = makesData?.map((m: any) => ({ label: m.name, value: m.name })) || [];
    const modelOptions = modelsData?.map((m: any) => ({ label: m.name, value: m.name })) || [];
    const stateOptions = states.data?.map((s: any) => ({ label: s.name, value: s.id })) || [];

    const getSelectedStateName = () => {
        const found = states.data?.find((s: any) => s.id === stateId);
        return found ? found.name : 'Select State';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">List Your Vehicle</h1>
                <p className="text-slate-500 font-semibold text-sm mt-1">
                    Submit your vehicle to the C9X certified marketplace
                </p>
            </div>

            {/* Progress Header */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex -space-x-1.5">
                        {[1, 2, 3].map((num) => (
                            <div 
                                key={num}
                                className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold transition-all relative z-10 ${
                                    step >= num ? 'bg-[#003399] text-white' : 'bg-slate-100 text-slate-400'
                                }`}
                            >
                                {num}
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase text-slate-400">Step {step} of 3</p>
                        <p className="text-sm font-bold text-slate-800">
                            {step === 1 && 'Basic Specs & Specifications'}
                            {step === 2 && 'Media Upload & Walkthrough'}
                            {step === 3 && 'Pricing & Location'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Button 
                        variant="ghost" 
                        onClick={handleSaveDraft}
                        className="rounded-xl h-11 border-slate-100 text-slate-500 font-bold text-xs"
                    >
                        Save as Draft
                    </Button>
                </div>
            </div>

            {/* Step Panel Content */}
            <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden">
                <CardContent className="p-6 md:p-10">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <Car size={18} className="text-[#003399]" />
                                        Vehicle Specifications
                                    </h3>

                                    {/* VIN Checker */}
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid md:grid-cols-[1fr_140px] items-end gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-1">
                                                <label className="text-xs font-bold text-slate-700 ml-1">VIN / Chassis Number</label>
                                                <span title="Inputting a verified VIN auto-populates specs details.">
                                                    <Info size={13} className="text-slate-400 cursor-help" />
                                                </span>
                                            </div>
                                            <Input
                                                placeholder="Enter 17-digit VIN"
                                                value={vin}
                                                onChange={(e) => setVin(e.target.value.toUpperCase())}
                                                maxLength={17}
                                                className="bg-white h-12 uppercase rounded-xl"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleVerifyVin}
                                            disabled={verifyVinMutation.isPending}
                                            className="h-12 bg-white hover:bg-slate-100 text-[#003399] border border-[#003399]/20 rounded-xl font-bold text-xs w-full"
                                        >
                                            {verifyVinMutation.isPending ? 'Verifying...' : 'Verify VIN'}
                                        </Button>
                                    </div>

                                    {/* Make / Model / Year Grid */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Brand / Make *</label>
                                            <SearchableDropdown
                                                options={makeOptions}
                                                value={make}
                                                onChange={(val) => setMake(String(val))}
                                                placeholder="Select Make"
                                                loading={isLoadingMakes}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Model *</label>
                                            <SearchableDropdown
                                                options={modelOptions}
                                                value={model}
                                                onChange={(val) => setModel(String(val))}
                                                placeholder="Select Model"
                                                disabled={!make}
                                                loading={isLoadingModels}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Year Model *</label>
                                            <select
                                                value={year}
                                                onChange={(e) => setYear(e.target.value)}
                                                className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none shadow-sm"
                                            >
                                                <option value="">Select Year</option>
                                                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Fuel, Trans, Trim Variant */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Transmission</label>
                                            <select
                                                value={transmission}
                                                onChange={(e) => setTransmission(e.target.value)}
                                                className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none shadow-sm"
                                            >
                                                <option value="">Select Transmission</option>
                                                {transmissions.data?.map((t: any) => {
                                                    const val = typeof t === 'string' ? t : t.name || '';
                                                    const key = typeof t === 'string' ? t : t.id || t.name || '';
                                                    return <option key={key} value={val}>{val}</option>;
                                                })}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Fuel Type</label>
                                            <select
                                                value={fuelType}
                                                onChange={(e) => setFuelType(e.target.value)}
                                                className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none shadow-sm"
                                            >
                                                <option value="">Select Fuel Type</option>
                                                {fuelTypes.data?.map((f: any) => {
                                                    const val = typeof f === 'string' ? f : f.name || '';
                                                    const key = typeof f === 'string' ? f : f.id || f.name || '';
                                                    return <option key={key} value={val}>{val}</option>;
                                                })}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Trim / Variant</label>
                                            <select
                                                value={trimVariant}
                                                onChange={(e) => setTrimVariant(e.target.value)}
                                                className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none shadow-sm"
                                            >
                                                <option value="">Select Trim</option>
                                                {trims.data?.map((t: any) => {
                                                    const val = typeof t === 'string' ? t : t.name || '';
                                                    const key = typeof t === 'string' ? t : t.id || t.name || '';
                                                    return <option key={key} value={val}>{val}</option>;
                                                })}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Color Pickers */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Exterior Color</label>
                                            <SearchableDropdown
                                                options={colorOptions}
                                                value={isCustomBodyColor ? 'CUSTOM_COLOR' : bodyColor}
                                                onChange={(val) => {
                                                    if (val === 'CUSTOM_COLOR') {
                                                        setIsCustomBodyColor(true);
                                                        setBodyColor('');
                                                    } else {
                                                        setIsCustomBodyColor(false);
                                                        setBodyColor(String(val));
                                                    }
                                                }}
                                                placeholder="Select Exterior Color"
                                            />
                                            {isCustomBodyColor && (
                                                <div className="mt-2 flex gap-2">
                                                    <div className="relative">
                                                        <Input
                                                            type="color"
                                                            value={bodyColor.startsWith('#') ? bodyColor : '#ffffff'}
                                                            onChange={(e) => setBodyColor(e.target.value)}
                                                            className="w-12 h-12 p-1 rounded-xl cursor-pointer border-slate-200"
                                                        />
                                                    </div>
                                                    <Input
                                                        placeholder="Enter Custom Exterior Color"
                                                        value={bodyColor}
                                                        onChange={(e) => setBodyColor(e.target.value)}
                                                        className="bg-slate-50 h-12 rounded-xl flex-1 border-slate-200"
                                                        autoFocus
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Interior Color</label>
                                            <SearchableDropdown
                                                options={colorOptions}
                                                value={isCustomInteriorColor ? 'CUSTOM_COLOR' : interiorColor}
                                                onChange={(val) => {
                                                    if (val === 'CUSTOM_COLOR') {
                                                        setIsCustomInteriorColor(true);
                                                        setInteriorColor('');
                                                    } else {
                                                        setIsCustomInteriorColor(false);
                                                        setInteriorColor(String(val));
                                                    }
                                                }}
                                                placeholder="Select Interior Color"
                                            />
                                            {isCustomInteriorColor && (
                                                <div className="mt-2 flex gap-2">
                                                    <div className="relative">
                                                        <Input
                                                            type="color"
                                                            value={interiorColor.startsWith('#') ? interiorColor : '#ffffff'}
                                                            onChange={(e) => setInteriorColor(e.target.value)}
                                                            className="w-12 h-12 p-1 rounded-xl cursor-pointer border-slate-200"
                                                        />
                                                    </div>
                                                    <Input
                                                        placeholder="Enter Custom Interior Color"
                                                        value={interiorColor}
                                                        onChange={(e) => setInteriorColor(e.target.value)}
                                                        className="bg-slate-50 h-12 rounded-xl flex-1 border-slate-200"
                                                        autoFocus
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Condition and Registration */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Condition *</label>
                                            <select
                                                value={condition}
                                                onChange={(e) => setCondition(e.target.value)}
                                                className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white shadow-sm"
                                            >
                                                <option value="Foreign Used">Foreign Used</option>
                                                <option value="Local Used">Local Used</option>
                                                <option value="Brand New">Brand New</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Registration Status *</label>
                                            <select
                                                value={registrationStatus}
                                                onChange={(e) => setRegistrationStatus(e.target.value)}
                                                className="h-12 w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white shadow-sm"
                                            >
                                                <option value="Unregistered">Unregistered</option>
                                                <option value="Registered">Registered</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Engine, trans condition spec options */}
                                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Health Condition</h4>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">Engine Health</label>
                                                <select value={engineCondition} onChange={(e) => setEngineCondition(e.target.value)} className="h-10 w-full rounded-xl bg-white border border-slate-100 px-3 text-xs font-semibold text-slate-800">
                                                    <option value="Excellent">Excellent</option>
                                                    <option value="Good">Good</option>
                                                    <option value="Needs Work">Needs Work</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">Transmission Health</label>
                                                <select value={transmissionCondition} onChange={(e) => setTransmissionCondition(e.target.value)} className="h-10 w-full rounded-xl bg-white border border-slate-100 px-3 text-xs font-semibold text-slate-800">
                                                    <option value="Excellent">Excellent</option>
                                                    <option value="Good">Good</option>
                                                    <option value="Needs Work">Needs Work</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">Suspension Health</label>
                                                <select value={suspensionCondition} onChange={(e) => setSuspensionCondition(e.target.value)} className="h-10 w-full rounded-xl bg-white border border-slate-100 px-3 text-xs font-semibold text-slate-800">
                                                    <option value="Excellent">Excellent</option>
                                                    <option value="Good">Good</option>
                                                    <option value="Needs Work">Needs Work</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features multi-selector */}
                                    {features.data && (
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Key Features</label>
                                            <SearchableDropdown
                                                options={features.data
                                                    .filter((feat: any) => !selectedFeatures.includes(typeof feat === 'string' ? feat : feat.name || ''))
                                                    .map((feat: any) => {
                                                        const featName = typeof feat === 'string' ? feat : feat.name || '';
                                                        return { label: featName, value: featName };
                                                    })
                                                }
                                                value=""
                                                onChange={(val) => toggleFeature(String(val))}
                                                placeholder="Select feature to add"
                                            />
                                            {selectedFeatures.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                                    {selectedFeatures.map((feat) => (
                                                        <Badge
                                                            key={feat}
                                                            onClick={() => toggleFeature(feat)}
                                                            className="cursor-pointer bg-[#003399] text-white hover:bg-rose-500 border-transparent px-3 py-1.5 rounded-xl text-xs font-semibold select-none transition-all flex items-center"
                                                        >
                                                            {feat} <X size={12} className="ml-1.5 opacity-70" />
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 ml-1">Description *</label>
                                        <Textarea
                                            placeholder="Tell potential buyers about V6, leather seats, minor scratches, service history..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="bg-slate-50 h-32 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        onClick={handleStep1Submit}
                                        disabled={submitStep1Mutation.isPending}
                                        className="bg-[#003399] hover:bg-blue-800 text-white rounded-xl font-bold h-12 px-6 flex items-center gap-2"
                                    >
                                        {submitStep1Mutation.isPending ? 'Saving...' : 'Continue'}
                                        <ArrowRight size={16} />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <ImageIcon size={18} className="text-[#003399]" />
                                        Media & Showcase
                                    </h3>

                                    {/* Drag-n-drop dropzone */}
                                    <div className="border-2 border-dashed border-slate-200 hover:border-[#003399]/40 rounded-3xl p-10 bg-slate-50/50 hover:bg-blue-50/5 text-center transition-all cursor-pointer relative group">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <Upload className="mx-auto h-10 w-10 text-slate-400 group-hover:scale-110 group-hover:text-[#003399] transition-all mb-4" />
                                        <p className="text-sm font-bold text-slate-800">Drag & drop your vehicle images</p>
                                        <p className="text-xs text-slate-400 font-semibold mt-1">or click to browse local files (JPG, PNG, max 5MB)</p>
                                    </div>

                                    {/* Selected Images Grid */}
                                    {uploadedImages.length > 0 && (
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-slate-600 block ml-1">Uploaded Images ({uploadedImages.length})</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {uploadedImages.map((img, idx) => (
                                                    <div 
                                                        key={img.url + idx}
                                                        className={`relative aspect-video rounded-2xl overflow-hidden border bg-slate-50 group shadow-sm ${
                                                            img.isPrimary ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-100'
                                                        }`}
                                                    >
                                                        <img
                                                            src={img.url}
                                                            alt={`Upload preview ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />

                                                        {/* Primary image star indicator */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetPrimaryImage(idx)}
                                                            className={`absolute top-2 left-2 p-1.5 rounded-lg border backdrop-blur-sm shadow-sm transition-all ${
                                                                img.isPrimary 
                                                                    ? 'bg-amber-400 text-white border-transparent' 
                                                                    : 'bg-white/95 text-slate-400 hover:text-amber-500 border-slate-100'
                                                            }`}
                                                            title={img.isPrimary ? 'Primary Image' : 'Set as Primary'}
                                                        >
                                                            <Star size={12} fill={img.isPrimary ? 'currentColor' : 'transparent'} />
                                                        </button>

                                                        {/* Delete button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(idx)}
                                                            className="absolute top-2 right-2 p-1.5 bg-white/95 text-slate-400 hover:text-rose-500 rounded-lg border border-slate-100 shadow-sm"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Video URL Link */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 ml-1">Walkthrough Video Link (Optional)</label>
                                        <Input
                                            placeholder="YouTube or Vimeo URL"
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            className="bg-slate-50 h-12"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4 border-t border-slate-100">
                                    <Button
                                        onClick={() => setStep(1)}
                                        variant="outline"
                                        className="rounded-xl h-12 px-5 font-bold text-slate-600 border-slate-200 flex items-center gap-2"
                                    >
                                        <ArrowLeft size={16} />
                                        Back
                                    </Button>

                                    <Button
                                        onClick={handleStep2Submit}
                                        disabled={submitStep2Mutation.isPending}
                                        className="bg-[#003399] hover:bg-blue-800 text-white rounded-xl font-bold h-12 px-6 flex items-center gap-2"
                                    >
                                        {submitStep2Mutation.isPending ? 'Uploading...' : 'Continue'}
                                        <ArrowRight size={16} />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                                        <DollarSign size={18} className="text-[#003399]" />
                                        Pricing & Location Details
                                    </h3>

                                    {/* Pricing inputs */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Asking Price (₦) *</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-500">₦</span>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    className="bg-slate-50 h-12 pl-8 font-extrabold text-slate-900"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-center space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                            <div className="flex items-center space-x-3 ml-2">
                                                <Checkbox
                                                    id="negotiable"
                                                    checked={isNegotiable}
                                                    onCheckedChange={(checked) => setIsNegotiable(!!checked)}
                                                    className="rounded border-slate-300 text-[#003399] focus:ring-[#003399]"
                                                />
                                                <label htmlFor="negotiable" className="text-xs font-bold text-slate-700 cursor-pointer">
                                                    Price Negotiable
                                                </label>
                                            </div>
                                            <div className="flex items-center space-x-3 ml-2">
                                                <Checkbox
                                                    id="inspection"
                                                    checked={inspectionAccepted}
                                                    onCheckedChange={(checked) => setInspectionAccepted(!!checked)}
                                                    className="rounded border-slate-300 text-[#003399] focus:ring-[#003399]"
                                                />
                                                <label htmlFor="inspection" className="text-xs font-bold text-slate-700 cursor-pointer">
                                                    Accept Inspection Before Payment
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location details */}
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Location</h4>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">State *</label>
                                                <SearchableDropdown
                                                    options={stateOptions}
                                                    value={stateId}
                                                    onChange={(val) => setStateId(val)}
                                                    placeholder="Select State"
                                                    loading={states.isLoading}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">City / Area *</label>
                                                <Input
                                                    placeholder="e.g. Ikeja"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    className="bg-slate-50 h-12"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 block ml-1">Neighborhood (Optional)</label>
                                                <Input
                                                    placeholder="e.g. GRA"
                                                    value={area}
                                                    onChange={(e) => setArea(e.target.value)}
                                                    className="bg-slate-50 h-12"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 ml-1">Landmark / Nearby Stop (Optional)</label>
                                            <Input
                                                placeholder="e.g. Opposite Shoprite Mall"
                                                value={landmark}
                                                onChange={(e) => setLandmark(e.target.value)}
                                                className="bg-slate-50 h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                                        <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                                            <strong>Offline Policy:</strong> C9X does not process vehicle transactions online. All trades, inspections, and payments must happen offline between buyer and seller directly.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4 border-t border-slate-100">
                                    <Button
                                        onClick={() => setStep(2)}
                                        variant="outline"
                                        className="rounded-xl h-12 px-5 font-bold text-slate-600 border-slate-200 flex items-center gap-2"
                                    >
                                        <ArrowLeft size={16} />
                                        Back
                                    </Button>

                                    <Button
                                        onClick={handleStep3Submit}
                                        disabled={submitStep3Mutation.isPending}
                                        className="bg-[#003399] hover:bg-blue-800 text-white rounded-xl font-bold h-12 px-8 flex items-center gap-2 shadow-lg shadow-blue-500/10"
                                    >
                                        {submitStep3Mutation.isPending ? 'Publishing...' : 'List Vehicle'}
                                        <Check size={16} />
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ListVehiclePage() {
    return (
        <div className="min-h-screen bg-slate-50 gradient-bg pb-20 pt-28">
            <div className="max-w-4xl mx-auto px-6">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <Loader2 className="h-8 w-8 animate-spin text-[#003399] mb-4" />
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading Wizard...</p>
                    </div>
                }>
                    <ListVehicleFormContent />
                </Suspense>
            </div>
        </div>
    );
}
