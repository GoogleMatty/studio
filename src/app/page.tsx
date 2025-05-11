
'use client';

import React, { useState, useMemo } from 'react';
import type { Customer } from '@/types/customer';
import type { Vendor } from '@/types/vendor';
import {
  getCustomersFirestore,
  addCustomerFirestore,
  updateCustomerFirestore,
  deleteCustomerFirestore,
} from '@/lib/customer-data';
import {
  getVendorsFirestore,
  addVendorFirestore,
  updateVendorFirestore,
  deleteVendorFirestore,
} from '@/lib/vendor-data';
import { MainLayout } from '@/components/layout/main-layout';
import { CustomerList } from '@/components/customers/customer-list';
import { CustomerFormDialog } from '@/components/customers/customer-form-dialog';
import { DeleteCustomerDialog } from '@/components/customers/delete-customer-dialog';
import { VendorList } from '@/components/vendors/vendor-list';
import { VendorFormDialog } from '@/components/vendors/vendor-form-dialog';
import { DeleteVendorDialog } from '@/components/vendors/delete-vendor-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Search, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';


type ActiveTab = 'customers' | 'vendors';

export default function HomePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  // Data fetching with React Query
  const { data: customers = [], isLoading: isLoadingCustomers, error: customersError } = useQuery<Customer[], Error>({
    queryKey: ['customers'],
    queryFn: getCustomersFirestore,
  });

  const { data: vendors = [], isLoading: isLoadingVendors, error: vendorsError } = useQuery<Vendor[], Error>({
    queryKey: ['vendors'],
    queryFn: getVendorsFirestore,
  });

  // Mutations for Customers
  const addCustomerMutation = useMutation({
    mutationFn: addCustomerFirestore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: "Customer Created", description: "New customer has been successfully added." });
      setIsCustomerFormOpen(false);
      setEditingCustomer(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: `Failed to create customer: ${error.message}`, variant: "destructive" });
    },
  });

  const updateCustomerMutation = useMutation({
    mutationFn: updateCustomerFirestore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: "Customer Updated", description: "Customer details have been successfully updated." });
      setIsCustomerFormOpen(false);
      setEditingCustomer(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: `Failed to update customer: ${error.message}`, variant: "destructive" });
    },
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: deleteCustomerFirestore,
    onSuccess: (_, deletedCustomerId) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      const deletedCustomerName = customers.find(c => c.id === deletedCustomerId)?.name || 'The customer';
      toast({ title: "Customer Deleted", description: `${deletedCustomerName} has been deleted.`, variant: "destructive" });
      setIsDeleteCustomerDialogOpen(false);
      setDeletingCustomerId(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: `Failed to delete customer: ${error.message}`, variant: "destructive" });
    },
  });

  // Mutations for Vendors
   const addVendorMutation = useMutation({
    mutationFn: addVendorFirestore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({ title: "Vendor Created", description: "New vendor has been successfully added." });
      setIsVendorFormOpen(false);
      setEditingVendor(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: `Failed to create vendor: ${error.message}`, variant: "destructive" });
    },
  });

  const updateVendorMutation = useMutation({
    mutationFn: updateVendorFirestore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({ title: "Vendor Updated", description: "Vendor details have been successfully updated." });
      setIsVendorFormOpen(false);
      setEditingVendor(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: `Failed to update vendor: ${error.message}`, variant: "destructive" });
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: deleteVendorFirestore,
    onSuccess: (_, deletedVendorId) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      const deletedVendorName = vendors.find(v => v.id === deletedVendorId)?.name || 'The vendor';
      toast({ title: "Vendor Deleted", description: `${deletedVendorName} has been deleted.`, variant: "destructive" });
      setIsDeleteVendorDialogOpen(false);
      setDeletingVendorId(null);
    },
    onError: (error) => {
      toast({ title: "Error", description: `Failed to delete vendor: ${error.message}`, variant: "destructive" });
    },
  });


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
    if (editingCustomer && customerData.id === editingCustomer.id) {
      updateCustomerMutation.mutate(customerData);
    } else {
      addCustomerMutation.mutate(customerData);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    setDeletingCustomerId(customerId);
    setIsDeleteCustomerDialogOpen(true);
  };

  const confirmDeleteCustomer = () => {
    if (!deletingCustomerId) return;
    deleteCustomerMutation.mutate(deletingCustomerId);
  };

  // Vendor handlers
  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsVendorFormOpen(true);
  };

  const handleSaveVendor = (vendorData: Vendor) => {
     if (editingVendor && vendorData.id === editingVendor.id) {
      updateVendorMutation.mutate(vendorData);
    } else {
      addVendorMutation.mutate(vendorData);
    }
  };

  const handleDeleteVendor = (vendorId: string) => {
    setDeletingVendorId(vendorId);
    setIsDeleteVendorDialogOpen(true);
  };

  const confirmDeleteVendor = () => {
    if (!deletingVendorId) return;
    deleteVendorMutation.mutate(deletingVendorId);
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

  const renderLoadingSkeletons = (count = 3) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3 p-4 border rounded-lg shadow-md">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  if (customersError) return <p className="text-destructive text-center p-4">Error loading customers: {customersError.message}</p>;
  if (vendorsError) return <p className="text-destructive text-center p-4">Error loading vendors: {vendorsError.message}</p>;

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
          {isLoadingCustomers ? renderLoadingSkeletons() : (
            <CustomerList
              customers={filteredCustomers}
              onEditCustomer={handleEditCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}
        </TabsContent>
        <TabsContent value="vendors">
          {isLoadingVendors ? renderLoadingSkeletons() : (
            <VendorList
              vendors={filteredVendors}
              onEditVendor={handleEditVendor}
              onDeleteVendor={handleDeleteVendor}
            />
          )}
        </TabsContent>
      </Tabs>

      <CustomerFormDialog
        isOpen={isCustomerFormOpen}
        onOpenChange={setIsCustomerFormOpen}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
        isSaving={addCustomerMutation.isPending || updateCustomerMutation.isPending}
      />
      <DeleteCustomerDialog
        isOpen={isDeleteCustomerDialogOpen}
        onOpenChange={setIsDeleteCustomerDialogOpen}
        onConfirmDelete={confirmDeleteCustomer}
        customerName={customerToDeleteName}
        isDeleting={deleteCustomerMutation.isPending}
      />

      <VendorFormDialog
        isOpen={isVendorFormOpen}
        onOpenChange={setIsVendorFormOpen}
        vendor={editingVendor}
        onSave={handleSaveVendor}
        isSaving={addVendorMutation.isPending || updateVendorMutation.isPending}
      />
      <DeleteVendorDialog
        isOpen={isDeleteVendorDialogOpen}
        onOpenChange={setIsDeleteVendorDialogOpen}
        onConfirmDelete={confirmDeleteVendor}
        vendorName={vendorToDeleteName}
        isDeleting={deleteVendorMutation.isPending}
      />
    </MainLayout>
  );
}
