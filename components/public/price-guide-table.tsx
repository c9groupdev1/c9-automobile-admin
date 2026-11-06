'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Car, ChevronRight, Search, SlidersHorizontal, TrendingUp } from 'lucide-react';
import { NIGERIAN_CAR_PRICE_GUIDES, CarPriceGuideItem } from '@/lib/seo/price-guides';

interface PriceGuideTableProps {
  locationId: number;
  locationName: string;
  fullName: string;
}

export function PriceGuideTable({ locationId, locationName, fullName }: PriceGuideTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    return ['All', 'Popular Sedans', 'SUVs & Crossovers', 'Luxury & Executive', 'Buses, Vans & Trucks'];
  }, []);

  const filteredGuides = useMemo(() => {
    return NIGERIAN_CAR_PRICE_GUIDES.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Category Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all select-none cursor-pointer ${
                  isActive
                    ? 'bg-[#003399] text-white shadow-md shadow-blue-900/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Quick Model Search */}
        <div className="relative w-full md:w-64 flex-shrink-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search model (e.g. Corolla, RX 350)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003399]/20 focus:border-[#003399]"
          />
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Popular Brand & Model</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Foreign Used (Tokunbo)</th>
              <th className="py-3.5 px-4">Nigerian Used</th>
              <th className="py-3.5 px-4 text-right">Live Inventory</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800 bg-white">
            {filteredGuides.length > 0 ? (
              filteredGuides.map((guide, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Car size={15} className="text-[#0066CC] flex-shrink-0" />
                    <span>{guide.brand}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase tracking-wider">
                      {guide.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-700">{guide.tokunboPrice}</td>
                  <td className="py-3 px-4 font-bold text-slate-700">{guide.localPrice}</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/marketplace?stateId=${locationId}&search=${encodeURIComponent(guide.brand)}`}
                      className="text-[#0066CC] font-bold text-xs hover:underline inline-flex items-center gap-1"
                    >
                      <span>Find in {locationName}</span>
                      <ChevronRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                  No car models match your filter. Try searching a different model or brand.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span>Showing {filteredGuides.length} popular car models for {fullName}</span>
        <span>Prices updated weekly based on Nigerian customs and market trends</span>
      </div>
    </div>
  );
}

