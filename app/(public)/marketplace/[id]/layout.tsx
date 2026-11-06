import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { NIGERIAN_LOCATIONS } from "@/lib/seo/locations";
import { SITE_URL } from "@/lib/seo/config";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

function isUUID(str: string) {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
}

async function getListingMetadata(id: string) {
  try {
    const isIdUuid = isUUID(id);
    const path = isIdUuid ? `/listings/${id}` : `/listings/slug/${id}`;

    const candidateBases = [
      process.env.API_SECRET_URL,
      process.env.NEXT_PUBLIC_API_URL,
      'https://c9x.ng/app/api',
      'https://c9x-staging.thec9group.com/api',
      'https://c9x.thec9group.com/api',
      'https://c9x.thec9group.com/app/api',
    ].filter(Boolean) as string[];

    const uniqueBases = Array.from(new Set(candidateBases.map((u) => u.replace(/\/+$/, ''))));

    for (const base of uniqueBases) {
      try {
        const res = await fetch(`${base}${path}`, { 
          next: { revalidate: 300 },
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && (data.data || data.id)) {
            return data.data ? data : { success: true, data };
          }
        }
      } catch (err) {
        // try next candidate
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;

  if (params.id && params.id.startsWith('cars-in-')) {
    const locSlug = params.id.replace(/^cars-in-/, '');
    redirect(`/cars-in/${locSlug}`);
  }

  const listingData = await getListingMetadata(params.id);
  
  if (!listingData || !listingData.data) {
    return {
      title: "View Vehicle | C9X Marketplace",
      description: "Explore verified cars for sale in Nigeria on C9X, the premier automotive marketplace.",
      openGraph: {
        title: "View Vehicle | C9X Marketplace",
        description: "Explore verified cars for sale in Nigeria on C9X, the premier automotive marketplace.",
        images: [`${SITE_URL}/hero-dashboard.png`],
        type: "website",
      },
      itunes: {
        appId: "6762285536",
        appArgument: "c9x://marketplace/" + params.id,
      }
    };
  }

  const listing = listingData.data;
  const basicInfo = listing.basicInfo || {};
  const pricingAndLocation = listing.pricingAndLocation || {};
  const locationData = pricingAndLocation.location || {};

  const titleVal = basicInfo.title || listing.title || 'Vehicle';
  const condition = basicInfo.condition || listing.condition;
  const conditionStr = condition ? `${condition} ` : '';
  const city = locationData.city || pricingAndLocation.address || listing.city;
  const stateName = pricingAndLocation.state?.name || listing.state?.name;
  const locationStr = city ? ` in ${city}${stateName ? `, ${stateName}` : ''}` : '';
  
  const rawAmount = pricingAndLocation.amount ?? listing.amount;
  const cleanPrice = rawAmount 
    ? (typeof rawAmount === 'string' ? parseFloat(rawAmount.replace(/,/g, '')) : parseFloat(rawAmount))
    : 0;
  const formattedPrice = !isNaN(cleanPrice) && cleanPrice > 0 ? ` - ₦${cleanPrice.toLocaleString()}` : '';
  
  const title = `Buy ${conditionStr}${titleVal}${locationStr}${formattedPrice} | C9X`;
  const description = `Find specifications, inspection status, and verified seller info for this ${conditionStr}${titleVal} for sale${locationStr}. Inspect before payment and buy with escrow on C9X.`;
  
  const images: string[] = [];
  if (listing.car?.images && listing.car.images.length > 0) {
    images.push(listing.car.images[0].url || listing.car.images[0]);
  } else if (listing.images && listing.images.length > 0) {
    const primary = listing.images.find((img: any) => img.isPrimary || img.is_primary);
    const chosen = primary || listing.images[0];
    images.push(chosen.url || chosen.path || chosen);
  }

  const canonicalUrl = `${SITE_URL}/marketplace/${listing.slug || params.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: images.length > 0 ? images : [`${SITE_URL}/hero-dashboard.png`],
      type: "website",
      locale: "en_NG",
      siteName: "C9X Marketplace",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.length > 0 ? images : [`${SITE_URL}/hero-dashboard.png`],
    },
    itunes: {
      appId: "6762285536",
      appArgument: "c9x://marketplace/" + (listing.slug || params.id),
    }
  };
}

export default async function ListingLayout(
  props: Props
) {
  const params = await props.params;

  if (params.id && params.id.startsWith('cars-in-')) {
    const locSlug = params.id.replace(/^cars-in-/, '');
    redirect(`/cars-in/${locSlug}`);
  }

  const { children } = props;
  const listingData = await getListingMetadata(params.id);
  
  if (!listingData || !listingData.data) {
    return <>{children}</>;
  }
  
  const listing = listingData.data;
  const basicInfo = listing.basicInfo || {};
  const pricingAndLocation = listing.pricingAndLocation || {};
  const locationData = pricingAndLocation.location || {};
  const seller = pricingAndLocation.sellerContact || listing.sellerInformation || {};

  const titleVal = basicInfo.title || listing.title || 'Vehicle';
  const rawAmount = pricingAndLocation.amount ?? listing.amount;
  const cleanPrice = rawAmount 
    ? (typeof rawAmount === 'string' ? parseFloat(rawAmount.replace(/,/g, '')) : parseFloat(rawAmount))
    : 0;

  let primaryImg = `${SITE_URL}/hero-dashboard.png`;
  if (listing.car?.images && listing.car.images.length > 0) {
    primaryImg = listing.car.images[0].url || listing.car.images[0];
  } else if (listing.images && listing.images.length > 0) {
    const primary = listing.images.find((img: any) => img.isPrimary || img.is_primary);
    const chosen = primary || listing.images[0];
    primaryImg = chosen.url || chosen.path || chosen;
  }

  const canonicalUrl = `${SITE_URL}/marketplace/${listing.slug || params.id}`;
  const condition = basicInfo.condition || listing.condition || 'Used';
  const isNew = condition.toLowerCase().includes('new');

  // Find location slug if state matches
  const stateName = pricingAndLocation.state?.name || listing.state?.name || '';
  const matchedState = Object.values(NIGERIAN_LOCATIONS).find(
    (l) => l.name.toLowerCase() === stateName.toLowerCase() || l.fullName.toLowerCase().includes(stateName.toLowerCase())
  );

  // Full Vehicle / Car / Product Schema
  const vehicleJsonLd = {
    "@context": "https://schema.org/",
    "@type": ["Car", "Vehicle", "Product"],
    "@id": `${canonicalUrl}#vehicle`,
    "name": titleVal,
    "image": primaryImg,
    "description": basicInfo.description || listing.description || `${titleVal} for sale on C9X`,
    "brand": basicInfo.make || listing.make ? {
      "@type": "Brand",
      "name": basicInfo.make || listing.make
    } : undefined,
    "model": basicInfo.model || listing.model,
    "modelDate": basicInfo.year || listing.year,
    "productionDate": basicInfo.year || listing.year,
    "vehicleTransmission": basicInfo.transmission || listing.transmission,
    "fuelType": basicInfo.fuelType || listing.fuelType,
    "vehicleIdentificationNumber": basicInfo.maskedVinChassisNumber || basicInfo.vinChassisNumber || listing.vin,
    "offers": {
      "@type": "Offer",
      "@id": `${canonicalUrl}#offer`,
      "url": canonicalUrl,
      "priceCurrency": "NGN",
      "price": !isNaN(cleanPrice) && cleanPrice > 0 ? cleanPrice : undefined,
      "availability": listing.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": isNew ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      "seller": {
        "@type": "Organization",
        "name": seller.businessName || seller.contactPerson || "Verified C9X Dealer"
      }
    }
  };

  const breadcrumbsList = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": SITE_URL
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Marketplace",
      "item": `${SITE_URL}/marketplace`
    }
  ];

  if (matchedState) {
    breadcrumbsList.push({
      "@type": "ListItem",
      "position": 3,
      "name": `Cars in ${matchedState.fullName}`,
      "item": `${SITE_URL}/cars-in/${matchedState.slug}`
    });
    breadcrumbsList.push({
      "@type": "ListItem",
      "position": 4,
      "name": titleVal,
      "item": canonicalUrl
    });
  } else {
    breadcrumbsList.push({
      "@type": "ListItem",
      "position": 3,
      "name": titleVal,
      "item": canonicalUrl
    });
  }

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    "itemListElement": breadcrumbsList
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([vehicleJsonLd, breadcrumbsJsonLd]) }}
      />
      {children}
    </>
  );
}
