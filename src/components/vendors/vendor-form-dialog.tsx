
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Vendor } from '@/types/vendor';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { suggestRelatedEntities, type SuggestRelatedEntitiesOutput } from '@/ai/flows/suggest-related-entities';
import { AiSuggestions } from '@/components/shared/ai-suggestions';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2 } from 'lucide-react';

const vendorFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  industry: z.string().optional(),
  contactPersonName: z.string().optional(),
  relatedOrganizations: z.string().optional(),
  relatedPeople: z.string().optional(),
  relatedVendors: z.string().optional(), 
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

interface VendorFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  vendor?: Vendor | null;
  onSave: (vendor: Vendor) => void;
  isSaving?: boolean;
}

export function VendorFormDialog({ isOpen, onOpenChange, vendor, onSave, isSaving = false }: VendorFormDialogProps) {
  const { toast } = useToast();
  const [aiSuggestions, setAiSuggestions] = useState<SuggestRelatedEntitiesOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const defaultValues = React.useMemo(() => ({
    name: vendor?.name || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    address: vendor?.address || '',
    notes: vendor?.notes || '',
    industry: vendor?.industry || '',
    contactPersonName: vendor?.contactPersonName || '',
    relatedOrganizations: vendor?.relatedOrganizations?.join(', ') || '',
    relatedPeople: vendor?.relatedPeople?.join(', ') || '',
    relatedVendors: vendor?.relatedVendors?.join(', ') || '',
  }), [vendor]);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
    setAiSuggestions(null);
  }, [defaultValues, form, isOpen]);

  const onSubmit = (data: VendorFormValues) => {
    const newVendorData: Vendor = {
      id: vendor?.id || crypto.randomUUID(),
      ...data,
      relatedOrganizations: data.relatedOrganizations?.split(',').map(s => s.trim()).filter(Boolean) || [],
      relatedPeople: data.relatedPeople?.split(',').map(s => s.trim()).filter(Boolean) || [],
      relatedVendors: data.relatedVendors?.split(',').map(s => s.trim()).filter(Boolean) || [],
    };
    onSave(newVendorData);
    // onOpenChange(false); // Dialog close is handled by parent on mutation success/error
  };

  const handleGetAiSuggestions = async () => {
    const vendorDataForAI = `Vendor Name: ${form.getValues('name')}, Email: ${form.getValues('email')}, Address: ${form.getValues('address')}, Notes: ${form.getValues('notes')}, Industry: ${form.getValues('industry')}`;
    if (!form.getValues('name') && !form.getValues('notes')) {
      toast({
        title: "Input Needed for AI",
        description: "Please enter a name or some notes to get AI suggestions.",
        variant: "destructive"
      });
      return;
    }

    setIsAiLoading(true);
    setAiSuggestions(null);
    try {
      const result = await suggestRelatedEntities({ customerData: vendorDataForAI }); 
      setAiSuggestions(result);
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      toast({
        title: "AI Suggestion Failed",
        description: "Could not retrieve AI suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const addSuggestionToField = (fieldName: keyof VendorFormValues, suggestion: string) => {
    const currentValue = form.getValues(fieldName) || '';
    const newValue = currentValue ? `${currentValue}, ${suggestion}` : suggestion;
    form.setValue(fieldName, newValue, { shouldValidate: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isSaving) onOpenChange(open); }}>
      <DialogContent className="sm:max-w-[600px] shadow-xl">
        <DialogHeader>
          <DialogTitle>{vendor ? 'Edit Vendor' : 'Create New Vendor'}</DialogTitle>
          <DialogDescription>
            {vendor ? 'Update the details for this vendor.' : 'Fill in the form to add a new vendor.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-200px)] pr-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., SupplyCo Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., sales@supplyco.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 555-000-1111" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Manufacturing, Logistics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="contactPersonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 456 Supply Rd, Factoria" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any relevant notes about the vendor..." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2 pt-4 border-t">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Related Entities</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleGetAiSuggestions} disabled={isAiLoading}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {isAiLoading ? "Suggesting..." : "Suggest with AI"}
                    </Button>
                 </div>
                 <p className="text-sm text-muted-foreground">
                    Optionally, list related organizations, people, or other vendors/partners. Use AI for suggestions.
                 </p>
              </div>
              
              <AiSuggestions 
                suggestions={aiSuggestions} 
                isLoading={isAiLoading}
                onAddSuggestion={(type, value) => {
                    if (type === 'organizations') addSuggestionToField('relatedOrganizations', value);
                    if (type === 'people') addSuggestionToField('relatedPeople', value);
                    if (type === 'vendors') addSuggestionToField('relatedVendors', value);
                }}
              />

              <FormField
                control={form.control}
                name="relatedOrganizations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Organizations (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Industry Group A, Association B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relatedPeople"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related People (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Key Contact X, Advisor Y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="relatedVendors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Vendors/Partners (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Supplier A, Partner B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancel</Button>
                <Button type="submit" className="bg-vendor-primary hover:bg-vendor-primary/90 text-vendor-primary-foreground" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Vendor
                  </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
