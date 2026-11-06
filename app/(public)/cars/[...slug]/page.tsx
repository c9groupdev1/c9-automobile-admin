import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  Car,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Calendar,
  CheckCircle2,
  SlidersHorizontal,
  Search,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { fetchVehicleCatalog, ServerListingItem } from '@/lib/seo/fetcher';
import { SITE_URL } from '@/lib/seo/config';
import { SeoLocationHub } from '@/components/public/seo-location-hub';

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 300; // 5-minute ISR

const KNOWN_MAKES: Record<string, string> = {
  toyota: 'Toyota',
  honda: 'Honda',
  lexus: 'Lexus',
  'mercedes-benz': 'Mercedes-Benz',
  mercedes: 'Mercedes-Benz',
  benz: 'Mercedes-Benz',
  hyundai: 'Hyundai',
  kia: 'Kia',
  ford: 'Ford',
  nissan: 'Nissan',
  'land-rover': 'Land Rover',
  landrover: 'Land Rover',
  'range-rover': 'Land Rover',
  rangerover: 'Land Rover',
  bmw: 'BMW',
  volkswagen: 'Volkswagen',
  vw: 'Volkswagen',
  peugeot: 'Peugeot',
  audi: 'Audi',
  mitsubishi: 'Mitsubishi',
  chevrolet: 'Chevrolet',
  chevy: 'Chevrolet',
  mazda: 'Mazda',
  jeep: 'Jeep',
  tesla: 'Tesla',
  porsche: 'Porsche',
  subaru: 'Subaru',
  volvo: 'Volvo',
  suzuki: 'Suzuki',
  bentley: 'Bentley',
  'rolls-royce': 'Rolls-Royce',
  rollsroyce: 'Rolls-Royce',
  ferrari: 'Ferrari',
  lamborghini: 'Lamborghini',
  'aston-martin': 'Aston Martin',
  astonmartin: 'Aston Martin',
  dodge: 'Dodge',
  chrysler: 'Chrysler',
  cadillac: 'Cadillac',
  gmc: 'GMC',
  lincoln: 'Lincoln',
  infiniti: 'Infiniti',
  acura: 'Acura',
  genesis: 'Genesis',
  maserati: 'Maserati',
  jaguar: 'Jaguar',
  renault: 'Renault',
  innoson: 'Innoson',
  ivm: 'Innoson',
  gac: 'GAC',
  changan: 'Changan',
  geely: 'Geely',
  chery: 'Chery',
  haval: 'Haval',
  jac: 'JAC',
  byd: 'BYD',
};

const KNOWN_MODELS: Record<string, { make: string; model: string }> = {
  camry: { make: 'Toyota', model: 'Camry' },
  corolla: { make: 'Toyota', model: 'Corolla' },
  highlander: { make: 'Toyota', model: 'Highlander' },
  rav4: { make: 'Toyota', model: 'RAV4' },
  sienna: { make: 'Toyota', model: 'Sienna' },
  prado: { make: 'Toyota', model: 'Prado' },
  venza: { make: 'Toyota', model: 'Venza' },
  hilux: { make: 'Toyota', model: 'Hilux' },
  yaris: { make: 'Toyota', model: 'Yaris' },
  landcruiser: { make: 'Toyota', model: 'Land Cruiser' },
  'land-cruiser': { make: 'Toyota', model: 'Land Cruiser' },
  'rx-350': { make: 'Lexus', model: 'RX 350' },
  rx350: { make: 'Lexus', model: 'RX 350' },
  'es-350': { make: 'Lexus', model: 'ES 350' },
  es350: { make: 'Lexus', model: 'ES 350' },
  'gx-460': { make: 'Lexus', model: 'GX 460' },
  gx460: { make: 'Lexus', model: 'GX 460' },
  'lx-570': { make: 'Lexus', model: 'LX 570' },
  lx570: { make: 'Lexus', model: 'LX 570' },
  'lx-600': { make: 'Lexus', model: 'LX 600' },
  lx600: { make: 'Lexus', model: 'LX 600' },
  c300: { make: 'Mercedes-Benz', model: 'C300' },
  e350: { make: 'Mercedes-Benz', model: 'E350' },
  glk350: { make: 'Mercedes-Benz', model: 'GLK 350' },
  'glk-350': { make: 'Mercedes-Benz', model: 'GLK 350' },
  gle350: { make: 'Mercedes-Benz', model: 'GLE 350' },
  'gle-350': { make: 'Mercedes-Benz', model: 'GLE 350' },
  gle450: { make: 'Mercedes-Benz', model: 'GLE 450' },
  'gle-450': { make: 'Mercedes-Benz', model: 'GLE 450' },
  g63: { make: 'Mercedes-Benz', model: 'G63 AMG' },
  'g-63': { make: 'Mercedes-Benz', model: 'G63 AMG' },
  accord: { make: 'Honda', model: 'Accord' },
  civic: { make: 'Honda', model: 'Civic' },
  'cr-v': { make: 'Honda', model: 'CR-V' },
  crv: { make: 'Honda', model: 'CR-V' },
  pilot: { make: 'Honda', model: 'Pilot' },
  elantra: { make: 'Hyundai', model: 'Elantra' },
  sonata: { make: 'Hyundai', model: 'Sonata' },
  'santa-fe': { make: 'Hyundai', model: 'Santa Fe' },
  tucson: { make: 'Hyundai', model: 'Tucson' },
  spectre: { make: 'Rolls-Royce', model: 'Spectre' },
  cullinan: { make: 'Rolls-Royce', model: 'Cullinan' },
  ghost: { make: 'Rolls-Royce', model: 'Ghost' },
  phantom: { make: 'Rolls-Royce', model: 'Phantom' },
  sportage: { make: 'Kia', model: 'Sportage' },
  optima: { make: 'Kia', model: 'Optima' },
  cerato: { make: 'Kia', model: 'Cerato' },
  sorento: { make: 'Kia', model: 'Sorento' },
  explorer: { make: 'Ford', model: 'Explorer' },
  edge: { make: 'Ford', model: 'Edge' },
  f150: { make: 'Ford', model: 'F-150' },
  'f-150': { make: 'Ford', model: 'F-150' },
  mustang: { make: 'Ford', model: 'Mustang' },
};

