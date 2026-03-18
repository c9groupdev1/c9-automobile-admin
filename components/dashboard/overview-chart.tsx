'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
    { name: 'Jan', total: 1540 },
    { name: 'Feb', total: 2300 },
    { name: 'Mar', total: 1800 },
    { name: 'Apr', total: 2800 },
    { name: 'May', total: 3200 },
    { name: 'Jun', total: 2500 },
    { name: 'Jul', total: 4100 },
    { name: 'Aug', total: 3800 },
    { name: 'Sep', total: 4500 },
    { name: 'Oct', total: 5200 },
    { name: 'Nov', total: 4800 },
    { name: 'Dec', total: 6100 },
];

import { cn } from '@/lib/utils';

interface OverviewChartProps {
    className?: string;
}

export function OverviewChart({ className }: OverviewChartProps) {
    return (
        <Card className={cn("border-slate-100 shadow-sm rounded-[1.5rem] overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-8">
                <CardTitle className="text-lg font-bold text-slate-900">Platform Usage</CardTitle>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#003399]"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Users</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={data}>
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
                            tickFormatter={(value) => `$${value}`}
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
