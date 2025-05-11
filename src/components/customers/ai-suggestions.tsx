'use client';

import type { SuggestRelatedEntitiesOutput } from '@/ai/flows/suggest-related-entities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Truck, Sparkles } from 'lucide-react';

interface AiSuggestionsProps {
  suggestions: SuggestRelatedEntitiesOutput | null;
  isLoading: boolean;
  onAddSuggestion: (type: keyof SuggestRelatedEntitiesOutput, value: string) => void;
}

export function AiSuggestions({ suggestions, isLoading, onAddSuggestion }: AiSuggestionsProps) {
  if (isLoading) {
    return (
      <div className="mt-4 flex items-center justify-center rounded-md border border-dashed p-8">
        <Sparkles className="mr-2 h-5 w-5 animate-spin text-primary" />
        <p className="text-muted-foreground">Generating AI suggestions...</p>
      </div>
    );
  }

  if (!suggestions || (suggestions.organizations.length === 0 && suggestions.people.length === 0 && suggestions.vendors.length === 0)) {
    return null; // Don't render if no suggestions and not loading
  }

  const renderSection = (title: string, items: string[], type: keyof SuggestRelatedEntitiesOutput, Icon: React.ElementType) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <h4 className="mb-2 flex items-center text-sm font-medium text-muted-foreground">
          <Icon className="mr-2 h-4 w-4" />
          {title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <Badge variant="secondary" className="text-sm">{item}</Badge>
              <Button
                type="button"
                size="xs"
                variant="ghost"
                onClick={() => onAddSuggestion(type, item)}
                className="h-6 px-1.5 text-xs"
                title={`Add ${item} to ${type}`}
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="mt-6 bg-accent/50 shadow-inner">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderSection('Organizations', suggestions.organizations, 'organizations', Building2)}
        {renderSection('People', suggestions.people, 'people', Users)}
        {renderSection('Vendors', suggestions.vendors, 'vendors', Truck)}
      </CardContent>
    </Card>
  );
}
