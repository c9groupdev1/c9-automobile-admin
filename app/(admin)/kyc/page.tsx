'use client';

import { KycTable } from '@/components/tables/kyc-table';

export default function KycPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">KYC Management</h2>
                <p className="text-muted-foreground">
                    Review and verify user identities and documents.
                </p>
            </div>

            <KycTable />
        </div>
    );
}
