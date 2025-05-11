
import { Badge } from '@/components/ui/badge';
import type React from 'react';

interface EntityListProps {
  items?: string[];
  Icon: React.ElementType;
  title: string;
}

export const EntityList: React.FC<EntityListProps> = ({ items, Icon, title }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-2">
      <h4 className="text-xs font-semibold text-muted-foreground flex items-center mb-1">
        <Icon className="w-3 h-3 mr-1.5" /> {title}
      </h4>
      <div className="flex flex-wrap gap-1">
        {items.map((item, index) => (
          <Badge key={index} variant="secondary" className="text-xs">{item}</Badge>
        ))}
      </div>
    </div>
  );
};