function formatBrandName(str: string): string {
  const clean = str.toLowerCase().trim();
  if (KNOWN_MAKES[clean]) return KNOWN_MAKES[clean];
  return clean
    .split(/[-_ ]+/)
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function formatModelName(str: string): string {
  const clean = str.toLowerCase().trim();
  if (KNOWN_MODELS[clean]) return KNOWN_MODELS[clean].model;
  return clean
    .split(/[-_ ]+/)
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

function parseSlugParams(slugs: string[]): { make?: string; model?: string; year?: string } {
  let make: string | undefined;
  let model: string | undefined;
  let year: string | undefined;

  const nonYearSlugs: string[] = [];

  for (const seg of slugs) {
    const clean = seg.toLowerCase().trim();
    if (/^(19\d{2}|20\d{2})$/.test(clean)) {
      year = clean;
    } else {
      nonYearSlugs.push(clean);
    }
  }

  if (nonYearSlugs.length === 1) {
    const single = nonYearSlugs[0];
    if (KNOWN_MODELS[single]) {
      make = KNOWN_MODELS[single].make;
      model = KNOWN_MODELS[single].model;
    } else if (KNOWN_MAKES[single]) {
      make = KNOWN_MAKES[single];
    } else {
      // Could be a make or a model
      model = formatModelName(single);
    }
  } else if (nonYearSlugs.length === 2) {
    // First segment is make, second is model
    make = formatBrandName(nonYearSlugs[0]);
    model = formatModelName(nonYearSlugs[1]);
  } else if (nonYearSlugs.length >= 3) {
    make = formatBrandName(nonYearSlugs[0]);
    model = formatModelName(nonYearSlugs.slice(1).join(' '));
  }

  return { make, model, year };
}

function formatPriceNaira(val: number): string {
  if (!val || isNaN(val)) return '₦3,800,000';
  return `₦${val.toLocaleString()}`;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { make, model, year } = parseSlugParams(params.slug || []);

  const searchTitle = [make, model, year].filter(Boolean).join(' ');
  if (!searchTitle) {
    return {
      title: 'Cars for Sale in Nigeria | C9X Marketplace',
      description: 'Find verified cars for sale in Nigeria on C9X.',
    };
  }

  const aggregates = await fetchVehicleCatalog({ make, model, year, perPage: 12 });
  const countStr = aggregates.totalCount > 0 ? `${aggregates.totalCount}+ ` : '';
  const minPriceFormatted = formatPriceNaira(aggregates.minPrice);

  // Exact Match to Google Search Intent (e.g. "Toyota Camry 2024 in Nigeria")
  const title = year
    ? `${searchTitle} in Nigeria | Price on C9X`
    : `${searchTitle} for sale in Nigeria | Price from ${minPriceFormatted} | C9X`;

  const description = `${countStr}${searchTitle} for sale in Nigeria ✓ From ${minPriceFormatted}. Foreign used (tokunbo) & Nigerian used ${searchTitle}. Compare prices, inspect vehicle history & buy securely on C9X.`;

  const canonicalUrl = `${SITE_URL}/cars/${params.slug.join('/')}`;

  return {
    title,
    description,
    keywords: [
      `${searchTitle} in Nigeria`,
      `${searchTitle} for sale in Nigeria`,
      `${searchTitle} price in Nigeria`,
      `Tokunbo ${searchTitle}`,
      `Used ${searchTitle} Nigeria`,
      `Buy ${searchTitle}`,
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
          alt: `${searchTitle} in Nigeria on C9X`,
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

export default async function VehicleCatalogPage(props: PageProps) {
  const params = await props.params;
  const { make, model, year } = parseSlugParams(params.slug || []);

  const searchTitle = [make, model, year].filter(Boolean).join(' ');
  if (!searchTitle) {
    notFound();
  }

  const aggregates = await fetchVehicleCatalog({ make, model, year, perPage: 24 });
  const minPriceFormatted = formatPriceNaira(aggregates.minPrice);
  const maxPriceFormatted = formatPriceNaira(aggregates.maxPrice);

  const canonicalUrl = `${SITE_URL}/cars/${params.slug.join('/')}`;

  // Multi-image ItemList Schema (powers Google 3-thumbnail carousel)
  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
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
          make
            ? {
                '@type': 'ListItem',
                position: 3,
                name: make,
                item: `${SITE_URL}/cars/${make.toLowerCase()}`,
              }
            : null,
          model
            ? {
                '@type': 'ListItem',
                position: 4,
                name: model,
                item: `${SITE_URL}/cars/${(make || '').toLowerCase()}/${model.toLowerCase()}`,
              }
            : null,
          year
            ? {
                '@type': 'ListItem',
                position: 5,
                name: year,
                item: canonicalUrl,
              }
            : null,
        ].filter(Boolean),
      },
      // AggregateOffer Schema (powers Google's "✓ From ₦ 3,800,000" snippet)
      {
        '@type': 'AggregateOffer',
        '@id': `${canonicalUrl}#aggregate-offer`,
        priceCurrency: 'NGN',
        lowPrice: aggregates.minPrice,
        highPrice: aggregates.maxPrice,
        offerCount: aggregates.totalCount,
        url: canonicalUrl,
      },
      // ItemList Schema (triggers Google's 3-Image Carousel in SERPs)
      {
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#itemlist`,
        name: `${searchTitle} in Nigeria`,
        description: `Verified ${searchTitle} for sale in Nigeria on C9X.`,
        numberOfItems: aggregates.listings.length,
        itemListElement: aggregates.listings.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_URL}/marketplace/${item.slug}`,
          name: item.title,
          image: item.imageUrl,
        })),
      },
      // FAQPage Schema (triggers Google FAQ accordions)
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: `How much is a ${searchTitle} in Nigeria?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `On C9X, prices for ${searchTitle} in Nigeria start from ${minPriceFormatted}. Prices vary depending on condition (Foreign Used Tokunbo vs Nigerian Used), year of production, mileage, and trim level.`,
            },
          },
          {
            '@type': 'Question',
            name: `What is the difference between Tokunbo and Nigerian used ${searchTitle}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Foreign Used (Tokunbo) ${searchTitle} vehicles are imported directly and have not been driven on Nigerian roads, typically commanding a premium for clean mechanical history. Nigerian used units offer substantial savings (often 30% to 50% less).`,
            },
          },
          {
            '@type': 'Question',
            name: `Can I inspect a ${searchTitle} before payment on C9X?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes. All listings on C9X support verified dealer credentials, comprehensive VIN/chassis background checks, physical inspections, and escrow payment options to guarantee your safety.`,
            },
          },
        ],
      },
    ],
  };

  const adjacentYears = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-16 px-4 md:px-8 border-b border-slate-700/60">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} className="text-slate-600" />
            <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
            {make && (
              <>
                <ChevronRight size={12} className="text-slate-600" />
                <Link href={`/cars/${make.toLowerCase()}`} className="hover:text-white transition-colors">{make}</Link>
              </>
            )}
            {model && (
              <>
                <ChevronRight size={12} className="text-slate-600" />
                <Link href={`/cars/${(make || '').toLowerCase()}/${model.toLowerCase()}`} className="hover:text-white transition-colors">{model}</Link>
              </>
            )}
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-[#60A5FA] font-semibold">{searchTitle} in Nigeria</span>
          </nav>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0066CC]/20 border border-[#0066CC]/30 text-[#60A5FA] text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Verified Automotive Inventory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {searchTitle} in Nigeria
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
              {aggregates.totalCount > 0 ? (
                <>
                  <strong className="text-white font-bold">{aggregates.totalCount}+ {searchTitle}</strong> for sale in Nigeria starting from{' '}
                  <strong className="text-white font-bold">{minPriceFormatted}</strong>.{' '}
                </>
              ) : null}
              Find verified foreign used (tokunbo) and Nigerian used {searchTitle} from certified dealers. Physical inspection, VIN reports, and escrow payments on C9X.
            </p>
          </div>

          {/* Model Year Fast Jump Pills */}
          {model && (
            <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex-shrink-0">
                Browse by Year:
              </span>
              {adjacentYears.map((yr) => {
                const isActive = yr === year;
                const makeSlug = (make || 'toyota').toLowerCase();
                const modelSlug = model.toLowerCase();
                return (
                  <Link
                    key={yr}
                    href={`/cars/${makeSlug}/${modelSlug}/${yr}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#0066CC] text-white shadow-md shadow-[#0066CC]/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {yr} {model}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Search CTA */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <SlidersHorizontal size={16} className="text-[#60A5FA]" />
              <span>Filter by transmission, color, location (Lagos, Abuja, PH) & price:</span>
            </div>
            <Link
              href={`/marketplace?search=${encodeURIComponent(searchTitle)}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#0052a3] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#0066CC]/20"
            >
              <Search size={14} />
              <span>Interactive Filters ({searchTitle})</span>
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
                {searchTitle} Available for Sale
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Showing verified inventory matching &quot;{searchTitle}&quot; across Nigeria
              </p>
            </div>
            <Link
              href={`/marketplace?search=${encodeURIComponent(searchTitle)}`}
              className="text-xs font-bold text-[#0066CC] hover:underline flex items-center gap-1"
            >
              <span>Explore all in marketplace</span>
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
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <Image
                      src={item.imageUrl || '/c9x-logo.png'}
                      alt={`${item.title} in Nigeria`}
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

                  <div className="p-4 flex flex-col flex-grow justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1">
                        <MapPin size={12} className="text-[#0066CC]" />
                        <span className="truncate">{item.city || item.state || 'Nigeria'}</span>
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
              <h3 className="text-lg font-bold text-slate-800">Looking for {searchTitle}?</h3>
              <p className="text-sm text-slate-500">
                New inventory is added daily. You can search our broader vehicle catalog or sell your {searchTitle} on C9X today.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/marketplace"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Browse All Vehicles
                </Link>
                <Link
                  href="/list-vehicle"
                  className="px-5 py-2.5 rounded-xl bg-[#0066CC] text-white font-bold text-xs uppercase tracking-wider"
                >
                  Sell on C9X
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Pricing Guide Section */}
        <section className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp size={13} />
              <span>Pricing Guide</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {searchTitle} Price Overview in Nigeria
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Estimated market values based on current active dealer listings across Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Starting Price</span>
              <p className="text-xl font-black text-[#0066CC]">{minPriceFormatted}</p>
              <span className="text-[10px] text-slate-400">Lowest verified listing</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Average Price</span>
              <p className="text-xl font-black text-slate-900">
                {aggregates.avgPrice ? formatPriceNaira(aggregates.avgPrice) : minPriceFormatted}
              </p>
              <span className="text-[10px] text-slate-400">Standard market value</span>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Top-Tier / Brand New</span>
              <p className="text-xl font-black text-slate-900">{maxPriceFormatted}</p>
              <span className="text-[10px] text-slate-400">High-spec & brand new editions</span>
            </div>
          </div>
        </section>

        {/* FAQs matching Google "People Also Ask" */}
        <section className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 space-y-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0066CC] text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle size={13} />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions About {searchTitle}
            </h2>
          </div>

          <div className="space-y-4 pt-2">
            <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors space-y-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0066CC]" />
                <span>How much does a {searchTitle} cost in Nigeria?</span>
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                Prices for {searchTitle} on C9X start from {minPriceFormatted}. Prices fluctuate based on whether the car is Foreign Used (Tokunbo) or Nigerian Used, overall mileage, and transmission condition.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors space-y-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0066CC]" />
                <span>How can I buy a verified {searchTitle} safely on C9X?</span>
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                All car sellers on C9X undergo identity verification. We advise requesting a comprehensive VIN check and scheduling a physical test drive before releasing funds through our secure transaction channels.
              </p>
            </div>
          </div>
        </section>

        {/* Directory Hub */}
        <SeoLocationHub />
      </main>
    </div>
  );
}

