
import type { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Mail, Phone, MapPin, Users, Building2, Truck, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { EntityList } from '@/components/shared/entity-list';


interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{customer.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(customer)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(customer.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="flex items-center text-sm">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          {customer.email}
        </CardDescription>
        {customer.phone && (
          <p className="text-sm text-muted-foreground flex items-center">
            <Phone className="mr-2 h-4 w-4" />
            {customer.phone}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        {customer.address && (
          <p className="text-muted-foreground flex items-start">
            <MapPin className="mr-2 h-4 w-4 mt-0.5 shrink-0" />
            <span>{customer.address}</span>
          </p>
        )}
        {customer.notes && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Notes</h4>
            <p className="text-xs bg-muted/50 p-2 rounded-md whitespace-pre-line">{customer.notes}</p>
          </div>
        )}
        <EntityList items={customer.relatedOrganizations} Icon={Building2} title="Organizations" />
        <EntityList items={customer.relatedPeople} Icon={Users} title="People" />
        <EntityList items={customer.relatedVendors} Icon={Truck} title="Vendors" />

      </CardContent>
      <CardFooter className="pt-3">
        {/* Footer can be used for quick actions or tags if needed */}
      </CardFooter>
    </Card>
  );
}
