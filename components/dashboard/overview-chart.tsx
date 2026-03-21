import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ChartData {
    month: string;
    count: number;
}

interface OverviewChartProps {
    className?: string;
    data?: ChartData[];
    isLoading?: boolean;
}

export function OverviewChart({ className, data, isLoading }: OverviewChartProps) {
    if (isLoading) {
        return (
            <Card className={cn("border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden flex items-center justify-center h-[400px]", className)}>
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-[#003399] animate-spin opacity-20" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Analytics</p>
                </div>
            </Card>
        );
    }

    const chartData = data?.map(d => ({
        name: d.month.split(' ')[0], // Just the month name
        total: d.count
    })) || [];

    if (!isLoading && chartData.length === 0) {
        return (
            <Card className={cn("border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden flex items-center justify-center h-[400px]", className)}>
                <div className="flex flex-col items-center gap-2 text-center p-6">
                    <p className="text-sm font-bold text-slate-400">No performance data detected.</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Selected parameters yielded zero results.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className={cn("border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-8">
                <CardTitle className="text-lg font-bold text-slate-900">Platform Growth</CardTitle>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#003399]"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Listings</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontWeight: 700 }}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                            tick={{ fontWeight: 700 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                borderRadius: '12px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                fontSize: '12px',
                                fontWeight: '700'
                            }}
                        />
                        <Bar
                            dataKey="total"
                            fill="#003399"
                            radius={[6, 6, 0, 0]}
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
