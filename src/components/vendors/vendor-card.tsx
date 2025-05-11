
import type { Vendor } from '@/types/vendor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Mail, Phone, MapPin, Users, Building2, Truck, MoreVertical, Pencil, Trash2, Store, Briefcase, Package } from 'lucide-react';
import { EntityList } from '@/components/shared/entity-list';
import { Badge } from '@/components/ui/badge';

interface VendorCardProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendorId: string) => void;
}

export function VendorCard({ vendor, onEdit, onDelete }: VendorCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden border-l-4 border-vendor-primary">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-vendor-primary" />
            <CardTitle className="text-xl">{vendor.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(vendor)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(vendor.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="flex items-center text-sm">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          {vendor.email}
        </CardDescription>
        {vendor.phone && (
          <p className="text-sm text-muted-foreground flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            {vendor.phone}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        {vendor.address && (
          <p className="text-muted-foreground flex items-start">
            <MapPin className="mr-2 h-4 w-4 mt-0.5 shrink-0" />
            <span>{vendor.address}</span>
          </p>
        )}
         {vendor.industry && (
          <div className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{vendor.industry}</span>
          </div>
        )}
        {vendor.contactPersonName && (
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
             <span className="text-sm text-muted-foreground">Contact: {vendor.contactPersonName}</span>
          </div>
        )}
        {vendor.notes && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Notes</h4>
            <p className="text-xs bg-muted/50 p-2 rounded-md whitespace-pre-line">{vendor.notes}</p>
          </div>
        )}
        <EntityList items={vendor.relatedOrganizations} Icon={Building2} title="Related Organizations" />
        <EntityList items={vendor.relatedPeople} Icon={Users} title="Related People" />
        <EntityList items={vendor.relatedVendors} Icon={Package} title="Related Suppliers/Partners" />

      </CardContent>
      <CardFooter className="pt-3">
        {/* Footer can be used for quick actions or tags if needed */}
      </CardFooter>
    </Card>
  );
}
