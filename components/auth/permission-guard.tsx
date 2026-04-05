'use client';

import { ReactNode } from 'react';
import { usePermissions, Permission } from '@/hooks/use-permissions';

interface PermissionGuardProps {
    permission?: Permission | Permission[];
    all?: Permission[];
    fallback?: ReactNode;
    children: ReactNode;
}

/**
 * A component that conditionally renders its children based on permissions.
 * 
 * @param permission - A single permission or an array of permissions (at least one must match).
 * @param all - An array of permissions (all must match).
 * @param fallback - Optional element to render if the user lacks permissions.
 * @param children - The content to protect.
 */
export function PermissionGuard({ 
    permission, 
    all, 
    fallback = null, 
    children 
}: PermissionGuardProps) {
    const { hasPermission, hasAllPermissions } = usePermissions();

    if (all && !hasAllPermissions(all)) {
        return <>{fallback}</>;
    }

    if (permission && !hasPermission(permission)) {
        return <>{fallback}</>;
    }

    // Default: If no permissions specified, or they match, render children.
    return <>{children}</>;
}
