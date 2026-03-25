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
import { Role, Permission, useRoles, usePermissions, useAssignPermissions, useCreateRole, useCreatePermission } from '@/hooks/useRoles';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SystemConfigPage() {
    const { data: roles, isLoading: rolesLoading } = useRoles();
    const { data: permissions, isLoading: permissionsLoading } = usePermissions();
    const assignPermissions = useAssignPermissions();
    const createRole = useCreateRole();
    const createPermission = useCreatePermission();

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
    const [isCreatePermissionOpen, setIsCreatePermissionOpen] = useState(false);
    const [newName, setNewName] = useState('');

    const handleTogglePermission = (permissionId: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionId)
                ? prev.filter((id) => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleOpenAssignModal = (role: Role) => {
        setSelectedRole(role);
        // Populate permissions from the role's existing data
        setSelectedPermissions(role.permissions || []);
        setIsDialogOpen(true);
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
            setIsDialogOpen(false);
            setSelectedRole(null);
        } catch (error) {
            toast.error('Failed to update permissions');
        } finally {
            setIsAssigning(false);
        }
    };
    const handleCreateRole = async () => {
        if (!newName) return;
        try {
            await createRole.mutateAsync(newName);
            toast.success('Role created successfully');
            setIsCreateRoleOpen(false);
            setNewName('');
        } catch (error) {
            toast.error('Failed to create role');
        }
    };

    const handleCreatePermission = async () => {
        if (!newName) return;
        try {
            await createPermission.mutateAsync(newName);
            toast.success('Permission created successfully');
            setIsCreatePermissionOpen(false);
            setNewName('');
        } catch (error) {
            toast.error('Failed to create permission');
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
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest">Access Groups</h4>
                        <Button 
                            onClick={() => setIsCreateRoleOpen(true)}
                            className="bg-[#0066CC] hover:bg-blue-700 text-white rounded-xl px-6 font-bold h-10 transition-all active:scale-95"
                        >
                            New Protocol Role
                        </Button>
                    </div>
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
                                                <Button
                                                    variant="ghost"
                                                    className="h-10 rounded-xl hover:bg-slate-100 font-bold group-hover:px-6 transition-all"
                                                    onClick={() => handleOpenAssignModal(role)}
                                                >
                                                    <Key className="mr-2 h-4 w-4" />
                                                    View Access
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>

                    {/* Shared Permission Assignment Modal */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-3xl p-0 custom-scrollbar">
                            <div className="bg-slate-900 px-8 py-6 text-white rounded-t-[2.5rem]">
                                <h2 className="text-2xl font-bold tracking-tight">Assign Permissions</h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Configuring protocol access for <span className="text-white font-bold capitalize">{selectedRole?.name}</span>
                                </p>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {permissionList.map((permission: Permission) => (
                                        <div
                                            key={permission.id}
                                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group/item"
                                            onClick={() => handleTogglePermission(permission.name)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={cn(
                                                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                                                    selectedPermissions.includes(permission.name) ? "bg-[#0066CC] border-[#0066CC]" : "border-slate-300 bg-white"
                                                )}>
                                                    {selectedPermissions.includes(permission.name) && <div className="w-2 h-2 bg-white rounded-full" />}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{permission.name}</span>
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-slate-300 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                {selectedPermissions.includes(permission.name) ? 'Selected' : 'Select'}
                                            </span>
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
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest">Security Identifiers</h4>
                        <Button 
                            onClick={() => setIsCreatePermissionOpen(true)}
                            className="bg-[#0066CC] hover:bg-blue-700 text-white rounded-xl px-6 font-bold h-10 transition-all active:scale-95"
                        >
                            New Access Scope
                        </Button>
                    </div>
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

                {/* Create Role Modal */}
                <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
                    <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-3xl p-0">
                        <div className="bg-[#0066CC] px-8 py-6 text-white rounded-t-[2.5rem]">
                            <h2 className="text-2xl font-bold tracking-tight">Create Protocol Role</h2>
                            <p className="text-white/60 text-sm mt-1">Define a new administrative group for the network.</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Identifier</label>
                                <input 
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. Protocol Auditor"
                                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-[#0066CC] transition-all outline-none"
                                />
                            </div>
                            <Button
                                onClick={handleCreateRole}
                                disabled={createRole.isPending || !newName}
                                className="w-full h-14 rounded-2xl bg-[#0066CC] hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/10"
                            >
                                {createRole.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Initialize Role
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Create Permission Modal */}
                <Dialog open={isCreatePermissionOpen} onOpenChange={setIsCreatePermissionOpen}>
                    <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-3xl p-0">
                        <div className="bg-slate-900 px-8 py-6 text-white rounded-t-[2.5rem]">
                            <h2 className="text-2xl font-bold tracking-tight">Define Access Scope</h2>
                            <p className="text-white/60 text-sm mt-1">Add a new functional permission to the protocol.</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permission Scope</label>
                                <input 
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. audit.reports"
                                    className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 text-sm font-bold focus:ring-4 focus:ring-slate-500/5 focus:border-slate-900 transition-all outline-none"
                                />
                            </div>
                            <Button
                                onClick={handleCreatePermission}
                                disabled={createPermission.isPending || !newName}
                                className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black font-bold shadow-lg shadow-slate-900/10"
                            >
                                {createPermission.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Register Permission
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </Tabs>
        </div>
    );
}
