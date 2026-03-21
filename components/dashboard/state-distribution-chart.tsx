import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface StateData {
    state: string;
    count: number;
}

interface StateDistributionChartProps {
    className?: string;
    data?: StateData[];
    isLoading?: boolean;
}

const COLORS = ['#003399', '#0066CC', '#3399FF', '#66B2FF', '#99CCFF'];

export function StateDistributionChart({ className, data, isLoading }: StateDistributionChartProps) {
    if (isLoading) {
        return (
            <Card className={cn("border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden flex items-center justify-center h-[400px]", className)}>
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-[#0066CC] animate-spin opacity-20" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Geography</p>
                </div>
            </Card>
        );
    }

    const chartData = data?.map(d => ({
        name: d.state,
        value: d.count
    })) || [];

    if (!isLoading && chartData.length === 0) {
        return (
            <Card className={cn("border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden flex items-center justify-center h-[400px]", className)}>
                <div className="flex flex-col items-center gap-2 text-center p-6">
                    <p className="text-sm font-bold text-slate-400">No geographical data detected.</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">No listings found for the selected category.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className={cn("border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-8">
                <CardTitle className="text-lg font-bold text-slate-900">Listings by State</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#94a3b8"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontWeight: 700 }}
                            width={80}
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
                            dataKey="value"
                            radius={[0, 6, 6, 0]}
                            barSize={20}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
