'use client';

import { useState } from 'react';
import { useChangePassword, useDeleteAccount } from '@/hooks/useUserProfile';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog';
import { Loader2, Lock, ShieldAlert, Trash2, KeyRound, Eye, EyeOff } from 'lucide-react';

export function SecuritySettings() {
    const changePassword = useChangePassword();
    const deleteAccount = useDeleteAccount();
    const { logout } = useAuthStore();
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [showPasswords, setShowPasswords] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return; // Add validation toast
        }
        await changePassword.mutateAsync({
            current_password: passwordData.currentPassword,
            password: passwordData.newPassword,
            password_confirmation: passwordData.confirmPassword
        });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText === 'DELETE') {
            await deleteAccount.mutateAsync();
            logout();
        }
    };

    return (
        <div className="space-y-8">
            {/* Change Password Card */}
            <Card className="border-slate-100 shadow-sm rounded-2xl sm:rounded-[2rem] overflow-hidden">
                <CardHeader className="p-4 sm:p-8 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <KeyRound className="text-[#003399] h-5 w-5" />
                        <CardTitle className="text-xl font-bold text-slate-900">Access Credentials</CardTitle>
                    </div>
                    <CardDescription className="text-slate-500 font-medium pl-8">
                        Update your authentication parameters to maintain protocol security.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-8">
                    <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-2xl">
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Current Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type={showPasswords ? "text" : "password"}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPasswords(!showPasswords)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">New Password</Label>
                                <Input
                                    type={showPasswords ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Confirm Password</Label>
                                <Input
                                    type={showPasswords ? "text" : "password"}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 font-semibold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button 
                                type="submit" 
                                disabled={changePassword.isPending}
                                className="w-full sm:w-auto bg-[#003399] hover:bg-blue-800 rounded-xl px-8 font-bold shadow-lg shadow-blue-900/10 h-11 transition-all"
                            >
                                {changePassword.isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Modify Credentials"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-rose-100 bg-rose-50/30 shadow-sm rounded-2xl sm:rounded-[2rem] overflow-hidden border-dashed">
                <CardHeader className="p-4 sm:p-8 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert className="text-rose-500 h-5 w-5" />
                        <CardTitle className="text-xl font-bold text-rose-900">Danger Protocol</CardTitle>
                    </div>
                    <CardDescription className="text-rose-600/70 font-medium pl-8">
                        Irreversible actions that will result in immediate data purging.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-rose-100">
                        <div>
                            <p className="text-sm font-bold text-slate-900">Purge Account Record</p>
                            <p className="text-xs font-medium text-slate-500 mt-1">Permanently delete your profile and all associated marketplace data.</p>
                        </div>
                        
                        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger render={
                                <Button variant="ghost" className="w-full sm:w-auto bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-xl px-6 font-bold text-xs h-10 border border-rose-200">
                                    <Trash2 size={14} className="mr-2" />
                                    Purge Record
                                </Button>
                            } />
                            <DialogContent className="rounded-[2rem] border-slate-100">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-slate-900">Terminate Account?</DialogTitle>
                                    <DialogDescription className="text-sm font-medium text-slate-500 py-4">
                                        This action is final and cannot be reversed. All your listings, settings, and historical data will be permanently wiped from the C9x ecosystem.
                                        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Type "DELETE" to confirm</p>
                                            <Input 
                                                value={deleteConfirmText}
                                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                                className="h-10 rounded-lg border-slate-200 bg-white font-bold"
                                                placeholder="DELETE"
                                            />
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="rounded-xl font-bold">Cancel</Button>
                                    <Button 
                                        onClick={handleDeleteAccount}
                                        disabled={deleteConfirmText !== 'DELETE' || deleteAccount.isPending}
                                        className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold px-6"
                                    >
                                        {deleteAccount.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Termination"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
