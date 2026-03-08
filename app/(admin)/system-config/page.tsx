'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Shield, Key, Loader2, Settings2, Lock } from 'lucide-react';
import { Role, Permission, useRoles, usePermissions, useAssignPermissions } from '@/hooks/useRoles';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SystemConfigPage() {
    const { data: roles, isLoading: rolesLoading } = useRoles();
    const { data: permissions, isLoading: permissionsLoading } = usePermissions();
    const assignPermissions = useAssignPermissions();

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);

    const handleTogglePermission = (permissionId: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleSavePermissions = async () => {
        if (!selectedRole) return;

        setIsAssigning(true);
        try {
            await assignPermissions.mutateAsync({
                roleId: selectedRole.id,
                permissions: selectedPermissions,
            });
            toast.success('Permissions updated successfully');
            setSelectedRole(null);
        } catch (error) {
            toast.error('Failed to update permissions');
        } finally {
            setIsAssigning(false);
        }
    };

    const roleList = Array.isArray(roles?.data?.data) ? roles.data.data : (Array.isArray(roles?.data) ? roles.data : (Array.isArray(roles) ? roles : []));
    const permissionList = Array.isArray(permissions?.data?.data) ? permissions.data.data : (Array.isArray(permissions?.data) ? permissions.data : (Array.isArray(permissions) ? permissions : []));

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Settings2 className="text-[#0066CC] w-5 h-5" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Protocol Settings</h3>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">System Configuration</h2>
                    <p className="text-muted-foreground mt-1">
                        Manage global platform configurations, security protocols, and access control.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="roles" className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
                    <TabsTrigger value="roles" className="rounded-lg px-8 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all">
                        <Shield className="w-4 h-4 mr-2" />
                        Access Roles
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="rounded-lg px-8 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all">
                        <Lock className="w-4 h-4 mr-2" />
                        Permissions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="roles" className="space-y-4">
                    <div className="rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                        {rolesLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-20 w-full rounded-xl" />
                                <Skeleton className="h-20 w-full rounded-xl" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Role Identity</TableHead>
                                        <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Access Level</TableHead>
                                        <TableHead className="py-6 px-8 text-right text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Operations</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roleList.map((role: Role) => (
                                        <TableRow key={role.id} className="group border-slate-50 last:border-none">
                                            <TableCell className="py-6 px-8 font-bold capitalize text-slate-900">{role.name}</TableCell>
                                            <TableCell className="py-6 px-8 font-medium text-slate-500">
                                                <span className="bg-blue-50 text-[#0066CC] px-3 py-1 rounded-lg text-xs font-bold">
                                                    {role.permissions_count} Active Permissions
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-6 px-8 text-right">
                                                <Dialog>
                                                    <DialogTrigger render={
                                                        <Button variant="ghost" className="h-10 rounded-xl hover:bg-slate-100 font-bold group-hover:px-6 transition-all" onClick={() => {
                                                            setSelectedRole(role);
                                                            setSelectedPermissions([]);
                                                        }}>
                                                            <Key className="mr-2 h-4 w-4" />
                                                            Configure Access
                                                        </Button>
                                                    } />
                                                    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-slate-100 shadow-3xl p-0 custom-scrollbar">
                                                        <div className="bg-slate-900 px-8 py-6 text-white rounded-t-[2.5rem]">
                                                            <h2 className="text-2xl font-bold tracking-tight">Assign Permissions</h2>
                                                            <p className="text-slate-400 text-sm mt-1">Configuring protocol access for <span className="text-white font-bold capitalize">{role.name}</span></p>
                                                        </div>
                                                        <div className="p-8 space-y-6">
                                                            <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                                {permissionList.map((permission: Permission) => (
                                                                    <div key={permission.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group/item" onClick={() => handleTogglePermission(permission.name)}>
                                                                        <div className="flex items-center space-x-3">
                                                                            <div className={cn(
                                                                                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                                                                selectedPermissions.includes(permission.name) ? "bg-[#0066CC] border-[#0066CC]" : "border-slate-300 bg-white"
                                                                            )}>
                                                                                {selectedPermissions.includes(permission.name) && <div className="w-2 h-2 bg-white rounded-full" />}
                                                                            </div>
                                                                            <span className="text-sm font-bold text-slate-700">{permission.name}</span>
                                                                        </div>
                                                                        <span className="text-[10px] font-black uppercase text-slate-300 opacity-0 group-hover/item:opacity-100 transition-opacity">Select</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex gap-4 pt-4">
                                                                <Button
                                                                    disabled={isAssigning}
                                                                    onClick={handleSavePermissions}
                                                                    className="flex-1 h-14 rounded-2xl bg-[#0066CC] hover:bg-blue-700 font-bold shadow-lg shadow-primary/10"
                                                                >
                                                                    {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                    Commit Sequence
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                    <div className="rounded-[2rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                        {permissionsLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-20 w-full rounded-xl" />
                                <Skeleton className="h-20 w-full rounded-xl" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Protocol Identifier</TableHead>
                                        <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Functional Description</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissionList.map((permission: Permission) => (
                                        <TableRow key={permission.id} className="border-slate-50 last:border-none">
                                            <TableCell className="py-6 px-8 font-bold text-[#0066CC] bg-blue-50/20">{permission.name}</TableCell>
                                            <TableCell className="py-6 px-8 text-sm font-medium text-slate-500">
                                                Grants capability to execute <span className="font-bold text-slate-700">{permission.name.replace(/:/g, ' ')}</span> operations within the C9x Network.
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
