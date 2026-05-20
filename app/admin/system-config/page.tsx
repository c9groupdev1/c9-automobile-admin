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
import { Shield, Key, Loader2, Settings2, Lock, Car, Layers, Plus, Trash2, Edit, CheckCircle2, XCircle, MoreVertical, Search, Cpu, Tag, Sliders, Fuel, GitMerge } from 'lucide-react';
import { Role, Permission, useRoles, usePermissions, useAssignPermissions, useCreateRole, useCreatePermission } from '@/hooks/useRoles';
import {
    VehicleMake,
    VehicleModel,
    VehicleTrim,
    VehicleEngineType,
    VehicleFeature,
    VehicleFuelType,
    VehicleTransmission,
    useVehicleMakes,
    useCreateMake,
    useUpdateMake,
    useDeleteMake,
    useVehicleModels,
    useCreateModel,
    useUpdateModel,
    useDeleteModel,
    useVehicleTrims,
    useCreateTrim,
    useUpdateTrim,
    useDeleteTrim,
    useVehicleEngineTypes,
    useCreateEngineType,
    useUpdateEngineType,
    useDeleteEngineType,
    useVehicleFeatures,
    useCreateFeature,
    useUpdateFeature,
    useDeleteFeature,
    useVehicleFuelTypes,
    useCreateFuelType,
    useUpdateFuelType,
    useDeleteFuelType,
    useVehicleTransmissions,
    useCreateTransmission,
    useUpdateTransmission,
    useDeleteTransmission
} from '@/hooks/useVehicles';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function SystemConfigPage() {
    const { data: roles, isLoading: rolesLoading } = useRoles();
    const { data: permissions, isLoading: permissionsLoading } = usePermissions();
    const assignPermissions = useAssignPermissions();
    const createRole = useCreateRole();
    const createPermission = useCreatePermission();

    const [makeSearch, setMakeSearch] = useState('');
    const [modelSearch, setModelSearch] = useState('');
    const [trimSearch, setTrimSearch] = useState('');
    const [engineTypeSearch, setEngineTypeSearch] = useState('');
    const [featureSearch, setFeatureSearch] = useState('');
    const [fuelTypeSearch, setFuelTypeSearch] = useState('');
    const [transmissionSearch, setTransmissionSearch] = useState('');

    const { data: makes, isLoading: makesLoading } = useVehicleMakes(makeSearch);
    const { data: models, isLoading: modelsLoading } = useVehicleModels(modelSearch);
    const { data: trims, isLoading: trimsLoading } = useVehicleTrims(trimSearch);
    const { data: engineTypes, isLoading: engineTypesLoading } = useVehicleEngineTypes(engineTypeSearch);
    const { data: features, isLoading: featuresLoading } = useVehicleFeatures(featureSearch);
    const { data: fuelTypes, isLoading: fuelTypesLoading } = useVehicleFuelTypes(fuelTypeSearch);
    const { data: transmissions, isLoading: transmissionsLoading } = useVehicleTransmissions(transmissionSearch);

    const createMake = useCreateMake();
    const updateMake = useUpdateMake();
    const deleteMake = useDeleteMake();

    const createModel = useCreateModel();
    const updateModel = useUpdateModel();
    const deleteModel = useDeleteModel();

    const createTrim = useCreateTrim();
    const updateTrim = useUpdateTrim();
    const deleteTrim = useDeleteTrim();

    const createEngineType = useCreateEngineType();
    const updateEngineType = useUpdateEngineType();
    const deleteEngineType = useDeleteEngineType();

    const createFeature = useCreateFeature();
    const updateFeature = useUpdateFeature();
    const deleteFeature = useDeleteFeature();

    const createFuelType = useCreateFuelType();
    const updateFuelType = useUpdateFuelType();
    const deleteFuelType = useDeleteFuelType();

    const createTransmission = useCreateTransmission();
    const updateTransmission = useUpdateTransmission();
    const deleteTransmission = useDeleteTransmission();

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
    const [isCreatePermissionOpen, setIsCreatePermissionOpen] = useState(false);

    const [isMakeDialogOpen, setIsMakeDialogOpen] = useState(false);
    const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);
    const [isTrimDialogOpen, setIsTrimDialogOpen] = useState(false);
    const [isEngineTypeDialogOpen, setIsEngineTypeDialogOpen] = useState(false);
    const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
    const [isFuelTypeDialogOpen, setIsFuelTypeDialogOpen] = useState(false);
    const [isTransmissionDialogOpen, setIsTransmissionDialogOpen] = useState(false);

    const [editingMake, setEditingMake] = useState<VehicleMake | null>(null);
    const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);
    const [editingTrim, setEditingTrim] = useState<VehicleTrim | null>(null);
    const [editingEngineType, setEditingEngineType] = useState<VehicleEngineType | null>(null);
    const [editingFeature, setEditingFeature] = useState<VehicleFeature | null>(null);
    const [editingFuelType, setEditingFuelType] = useState<VehicleFuelType | null>(null);
    const [editingTransmission, setEditingTransmission] = useState<VehicleTransmission | null>(null);

    const [newName, setNewName] = useState('');
    const [formState, setFormState] = useState({
        name: '',
        logo: '',
        status: 1,
        vehicle_make_id: ''
    });

    const [trimForm, setTrimForm] = useState({
        name: '',
        is_active: true
    });

    const [engineTypeForm, setEngineTypeForm] = useState({
        name: '',
        is_active: true
    });

    const [featureForm, setFeatureForm] = useState({
        name: '',
        is_active: true
    });

    const [fuelTypeForm, setFuelTypeForm] = useState({
        name: '',
        is_active: true
    });

    const [transmissionForm, setTransmissionForm] = useState({
        name: '',
        is_active: true
    });

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

    const handleOpenMakeDialog = (make?: VehicleMake) => {
        if (make) {
            setEditingMake(make);
            setFormState({
                name: make.name,
                logo: make.logo || '',
                status: make.status,
                vehicle_make_id: ''
            });
        } else {
            setEditingMake(null);
            setFormState({ name: '', logo: '', status: 1, vehicle_make_id: '' });
        }
        setIsMakeDialogOpen(true);
    };

    const handleSaveMake = async () => {
        try {
            if (editingMake) {
                await updateMake.mutateAsync({ id: editingMake.id, ...formState });
                toast.success('Vehicle make updated');
            } else {
                await createMake.mutateAsync({ name: formState.name, logo: formState.logo, status: formState.status });
                toast.success('Vehicle make created');
            }
            setIsMakeDialogOpen(false);
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDeleteMake = async (id: string) => {
        if (!confirm('Are you sure you want to delete this make? All associated models will be affected.')) return;
        try {
            await deleteMake.mutateAsync(id);
            toast.success('Vehicle make deleted');
        } catch (error) {
            toast.error('Failed to delete make');
        }
    };

    const handleOpenModelDialog = (model?: VehicleModel) => {
        if (model) {
            setEditingModel(model);
            setFormState({
                name: model.name,
                logo: '',
                status: model.status,
                vehicle_make_id: model.vehicle_make_id
            });
        } else {
            setEditingModel(null);
            setFormState({ name: '', logo: '', status: 1, vehicle_make_id: '' });
        }
        setIsModelDialogOpen(true);
    };

    const handleSaveModel = async () => {
        try {
            if (editingModel) {
                await updateModel.mutateAsync({ id: editingModel.id, ...formState });
                toast.success('Vehicle model updated');
            } else {
                await createModel.mutateAsync({
                    name: formState.name,
                    vehicle_make_id: formState.vehicle_make_id,
                    status: formState.status
                });
                toast.success('Vehicle model created');
            }
            setIsModelDialogOpen(false);
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDeleteModel = async (id: string) => {
        if (!confirm('Delete this model?')) return;
        try {
            await deleteModel.mutateAsync(id);
            toast.success('Vehicle model deleted');
        } catch (error) {
            toast.error('Failed to delete model');
        }
    };

    const handleOpenTrimDialog = (trim?: VehicleTrim) => {
        if (trim) {
            setEditingTrim(trim);
            setTrimForm({
                name: trim.name,
                is_active: trim.is_active
            });
        } else {
            setEditingTrim(null);
            setTrimForm({
                name: '',
                is_active: true
            });
        }
        setIsTrimDialogOpen(true);
    };

    const handleSaveTrim = async () => {
        try {
            if (editingTrim) {
                await updateTrim.mutateAsync({ id: editingTrim.id, ...trimForm });
                toast.success('Vehicle trim updated');
            } else {
                await createTrim.mutateAsync(trimForm);
                toast.success('Vehicle trim created');
            }
            setIsTrimDialogOpen(false);
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDeleteTrim = async (id: string) => {
        if (!confirm('Are you sure you want to delete this trim?')) return;
        try {
            await deleteTrim.mutateAsync(id);
            toast.success('Vehicle trim deleted');
        } catch (error) {
            toast.error('Failed to delete trim');
        }
    };

    const handleOpenEngineTypeDialog = (engineType?: VehicleEngineType) => {
        if (engineType) {
            setEditingEngineType(engineType);
            setEngineTypeForm({
                name: engineType.name,
                is_active: engineType.is_active
            });
        } else {
            setEditingEngineType(null);
            setEngineTypeForm({
                name: '',
                is_active: true
            });
        }
        setIsEngineTypeDialogOpen(true);
    };

    const handleSaveEngineType = async () => {
        try {
            if (editingEngineType) {
                await updateEngineType.mutateAsync({ id: editingEngineType.id, ...engineTypeForm });
                toast.success('Engine type updated');
            } else {
                await createEngineType.mutateAsync(engineTypeForm);
                toast.success('Engine type created');
            }
            setIsEngineTypeDialogOpen(false);
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDeleteEngineType = async (id: string) => {
        if (!confirm('Are you sure you want to delete this engine type?')) return;
        try {
            await deleteEngineType.mutateAsync(id);
            toast.success('Engine type deleted');
        } catch (error) {
            toast.error('Failed to delete engine type');
        }
    };

    const handleOpenFeatureDialog = (feature?: VehicleFeature) => {
        if (feature) {
            setEditingFeature(feature);
            setFeatureForm({
                name: feature.name,
                is_active: feature.is_active
            });
        } else {
            setEditingFeature(null);
            setFeatureForm({
                name: '',
                is_active: true
            });
        }
        setIsFeatureDialogOpen(true);
    };

    const handleSaveFeature = async () => {
        try {
            if (editingFeature) {
                await updateFeature.mutateAsync({ id: editingFeature.id, ...featureForm });
                toast.success('Vehicle feature updated');
            } else {
                await createFeature.mutateAsync(featureForm);
                toast.success('Vehicle feature created');
            }
            setIsFeatureDialogOpen(false);
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDeleteFeature = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feature?')) return;
        try {
            await deleteFeature.mutateAsync(id);
            toast.success('Vehicle feature deleted');
        } catch (error) {
            toast.error('Failed to delete feature');
        }
    };

    const handleOpenFuelTypeDialog = (fuelType?: VehicleFuelType) => {
        if (fuelType) {
            setEditingFuelType(fuelType);
            setFuelTypeForm({
                name: fuelType.name,
                is_active: fuelType.is_active
            });
        } else {
            setEditingFuelType(null);
            setFuelTypeForm({
                name: '',
                is_active: true
            });
        }
        setIsFuelTypeDialogOpen(true);
    };

    const handleSaveFuelType = async () => {
        try {
            if (editingFuelType) {
                await updateFuelType.mutateAsync({ id: editingFuelType.id, ...fuelTypeForm });
                toast.success('Fuel type updated');
            } else {
                await createFuelType.mutateAsync(fuelTypeForm);
                toast.success('Fuel type created');
            }
            setIsFuelTypeDialogOpen(false);
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDeleteFuelType = async (id: string) => {
        if (!confirm('Are you sure you want to delete this fuel type?')) return;
        try {
            await deleteFuelType.mutateAsync(id);
            toast.success('Fuel type deleted');
        } catch (error) {
            toast.error('Failed to delete fuel type');
        }
    };

    const handleOpenTransmissionDialog = (transmission?: VehicleTransmission) => {
        if (transmission) {
            setEditingTransmission(transmission);
            setTransmissionForm({
                name: transmission.name,
                is_active: transmission.is_active
            });
        } else {
            setEditingTransmission(null);
            setTransmissionForm({
                name: '',
                is_active: true
            });
        }
        setIsTransmissionDialogOpen(true);
    };

    const handleSaveTransmission = async () => {
        try {
            if (editingTransmission) {
                await updateTransmission.mutateAsync({ id: editingTransmission.id, ...transmissionForm });
                toast.success('Transmission updated');
            } else {
                await createTransmission.mutateAsync(transmissionForm);
                toast.success('Transmission created');
            }
            setIsTransmissionDialogOpen(false);
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDeleteTransmission = async (id: string) => {
        if (!confirm('Are you sure you want to delete this transmission?')) return;
        try {
            await deleteTransmission.mutateAsync(id);
            toast.success('Transmission deleted');
        } catch (error) {
            toast.error('Failed to delete transmission');
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
                <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                    <TabsList className="bg-slate-100 p-1 rounded-xl mb-2 flex w-max gap-1">
                        <div className="flex gap-1 items-center">
                            <TabsTrigger value="roles" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all text-xs uppercase tracking-wider">
                                <Shield className="w-3.5 h-3.5 mr-2" /> Roles
                            </TabsTrigger>
                            <TabsTrigger value="permissions" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all text-xs uppercase tracking-wider">
                                <Lock className="w-3.5 h-3.5 mr-2" /> Permissions
                            </TabsTrigger>
                        </div>
                        <div className="w-px h-6 bg-slate-200 mx-1" />
                        <div className="flex gap-1 items-center">
                            <TabsTrigger value="makes" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all text-xs uppercase tracking-wider">
                                <Car className="w-3.5 h-3.5 mr-2" /> Makes
                            </TabsTrigger>
                            <TabsTrigger value="models" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all text-xs uppercase tracking-wider">
                                <Layers className="w-3.5 h-3.5 mr-2" /> Models
                            </TabsTrigger>
                            <TabsTrigger value="trims" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all text-xs uppercase tracking-wider">
                                <Tag className="w-3.5 h-3.5 mr-2" /> Trims
                            </TabsTrigger>
                            <TabsTrigger value="engine-types" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all text-xs uppercase tracking-wider">
                                <Cpu className="w-3.5 h-3.5 mr-2" /> Engines
                            </TabsTrigger>
                            <TabsTrigger value="features" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all text-xs uppercase tracking-wider">
                                <Sliders className="w-3.5 h-3.5 mr-2" /> Features
                            </TabsTrigger>
                            <TabsTrigger value="fuel-types" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all text-xs uppercase tracking-wider">
                                <Fuel className="w-3.5 h-3.5 mr-2" /> Fuels
                            </TabsTrigger>
                            <TabsTrigger value="transmissions" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold transition-all text-xs uppercase tracking-wider">
                                <GitMerge className="w-3.5 h-3.5 mr-2" /> Transmissions
                            </TabsTrigger>
                        </div>
                    </TabsList>
                </div>

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
                                        Update Permissions
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

                {/* Vehicle Make Dialog */}
                <Dialog open={isMakeDialogOpen} onOpenChange={setIsMakeDialogOpen}>
                    <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-3xl p-0">
                        <div className="bg-[#003399] px-8 py-6 text-white rounded-t-[2.5rem]">
                            <h2 className="text-2xl font-bold tracking-tight">{editingMake ? 'Modify Make' : 'New Vehicle Make'}</h2>
                            <p className="text-white/60 text-sm mt-1">Configure vehicle manufacturer profile.</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Make Name</Label>
                                    <Input
                                        value={formState.name}
                                        onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g. Toyota"
                                        className="h-12 rounded-xl bg-slate-50 border-slate-100 px-4 font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                                    />
                                </div>
                                {/* <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logo URL / Path</Label>
                                    <Input
                                        value={formState.logo}
                                        onChange={(e) => setFormState(prev => ({ ...prev, logo: e.target.value }))}
                                        placeholder="Enter logo identifier"
                                        className="h-12 rounded-xl bg-slate-50 border-slate-100 px-4 font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                                    />
                                </div> */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold text-slate-900">Active Status</Label>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Visible in marketplace</p>
                                    </div>
                                    <Switch
                                        checked={formState.status === 1}
                                        onCheckedChange={(v) => setFormState(prev => ({ ...prev, status: v ? 1 : 0 }))}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleSaveMake}
                                disabled={createMake.isPending || updateMake.isPending || !formState.name}
                                className="w-full h-14 rounded-2xl bg-[#003399] hover:bg-blue-800 font-bold shadow-lg shadow-blue-500/10"
                            >
                                {(createMake.isPending || updateMake.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingMake ? 'Save Changes' : 'Add Make'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Vehicle Model Dialog */}
                <Dialog open={isModelDialogOpen} onOpenChange={setIsModelDialogOpen}>
                    <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-3xl p-0">
                        <div className="bg-slate-900 px-8 py-6 text-white rounded-t-[2.5rem]">
                            <h2 className="text-2xl font-bold tracking-tight">{editingModel ? 'Modify Model' : 'New Vehicle Model'}</h2>
                            <p className="text-white/60 text-sm mt-1">Register a specific vehicle model sequence.</p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Manufacturer</Label>
                                    <select
                                        value={formState.vehicle_make_id}
                                        onChange={(e) => setFormState(prev => ({ ...prev, vehicle_make_id: e.target.value }))}
                                        className="w-full h-12 rounded-xl bg-slate-50 border border-slate-100 px-4 text-sm font-bold focus:ring-4 focus:ring-slate-500/5 transition-all outline-none"
                                    >
                                        <option value="">Select Make</option>
                                        {makes?.map((make: VehicleMake) => (
                                            <option key={make.id} value={make.id}>{make.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Model Name</Label>
                                    <Input
                                        value={formState.name}
                                        onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g. Camry"
                                        className="h-12 rounded-xl bg-slate-50 border-slate-100 px-4 font-bold focus:ring-4 focus:ring-slate-500/5 transition-all outline-none"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold text-slate-900">Active Status</Label>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Enable for selections</p>
                                    </div>
                                    <Switch
                                        checked={formState.status === 1}
                                        onCheckedChange={(v) => setFormState(prev => ({ ...prev, status: v ? 1 : 0 }))}
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handleSaveModel}
                                disabled={createModel.isPending || updateModel.isPending || !formState.name || !formState.vehicle_make_id}
                                className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black font-bold shadow-lg shadow-slate-900/10"
                            >
                                {(createModel.isPending || updateModel.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingModel ? 'Save Changes' : 'Add Model'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Vehicle Makes Tab Content */}
                <TabsContent value="makes" className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest">Global Manufacturers</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Active in the C9x ecosystem</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search manufacturers..."
                                    value={makeSearch}
                                    onChange={(e) => setMakeSearch(e.target.value)}
                                    className="pl-10 h-10 rounded-xl bg-white border-slate-100 font-bold text-xs shadow-sm"
                                />
                            </div>
                            <Button
                                onClick={() => handleOpenMakeDialog()}
                                className="bg-[#003399] hover:bg-blue-700 text-white rounded-xl px-6 font-bold h-10 transition-all shadow-lg shadow-blue-500/10 whitespace-nowrap"
                            >
                                Add Make
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {makesLoading ? (
                            [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-[2rem]" />)
                        ) : (
                            makes?.map((make: VehicleMake) => (
                                <div key={make.id} className="group relative bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:border-[#003399]/20 transition-all transition-duration-500">
                                    <div className="absolute top-6 right-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300 hover:text-slate-600" />
                                                }
                                            >
                                                <MoreVertical size={16} />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-slate-100 p-2">
                                                <DropdownMenuItem onClick={() => handleOpenMakeDialog(make)} className="rounded-lg font-bold text-xs py-2 cursor-pointer">
                                                    <Edit size={12} className="mr-2" /> Modify Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteMake(make.id)} className="rounded-lg font-bold text-xs py-2 text-rose-500 hover:text-rose-600 cursor-pointer">
                                                    <Trash2 size={12} className="mr-2" /> Delete Make
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-50 overflow-hidden">
                                            {make.logo ? (
                                                <img src={make.logo} alt={make.name} className="w-10 h-10 object-contain grayscale group-hover:grayscale-0 transition-all" />
                                            ) : (
                                                <Car size={24} className="text-slate-200" />
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="font-black text-slate-900 uppercase tracking-tight">{make.name}</h5>
                                            <div className="flex items-center justify-center gap-2 mt-2">
                                                <span className="bg-blue-50 text-[#003399] px-2 py-0.5 rounded-md text-[9px] font-black uppercase">{make.models_count || 0} Models</span>
                                                {make.status === 1 ? (
                                                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase">Active</span>
                                                ) : (
                                                    <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md text-[9px] font-black uppercase">Inactive</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* Vehicle Models Tab Content */}
                <TabsContent value="models" className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest">Model Sequences</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase"> Vehicle classification</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search models..."
                                    value={modelSearch}
                                    onChange={(e) => setModelSearch(e.target.value)}
                                    className="pl-10 h-10 rounded-xl bg-white border-slate-100 font-bold text-xs shadow-sm"
                                />
                            </div>
                            <Button
                                onClick={() => handleOpenModelDialog()}
                                className="bg-slate-900 hover:bg-black text-white rounded-xl px-6 font-bold h-10 transition-all shadow-lg shadow-black/10 whitespace-nowrap"
                            >
                                Add Model
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                        {modelsLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-48 w-full rounded-xl" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Manufacturer</TableHead>
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Model Name</TableHead>
                                        {/* <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Integrity</TableHead> */}
                                        <TableHead className="py-6 px-10 text-right text-[10px] font-black uppercase tracking-widest text-[#003399]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {models?.map((model: VehicleModel) => (
                                        <TableRow key={model.id} className="group border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="py-6 px-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px] uppercase">
                                                        {model.make?.name?.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-slate-500 uppercase text-xs">{model.make?.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 px-10 font-black text-slate-900 uppercase text-sm tracking-tight">{model.name}</TableCell>
                                            {/* <TableCell className="py-6 px-10">
                                                {model.is_active ? (
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                                                        <CheckCircle2 size={10} /> Active
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100/50">
                                                        <XCircle size={10} /> Suspended
                                                    </div>
                                                )}
                                            </TableCell> */}
                                            <TableCell className="py-6 px-10 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleOpenModelDialog(model)}
                                                        className="h-9 w-9 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all"
                                                    >
                                                        <Edit size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteModel(model.id)}
                                                        className="h-9 w-9 rounded-xl hover:bg-white hover:text-rose-600 hover:shadow-sm transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>

                {/* Vehicle Trims Tab Content */}
                <TabsContent value="trims" className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest">Trim Sequences</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Vehicle Trims Classification</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search trims..."
                                    value={trimSearch}
                                    onChange={(e) => setTrimSearch(e.target.value)}
                                    className="pl-10 h-10 rounded-xl bg-white border-slate-100 font-bold text-xs shadow-sm"
                                />
                            </div>
                            <Button
                                onClick={() => handleOpenTrimDialog()}
                                className="bg-[#003399] hover:bg-blue-700 text-white rounded-xl px-6 font-bold h-10 transition-all shadow-lg shadow-blue-500/10 whitespace-nowrap"
                            >
                                Add Trim
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                        {trimsLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-48 w-full rounded-xl" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Trim Name</TableHead>
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Status</TableHead>
                                        <TableHead className="py-6 px-10 text-right text-[10px] font-black uppercase tracking-widest text-[#003399]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(trims) && trims.length > 0 ? (
                                        trims.map((trim: VehicleTrim) => (
                                            <TableRow key={trim.id} className="group border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="py-6 px-10 font-black text-slate-900 uppercase text-sm tracking-tight">{trim.name}</TableCell>
                                                <TableCell className="py-6 px-10">
                                                    {trim.is_active ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                                                            <CheckCircle2 size={10} /> Active
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100/50">
                                                            <XCircle size={10} /> Inactive
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-6 px-10 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenTrimDialog(trim)}
                                                            className="h-9 w-9 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all"
                                                        >
                                                            <Edit size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteTrim(trim.id)}
                                                            className="h-9 w-9 rounded-xl hover:bg-white hover:text-rose-600 hover:shadow-sm transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-12 text-center text-slate-400 font-bold text-sm uppercase tracking-wider">
                                                No Trims Configured
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>

                {/* Engine Types Tab Content */}
                <TabsContent value="engine-types" className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest">Engine Architectures</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Engine Classification Types</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search engine types..."
                                    value={engineTypeSearch}
                                    onChange={(e) => setEngineTypeSearch(e.target.value)}
                                    className="pl-10 h-10 rounded-xl bg-white border-slate-100 font-bold text-xs shadow-sm"
                                />
                            </div>
                            <Button
                                onClick={() => handleOpenEngineTypeDialog()}
                                className="bg-slate-900 hover:bg-black text-white rounded-xl px-6 font-bold h-10 transition-all shadow-lg shadow-black/10 whitespace-nowrap"
                            >
                                Add Engine Type
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                        {engineTypesLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-48 w-full rounded-xl" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Engine Type</TableHead>
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Status</TableHead>
                                        <TableHead className="py-6 px-10 text-right text-[10px] font-black uppercase tracking-widest text-[#003399]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(engineTypes) && engineTypes.length > 0 ? (
                                        engineTypes.map((engineType: VehicleEngineType) => (
                                            <TableRow key={engineType.id} className="group border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="py-6 px-10 font-black text-slate-900 uppercase text-sm tracking-tight">{engineType.name}</TableCell>
                                                <TableCell className="py-6 px-10">
                                                    {engineType.is_active ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                                                            <CheckCircle2 size={10} /> Active
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100/50">
                                                            <XCircle size={10} /> Inactive
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-6 px-10 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEngineTypeDialog(engineType)}
                                                            className="h-9 w-9 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all"
                                                        >
                                                            <Edit size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteEngineType(engineType.id)}
                                                            className="h-9 w-9 rounded-xl hover:bg-white hover:text-rose-600 hover:shadow-sm transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-12 text-center text-slate-400 font-bold text-sm uppercase tracking-wider">
                                                No Engine Types Configured
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>

                {/* Vehicle Features Tab Content */}
                <TabsContent value="features" className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest">Feature Offerings</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Vehicle Amenity Features</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search features..."
                                    value={featureSearch}
                                    onChange={(e) => setFeatureSearch(e.target.value)}
                                    className="pl-10 h-10 rounded-xl bg-white border-slate-100 font-bold text-xs shadow-sm"
                                />
                            </div>
                            <Button
                                onClick={() => handleOpenFeatureDialog()}
                                className="bg-[#003399] hover:bg-blue-700 text-white rounded-xl px-6 font-bold h-10 transition-all shadow-lg shadow-blue-500/10 whitespace-nowrap"
                            >
                                Add Feature
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                        {featuresLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-48 w-full rounded-xl" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Feature Name</TableHead>
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Status</TableHead>
                                        <TableHead className="py-6 px-10 text-right text-[10px] font-black uppercase tracking-widest text-[#003399]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(features) && features.length > 0 ? (
                                        features.map((feature: VehicleFeature) => (
                                            <TableRow key={feature.id} className="group border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="py-6 px-10 font-black text-slate-900 uppercase text-sm tracking-tight">{feature.name}</TableCell>
                                                <TableCell className="py-6 px-10">
                                                    {feature.is_active ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                                                            <CheckCircle2 size={10} /> Active
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100/50">
                                                            <XCircle size={10} /> Inactive
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-6 px-10 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenFeatureDialog(feature)}
                                                            className="h-9 w-9 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all"
                                                        >
                                                            <Edit size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteFeature(feature.id)}
                                                            className="h-9 w-9 rounded-xl hover:bg-white hover:text-rose-600 hover:shadow-sm transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-12 text-center text-slate-400 font-bold text-sm uppercase tracking-wider">
                                                No Features Configured
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>

                {/* Fuel Types Tab Content */}
                <TabsContent value="fuel-types" className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest">Powertrain Fuel Configurations</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Fuel Source Classifications</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search fuel types..."
                                    value={fuelTypeSearch}
                                    onChange={(e) => setFuelTypeSearch(e.target.value)}
                                    className="pl-10 h-10 rounded-xl bg-white border-slate-100 font-bold text-xs shadow-sm"
                                />
                            </div>
                            <Button
                                onClick={() => handleOpenFuelTypeDialog()}
                                className="bg-slate-900 hover:bg-black text-white rounded-xl px-6 font-bold h-10 transition-all shadow-lg shadow-black/10 whitespace-nowrap"
                            >
                                Add Fuel Type
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                        {fuelTypesLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-48 w-full rounded-xl" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Fuel Type</TableHead>
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Status</TableHead>
                                        <TableHead className="py-6 px-10 text-right text-[10px] font-black uppercase tracking-widest text-[#003399]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(fuelTypes) && fuelTypes.length > 0 ? (
                                        fuelTypes.map((fuelType: VehicleFuelType) => (
                                            <TableRow key={fuelType.id} className="group border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="py-6 px-10 font-black text-slate-900 uppercase text-sm tracking-tight">{fuelType.name}</TableCell>
                                                <TableCell className="py-6 px-10">
                                                    {fuelType.is_active ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                                                            <CheckCircle2 size={10} /> Active
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100/50">
                                                            <XCircle size={10} /> Inactive
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-6 px-10 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenFuelTypeDialog(fuelType)}
                                                            className="h-9 w-9 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all"
                                                        >
                                                            <Edit size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteFuelType(fuelType.id)}
                                                            className="h-9 w-9 rounded-xl hover:bg-white hover:text-rose-600 hover:shadow-sm transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-12 text-center text-slate-400 font-bold text-sm uppercase tracking-wider">
                                                No Fuel Types Configured
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>

                {/* Transmissions Tab Content */}
                <TabsContent value="transmissions" className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest">Transmission Types</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Drivetrain Configuration Options</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search transmissions..."
                                    value={transmissionSearch}
                                    onChange={(e) => setTransmissionSearch(e.target.value)}
                                    className="pl-10 h-10 rounded-xl bg-white border-slate-100 font-bold text-xs shadow-sm"
                                />
                            </div>
                            <Button
                                onClick={() => handleOpenTransmissionDialog()}
                                className="bg-[#003399] hover:bg-blue-700 text-white rounded-xl px-6 font-bold h-10 transition-all shadow-lg shadow-blue-500/10 whitespace-nowrap"
                            >
                                Add Transmission
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm">
                        {transmissionsLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-10 w-full rounded-xl" />
                                <Skeleton className="h-48 w-full rounded-xl" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Transmission Name</TableHead>
                                        <TableHead className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-[#003399]">Status</TableHead>
                                        <TableHead className="py-6 px-10 text-right text-[10px] font-black uppercase tracking-widest text-[#003399]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.isArray(transmissions) && transmissions.length > 0 ? (
                                        transmissions.map((transmission: VehicleTransmission) => (
                                            <TableRow key={transmission.id} className="group border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                                                <TableCell className="py-6 px-10 font-black text-slate-900 uppercase text-sm tracking-tight">{transmission.name}</TableCell>
                                                <TableCell className="py-6 px-10">
                                                    {transmission.is_active ? (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                                                            <CheckCircle2 size={10} /> Active
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-100/50">
                                                            <XCircle size={10} /> Inactive
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-6 px-10 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenTransmissionDialog(transmission)}
                                                            className="h-9 w-9 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all"
                                                        >
                                                            <Edit size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteTransmission(transmission.id)}
                                                            className="h-9 w-9 rounded-xl hover:bg-white hover:text-rose-600 hover:shadow-sm transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="py-12 text-center text-slate-400 font-bold text-sm uppercase tracking-wider">
                                                No Transmissions Configured
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Transmission Dialog */}
            <Dialog open={isTransmissionDialogOpen} onOpenChange={setIsTransmissionDialogOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-3xl p-0">
                    <div className="bg-[#003399] px-8 py-6 text-white rounded-t-[2.5rem]">
                        <h2 className="text-2xl font-bold tracking-tight">{editingTransmission ? 'Modify Transmission' : 'New Transmission'}</h2>
                        <p className="text-white/60 text-sm mt-1">Configure a drivetrain transmission type.</p>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transmission Name</Label>
                                <Input
                                    value={transmissionForm.name}
                                    onChange={(e) => setTransmissionForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. Automatic"
                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 px-4 font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-900">Active Status</Label>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Enable for selections</p>
                                </div>
                                <Switch
                                    checked={transmissionForm.is_active}
                                    onCheckedChange={(v) => setTransmissionForm(prev => ({ ...prev, is_active: v }))}
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleSaveTransmission}
                            disabled={createTransmission.isPending || updateTransmission.isPending || !transmissionForm.name}
                            className="w-full h-14 rounded-2xl bg-[#003399] hover:bg-blue-800 font-bold shadow-lg shadow-blue-500/10"
                        >
                            {(createTransmission.isPending || updateTransmission.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingTransmission ? 'Save Changes' : 'Add Transmission'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Vehicle Feature Dialog */}
            <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-3xl p-0">
                    <div className="bg-[#003399] px-8 py-6 text-white rounded-t-[2.5rem]">
                        <h2 className="text-2xl font-bold tracking-tight">{editingFeature ? 'Modify Feature' : 'New Feature'}</h2>
                        <p className="text-white/60 text-sm mt-1">Configure vehicle amenity/options feature key.</p>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Feature Name</Label>
                                <Input
                                    value={featureForm.name}
                                    onChange={(e) => setFeatureForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. Leather Seats"
                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 px-4 font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-900">Active Status</Label>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Visible in marketplace</p>
                                </div>
                                <Switch
                                    checked={featureForm.is_active}
                                    onCheckedChange={(v) => setFeatureForm(prev => ({ ...prev, is_active: v }))}
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleSaveFeature}
                            disabled={createFeature.isPending || updateFeature.isPending || !featureForm.name}
                            className="w-full h-14 rounded-2xl bg-[#003399] hover:bg-blue-800 font-bold shadow-lg shadow-blue-500/10"
                        >
                            {(createFeature.isPending || updateFeature.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingFeature ? 'Save Changes' : 'Add Feature'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Fuel Type Dialog */}
            <Dialog open={isFuelTypeDialogOpen} onOpenChange={setIsFuelTypeDialogOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-3xl p-0">
                    <div className="bg-slate-900 px-8 py-6 text-white rounded-t-[2.5rem]">
                        <h2 className="text-2xl font-bold tracking-tight">{editingFuelType ? 'Modify Fuel Type' : 'New Fuel Type'}</h2>
                        <p className="text-white/60 text-sm mt-1">Configure vehicle powertrain fuel classification.</p>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fuel Type Name</Label>
                                <Input
                                    value={fuelTypeForm.name}
                                    onChange={(e) => setFuelTypeForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. Hybrid (Gas/Electric)"
                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 px-4 font-bold focus:ring-4 focus:ring-slate-500/5 transition-all outline-none"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-900">Active Status</Label>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Visible in marketplace</p>
                                </div>
                                <Switch
                                    checked={fuelTypeForm.is_active}
                                    onCheckedChange={(v) => setFuelTypeForm(prev => ({ ...prev, is_active: v }))}
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleSaveFuelType}
                            disabled={createFuelType.isPending || updateFuelType.isPending || !fuelTypeForm.name}
                            className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black font-bold shadow-lg shadow-slate-900/10"
                        >
                            {(createFuelType.isPending || updateFuelType.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingFuelType ? 'Save Changes' : 'Add Fuel Type'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Vehicle Trim Dialog */}
            <Dialog open={isTrimDialogOpen} onOpenChange={setIsTrimDialogOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-3xl p-0">
                    <div className="bg-[#003399] px-8 py-6 text-white rounded-t-[2.5rem]">
                        <h2 className="text-2xl font-bold tracking-tight">{editingTrim ? 'Modify Trim' : 'New Vehicle Trim'}</h2>
                        <p className="text-white/60 text-sm mt-1">Configure vehicle specification trim identifier.</p>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trim Identifier</Label>
                                <Input
                                    value={trimForm.name}
                                    onChange={(e) => setTrimForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. XLE"
                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 px-4 font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-900">Active Status</Label>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Visible in marketplace</p>
                                </div>
                                <Switch
                                    checked={trimForm.is_active}
                                    onCheckedChange={(v) => setTrimForm(prev => ({ ...prev, is_active: v }))}
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleSaveTrim}
                            disabled={createTrim.isPending || updateTrim.isPending || !trimForm.name}
                            className="w-full h-14 rounded-2xl bg-[#003399] hover:bg-blue-800 font-bold shadow-lg shadow-blue-500/10"
                        >
                            {(createTrim.isPending || updateTrim.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingTrim ? 'Save Changes' : 'Add Trim'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Vehicle Engine Type Dialog */}
            <Dialog open={isEngineTypeDialogOpen} onOpenChange={setIsEngineTypeDialogOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-3xl p-0">
                    <div className="bg-slate-900 px-8 py-6 text-white rounded-t-[2.5rem]">
                        <h2 className="text-2xl font-bold tracking-tight">{editingEngineType ? 'Modify Engine Type' : 'New Engine Type'}</h2>
                        <p className="text-white/60 text-sm mt-1">Configure vehicle engine powertrain classification.</p>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Engine Architecture</Label>
                                <Input
                                    value={engineTypeForm.name}
                                    onChange={(e) => setEngineTypeForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g. V6 Twin-Turbo"
                                    className="h-12 rounded-xl bg-slate-50 border-slate-100 px-4 font-bold focus:ring-4 focus:ring-slate-500/5 transition-all outline-none"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-900">Active Status</Label>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Visible in marketplace</p>
                                </div>
                                <Switch
                                    checked={engineTypeForm.is_active}
                                    onCheckedChange={(v) => setEngineTypeForm(prev => ({ ...prev, is_active: v }))}
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleSaveEngineType}
                            disabled={createEngineType.isPending || updateEngineType.isPending || !engineTypeForm.name}
                            className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black font-bold shadow-lg shadow-slate-900/10"
                        >
                            {(createEngineType.isPending || updateEngineType.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingEngineType ? 'Save Changes' : 'Add Engine Type'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
