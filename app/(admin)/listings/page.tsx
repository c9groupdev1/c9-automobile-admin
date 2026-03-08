'use client';

import { useState } from 'react';
import { ListingsTable } from '@/components/tables/listings-table';
import { AddListingForm } from '@/components/forms/add-listing-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ListingsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Listing Management</h2>
                    <p className="text-muted-foreground">
                        Manage vehicle listings, approve new entries, or remove outdated ones.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger render={
                        <Button className="h-12 px-6 rounded-xl bg-[#0066CC] hover:bg-blue-700 font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                            <Plus className="mr-2 h-5 w-5" />
                            Initialize New Listing
                        </Button>
                    } />
                    <DialogContent className="sm:max-w-[850px] max-h-[95vh] overflow-y-auto rounded-[2.5rem] border-slate-100 shadow-3xl p-0 custom-scrollbar">
                        <div className="bg-slate-900 px-10 py-8 text-white relative overflow-hidden rounded-t-[2.5rem]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066CC]/10 blur-[100px] -mr-32 -mt-32"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold tracking-tight font-display mb-2">Create Vehicle Protocol</h2>
                                <p className="text-slate-400 font-medium">Provision a new high-fidelity automotive asset to the C9x Network.</p>
                            </div>
                        </div>
                        <div className="px-10 pb-10">
                            <AddListingForm onSuccess={() => setIsDialogOpen(false)} />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <ListingsTable />
        </div>
    );
}
