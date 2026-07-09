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
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const isIdUuid = isUUID(id);
    const endpoint = isIdUuid ? `${backendUrl}/listings/${id}` : `${backendUrl}/listings/slug/${id}`;
    
    const res = await fetch(endpoint, { next: { revalidate: 3600 } });
    
    if (!res.ok) return null;
    const data = await res.json();
    return data;
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
      title: "Vehicle Not Found | C9X Marketplace",
    };
  }

  const listing = listingData.data;
  const conditionStr = listing.condition ? `${listing.condition} ` : '';
  const city = listing.pricingAndLocation?.location?.city || listing.city;
  const locationStr = city ? ` in ${city}` : '';
  const formattedPrice = Number(listing.amount) > 0 ? ` - ₦${Number(listing.amount).toLocaleString()}` : '';
  
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
    notFound();
  }
  
  const listing = listingData.data;

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
      "price": listing.amount,
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
