/**
 * Centralized SEO & Domain Configuration for C9X
 * 
 * Single source of truth for the primary canonical domain.
 * Defaults to 'https://c9x.ng' and safely handles trailing slashes.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://c9x.ng'
).replace(/\/+$/, '');

