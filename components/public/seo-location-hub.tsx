import React from 'react';
import Link from 'next/link';
import { MapPin, Compass, ArrowRight, ShieldCheck, Car } from 'lucide-react';
import { NIGERIAN_LOCATIONS } from '@/lib/seo/locations';

export function SeoLocationHub({
  currentSlug,
  className = '',
}: {
  currentSlug?: string;
  className?: string;
}) {
  const topLocations = Object.values(NIGERIAN_LOCATIONS);

  // Group top tier hubs
  const primaryHubs = topLocations.slice(0, 8);
  const secondaryHubs = topLocations.slice(8);

  return (
    <section className={`bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 ${className}`}>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066CC]/20 text-[#60A5FA] text-xs font-bold uppercase tracking-wider mb-3">
              <Compass size={13} />
              <span>Nigeria Automotive Directory</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Browse Cars by State & Region
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Find verified new, foreign used (tokunbo) and Nigerian used cars in every major city and state across Nigeria.
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#60A5FA] hover:text-white transition-colors"
          >
            <span>View All Vehicles</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Primary State Links */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <MapPin size={14} className="text-[#0066CC]" />
            <span>Top Automotive Markets</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {primaryHubs.map((loc) => {
              const isActive = loc.slug === currentSlug;
              return (
                <Link
                  key={loc.slug}
                  href={`/cars-in/${loc.slug}`}
                  className={`p-4 rounded-2xl border transition-all duration-200 group flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#0066CC] border-[#0066CC] text-white shadow-lg shadow-[#0066CC]/20'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-[#60A5FA] transition-colors">
                      Cars in {loc.name}
                    </span>
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all text-[#60A5FA]"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 line-clamp-1">
                    {loc.popularAreas.slice(0, 3).join(', ')}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* All Other States Grid */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
            Other States Across Nigeria
          </h3>
          <div className="flex flex-wrap gap-2">
            {secondaryHubs.map((loc) => (
              <Link
                key={loc.slug}
                href={`/cars-in/${loc.slug}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 hover:border-slate-600 text-slate-300 hover:text-white transition-colors"
              >
                Cars in {loc.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Badge Footer */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Every vehicle on C9X includes verified dealer credentials and physical inspection options.</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Car size={14} className="text-[#60A5FA]" />
            <span className="font-semibold">Tokunbo & Nigerian Used Verified Directory</span>
          </div>
        </div>
      </div>
    </section>
  );
}

