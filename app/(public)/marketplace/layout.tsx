import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "Cars for Sale in Nigeria",
  description: "Browse thousands of new and used cars for sale in Nigeria. Find the best prices on Toyota, Honda, Lexus, Mercedes-Benz, and more on C9X Marketplace.",
  openGraph: {
    title: "Cars for Sale in Nigeria | C9X Marketplace",
    description: "Browse thousands of new and used cars for sale in Nigeria.",
    url: `${SITE_URL}/marketplace`,
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
