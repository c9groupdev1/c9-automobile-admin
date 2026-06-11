'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserForm } from '@/components/forms/user-form';

export default function EditUserPage() {
    const { id } = useParams();
    const router = useRouter();

    if (!id) return null;

    return (
        <div className="pb-20">
            <div className="max-w-3xl mx-auto space-y-8 text-slate-900">
                {/* Breadcrumbs & Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        <Link href="/admin/users" className="hover:text-[#003399] transition-colors">Users</Link>
                        <ChevronRight size={10} />
                        <Link href={`/admin/users/${id}`} className="hover:text-[#003399] transition-colors">User Details</Link>
                        <ChevronRight size={10} />
                        <span className="text-[#003399]">Modify Profile</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href={`/admin/users/${id}`}>
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-100 hover:bg-slate-50">
                                    <ArrowLeft size={16} />
                                </Button>
                            </Link>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Modify User Profile</h1>
                                <p className="text-xs text-slate-400 font-medium">Update account details, role permissions, operational status, and verification.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form Card */}
                <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden bg-white">
                    <CardContent className="p-8">
                        <UserForm
                            initialData={{
                                id: id as string,
                                name: '',
                                email: '',
                                role: 'user',
                            }}
                            onSuccess={() => {
                                router.push(`/admin/users/${id}`);
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
