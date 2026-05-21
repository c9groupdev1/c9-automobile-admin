'use client';

import { useState } from 'react';
import {
    CreditCard,
    Zap,
    Search,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    XCircle,
    Filter,
    Download,
    TrendingUp,
    LayoutGrid,
    History,
    MoreVertical,
    Loader2,
    SlidersHorizontal,
    X,
    ArrowUpDown,
    CalendarRange,
    User,
    RefreshCw
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
    usePaymentHistory,
    useActivePromotions,
    usePaymentDetail,
    useRequeryPayment,
    PaymentHistory,
    ActivePromotion,
    PaymentHistoryFilters
} from '@/hooks/usePayments';
import { toast } from 'sonner';

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'success':
        case 'active':
        case 'successful':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" />
                    {status}
                </div>
            );
        case 'failed':
        case 'expired':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider">
                    <XCircle className="w-3 h-3" />
                    {status}
                </div>
            );
        case 'pending':
        case 'upcoming':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    {status}
                </div>
            );
        default:
            return (
                <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wider">
                    {status}
                </div>
            );
    }
};

const DetailItem = ({ label, value, icon: Icon, className }: { label: string, value: string | number | React.ReactNode, icon?: any, className?: string }) => (
    <div className={cn("p-6 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-100/50", className)}>
        <div className="flex items-center gap-2 mb-2 text-slate-400">
            {Icon && <Icon className="w-3 h-3" />}
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className="text-sm font-black text-slate-900">{value}</div>
    </div>
);

const STATUSES = [
    { value: '', label: 'All Statuses' },
    { value: 'successful', label: 'Successful' },
    { value: 'failed', label: 'Failed' },
    { value: 'pending', label: 'Pending' },
];

const SORT_BY_OPTIONS = [
    { value: '', label: 'Default' },
    { value: 'payment_date', label: 'Payment Date' },
    { value: 'expiry_date', label: 'Expiry Date' },
];

