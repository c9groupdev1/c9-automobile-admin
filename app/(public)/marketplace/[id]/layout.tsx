import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

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
  const listingData = await getListingMetadata(params.id);
  
  if (!listingData || !listingData.data) {
    return {
      title: "View Vehicle | C9X Marketplace",
      description: "Check out this car listing on C9X, Nigeria's premier automotive marketplace.",
      openGraph: {
        title: "View Vehicle | C9X Marketplace",
        description: "Check out this car listing on C9X, Nigeria's premier automotive marketplace.",
        images: ["https://c9x.thec9group.com/hero-dashboard.png"],
        type: "website",
      },
      itunes: {
        appId: "6762285536",
        appArgument: "c9x://marketplace/" + params.id,
      }
    };
  }

  const listing = listingData.data;
  const conditionStr = listing.condition ? `${listing.condition} ` : '';
  const city = listing.pricingAndLocation?.location?.city || listing.city;
  const locationStr = city ? ` in ${city}` : '';
  
  const rawAmount = listing.amount;
  const cleanPrice = rawAmount 
    ? (typeof rawAmount === 'string' ? parseFloat(rawAmount.replace(/,/g, '')) : parseFloat(rawAmount))
    : 0;
  const formattedPrice = !isNaN(cleanPrice) && cleanPrice > 0 ? ` - ₦${cleanPrice.toLocaleString()}` : '';
  
  const title = `Buy ${conditionStr}${listing.title || 'Vehicle'}${locationStr}${formattedPrice} | C9X`;
  const description = `Find specifications, photos, and contact info for this ${conditionStr}${listing.title || 'Vehicle'} for sale${locationStr}. Click to view details on C9X, Nigeria's premier auto portal.`;
  
  const images = [];
  if (listing.car?.images && listing.car.images.length > 0) {
    images.push(listing.car.images[0].url);
  } else if (listing.images && listing.images.length > 0) {
    images.push(listing.images[0].url || listing.images[0]);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: images.length > 0 ? images : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.length > 0 ? images : undefined,
    },
    itunes: {
      appId: "6762285536",
      appArgument: "c9x://marketplace/" + params.id,
    }
  };
}

export default async function ListingLayout(
  props: Props
) {
  const params = await props.params;
  const { children } = props;
  const listingData = await getListingMetadata(params.id);
  
  if (!listingData || !listingData.data) {
    return <>{children}</>;
  }
  
  const listing = listingData.data;
  const rawAmount = listing.amount;
  const cleanPrice = rawAmount 
    ? (typeof rawAmount === 'string' ? parseFloat(rawAmount.replace(/,/g, '')) : parseFloat(rawAmount))
    : 0;

  // JSON-LD for AI & Search Engines
  const jsonLd = listing ? {
    "@context": "https://schema.org/",
    "@type": "Product", // Vehicle schema can also be used
    "name": listing.title,
    "image": listing.car?.images?.[0]?.url || listing.images?.[0]?.url,
    "description": listing.description,
    "offers": {
      "@type": "Offer",
      "url": `https://c9x.thec9group.com/marketplace/${params.id}`,
      "priceCurrency": "NGN",
      "price": !isNaN(cleanPrice) ? cleanPrice : 0,
      "availability": listing.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": listing.condition?.toLowerCase().includes('new') ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition"
    }
  } : null;

  const breadcrumbsLd = listing ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://c9x.thec9group.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Marketplace",
        "item": "https://c9x.thec9group.com/marketplace"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": listing.title || "Vehicle",
        "item": `https://c9x.thec9group.com/marketplace/${params.id}`
      }
    ]
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbsLd]) }}
        />
      )}
      {children}
    </>
  );
}
