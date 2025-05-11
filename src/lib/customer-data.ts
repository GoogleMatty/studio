import type { Customer } from '@/types/customer';

const CUSTOMERS_STORAGE_KEY = 'tradeflow_customers';

// Sample initial customers
const initialSeedCustomers: Customer[] = [
  {
    id: '1f2c3e4d-5a6b-7890-1234-567890abcdef',
    name: 'Innovate Solutions Ltd.',
    email: 'contact@innovatesolutions.com',
    phone: '555-0101',
    address: '123 Future Drive, Techville, CA 90210',
    notes: 'Leading provider of custom software solutions. Interested in cloud migration services.',
    relatedOrganizations: ['CloudNet Partners', 'DataSecure Inc.'],
    relatedPeople: ['Alice Wonderland (CTO)', 'Bob The Builder (Project Manager)'],
    relatedVendors: ['DevTools Co.', 'ServerFarm Hosting'],
  },
  {
    id: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    name: 'GreenLeaf Organics',
    email: 'info@greenleaf.org',
    phone: '555-0202',
    address: '456 Meadow Lane, Farmstead, OR 97005',
    notes: 'Supplier of organic produce. Looking to expand distribution network.',
    relatedOrganizations: ['EcoHarvest Collective', 'WholeFoods Market (potential retailer)'],
    relatedPeople: ['Charles Xavier (Owner)'],
    relatedVendors: ['BioPackaging Ltd.', 'FreshLogistics Transport'],
  },
  {
    id: 'x7y8z9w0-v1u2-t3s4-r5q6-p7o8n9m0l1k2',
    name: 'Quantum Mechanics Inc.',
    email: 'support@quantmech.io',
    phone: '555-0303',
    address: '789 Particle Ave, Atom City, MA 01776',
    notes: 'Research and development in quantum computing. Seeking venture capital.',
    relatedOrganizations: ['TechFuture Ventures', 'University Physics Department'],
    relatedPeople: ['Dr. Eva Quantum (Lead Scientist)'],
    relatedVendors: ['CryoCool Systems', 'Precision Instruments LLC'],
  }
];

export const getCustomers = (): Customer[] => {
  if (typeof window === 'undefined') {
    return initialSeedCustomers; // Provide initial data for SSR or if localStorage is not available
  }
  try {
    const storedCustomers = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (storedCustomers) {
      return JSON.parse(storedCustomers);
    } else {
      // Seed localStorage if it's empty
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(initialSeedCustomers));
      return initialSeedCustomers;
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return initialSeedCustomers; // Fallback to initial data on error
  }
};

export const saveCustomers = (customers: Customer[]): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }
};
