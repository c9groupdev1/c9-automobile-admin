import { StatsCard } from '@/components/dashboard/stats-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { Users, ShieldCheck, Car, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Users"
                    value="2,350"
                    description="Total registered users"
                    icon={Users}
                    trend={{ value: '12%', positive: true }}
                />
                <StatsCard
                    title="Pending KYC"
                    value="45"
                    description="Awaiting verification"
                    icon={ShieldCheck}
                    trend={{ value: '5', positive: false }}
                />
                <StatsCard
                    title="Active Listings"
                    value="1,240"
                    description="Cars currently listed"
                    icon={Car}
                    trend={{ value: '8%', positive: true }}
                />
                <StatsCard
                    title="Reported Listings"
                    value="12"
                    description="Listings flag for review"
                    icon={AlertTriangle}
                    trend={{ value: '2', positive: false }}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <OverviewChart />
                <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {[
                                { name: 'John Doe', action: 'applied for KYC', time: '2 minutes ago' },
                                { name: 'Toyota Camry 2022', action: 'new listing added', time: '15 minutes ago' },
                                { name: 'Alice Smith', action: 'account suspended', time: '1 hour ago' },
                                { name: 'Honda Civic 2019', action: 'price updated', time: '2 hours ago' },
                                { name: 'Mike Johnson', action: 'verified email', time: '3 hours ago' },
                            ].map((activity, i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{activity.name}</p>
                                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                                        {activity.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
