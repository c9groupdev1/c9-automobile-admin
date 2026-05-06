'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive' | 'warning';
    isLoading?: boolean;
}

export function ActionConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = 'default',
    isLoading = false
}: ActionConfirmationModalProps) {
    const variantConfig = {
        default: {
            icon: <div className="p-3 rounded-2xl bg-blue-50 text-[#003399]"><AlertTriangle className="h-6 w-6" /></div>,
            button: "bg-[#003399] hover:bg-blue-800 text-white"
        },
        destructive: {
            icon: <div className="p-3 rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle className="h-6 w-6" /></div>,
            button: "bg-rose-600 hover:bg-rose-700 text-white"
        },
        warning: {
            icon: <div className="p-3 rounded-2xl bg-amber-50 text-amber-600"><AlertTriangle className="h-6 w-6" /></div>,
            button: "bg-amber-600 hover:bg-amber-700 text-white"
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[440px] rounded-[2.5rem] border-slate-100 p-0 overflow-hidden shadow-2xl">
                <div className="p-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        {variantConfig[variant].icon}
                        <div className="space-y-2">
                            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                                {description}
                            </DialogDescription>
                        </div>
                    </div>
                </div>
                
                <DialogFooter className="flex-row p-6 bg-slate-50/50 border-t border-slate-50 gap-3 sm:justify-center">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 h-12 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all border-0"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            "flex-1 h-12 rounded-xl font-bold transition-all shadow-lg",
                            variantConfig[variant].button
                        )}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                        ) : (
                            confirmText
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
