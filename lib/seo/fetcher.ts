import { LocationSeoConfig, NIGERIAN_LOCATIONS } from './locations';

export interface ServerListingItem {
  id: string;
  slug?: string;
  title: string;
  amount: number;
  condition?: string;
  year?: string | number;
  make?: string;
  model?: string;
  city?: string;
  state?: string;
  imageUrl?: string;
  transmission?: string;
  fuelType?: string;
  mileage?: string | number;
  status?: string;
  createdAt?: string;
}

export interface LocationAggregates {
  effectiveStateId: number | string;
  totalCount: number;
  minPrice: number;
  maxPrice: number;
  avgForeignUsedPrice?: number;
  avgNigerianUsedPrice?: number;
  listings: ServerListingItem[];
}

function getCandidateBases(): string[] {
  const list = [
    process.env.API_SECRET_URL,
    process.env.NEXT_PUBLIC_API_URL,
    'https://c9x.ng/app/api',
    'https://c9x.thec9group.com/api',
    'https://c9x.thec9group.com/app/api',
  ].filter(Boolean) as string[];

  return Array.from(new Set(list.map((u) => u.replace(/\/+$/, ''))));
}

/**
 * Dynamically resolves the live backend state ID by querying `/states`.
 * If the API is offline or unreachable, falls back to the static ID from locations.ts.
 */
export async function resolveBackendStateId(loc: LocationSeoConfig): Promise<number | string> {
  const bases = getCandidateBases();
  const searchTerms = [loc.slug, loc.name.toLowerCase(), ...loc.aliases.map((a) => a.toLowerCase())];

  for (const base of bases) {
    try {
      const res = await fetch(`${base}/states`, {
        next: { revalidate: 86400 }, // Cache live states list for 24 hours
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(3500),
      });

      if (res.ok) {
        const json = await res.json();
        const stateList = json?.data?.data || json?.data || [];
        if (Array.isArray(stateList) && stateList.length > 0) {
          const match = stateList.find((s: any) => {
            const sSlug = String(s.slug || '').toLowerCase();
            const sName = String(s.name || '').toLowerCase();
            return searchTerms.includes(sSlug) || searchTerms.includes(sName);
          });
          if (match && match.id !== undefined && match.id !== null) {
            return match.id;
          }
        }
      }
    } catch (e) {
      // try next candidate
    }
  }

  // Safe fallback to the static standard Nigerian state ID
  return loc.id;
}

export async function fetchLocationListings(
  loc: LocationSeoConfig | (number | string),
  options?: { page?: number; perPage?: number; condition?: string; make?: string }
): Promise<LocationAggregates> {
  let stateId: number | string;

  if (typeof loc === 'object' && loc !== null && 'id' in loc) {
    stateId = await resolveBackendStateId(loc);
  } else {
    stateId = loc;
  }

  const bases = getCandidateBases();
  const perPage = options?.perPage || 24;
  const page = options?.page || 1;

  const queryParams = new URLSearchParams({
    stateId: String(stateId),
    perPage: String(perPage),
    page: String(page),
  });

  if (options?.condition) queryParams.set('condition', options.condition);
  if (options?.make) queryParams.set('make', options.make);

  let rawListings: any[] = [];
  let total = 0;

  for (const base of bases) {
    try {
      const url = `${base}/listings?${queryParams.toString()}`;
      const res = await fetch(url, {
        next: { revalidate: 300 }, // 5 min ISR caching
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(4500),
      });

      if (res.ok) {
        const json = await res.json();
        const dataArr = json?.data?.data || json?.data || [];
        total = json?.data?.total || json?.meta?.total || dataArr.length || 0;
        rawListings = Array.isArray(dataArr) ? dataArr : [];
        if (rawListings.length > 0) break;
      }
    } catch (e) {
      // try next candidate
    }
  }

  // Normalize listings
  let minPrice = Infinity;
  let maxPrice = 0;
  let foreignTotal = 0;
  let foreignCount = 0;
  let localTotal = 0;
  let localCount = 0;

  const normalized: ServerListingItem[] = rawListings.map((item: any) => {
    const basic = item.basicInfo || {};
    const pricing = item.pricingAndLocation || {};
    const locData = pricing.location || {};

    const rawAmt = pricing.amount ?? item.amount ?? 0;
    const cleanAmt = typeof rawAmt === 'string' ? parseFloat(rawAmt.replace(/,/g, '')) : parseFloat(rawAmt) || 0;

    if (cleanAmt > 0) {
      if (cleanAmt < minPrice) minPrice = cleanAmt;
      if (cleanAmt > maxPrice) maxPrice = cleanAmt;

      const cond = (item.condition || basic.condition || '').toLowerCase();
      if (cond.includes('foreign') || cond.includes('tokunbo')) {
        foreignTotal += cleanAmt;
        foreignCount++;
      } else if (cond.includes('nigerian') || cond.includes('used')) {
        localTotal += cleanAmt;
        localCount++;
      }
    }

    let primaryImg = '/c9x-logo.png';
    if (item.car?.images && item.car.images.length > 0) {
      primaryImg = item.car.images[0].url || item.car.images[0];
    } else if (item.images && item.images.length > 0) {
      const primary = item.images.find((img: any) => img.isPrimary || img.is_primary);
      primaryImg = primary?.url || primary?.path || item.images[0]?.url || item.images[0]?.path || '/c9x-logo.png';
    }

    return {
      id: item.id,
      slug: item.slug || item.id,
      title: item.title || basic.title || 'Vehicle Listing',
      amount: cleanAmt,
      condition: item.condition || basic.condition || 'Nigerian Used',
      year: item.year || basic.year,
      make: item.make || basic.make,
      model: item.model || basic.model,
      city: locData.city || pricing.address || item.city,
      state: pricing.state?.name || item.state?.name,
      imageUrl: primaryImg,
      transmission: basic.transmission || item.transmission,
      fuelType: basic.fuelType || item.fuelType,
      mileage: basic.mileage || item.mileage,
      status: item.status || 'available',
      createdAt: item.createdAt || item.created_at,
    };
  });

  if (minPrice === Infinity) minPrice = 1500000; // Realistic default fallback for Nigeria
  if (maxPrice === 0) maxPrice = 45000000;

  return {
    effectiveStateId: stateId,
    totalCount: total || normalized.length,
    minPrice,
    maxPrice,
    avgForeignUsedPrice: foreignCount > 0 ? Math.round(foreignTotal / foreignCount) : undefined,
    avgNigerianUsedPrice: localCount > 0 ? Math.round(localTotal / localCount) : undefined,
    listings: normalized,
  };
}
