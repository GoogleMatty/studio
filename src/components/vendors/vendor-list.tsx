
import type { Vendor } from '@/types/vendor';
import { VendorCard } from './vendor-card';

interface VendorListProps {
  vendors: Vendor[];
  onEditVendor: (vendor: Vendor) => void;
  onDeleteVendor: (vendorId: string) => void;
}

export function VendorList({ vendors, onEditVendor, onDeleteVendor }: VendorListProps) {
  if (vendors.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">No vendors found.</p>
        <p className="text-sm text-muted-foreground">Try adjusting your search or add a new vendor.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          onEdit={onEditVendor}
          onDelete={onDeleteVendor}
        />
      ))}
    </div>
  );
}
