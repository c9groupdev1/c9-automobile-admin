import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        positive: boolean;
    };
    iconColor?: string;
    iconBg?: string;
}

export function StatsCard({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    trend,
    iconColor = "text-[#003399]",
    iconBg = "bg-blue-50"
}: StatsCardProps) {
    return (
        <Card className="border-slate-100 shadow-sm rounded-[2rem] overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
                        <Icon className={cn("h-5 w-5", iconColor)} />
                    </div>
                    {trend && (
                        <div className={cn(
                            "text-[10px] font-bold px-2 py-1 rounded-lg",
                            trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        )}>
                            {trend.positive ? "↑" : "↓"} {trend.value}
                        </div>
                    )}
                </div>
                
                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                    <div className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
                    <p className="text-[10px] font-medium text-slate-500">{description}</p>
                </div>
            </CardContent>
        </Card>
    );
}
