export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string; // For general notes and AI input
  relatedOrganizations?: string[];
  relatedPeople?: string[];
  relatedVendors?: string[];
}