export default function PaymentsPage() {
    const [page, setPage] = useState(1);
    const [boostPage, setBoostPage] = useState(1);
    const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [activeTab, setActiveTab] = useState<'history' | 'boosts'>('history');

    // Filter state
    const [filters, setFilters] = useState<PaymentHistoryFilters>({});
    const [draftFilters, setDraftFilters] = useState<PaymentHistoryFilters>({});

    const { data: historyResponse, isLoading: historyLoading } = usePaymentHistory(page, filters);
    const { data: promotionsResponse, isLoading: promotionsLoading } = useActivePromotions(boostPage);
    const { data: detailResponse, isLoading: detailLoading } = usePaymentDetail(selectedPaymentId);

    const history = historyResponse?.data || [];
    const meta = historyResponse?.meta;
    const paymentDetail = detailResponse?.data;

    const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
    const requeryPayment = useRequeryPayment();

    const handleDownloadReceipt = async (payment: any) => {
        if (!payment) {
            toast.error('Payment details not available');
            return;
        }

        try {
            setIsGeneratingReceipt(true);
            toast.loading('Generating receipt on your device...', { id: 'download-receipt' });

            // Dynamically import jsPDF to keep Next.js SSR bundle clean
            const { jsPDF } = await import('jspdf');

            // Create Document (A4: 210mm x 297mm)
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Helper to clean and format currency amounts to standard ASCII/WinAnsi characters for PDF
            const formatCurrency = (val: string | number) => {
                if (typeof val === 'number') {
                    return `NGN ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                }
                if (!val) return 'NGN 0.00';
                return val.replace(/₦/g, 'NGN ').trim();
            };

            // Load the brand logo image asynchronously with robust fallback
            const loadImage = (src: string): Promise<HTMLImageElement> => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                    img.src = src.startsWith('http') ? src : `${baseUrl}${src}`;
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        // Fallback to relative URL directly
                        const fallbackImg = new Image();
                        fallbackImg.crossOrigin = 'anonymous';
                        fallbackImg.src = src;
                        fallbackImg.onload = () => resolve(fallbackImg);
                        fallbackImg.onerror = (err) => reject(err);
                    };
                });
            };

            let logoImg: HTMLImageElement | null = null;
            try {
                logoImg = await loadImage('/c9x-logo.png');
            } catch (err) {
                console.warn('Logo image failed to load, falling back to vector bar', err);
            }

            // 1. Accent Top Ribbon & Border Frame
            // Top Accent Ribbon (Cobalt Blue #0066CC)
            doc.setFillColor(0, 102, 204);
            doc.rect(0, 0, 210, 4, 'F');

            // Page Border Frame (Slate 100)
            doc.setDrawColor(241, 245, 249);
            doc.setLineWidth(0.2);
            doc.rect(10, 10, 190, 277, 'D');

            // 1.1 Background Safety Mesh (Interlocking sine/cosine waves for anti-forgery copy protection)
            doc.setDrawColor(242, 246, 252); // extremely light slate blue
            doc.setLineWidth(0.06);
            // Horizontal safety waves spanning page printable area
            for (let y = 14; y < 283; y += 7) {
                let prevWx = 12;
                let prevWy = y + Math.sin(12 * 0.15) * 1.5;
                for (let x = 14; x <= 198; x += 3) {
                    const wy = y + Math.sin(x * 0.15) * 1.5;
                    doc.line(prevWx, prevWy, x, wy);
                    prevWx = x;
                    prevWy = wy;
                }
            }
            // Vertical safety waves spanning page printable area
            for (let x = 15; x < 195; x += 9) {
                let prevWx = x + Math.cos(12 * 0.1) * 1.2;
                let prevWy = 12;
                for (let y = 14; y <= 283; y += 3) {
                    const wx = x + Math.cos(y * 0.1) * 1.2;
                    doc.line(prevWx, prevWy, wx, y);
                    prevWx = wx;
                    prevWy = y;
                }
            }

            // 2. Company Brand Headers and Logo
            if (logoImg) {
                try {
                    doc.addImage(logoImg, 'PNG', 20, 18, 18, 18);
                } catch (e) {
                    console.error('Failed to add image to PDF, using vector logo fallback', e);
                    // Stylized C9 vector badge
                    doc.setFillColor(0, 102, 204); // Cobalt Blue
                    doc.roundedRect(20, 18, 18, 18, 3, 3, 'F');
                    doc.setFillColor(0, 68, 153); // Navy Blue
                    doc.roundedRect(21, 19, 16, 16, 2.5, 2.5, 'F');
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(10);
                    doc.setTextColor(255, 255, 255);
                    doc.text('C9', 29, 29.5, { align: 'center' });
                }
            } else {
                // Stylized C9 vector badge
                doc.setFillColor(0, 102, 204); // Cobalt Blue
                doc.roundedRect(20, 18, 18, 18, 3, 3, 'F');
                doc.setFillColor(0, 68, 153); // Navy Blue
                doc.roundedRect(21, 19, 16, 16, 2.5, 2.5, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(255, 255, 255);
                doc.text('C9', 29, 29.5, { align: 'center' });
            }

            const brandTextX = 43;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.setTextColor(15, 23, 42); // Slate 900
            doc.text('C9X', brandTextX, 26);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(0, 102, 204); // Cobalt Blue
            doc.text('OFFICIAL PAYMENT RECEIPT', brandTextX, 31);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(100, 116, 139); // Slate 500
            doc.text('ADMINISTRATIVE BILLING PORTAL', brandTextX, 35);

            // 3. Premium Status Badge
            const status = (payment.status || 'pending').toLowerCase();
            let badgeBg = [248, 250, 252]; // Slate 50
            let badgeText = [100, 116, 139]; // Slate 500
            let badgeBorder = [226, 232, 240]; // Slate 200
            let badgeLabel = 'PENDING';

            if (status === 'success' || status === 'successful' || status === 'active') {
                badgeBg = [236, 253, 245]; // Emerald 50
                badgeText = [4, 120, 87]; // Emerald 700
                badgeBorder = [167, 243, 208]; // Emerald 200
                badgeLabel = 'SUCCESSFUL / PAID';
            } else if (status === 'failed') {
                badgeBg = [254, 242, 242]; // Red 50
                badgeText = [185, 28, 28]; // Red 700
                badgeBorder = [254, 202, 202]; // Red 200
                badgeLabel = 'FAILED';
            } else {
                badgeBg = [255, 251, 235]; // Amber 50
                badgeText = [217, 119, 6]; // Amber 700
                badgeBorder = [253, 230, 138]; // Amber 200
                badgeLabel = 'PENDING';
            }

            doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
            doc.setDrawColor(badgeBorder[0], badgeBorder[1], badgeBorder[2]);
            doc.setLineWidth(0.3);
            doc.roundedRect(145, 20, 45, 11, 2, 2, 'FD');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(badgeText[0], badgeText[1], badgeText[2]);
            doc.text(badgeLabel, 167.5, 27.5, { align: 'center' });

            // Divider Line
            doc.setDrawColor(226, 232, 240); // Slate 200
            doc.setLineWidth(0.4);
            doc.line(20, 44, 190, 44);

            // 4. Billing Grid (ISSUED TO / RECEIPT DETAILS)
            // Left - Payer Info
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(148, 163, 184); // Slate 400
            doc.text('CUSTOMER / PAYER', 20, 53);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(15, 23, 42); // Slate 900
            doc.text(payment.user?.name || 'Valued Customer', 20, 60);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105); // Slate 600
            doc.text(payment.user?.email || 'N/A', 20, 66);

            if (payment.user?.displayId || payment.user?.id) {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                doc.setTextColor(100, 116, 139);
                doc.text(`Account ID: ${payment.user.displayId || payment.user.id.substring(0, 8).toUpperCase()}`, 20, 72);
            }

            // Right - Receipt Info
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(148, 163, 184); // Slate 400
            doc.text('RECEIPT INFORMATION', 120, 53);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(15, 23, 42);
            doc.text(`Receipt ID: C9-REC-${payment.transactionId}`, 120, 60);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(71, 85, 105);
            doc.text(`Date Issued: ${new Date(payment.paidAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`, 120, 66);
            doc.text(`Payment Gateway: ${(payment.gateway || 'Paystack').toUpperCase()}`, 120, 72);

            const rawRef = payment.reference || 'N/A';
            doc.setFontSize(7.5);
            doc.text(`Reference: ${rawRef}`, 120, 78);

            // Divider Line
            doc.line(20, 84, 190, 84);

            // 5. Items Table
            // Table Header Background (Cobalt Blue)
            doc.setFillColor(0, 102, 204);
            doc.rect(20, 91, 170, 8, 'F');

            // Table Headers Text (White)
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(255, 255, 255);
            doc.text('ITEM DESCRIPTION', 25, 96.5);
            doc.text('AMOUNT', 185, 96.5, { align: 'right' });

            // Row 1 - Main Payment Item
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(15, 23, 42);
            doc.text(payment.description || 'C9X Administrative Payment', 25, 107);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.text(formatCurrency(payment.formattedAmount || payment.amount), 185, 107, { align: 'right' });

            // Row 2 - Charges
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text('Gateway Processing & Service Fee', 25, 116);
            doc.text(formatCurrency(payment.formattedCharges || payment.charges), 185, 116, { align: 'right' });

            // Table Border Bottom Line
            doc.setDrawColor(226, 232, 240); // Slate 200
            doc.setLineWidth(0.4);
            doc.line(20, 124, 190, 124);

            // 6. Grand Total Box (Sleek Border & Slate Fill with Cobalt accent)
            doc.setFillColor(248, 250, 252); // Slate 50
            doc.setDrawColor(226, 232, 240); // Slate 200
            doc.setLineWidth(0.4);
            doc.roundedRect(120, 130, 70, 22, 2, 2, 'FD'); // Fill and Draw border

            // Accent strip inside Grand Total box
            doc.setFillColor(0, 102, 204);
            doc.rect(120, 130, 2, 22, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(100, 116, 139);
            doc.text('TOTAL AMOUNT PAID', 126, 136);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(0, 102, 204); // Cobalt Blue
            doc.text(formatCurrency(payment.formattedTotal || payment.total), 185, 146, { align: 'right' });

            // Security Validation Badge
            doc.setFillColor(239, 246, 255); // Blue 50
            doc.setDrawColor(191, 219, 254); // Blue 200
            doc.setLineWidth(0.2);
            doc.roundedRect(20, 132, 45, 7, 1.5, 1.5, 'FD');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6.5);
            doc.setTextColor(29, 78, 216); // Blue 700
            doc.text('SECURE TRANSACTION', 42.5, 136.5, { align: 'center' });

            // 7. Footer Note & Guarantee
            // Microprint security line directly above the footer separator (looks like a line but has legible anti-forgery text under magnification)
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(3.5);
            doc.setTextColor(148, 163, 184); // Slate 400
            const microText = "C9X TRANSACTION VERIFIED * AUTHENTICITY SECURED * C9 GROUP ADMINISTRATIVE SYSTEM * ".repeat(3);
            doc.text(microText, 20, 166.5);

            doc.setDrawColor(226, 232, 240); // Slate 200
            doc.setLineWidth(0.4);
            doc.line(20, 168, 190, 168);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(0, 68, 153); // Secondary Navy Blue
            doc.text('Thank you for choosing C9X!', 20, 175);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(100, 116, 139);
            doc.text('If you have any questions about this payment, please email support@thec9group.com', 20, 181);

            // 7.5. Security Guilloché Rosette Seal (Notary/Integrity Stamp)
            // Centered perfectly on the A4 page (width 210mm) for a balanced, elegant layout
            const cx = 105;
            const cy = 215;

            // Draw beautiful spirograph lobes
            // Inner complex rosette loops in deep Navy Blue
            doc.setLineWidth(0.08);
            doc.setDrawColor(0, 68, 153); // Deep Navy Blue
            let prevX = 0;
            let prevY = 0;
            const R1 = 12;
            const r1 = 3.5;
            const d1 = 4.5;
            for (let theta = 0; theta <= 2 * Math.PI * 8; theta += 0.05) {
                const lx = (R1 - r1) * Math.cos(theta) + d1 * Math.cos(((R1 - r1) * theta) / r1);
                const ly = (R1 - r1) * Math.sin(theta) - d1 * Math.sin(((R1 - r1) * theta) / r1);
                const px = cx + lx;
                const py = cy + ly;
                if (theta > 0) {
                    doc.line(prevX, prevY, px, py);
                }
                prevX = px;
                prevY = py;
            }

            // Outer ring in Cobalt Blue with fine details using circle calls
            doc.setLineWidth(0.05);
            doc.setDrawColor(0, 102, 204); // Cobalt Blue
            doc.circle(cx, cy, 17, 'D');
            doc.circle(cx, cy, 16.5, 'D');

            // Draw second overlapping set of loops in Cobalt Blue
            doc.setLineWidth(0.06);
            let prevX2 = 0;
            let prevY2 = 0;
            for (let theta = 0; theta <= 2 * Math.PI * 6; theta += 0.05) {
                const lx = 9 * Math.cos(theta) + 2.5 * Math.cos(4 * theta);
                const ly = 9 * Math.sin(theta) - 2.5 * Math.sin(4 * theta);
                const px = cx + lx;
                const py = cy + ly;
                if (theta > 0) {
                    doc.line(prevX2, prevY2, px, py);
                }
                prevX2 = px;
                prevY2 = py;
            }

            // Center micro-stamp solid seal
            doc.setFillColor(0, 102, 204); // Cobalt
            doc.circle(cx, cy, 3.5, 'F');
            doc.setFillColor(255, 255, 255); // White core
            doc.circle(cx, cy, 2.5, 'F');
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(4);
            doc.setTextColor(0, 68, 153);
            doc.text('C9X', cx, cy + 1.2, { align: 'center' });

            // Official label tags under the seal
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5.5);
            doc.setTextColor(71, 85, 105);
            doc.text('OFFICIAL SECURITY SEAL', cx, cy + 22, { align: 'center' });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(4.5);
            doc.text('SYSTEM TIMESTAMP CERTIFIED', cx, cy + 24.5, { align: 'center' });

            // Bottom Centered Signature Disclaimer
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(7.5);
            doc.setTextColor(148, 163, 184);
            doc.text('This is a system-generated electronic payment receipt and requires no signature.', 105, 265, { align: 'center' });
            doc.setFont('helvetica', 'normal');
            doc.text('C9X administrative system. © 2026 C9 Group.', 105, 271, { align: 'center' });

            // Save PDF File
            doc.save(`Receipt_C9X_REC_${payment.id}.pdf`);

            toast.success('Receipt generated and downloaded successfully', { id: 'download-receipt' });
        } catch (error: any) {
            console.error('Failed to generate receipt:', error);
            toast.error('Failed to generate receipt on frontend', { id: 'download-receipt' });
        } finally {
            setIsGeneratingReceipt(false);
        }
    };

    const handleRequery = async (id: number) => {
        try {
            toast.loading('Manually verifying status with gateway...', { id: 'requery-payment' });
            const response = await requeryPayment.mutateAsync(id);
            if (response.success) {
                toast.success(response.message || 'Payment status updated successfully', { id: 'requery-payment' });
            } else {
                toast.success('Requery executed successfully', { id: 'requery-payment' });
            }
        } catch (error: any) {
            console.error('Failed to requery payment:', error);
            toast.error(error.response?.data?.message || 'Failed to verify payment status', { id: 'requery-payment' });
        }
    };

    const actualPromotions = promotionsResponse?.data?.data || [];
    const actualBoostsMeta = promotionsResponse?.data;

    // Boost tab keeps client-side search for simplicity
    const [boostSearch, setBoostSearch] = useState('');
    const filteredPromotions = actualPromotions.filter((promo: ActivePromotion) =>
        promo.listing.title.toLowerCase().includes((boostSearch).toLowerCase()) ||
        (promo.promotion.type || '').toLowerCase().includes((boostSearch).toLowerCase())
    );

    const hasActiveFilters = !!(filters.search || filters.status || filters.expireFromDate || filters.expireToDate || filters.expiringInDays || filters.sortBy || filters.sortOrder);

    const applyFilters = () => {
        setPage(1);
        setFilters({ ...draftFilters });
        setShowFilters(false);
    };

    const clearFilters = () => {
        setDraftFilters({});
        setFilters({});
        setPage(1);
    };

    const handleStatusBadge = (status: string) => {
        const normalizedStatus = status === 'successful' || status === 'active' ? 'success' : status;
        return <StatusBadge status={normalizedStatus} />;
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="text-[#0066CC] w-5 h-5" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Financials</h3>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">Payments & Boosts</h2>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                        Monitor transaction history, track payment statuses, and manage active listing boosts.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 rounded-2xl border-slate-200 font-bold hover:bg-slate-50 transition-all">
                        <Download className="w-4 h-4 mr-2" />
                        Export History
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-[#0066CC]/20 transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <CreditCard className="text-[#0066CC] w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase">+12.5%</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                        {historyLoading ? <Skeleton className="h-9 w-24" /> : `${history[0]?.formattedTotal?.substring(0, 1) || '₦'}${history?.reduce((acc: number, curr: PaymentHistory) => acc + (curr.status === 'successful' ? curr.amount : 0), 0).toLocaleString()}`}
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Page Volume</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-amber-500/20 transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                            <Zap className="text-amber-500 w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-amber-500 uppercase">ACTIVE</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                        {promotionsLoading ? <Skeleton className="h-9 w-12" /> : actualBoostsMeta?.total || 0}
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Active Boosts</p>
                </div>

                <div className="bg-[#0066CC] p-8 rounded-[2.5rem] shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:scale-150" />
                    <div className="flex items-center justify-between mb-6 relative">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                            <ArrowUpRight className="text-white w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-white mb-1 relative underline underline-offset-8 decoration-white/30">
                        {meta?.total || '...'}
                    </div>
                    <p className="text-sm font-bold text-white/60 uppercase tracking-widest leading-none relative">Total Transactions</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'history' | 'boosts')} className="w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <TabsList className="bg-slate-100 p-1 rounded-2xl h-14">
                        <TabsTrigger value="history" className="rounded-xl px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest transition-all">
                            <History className="w-4 h-4 mr-2" />
                            Payment History
                        </TabsTrigger>
                        <TabsTrigger value="boosts" className="rounded-xl px-8 h-12 data-[state=active]:bg-white data-[state=active]:shadow-sm font-black text-[10px] uppercase tracking-widest transition-all">
                            <Zap className="w-4 h-4 mr-2" />
                            Active Boosts
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-3">
                        {activeTab === 'history' ? (
                            <>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0066CC] transition-colors" />
                                    <Input
                                        placeholder="Search payments..."
                                        value={draftFilters.search || ''}
                                        onChange={(e) => setDraftFilters(prev => ({ ...prev, search: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                applyFilters();
                                            }
                                        }}
                                        className="h-14 w-[300px] rounded-2xl border-slate-100 bg-white pl-11 font-bold text-sm focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm shadow-slate-100/50"
                                    />
                                    {draftFilters.search && (
                                        <button
                                            onClick={() => setDraftFilters(prev => ({ ...prev, search: '' }))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={cn(
                                        "h-14 w-14 rounded-2xl border-slate-100 bg-white transition-all hover:bg-slate-50 relative",
                                        (showFilters || hasActiveFilters) && "border-blue-200 bg-blue-50/50 text-[#0066CC] hover:bg-blue-50"
                                    )}
                                >
                                    <Filter className="w-5 h-5 text-slate-400" />
                                    {hasActiveFilters && (
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0066CC]" />
                                    )}
                                </Button>
                            </>
                        ) : (
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                <Input
                                    placeholder="Search active boosts..."
                                    value={boostSearch}
                                    onChange={(e) => setBoostSearch(e.target.value)}
                                    className="h-14 w-[300px] rounded-2xl border-slate-100 bg-white pl-11 font-bold text-sm focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm shadow-slate-100/50"
                                />
                                {boostSearch && (
                                    <button
                                        onClick={() => setBoostSearch('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <TabsContent value="history" className="space-y-6 focus-visible:outline-none">
                    {showFilters && (
                        <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-sm shadow-slate-100/50 space-y-6 animate-in fade-in slide-in-from-top-4 duration-200">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                <div className="flex items-center gap-2">
                                    <SlidersHorizontal className="text-[#0066CC] w-4 h-4" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">Filter Payments</h4>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-slate-50"
                                    onClick={() => setShowFilters(false)}
                                >
                                    <X className="w-4 h-4 text-slate-400" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Payment Status</label>
                                    <select
                                        value={draftFilters.status || ''}
                                        onChange={(e) => setDraftFilters(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-black text-slate-700 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] transition-all"
                                    >
                                        {STATUSES.map(status => (
                                            <option key={status.value} value={status.value}>{status.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort By */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Sort By</label>
                                    <select
                                        value={draftFilters.sortBy || ''}
                                        onChange={(e) => setDraftFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                                        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-black text-slate-700 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] transition-all"
                                    >
                                        {SORT_BY_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort Order */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Sort Order</label>
                                    <select
                                        value={draftFilters.sortOrder || 'desc'}
                                        onChange={(e) => setDraftFilters(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                                        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-black text-slate-700 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] transition-all"
                                    >
                                        <option value="desc">Descending</option>
                                        <option value="asc">Ascending</option>
                                    </select>
                                </div>

                                {/* Expiring In Days */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Days to Expiration</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 7"
                                        value={draftFilters.expiringInDays === undefined ? '' : draftFilters.expiringInDays}
                                        onChange={(e) => setDraftFilters(prev => ({
                                            ...prev,
                                            expiringInDays: e.target.value === '' ? '' : parseInt(e.target.value, 10)
                                        }))}
                                        className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-black text-slate-700 placeholder:text-slate-400 placeholder:font-bold focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] transition-all"
                                    />
                                </div>

                                {/* Expire From Date */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Expires From</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={draftFilters.expireFromDate || ''}
                                            onChange={(e) => setDraftFilters(prev => ({ ...prev, expireFromDate: e.target.value }))}
                                            className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-black text-slate-700 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Expire To Date */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Expires To</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={draftFilters.expireToDate || ''}
                                            onChange={(e) => setDraftFilters(prev => ({ ...prev, expireToDate: e.target.value }))}
                                            className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-black text-slate-700 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="h-11 rounded-xl border-slate-200 font-bold hover:bg-slate-50 transition-all text-xs text-rose-600 hover:text-rose-700 hover:border-rose-200"
                                    >
                                        <X className="w-3.5 h-3.5 mr-2" />
                                        Reset Filters
                                    </Button>
                                )}
                                <Button
                                    onClick={applyFilters}
                                    className="h-11 rounded-xl bg-[#0066CC] text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-sm"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    )}
                    <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm shadow-slate-200/50">
                        {historyLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-12 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/80">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Payment Details</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Base Amount</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Processing Fee</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Total Paid</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Payment Date</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-[#0066CC]">Status</TableHead>
                                            <TableHead className="py-7 px-8 text-right text-[11px] font-black uppercase tracking-widest text-[#0066CC]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {history.map((item: PaymentHistory) => (
                                            <TableRow
                                                key={item.id}
                                                className="group border-slate-50 transition-colors hover:bg-slate-50/50 cursor-pointer"
                                                onClick={() => setSelectedPaymentId(item.id)}
                                            >
                                                <TableCell className="py-6 px-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-[10px] uppercase tracking-tighter">
                                                            PAY
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 text-sm">{item.description}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.user?.name}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6 px-8 font-black text-slate-900 text-sm">
                                                    {item.formattedAmount}
                                                </TableCell>
                                                <TableCell className="py-6 px-8 font-bold text-rose-500 text-xs">
                                                    {item.formattedCharges}
                                                </TableCell>
                                                <TableCell className="py-6 px-8 font-black text-emerald-600 text-sm">
                                                    {item.formattedTotal}
                                                </TableCell>
                                                <TableCell className="py-6 px-8 text-slate-500 font-bold text-xs uppercase tabular-nums">
                                                    {new Date(item.date).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </TableCell>
                                                <TableCell className="py-6 px-8">
                                                    {handleStatusBadge(item.status)}
                                                </TableCell>
                                                <TableCell className="py-6 px-8 text-right">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-sm">
                                                        <MoreVertical className="w-4 h-4 text-slate-400" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {!historyLoading && meta && (
                        <div className="flex items-center justify-between px-8 py-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                showing {meta.from} to {meta.to} of {meta.total} transactions
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-4 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ArrowUpRight className="w-3 h-3 mr-2 rotate-[225deg]" />
                                    Previous
                                </Button>
                                <div className="px-4 h-10 flex items-center bg-slate-50 rounded-xl font-black text-[10px] text-[#0066CC] uppercase tracking-widest border border-blue-100">
                                    PAGE {page} OF {meta.last_page}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-4 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                                    onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                    disabled={page === meta.last_page}
                                >
                                    Next
                                    <ArrowUpRight className="w-3 h-3 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="boosts" className="space-y-4 focus-visible:outline-none">
                    <div className="rounded-[2.5rem] border border-slate-100 bg-white overflow-hidden shadow-sm shadow-slate-200/50">
                        {promotionsLoading ? (
                            <div className="p-12 space-y-4">
                                <Skeleton className="h-12 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                                <Skeleton className="h-20 w-full rounded-2xl" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/80">
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-amber-600">Listing Details</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-amber-600">Boost Tier</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-amber-600">Active Period</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-amber-600">Amount Paid</TableHead>
                                            <TableHead className="py-7 px-8 text-[11px] font-black uppercase tracking-widest text-amber-600">Status</TableHead>
                                            <TableHead className="py-7 px-8 text-right text-[11px] font-black uppercase tracking-widest text-amber-600"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPromotions.map((promo: ActivePromotion) => (
                                            <TableRow key={promo.id} className="group border-slate-50 transition-colors hover:bg-amber-50/20">
                                                <TableCell className="py-6 px-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center font-black text-amber-600 text-[10px] uppercase">
                                                            LST
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-slate-900 text-sm">{promo.listing.title}</div>
                                                            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em]">Listing ID: {promo.listing_id.substring(0, 8)}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6 px-8">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                                                            {(promo.promotion.type || 'Standard Boost').replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6 px-8">
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-tight tabular-nums">
                                                        {new Date(promo.starts_at).toLocaleDateString()}
                                                        <span className="mx-2 text-slate-300">→</span>
                                                        {new Date(promo.expires_at).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-6 px-8 font-black text-slate-900 text-sm tabular-nums">
                                                    ₦{parseFloat(promo.promotion.price).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="py-6 px-8">
                                                    {handleStatusBadge(promo.status)}
                                                </TableCell>
                                                <TableCell className="py-6 px-8 text-right">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-sm">
                                                        <MoreVertical className="w-4 h-4 text-slate-400" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>

                    {/* Boost Pagination Controls */}
                    {!promotionsLoading && actualBoostsMeta && (
                        <div className="flex items-center justify-between px-8 py-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                showing {actualBoostsMeta.from} to {actualBoostsMeta.to} of {actualBoostsMeta.total} active boosts
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-4 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                                    onClick={() => setBoostPage(p => Math.max(1, p - 1))}
                                    disabled={boostPage === 1}
                                >
                                    <ArrowUpRight className="w-3 h-3 mr-2 rotate-[225deg]" />
                                    Previous
                                </Button>
                                <div className="px-4 h-10 flex items-center bg-slate-50 rounded-xl font-black text-[10px] text-amber-600 uppercase tracking-widest border border-amber-100">
                                    PAGE {boostPage} OF {actualBoostsMeta.last_page}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-4 rounded-xl border-slate-100 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
                                    onClick={() => setBoostPage(p => Math.min(actualBoostsMeta.last_page, p + 1))}
                                    disabled={boostPage === actualBoostsMeta.last_page}
                                >
                                    Next
                                    <ArrowUpRight className="w-3 h-3 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Detailed Payment Record Sheet */}
            <Sheet open={!!selectedPaymentId} onOpenChange={(open) => !open && setSelectedPaymentId(null)}>
                <SheetContent className="sm:max-w-xl border-l border-slate-100 p-0 overflow-y-auto custom-scrollbar">
                    {detailLoading ? (
                        <div className="p-12 space-y-8">
                            <Skeleton className="h-12 w-3/4 rounded-2xl" />
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-32 rounded-3xl" />
                                <Skeleton className="h-32 rounded-3xl" />
                            </div>
                            <Skeleton className="h-64 rounded-[2.5rem]" />
                        </div>
                    ) : paymentDetail ? (
                        <div className="space-y-0">
                            <div className="p-8 bg-slate-50/50 border-b border-slate-100">
                                <SheetHeader className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                            <CreditCard className="w-6 h-6 text-[#0066CC]" />
                                        </div>
                                        {handleStatusBadge(paymentDetail.status)}
                                    </div>
                                    <div>
                                        <SheetTitle className="text-2xl font-black text-slate-900 leading-tight">
                                            {paymentDetail.description}
                                        </SheetTitle>
                                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 px-1">
                                            Payment Details
                                        </p>
                                    </div>
                                </SheetHeader>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Payment Breakdown */}
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-8 bg-slate-50/30 border-b border-slate-50">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Payment Breakdown</h4>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-400">Base Amount</span>
                                            <span className="text-sm font-black text-slate-900">{paymentDetail.formattedAmount}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-400">Processing Fee</span>
                                            <span className="text-sm font-black text-rose-500">{paymentDetail.formattedCharges}</span>
                                        </div>
                                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-base font-black text-slate-900">Total Paid</span>
                                            <span className="text-2xl font-black text-emerald-600">{paymentDetail.formattedTotal}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payer Details */}
                                {paymentDetail.user && (
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                        <div className="p-8 bg-slate-50/30 border-b border-slate-50 flex items-center justify-between">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0066CC]">Payer Details</h4>
                                            {paymentDetail.user.displayId && (
                                                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066CC] text-[10px] font-black uppercase tracking-wider">
                                                    ID: {paymentDetail.user.displayId}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-8 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-sm font-black text-slate-900">{paymentDetail.user.name}</div>
                                                <div className="text-xs font-bold text-slate-400">{paymentDetail.user.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Transaction Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <DetailItem
                                        label="Reference"
                                        value={paymentDetail.reference}
                                        icon={History}
                                        className="col-span-2"
                                    />
                                    <DetailItem
                                        label="Transaction ID"
                                        value={paymentDetail.transactionId || 'NOT_ASSIGNED'}
                                        icon={Clock}
                                    />
                                    <DetailItem
                                        label="Payment Method"
                                        value={paymentDetail.gateway}
                                        icon={LayoutGrid}
                                    />
                                    <DetailItem
                                        label="Payment Date"
                                        value={paymentDetail.date}
                                        icon={Clock}
                                        className="col-span-2"
                                    />
                                    {paymentDetail.paidAt && (
                                        <DetailItem
                                            label="Paid At"
                                            value={new Date(paymentDetail.paidAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            icon={CheckCircle2}
                                            className="col-span-2 bg-emerald-50/20 hover:bg-emerald-50/30 border-emerald-100/50 text-emerald-950"
                                        />
                                    )}
                                </div>

                                <div className="pt-8 space-y-3">
                                    {(paymentDetail.status === 'pending' || paymentDetail.status === 'failed') && (
                                        <Button
                                            onClick={() => handleRequery(paymentDetail.id)}
                                            disabled={requeryPayment.isPending}
                                            className="w-full h-14 rounded-2xl bg-[#0066CC] hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-[0.98]"
                                        >
                                            {requeryPayment.isPending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <RefreshCw className="w-4 h-4" />
                                            )}
                                            Requery Gateway Status
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => handleDownloadReceipt(paymentDetail)}
                                        disabled={isGeneratingReceipt}
                                        className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        {isGeneratingReceipt ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                        Download Receipt
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-12 text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
                                <Search className="w-8 h-8" />
                            </div>
                            <p className="text-slate-500 font-bold">Failed to load payment details</p>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
