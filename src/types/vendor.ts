
export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  industry?: string;
  contactPersonName?: string;
  // Fields for related entities, similar to Customer for reusability of AI/UI components
  relatedOrganizations?: string[];
  relatedPeople?: string[];
  relatedVendors?: string[]; // e.g., other vendors they partner with or supply them
}
