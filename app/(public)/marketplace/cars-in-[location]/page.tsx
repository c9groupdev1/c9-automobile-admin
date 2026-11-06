import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  MapPin,
  ShieldCheck,
  Tag,
  Car,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Gauge,
  Fuel,
  ArrowRight,
  Search,
} from 'lucide-react';
import { getLocationBySlug, getAllLocationSlugs, NIGERIAN_LOCATIONS } from '@/lib/seo/locations';
import { fetchLocationListings, ServerListingItem } from '@/lib/seo/fetcher';
import { SeoLocationHub } from '@/components/public/seo-location-hub';
import { PriceGuideTable } from '@/components/public/price-guide-table';
import { SITE_URL } from '@/lib/seo/config';

interface PageProps {
  params: Promise<{ location: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 300; // 5-minute Incremental Static Regeneration

export async function generateStaticParams() {
  const slugs = getAllLocationSlugs();
  return slugs.map((slug) => ({ location: slug }));
}

function formatPriceNaira(val: number): string {
  if (!val || isNaN(val)) return '₦1,500,000';
  return `₦${val.toLocaleString()}`;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const loc = getLocationBySlug(params.location);

  if (!loc) {
    return {
      title: 'Cars for Sale in Nigeria | C9X Marketplace',
      description: 'Explore verified cars for sale in Nigeria on C9X.',
    };
  }

  const aggregates = await fetchLocationListings(loc, { perPage: 12 });
  const countStr = aggregates.totalCount > 0 ? `${aggregates.totalCount}+ ` : '';
  const minPriceFormatted = formatPriceNaira(aggregates.minPrice);

  const title = `Cars in ${loc.fullName} for sale | Price on C9X`;
  const description = `${countStr}Cars for sale in ${loc.fullName} ✓ From ${minPriceFormatted}. Verified new, foreign used (tokunbo) & Nigerian used cars in ${loc.popularAreas.slice(0, 4).join(', ')}. Compare prices, inspect vehicle history & buy securely on C9X.`;

  const canonicalUrl = `${SITE_URL}/marketplace/cars-in-${loc.slug}`;

  return {
    title,
    description,
    keywords: [
      `Cars in ${loc.name} for sale`,
      `Cars for sale in ${loc.fullName}`,
      `Used cars in ${loc.name}`,
      `Tokunbo cars in ${loc.name}`,
      `Buy cars in ${loc.name}`,
      `Car dealers in ${loc.name}`,
      ...loc.popularBrands.map((b) => `${b} for sale in ${loc.name}`),
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'C9X Marketplace',
      locale: 'en_NG',
      type: 'website',
      images: [
        {
          url: aggregates.listings[0]?.imageUrl || `${SITE_URL}/hero-dashboard.png`,
          width: 1200,
          height: 630,
          alt: `Cars for sale in ${loc.fullName} on C9X`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [aggregates.listings[0]?.imageUrl || `${SITE_URL}/hero-dashboard.png`],
    },
  };
}

export default async function LocationMarketplacePage(props: PageProps) {
  const params = await props.params;
  const loc = getLocationBySlug(params.location);

  if (!loc) {
    notFound();
  }

  const aggregates = await fetchLocationListings(loc, { perPage: 24 });
  const effectiveId = aggregates.effectiveStateId || loc.id;
  const minPriceFormatted = formatPriceNaira(aggregates.minPrice);
  const maxPriceFormatted = formatPriceNaira(aggregates.maxPrice);

  // Schema.org Graph definition
  const canonicalUrl = `${SITE_URL}/marketplace/cars-in-${loc.slug}`;

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. Breadcrumbs
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Marketplace',
            item: `${SITE_URL}/marketplace`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `Cars in ${loc.fullName}`,
            item: canonicalUrl,
          },
        ],
      },
      // 2. Aggregate Offer (powers Google snippet price and count)
      {
        '@type': 'AggregateOffer',
        '@id': `${canonicalUrl}#aggregate-offer`,
        priceCurrency: 'NGN',
        lowPrice: aggregates.minPrice,
        highPrice: aggregates.maxPrice,
        offerCount: aggregates.totalCount,
        url: canonicalUrl,
      },
      // 3. ItemList (powers Google Carousel & Rich Result list)
      {
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#itemlist`,
        name: `Cars for sale in ${loc.fullName}`,
        description: loc.description,
        numberOfItems: aggregates.listings.length,
        itemListElement: aggregates.listings.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_URL}/marketplace/${item.slug}`,
          name: item.title,
          image: item.imageUrl,
        })),
      },
      // 4. SiteNavigationElement (triggers Google Sitelinks)
      {
        '@type': 'SiteNavigationElement',
        name: [
          `Check Car Prices In ${loc.name}`,
          `Buy Verified Cars in ${loc.name}`,
          `Find Best Used Cars`,
          `Find Foreign Used Cars in ${loc.name}`,
          `Popular Districts in ${loc.name}`,
        ],
        url: [
          `${canonicalUrl}#check-car-prices`,
          `${canonicalUrl}#buy-verified-cars`,
          `${canonicalUrl}#used-cars`,
          `${canonicalUrl}#foreign-used`,
          `${canonicalUrl}#popular-districts`,
        ],
      },
      // 5. FAQPage (triggers expandable Google search FAQ accordions)
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: `How much does a car cost in ${loc.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `On C9X, car prices in ${loc.fullName} start from ${minPriceFormatted}. Prices vary based on vehicle year, make, condition (Foreign Used Tokunbo vs Nigerian Used), and mileage. Popular sedans range from ₦4,000,000 to ₦18,000,000, while luxury SUVs range from ₦15,000,000 to ₦75,000,000+.`,
            },
          },
          {
            '@type': 'Question',
            name: `Where are the best places to buy cars in ${loc.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Top car dealership hubs and private seller locations in ${loc.name} include ${loc.popularAreas.slice(0, 5).join(', ')}. All listings on C9X can be filtered by specific district and inspected prior to payment.`,
            },
          },
          {
            '@type': 'Question',
            name: `What is the difference between Tokunbo and Nigerian Used cars in ${loc.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Foreign Used (Tokunbo) cars are imported directly from the US, Canada, Europe, or Asia and have never been driven on Nigerian roads, typically offering higher mechanical integrity. Nigerian Used cars have been previously registered and driven in Nigeria and are often priced 30% to 50% lower.`,
            },
          },
          {
            '@type': 'Question',
            name: `How does C9X protect car buyers in ${loc.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `C9X provides verified dealer badges, comprehensive VIN and chassis verification, physical vehicle inspection services, and escrow transaction options to ensure your funds remain protected until you inspect and accept the vehicle.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      {/* Hero / Header Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-16 px-4 md:px-8 border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} className="text-slate-600" />
            <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-[#60A5FA] font-semibold">Cars in {loc.fullName}</span>
          </nav>

          {/* Main Title & Trust Signal */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0066CC]/20 border border-[#0066CC]/30 text-[#60A5FA] text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Verified Automotive Marketplace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Cars in {loc.fullName} for Sale
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              {aggregates.totalCount > 0 ? (
                <>
                  <strong className="text-white font-bold">{aggregates.totalCount}+ Cars</strong> available in {loc.fullName} starting from{' '}
                  <strong className="text-white font-bold">{minPriceFormatted}</strong>.{' '}
                </>
              ) : null}
              Find verified foreign used (tokunbo) and Nigerian used cars in {loc.popularAreas.slice(0, 4).join(', ')}. Inspect before payment and deal with verified sellers on C9X.
            </p>
          </div>

          {/* Quick Jump Anchors (These become Google Sitelinks!) */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
            <a
              href="#check-car-prices"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <TrendingUp size={13} className="text-[#60A5FA]" />
              <span>Check Car Prices in {loc.name}</span>
            </a>
            <a
              href="#buy-verified-cars"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Buy Verified Cars</span>
            </a>
            <a
              href="#foreign-used"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Car size={13} className="text-amber-400" />
              <span>Foreign Used (Tokunbo)</span>
            </a>
            <a
              href="#popular-districts"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <MapPin size={13} className="text-purple-400" />
              <span>Cars by District</span>
            </a>
            <a
              href="#faq"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle size={13} className="text-sky-400" />
              <span>Frequently Asked Questions</span>
            </a>
          </div>

          {/* Interactive Filter CTA Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <SlidersHorizontal size={16} className="text-[#60A5FA]" />
              <span>Need specific filters? Search makes, models, year, transmission and budget:</span>
            </div>
            <Link
              href={`/marketplace?stateId=${effectiveId}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#0052a3] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#0066CC]/20"
            >
              <Search size={14} />
              <span>Open Filter Explorer ({loc.name})</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
        {/* Listings Grid */}
        <section>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Available Cars in {loc.fullName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Showing verified vehicle listings located in {loc.name}
              </p>
            </div>
            <Link
              href={`/marketplace?stateId=${effectiveId}`}
              className="text-xs font-bold text-[#0066CC] hover:underline flex items-center gap-1"
            >
              <span>View all in interactive grid</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {aggregates.listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {aggregates.listings.map((item: ServerListingItem) => (
                <Link
                  key={item.id}
                  href={`/marketplace/${item.slug || item.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <Image
                      src={item.imageUrl || '/c9x-logo.png'}
                      alt={`${item.title} for sale in ${loc.name}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.condition && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                        {item.condition}
                      </span>
                    )}
                  </div>

                  {/* Vehicle Details */}
                  <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1">
                        <MapPin size={12} className="text-[#0066CC]" />
                        <span className="truncate">{item.city || loc.name}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0066CC] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-base font-black text-[#0066CC]">
                        {formatPriceNaira(item.amount)}
                      </p>
                      <span className="text-[11px] font-bold text-slate-500 group-hover:text-[#0066CC] transition-colors flex items-center gap-1">
                        <span>Details</span>
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-xl mx-auto space-y-4">
              <Car size={48} className="mx-auto text-slate-300" />
              <h3 className="text-lg font-bold text-slate-800">New inventory arriving in {loc.name}</h3>
              <p className="text-sm text-slate-500">
                Be the first to browse newly uploaded vehicles or list your car for sale in {loc.name} today.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/marketplace"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Browse All Nigeria
                </Link>
                <Link
                  href="/list-vehicle"
                  className="px-5 py-2.5 rounded-xl bg-[#0066CC] text-white font-bold text-xs uppercase tracking-wider"
                >
                  Sell Your Car in {loc.name}
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Section 1: Check Car Prices in Location (Price Guide) */}
        <section id="check-car-prices" className="scroll-mt-24 bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp size={13} />
              <span>Market Price Intelligence</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Check Car Prices in {loc.fullName}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Estimated price benchmarks for popular car models in {loc.name}. Actual prices vary based on year of manufacture, transmission, mileage, and vehicle condition report.
            </p>
          </div>

          <PriceGuideTable
            locationId={Number(effectiveId) || loc.id}
            locationName={loc.name}
            fullName={loc.fullName}
          />
        </section>

        {/* Section 2: Buy Verified Cars in Location */}
        <section id="buy-verified-cars" className="scroll-mt-24 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 md:p-12 shadow-xl space-y-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={14} />
              <span>Buyer Protection Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Buy Verified Cars in {loc.fullName} with Confidence
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Unlike unverified classifieds, C9X enforces strict dealer KYC, physical multi-point inspection checks, and secure payment escrow so you can buy cars in {loc.name} without fear of scams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066CC] flex items-center justify-center text-white font-bold">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-base text-white">Verified Dealers & Private Sellers</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All car sellers in {loc.name} submit government-issued identification and dealership documentation before their listings receive verified status.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-bold text-base text-white">Chassis & VIN Inspection</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Verify original production year, factory specs, accident history, and customs duty clearance status right on C9X before arranging a test drive.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-base text-white">Physical Test Drives in {loc.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Schedule in-person inspections at verified dealer showrooms or designated secure meeting locations in {loc.popularAreas[0]} and across {loc.name}.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Popular Districts / Areas */}
        <section id="popular-districts" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Cars for Sale by District in {loc.fullName}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Find cars near you in top residential and commercial hubs across {loc.name}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {loc.popularAreas.map((area, idx) => (
              <Link
                key={idx}
                href={`/marketplace?stateId=${effectiveId}&search=${encodeURIComponent(area)}`}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#0066CC] hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin size={13} className="text-[#0066CC] flex-shrink-0" />
                  <span className="font-bold text-xs text-slate-800 group-hover:text-[#0066CC] truncate">
                    {area}
                  </span>
                </div>
                <ChevronRight size={13} className="text-slate-400 group-hover:text-[#0066CC] transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Popular Car Brands in Location */}
        <section id="popular-brands" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Popular Car Brands in {loc.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explore inventory from top manufacturers preferred by motorists in {loc.fullName}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {loc.popularBrands.map((brand, idx) => (
              <Link
                key={idx}
                href={`/marketplace?stateId=${effectiveId}&search=${encodeURIComponent(brand)}`}
                className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#0066CC] hover:shadow-sm text-center transition-all group"
              >
                <p className="font-bold text-xs text-slate-800 group-hover:text-[#0066CC] transition-colors">
                  {brand}
                </p>
                <span className="text-[10px] text-slate-400">in {loc.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 5: Localized FAQ with Schema Alignment */}
        <section id="faq" className="scroll-mt-24 bg-white rounded-3xl p-8 md:p-10 border border-slate-200 space-y-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0066CC] text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle size={13} />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions About Cars in {loc.fullName}
            </h2>
          </div>

          <div className="space-y-4 pt-2">
            <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors space-y-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0066CC]" />
                <span>How much does a car cost in {loc.name}?</span>
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                Car prices in {loc.fullName} on C9X start from {minPriceFormatted}. Prices depend on whether the car is Foreign Used (Tokunbo) or Nigerian Used, its year of production, and its mechanical grade. Budget sedans like Toyota Corolla and Camry start from ₦3.5M - ₦8.5M, while executive SUVs range from ₦15M to ₦60M+.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors space-y-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0066CC]" />
                <span>What are the best places to buy cars in {loc.name}?</span>
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                Top car dealership hubs in {loc.name} include {loc.popularAreas.slice(0, 4).join(', ')}. C9X allows you to browse verified dealer lots and direct private car owners across all these areas from your phone.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors space-y-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0066CC]" />
                <span>What is the difference between Tokunbo and Nigerian Used cars?</span>
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                Tokunbo (Foreign Used) cars are imported from North America, Europe, or the UAE and have not experienced Nigerian road conditions. They typically command higher prices due to clean engine states. Nigerian used cars have been driven locally and offer substantial discounts for budget-conscious buyers.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors space-y-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0066CC]" />
                <span>Can I inspect the vehicle before paying in {loc.name}?</span>
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                Yes. C9X strongly advises and supports in-person vehicle inspections. Sellers are verified, and you can chat with the seller directly through the C9X platform to agree on a secure viewing and test-drive appointment.
              </p>
            </div>
          </div>
        </section>

        {/* Directory Hub Section (Passes PageRank to other states) */}
        <SeoLocationHub currentSlug={loc.slug} />
      </main>
    </div>
  );
}

