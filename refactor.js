const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, 'app/(public)/page.tsx');
const marketplaceFile = path.join(__dirname, 'app/(public)/marketplace/page.tsx');

let pageContent = fs.readFileSync(pageFile, 'utf8');

// For page.tsx (Home)
// Replace "View All" in CategoryRow to point to /marketplace
pageContent = pageContent.replace(
    /<button className="text-\[10px\] font-black uppercase tracking-widest text-\[\#003399\] hover:underline flex items-center gap-1">/g,
    '<button onClick={() => router.push("/marketplace")} className="text-[10px] font-black uppercase tracking-widest text-[#003399] hover:underline flex items-center gap-1">'
);

// We need to extract the Curated Categories
const curatedMatch = pageContent.match(/{!hasActiveFilters && !isLoadingHome && \([\s\S]*?<div className="space-y-8 pb-8 border-b border-slate-200">([\s\S]*?)<\/div>\s*\)\}/);
const curatedCategoriesStr = curatedMatch ? curatedMatch[1] : '';

// Remove the Main Content Layout Grid completely from Home
const mainGridStart = pageContent.indexOf('{/* Main Content Layout Grid */}');
const mainGridEnd = pageContent.indexOf('{/* Mobile Filters Drawer Modal (Glassmorphic) */}');
if (mainGridStart !== -1 && mainGridEnd !== -1) {
    const mobileDrawerEnd = pageContent.indexOf('</AnimatePresence>', mainGridEnd) + '</AnimatePresence>'.length;
    
    // Replace the entire block with just the curated categories
    pageContent = pageContent.substring(0, mainGridStart) + 
                  '<div className="space-y-8 pb-8">' + curatedCategoriesStr + '</div>\n' +
                  pageContent.substring(mobileDrawerEnd);
}

// Remove unused state variables from Home
pageContent = pageContent.replace(/const \[search, setSearch\] = useState\(''\);\s*/, '');
pageContent = pageContent.replace(/const \[selectedMake, setSelectedMake\] = useState<string>\(''\);\s*/, '');
pageContent = pageContent.replace(/const \[selectedModel, setSelectedModel\] = useState<string>\(''\);\s*/, '');
pageContent = pageContent.replace(/const \[selectedCondition, setSelectedCondition\] = useState<string>\(''\);\s*/, '');
pageContent = pageContent.replace(/const \[selectedTransmission, setSelectedTransmission\] = useState<string>\(''\);\s*/, '');
pageContent = pageContent.replace(/const \[selectedFuelType, setSelectedFuelType\] = useState<string>\(''\);\s*/, '');
pageContent = pageContent.replace(/const \[selectedStateId, setSelectedStateId\] = useState<string \| number>\(''\);\s*/, '');
pageContent = pageContent.replace(/const \[minPrice, setMinPrice\] = useState<string>\(''\);\s*/, '');
pageContent = pageContent.replace(/const \[maxPrice, setMaxPrice\] = useState<string>\(''\);\s*/, '');
pageContent = pageContent.replace(/const \[sort, setSort\] = useState<string>\('latest'\);\s*/, '');
pageContent = pageContent.replace(/const \[showFiltersMobile, setShowFiltersMobile\] = useState\(false\);\s*/, '');
pageContent = pageContent.replace(/const { data: listingsData, isLoading, refetch } = useUserMarketplaceListings[\s\S]*?const { listings, meta, hasActiveFilters } = listingsData || { listings: \[\], meta: { last_page: 1, total: 0 }, hasActiveFilters: false };/m, '');
pageContent = pageContent.replace(/const handleResetFilters = \(\) => {[\s\S]*?};\s*/, '');

fs.writeFileSync(pageFile, pageContent);

// For marketplace/page.tsx
let mContent = fs.readFileSync(marketplaceFile, 'utf8');

// Change export default function Page to function MarketplacePage
mContent = mContent.replace(/export default function Page\(\) {/, 'export default function MarketplacePage() {');

// Remove Hero Section
const heroStart = mContent.indexOf('{/* Professional Hero Header with Quick Search */}');
const heroEnd = mContent.indexOf('{/* KYC Prompt Banner for Unverified Users */}');
if (heroStart !== -1 && heroEnd !== -1) {
    mContent = mContent.substring(0, heroStart) + 
               '<h1 className="text-3xl font-extrabold text-slate-900 mb-8 px-4 sm:px-6 lg:px-12">Marketplace</h1>\n' +
               mContent.substring(heroEnd);
}

// Remove Recommendations Section
const recStart = mContent.indexOf('{/* Recommendations Section */}');
const recEnd = mContent.indexOf('{/* Main Content Layout Grid */}');
if (recStart !== -1 && recEnd !== -1) {
    mContent = mContent.substring(0, recStart) + mContent.substring(recEnd);
}

// Remove Curated Categories from Marketplace
const curatedStart = mContent.indexOf('{/* Curated Categories (Hidden when searching/filtering) */}');
const curatedEnd = mContent.indexOf('{/* Explore All Title */}');
if (curatedStart !== -1 && curatedEnd !== -1) {
    mContent = mContent.substring(0, curatedStart) + mContent.substring(curatedEnd);
}

// Remove useUserMarketplaceExploration
mContent = mContent.replace(/const { data: homeData, isLoading: isLoadingHome } = useUserMarketplaceExploration\(\);[\s\S]*?const recentlyAddedCars = homeData\?.data\?.recently_added \|\| \[\];\s*/, '');
mContent = mContent.replace(/const { data: recommendedResponse, isLoading: isLoadingRecommended } = useRecommendedListings\(\);\s*/, '');

fs.writeFileSync(marketplaceFile, mContent);

console.log("Refactoring complete.");
