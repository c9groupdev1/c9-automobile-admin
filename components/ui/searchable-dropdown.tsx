'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface Option {
    label: string;
    value: string | number;
}

interface SearchableDropdownProps {
    options: Option[];
    value: string | number | undefined;
    onChange: (value: string | number) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

export function SearchableDropdown({
    options,
    value,
    onChange,
    placeholder = 'Select option',
    searchPlaceholder = 'Search...',
    disabled = false,
    loading = false,
    className,
}: SearchableDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Find the selected option
    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    // Filtered options based on search term
    const filteredOptions = options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Reset search when opening
    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

    return (
        <div ref={containerRef} className={cn('relative w-full', className)}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className={cn('truncate', !selectedOption && 'text-slate-400 font-normal')}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 flex max-h-[300px] w-full flex-col rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 duration-100">
                    <div className="relative mb-2 flex items-center">
                        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 pl-9 pr-8 text-xs font-semibold rounded-lg bg-slate-50 border-slate-50 focus:bg-white"
                            autoFocus
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-0.5 max-h-[200px] pr-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-6 text-xs text-slate-400 font-bold uppercase tracking-widest gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-[#003399]" />
                                Loading...
                            </div>
                        ) : filteredOptions.length === 0 ? (
                            <div className="px-3 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                                No options found
                            </div>
                        ) : (
                            filteredOptions.map((option) => {
                                const isSelected = String(option.value) === String(value);
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left',
                                            isSelected && 'bg-slate-50 text-[#003399] font-black'
                                        )}
                                    >
                                        <span className="truncate">{option.label}</span>
                                        {isSelected && <Check className="h-4 w-4 text-[#003399]" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
