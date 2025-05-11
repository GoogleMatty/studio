
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Customer } from '@/types/customer';
import type { Vendor } from '@/types/vendor';
import { getCustomers, saveCustomers } from '@/lib/customer-data';
import { getVendors, saveVendors } from '@/lib/vendor-data';
import { MainLayout } from '@/components/layout/main-layout';
import { CustomerList } from '@/components/customers/customer-list';
import { CustomerFormDialog } from '@/components/customers/customer-form-dialog';
import { DeleteCustomerDialog } from '@/components/customers/delete-customer-dialog';
import { VendorList } from '@/components/vendors/vendor-list';
import { VendorFormDialog } from '@/components/vendors/vendor-form-dialog';
import { DeleteVendorDialog } from '@/components/vendors/delete-vendor-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ActiveTab = 'customers' | 'vendors';

export default function HomePage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('customers');

  // Customer states
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDeleteCustomerDialogOpen, setIsDeleteCustomerDialogOpen] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  // Vendor states
  const [isVendorFormOpen, setIsVendorFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [isDeleteVendorDialogOpen, setIsDeleteVendorDialogOpen] = useState(false);
  const [deletingVendorId, setDeletingVendorId] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    setCustomers(getCustomers());
    setVendors(getVendors());
  }, []);

  // Persist customers
  useEffect(() => {
    if (customers.length > 0 || localStorage.getItem('tradeflow_customers')) {
        saveCustomers(customers);
    }
  }, [customers]);

  // Persist vendors
  useEffect(() => {
    if (vendors.length > 0 || localStorage.getItem('tradeflow_vendors')) {
        saveVendors(vendors);
    }
  }, [vendors]);

  const handleCreateEntity = () => {
    if (activeTab === 'customers') {
      setEditingCustomer(null);
      setIsCustomerFormOpen(true);
    } else {
      setEditingVendor(null);
      setIsVendorFormOpen(true);
    }
  };

  // Customer handlers
  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCustomerFormOpen(true);
  };

  const handleSaveCustomer = (customerData: Customer) => {
    setCustomers(prevCustomers => {
      const existingIndex = prevCustomers.findIndex(c => c.id === customerData.id);
      if (existingIndex > -1) {
        const updatedCustomers = [...prevCustomers];
        updatedCustomers[existingIndex] = customerData;
        return updatedCustomers;
      } else {
        return [customerData, ...prevCustomers];
      }
    });
    toast({
      title: customerData.id === editingCustomer?.id ? "Customer Updated" : "Customer Created",
      description: `${customerData.name} has been successfully saved.`,
    });
    setIsCustomerFormOpen(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setDeletingCustomerId(customerId);
    setIsDeleteCustomerDialogOpen(true);
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
    setIsDeleteCustomerDialogOpen(false);
    setDeletingCustomerId(null);
  };

  // Vendor handlers
  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsVendorFormOpen(true);
  };

  const handleSaveVendor = (vendorData: Vendor) => {
    setVendors(prevVendors => {
      const existingIndex = prevVendors.findIndex(v => v.id === vendorData.id);
      if (existingIndex > -1) {
        const updatedVendors = [...prevVendors];
        updatedVendors[existingIndex] = vendorData;
        return updatedVendors;
      } else {
        return [vendorData, ...prevVendors];
      }
    });
    toast({
      title: vendorData.id === editingVendor?.id ? "Vendor Updated" : "Vendor Created",
      description: `${vendorData.name} has been successfully saved.`,
    });
    setIsVendorFormOpen(false);
    setEditingVendor(null);
  };

  const handleDeleteVendor = (vendorId: string) => {
    setDeletingVendorId(vendorId);
    setIsDeleteVendorDialogOpen(true);
  };

  const confirmDeleteVendor = () => {
    if (!deletingVendorId) return;
    const vendorToDelete = vendors.find(v => v.id === deletingVendorId);
    setVendors(prevVendors => prevVendors.filter(v => v.id !== deletingVendorId));
    toast({
      title: "Vendor Deleted",
      description: `${vendorToDelete?.name || 'The vendor'} has been deleted.`,
      variant: "destructive",
    });
    setIsDeleteVendorDialogOpen(false);
    setDeletingVendorId(null);
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

  const filteredVendors = useMemo(() => {
    if (!searchTerm) return vendors;
    return vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.phone && vendor.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vendor.address && vendor.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [vendors, searchTerm]);
  
  const customerToDeleteName = useMemo(() => customers.find(c => c.id === deletingCustomerId)?.name, [customers, deletingCustomerId]);
  const vendorToDeleteName = useMemo(() => vendors.find(v => v.id === deletingVendorId)?.name, [vendors, deletingVendorId]);

  return (
    <MainLayout activeEntityType={activeTab} onCreateEntity={handleCreateEntity}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)} className="w-full">
        <div className="flex justify-between items-center mb-8">
          <TabsList>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
          </TabsList>
          <div className="w-1/2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search ${activeTab} by name, email, phone, or address...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-base rounded-lg shadow-sm focus-visible:ring-primary focus-visible:ring-2"
            />
          </div>
        </div>

        <TabsContent value="customers">
          <CustomerList
            customers={filteredCustomers}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        </TabsContent>
        <TabsContent value="vendors">
          <VendorList
            vendors={filteredVendors}
            onEditVendor={handleEditVendor}
            onDeleteVendor={handleDeleteVendor}
          />
        </TabsContent>
      </Tabs>

      <CustomerFormDialog
        isOpen={isCustomerFormOpen}
        onOpenChange={setIsCustomerFormOpen}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
      />
      <DeleteCustomerDialog
        isOpen={isDeleteCustomerDialogOpen}
        onOpenChange={setIsDeleteCustomerDialogOpen}
        onConfirmDelete={confirmDeleteCustomer}
        customerName={customerToDeleteName}
      />

      <VendorFormDialog
        isOpen={isVendorFormOpen}
        onOpenChange={setIsVendorFormOpen}
        vendor={editingVendor}
        onSave={handleSaveVendor}
      />
      <DeleteVendorDialog
        isOpen={isDeleteVendorDialogOpen}
        onOpenChange={setIsDeleteVendorDialogOpen}
        onConfirmDelete={confirmDeleteVendor}
        vendorName={vendorToDeleteName}
      />
    </MainLayout>
  );
}
