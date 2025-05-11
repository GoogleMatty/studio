
import type { Vendor } from '@/types/vendor';

const VENDORS_STORAGE_KEY = 'tradeflow_vendors';

// Sample initial vendors
const initialSeedVendors: Vendor[] = [
  {
    id: 'v1a2b3c4-d5e6-f789-0123-456789abcdef',
    name: 'SupplyCo Global',
    email: 'sales@supplyco.global',
    phone: '555-0404',
    address: '789 Logistics Rd, Warehouse City, TX 75001',
    notes: 'Bulk supplier of industrial components. Known for reliability.',
    industry: 'Logistics & Supply Chain',
    contactPersonName: 'Sarah Connor',
    relatedOrganizations: ['Manufacturing United', 'Global Trade Association'],
    relatedPeople: ['John Smith (Procurement Head at Client X)'],
    relatedVendors: ['Parts Unlimited', 'Raw Materials Inc.'],
  },
  {
    id: 'v0f9e8d7-c6b5-a493-8271-fedcba098765',
    name: 'Creative Design Agency',
    email: 'hello@creativedesign.io',
    phone: '555-0505',
    address: '101 Art Block, Studio City, NY 10001',
    notes: 'Specializes in branding and digital marketing for tech startups.',
    industry: 'Marketing & Advertising',
    contactPersonName: 'Mike Angelo',
    relatedOrganizations: ['Startup Hub NYC', 'Digital Nomads Network'],
    relatedPeople: ['Lisa Ray (CEO of Startup Y)'],
    relatedVendors: ['PrintFast Co.', 'StockPhoto Pro'],
  },
];

export const getVendors = (): Vendor[] => {
  if (typeof window === 'undefined') {
    return initialSeedVendors;
  }
  try {
    const storedVendors = localStorage.getItem(VENDORS_STORAGE_KEY);
    if (storedVendors) {
      return JSON.parse(storedVendors);
    } else {
      localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(initialSeedVendors));
      return initialSeedVendors;
    }
  } catch (error) {
    console.error("Error accessing localStorage for vendors:", error);
    return initialSeedVendors;
  }
};

export const saveVendors = (vendors: Vendor[]): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(vendors));
    } catch (error) {
      console.error("Error saving vendors to localStorage:", error);
    }
  }
};
