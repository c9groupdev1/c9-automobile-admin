'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, ZoomIn, ZoomOut, RotateCw, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';

interface ImagePreviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    title: string;
}

export function ImagePreviewDialog({ isOpen, onClose, imageUrl, title }: ImagePreviewDialogProps) {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);

    const resetTransform = () => {
        setScale(1);
        setRotation(0);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { resetTransform(); onClose(); } }}>
            <DialogContent 
                showCloseButton={false}
                className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] h-[88vh] p-0 overflow-hidden border border-slate-800 bg-slate-950 text-white flex flex-col rounded-[2.5rem] shadow-2xl transition-all"
            >
                {/* Sleek Top Header */}
                <div className="flex items-center justify-between px-8 py-5 bg-slate-900/40 backdrop-blur-md border-b border-slate-900/60 z-20">
                    <DialogHeader className="space-y-0 text-left flex-1 mr-4">
                        <DialogTitle className="text-sm font-black text-slate-100 uppercase tracking-[0.2em] truncate max-w-xl">
                            {title || 'Image Preview'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-4">
                        {imageUrl && (
                            <a 
                                href={imageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-10 px-5 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20 transition-all gap-2"
                            >
                                <ExternalLink size={12} />
                                Full Resolution
                            </a>
                        )}
                        <div className="w-px h-6 bg-slate-800" />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => { resetTransform(); onClose(); }}
                            className="h-10 w-10 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
                            title="Close Preview"
                        >
                            <X size={20} />
                        </Button>
                    </div>
                </div>

                {/* Immersive Image Display Layer */}
                <div className="flex-1 min-h-0 bg-slate-950 flex items-center justify-center p-8 relative overflow-hidden group">
                    {imageUrl ? (
                        <>
                            {/* Decorative subtle background ambient glow */}
                            <div 
                                className="absolute w-[600px] h-[600px] bg-[#003399]/15 rounded-full filter blur-[120px] pointer-events-none opacity-40 mix-blend-screen transition-transform duration-500"
                                style={{
                                    transform: `scale(${scale})`,
                                }}
                            />
                            
                            {/* Interactive Zoomable Image container */}
                            <div 
                                className="relative w-full h-full flex items-center justify-center select-none transition-all duration-300 ease-out"
                                style={{
                                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                                }}
                            >
                                <img
                                    src={imageUrl}
                                    alt={title}
                                    className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all select-none pointer-events-none"
                                    draggable={false}
                                />
                            </div>

                            {/* Floating Premium Glassmorphism Dock at the Bottom */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/75 hover:bg-slate-900/90 backdrop-blur-2xl border border-white/5 px-6 py-3 rounded-full flex items-center gap-4 shadow-2xl z-10 transition-all duration-300">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={handleZoomOut}
                                    disabled={scale <= 0.5}
                                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all disabled:opacity-35"
                                    title="Zoom Out"
                                >
                                    <ZoomOut size={15} />
                                </Button>
                                
                                <span className="text-[10px] font-black text-slate-300 w-12 text-center uppercase tracking-widest select-none">
                                    {Math.round(scale * 100)}%
                                </span>
                                
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={handleZoomIn}
                                    disabled={scale >= 3}
                                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all disabled:opacity-35"
                                    title="Zoom In"
                                >
                                    <ZoomIn size={15} />
                                </Button>
                                
                                <div className="w-px h-5 bg-white/10" />
                                
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={handleRotate}
                                    className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                    title="Rotate 90°"
                                >
                                    <RotateCw size={15} />
                                </Button>

                                {(scale !== 1 || rotation !== 0) && (
                                    <>
                                        <div className="w-px h-5 bg-white/10" />
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={resetTransform}
                                            className="h-8 w-8 text-[#003399] hover:text-blue-400 hover:bg-white/10 rounded-full transition-all"
                                            title="Reset Transforms"
                                        >
                                            <RotateCcw size={15} />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-500 uppercase select-none">
                            <span className="text-[10px] font-black tracking-widest">No Image Found</span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
