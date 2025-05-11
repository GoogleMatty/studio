'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import type { Customer } from '@/types/customer';
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
import { AiSuggestions } from './ai-suggestions';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

const customerFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  relatedOrganizations: z.string().optional(), // Store as comma-separated string in form
  relatedPeople: z.string().optional(),
  relatedVendors: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface CustomerFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  customer?: Customer | null;
  onSave: (customer: Customer) => void;
}

export function CustomerFormDialog({ isOpen, onOpenChange, customer, onSave }: CustomerFormDialogProps) {
  const { toast } = useToast();
  const [aiSuggestions, setAiSuggestions] = useState<SuggestRelatedEntitiesOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const defaultValues = React.useMemo(() => ({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    notes: customer?.notes || '',
    relatedOrganizations: customer?.relatedOrganizations?.join(', ') || '',
    relatedPeople: customer?.relatedPeople?.join(', ') || '',
    relatedVendors: customer?.relatedVendors?.join(', ') || '',
  }), [customer]);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
    setAiSuggestions(null); // Clear previous suggestions when dialog reopens or customer changes
  }, [defaultValues, form, isOpen]);


  const onSubmit = (data: CustomerFormValues) => {
    const newCustomerData: Customer = {
      id: customer?.id || crypto.randomUUID(),
      ...data,
      relatedOrganizations: data.relatedOrganizations?.split(',').map(s => s.trim()).filter(Boolean) || [],
      relatedPeople: data.relatedPeople?.split(',').map(s => s.trim()).filter(Boolean) || [],
      relatedVendors: data.relatedVendors?.split(',').map(s => s.trim()).filter(Boolean) || [],
    };
    onSave(newCustomerData);
    onOpenChange(false);
  };

  const handleGetAiSuggestions = async () => {
    const customerDataForAI = `Name: ${form.getValues('name')}, Email: ${form.getValues('email')}, Address: ${form.getValues('address')}, Notes: ${form.getValues('notes')}`;
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
      const result = await suggestRelatedEntities({ customerData: customerDataForAI });
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
  
  const addSuggestionToField = (fieldName: keyof CustomerFormValues, suggestion: string) => {
    const currentValue = form.getValues(fieldName) || '';
    const newValue = currentValue ? `${currentValue}, ${suggestion}` : suggestion;
    form.setValue(fieldName, newValue, { shouldValidate: true });
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] shadow-xl">
        <DialogHeader>
          <DialogTitle>{customer ? 'Edit Customer' : 'Create New Customer'}</DialogTitle>
          <DialogDescription>
            {customer ? 'Update the details for this customer.' : 'Fill in the form to add a new customer.'}
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
                        <Input placeholder="e.g., Acme Corp" {...field} />
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
                        <Input type="email" placeholder="e.g., contact@acme.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 555-123-4567" {...field} />
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
                      <Textarea placeholder="e.g., 123 Main St, Anytown, USA" {...field} />
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
                      <Textarea placeholder="Any relevant notes about the customer..." {...field} rows={3} />
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
                    Optionally, list related organizations, people, or vendors. Use AI to get suggestions based on customer data.
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
                      <Input placeholder="e.g., Org A, Org B" {...field} />
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
                      <Input placeholder="e.g., John Doe, Jane Smith" {...field} />
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
                    <FormLabel>Related Vendors (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Vendor X, Vendor Y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit">Save Customer</Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
