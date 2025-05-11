'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Customer } from '@/types/customer';
import { getCustomers, saveCustomers } from '@/lib/customer-data';
import { MainLayout } from '@/components/layout/main-layout';
import { CustomerList } from '@/components/customers/customer-list';
import { CustomerFormDialog } from '@/components/customers/customer-form-dialog';
import { DeleteCustomerDialog } from '@/components/customers/delete-customer-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Search } from 'lucide-react';

export default function HomePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load customers from localStorage on initial render
  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  // Persist customers to localStorage whenever they change
  useEffect(() => {
    if (customers.length > 0 || localStorage.getItem('tradeflow_customers')) { // Only save if there are customers or if storage was previously used
        saveCustomers(customers);
    }
  }, [customers]);

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleSaveCustomer = (customerData: Customer) => {
    setCustomers(prevCustomers => {
      const existingIndex = prevCustomers.findIndex(c => c.id === customerData.id);
      if (existingIndex > -1) {
        // Update existing customer
        const updatedCustomers = [...prevCustomers];
        updatedCustomers[existingIndex] = customerData;
        return updatedCustomers;
      } else {
        // Add new customer
        return [customerData, ...prevCustomers];
      }
    });
    toast({
      title: customerData.id === editingCustomer?.id ? "Customer Updated" : "Customer Created",
      description: `${customerData.name} has been successfully saved.`,
    });
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setDeletingCustomerId(customerId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCustomer = () => {
    if (!deletingCustomerId) return;
    const customerToDelete = customers.find(c => c.id === deletingCustomerId);
    setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== deletingCustomerId));
    toast({
      title: "Customer Deleted",
      description: `${customerToDelete?.name || 'The customer'} has been deleted.`,
      variant: "destructive",
    });
    setIsDeleteDialogOpen(false);
    setDeletingCustomerId(null);
  };

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [customers, searchTerm]);

  const customerToDeleteName = useMemo(() => {
    return customers.find(c => c.id === deletingCustomerId)?.name;
  }, [customers, deletingCustomerId]);

  return (
    <MainLayout onCreateCustomer={handleCreateCustomer}>
      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search customers by name, email, phone, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-base rounded-lg shadow-sm focus-visible:ring-primary focus-visible:ring-2"
        />
      </div>

      <CustomerList
        customers={filteredCustomers}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDeleteCustomer}
      />

      <CustomerFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
      />

      <DeleteCustomerDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={confirmDeleteCustomer}
        customerName={customerToDeleteName}
      />
    </MainLayout>
  );
}
