'use client';

import { useAuthStore } from '@/store/authStore';

export type Permission = 
    | 'listing.create'
    | 'listing.update_own'
    | 'listing.delete_own'
    | 'listing.update_any'
    | 'listing.delete_any'
    | 'listing.status_manage'
    | 'listing.view'
    | 'car.sell'
    | 'spare_part.sell'
    | 'product.sell'
    | 'service.create'
    | 'service.manage'
    | 'auction.create'
    | 'auction.bid'
    | 'auction.manage'
    | 'c9.mark'
    | 'order.create'
    | 'order.view_own'
    | 'payment.make'
    | 'review.create'
    | 'review.moderate'
    | 'user.view'
    | 'user.create'
    | 'user.update'
    | 'user.suspend'
    | 'user.verify'
    | 'role.view'
    | 'role.manage'
    | 'kyc.submit'
    | 'kyc.view'
    | 'kyc.approve'
    | 'kyc.reject'
    | 'category.manage'
    | 'system.manage'
    | 'referral.refer'
    | 'payment.view'
    | 'payment.manage'
    | 'plan.manage'
    | 'promotion.manage'
    | 'support.manage'
    | 'news.manage'
    | 'referral.view';

export function usePermissions() {
    const { user } = useAuthStore();
    const permissions = user?.permissions || [];

    const hasPermission = (permission: Permission | Permission[]) => {
        if (Array.isArray(permission)) {
            return permission.some(p => permissions.includes(p));
        }
        return permissions.includes(permission);
    };

    const hasAllPermissions = (requiredPermissions: Permission[]) => {
        return requiredPermissions.every(p => permissions.includes(p));
    };

    const isAdmin = user?.roles?.includes('admin') || false;

    return {
        permissions,
        hasPermission,
        hasAllPermissions,
        isAdmin,
        // Helper for specific common checks
        canManageUsers: hasPermission(['user.create', 'user.update', 'user.suspend', 'user.verify']),
        canManageListings: hasPermission(['listing.status_manage', 'listing.update_any', 'listing.delete_any']),
        canReviewKyc: hasPermission(['kyc.approve', 'kyc.reject']),
        canManageSystem: hasPermission('system.manage'),
        canViewPayments: hasPermission(['payment.view', 'payment.manage']),
        canManagePayments: hasPermission('payment.manage'),
        canManagePlans: hasPermission('plan.manage'),
        canManagePromotions: hasPermission('promotion.manage'),
        canManageSupport: hasPermission('support.manage'),
        canViewReferrals: hasPermission('referral.view'),
    };
}
