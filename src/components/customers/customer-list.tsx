import type { Customer } from '@/types/customer';
import { CustomerCard } from './customer-card';

interface CustomerListProps {
  customers: Customer[];
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export function CustomerList({ customers, onEditCustomer, onDeleteCustomer }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">No customers found.</p>
        <p className="text-sm text-muted-foreground">Try adjusting your search or add a new customer.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onEdit={onEditCustomer}
          onDelete={onDeleteCustomer}
        />
      ))}
    </div>
  );
}
