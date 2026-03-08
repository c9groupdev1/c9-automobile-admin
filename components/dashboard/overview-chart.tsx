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

export function OverviewChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Platform Usage</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                            }}
                        />
                        <Bar
                            dataKey="total"
                            fill="currentColor"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
