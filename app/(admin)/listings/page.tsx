'use client';

import { useState } from 'react';
import { ListingsTable } from '@/components/tables/listings-table';
import { ListingsGrid } from '@/components/tables/listings-grid';
import { AddListingForm } from '@/components/forms/add-listing-form';
import { EditListingForm } from '@/components/forms/edit-listing-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus, LayoutGrid, List, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Listing } from '@/hooks/useListings';

export default function ListingsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

    const handleEdit = (listing: Listing) => {
        setSelectedListing(listing);
        setIsEditOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 font-display">Asset Registry</h2>
                    <p className="text-slate-400 font-medium mt-2">
                        Oversee high-fidelity automotive assets and manage the network inventory.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 self-start md:self-auto">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            viewMode === 'grid'
                                ? "bg-white text-[#0066CC] shadow-lg shadow-blue-500/10 ring-1 ring-slate-100"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <LayoutGrid size={14} />
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('table')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            viewMode === 'table'
                                ? "bg-white text-[#0066CC] shadow-lg shadow-blue-500/10 ring-1 ring-slate-100"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <List size={14} />
                        List
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger render={
                            <Button className="h-14 px-8 rounded-2xl bg-[#0066CC] hover:bg-blue-700 font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]">
                                <Plus className="mr-3 h-5 w-5" />
                                Provision New Asset
                            </Button>
                        } />
                        <DialogContent className="sm:max-w-[850px] max-h-[95vh] overflow-y-auto rounded-[3rem] border-slate-100 shadow-3xl p-0 custom-scrollbar">
                            <div className="bg-slate-900 px-10 py-10 text-white relative overflow-hidden rounded-t-[3rem]">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-[#0066CC]/20 blur-[120px] -mr-40 -mt-40"></div>
                                <div className="relative z-10">
                                    <h2 className="text-4xl font-black tracking-tight font-display mb-2">Asset Deployment</h2>
                                    <p className="text-slate-400 font-medium text-lg">Initialize a new high-fidelity automotive record on the C9x Protocol.</p>
                                </div>
                            </div>
                            <div className="px-10 pb-10">
                                <AddListingForm onSuccess={() => setIsDialogOpen(false)} />
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="sm:max-w-[850px] max-h-[95vh] overflow-y-auto rounded-[3rem] border-slate-100 shadow-3xl p-0 custom-scrollbar">
                            <div className="bg-[#0066CC] px-10 py-10 text-white relative overflow-hidden rounded-t-[3rem]">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[120px] -mr-40 -mt-40"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Settings2 className="w-6 h-6" />
                                        <h2 className="text-4xl font-black tracking-tight font-display">Refine Asset Protocol</h2>
                                    </div>
                                    <p className="text-blue-100 font-medium text-lg">Modifying state parameters for <span className="text-white font-black">{selectedListing?.title}</span></p>
                                </div>
                            </div>
                            <div className="px-10 pb-10">
                                {selectedListing && (
                                    <EditListingForm
                                        listing={selectedListing}
                                        onSuccess={() => setIsEditOpen(false)}
                                    />
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="pt-4">
                {viewMode === 'grid' ? (
                    <ListingsGrid onEdit={handleEdit} />
                ) : (
                    <ListingsTable onEdit={handleEdit} />
                )}
            </div>
        </div>
    );
}
