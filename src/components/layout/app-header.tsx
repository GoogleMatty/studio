
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  activeEntityType: 'customer' | 'vendor';
  onCreateEntity: () => void;
}

export function AppHeader({ activeEntityType, onCreateEntity }: AppHeaderProps) {
  const buttonText = activeEntityType === 'customer' ? 'New Customer' : 'New Vendor';
  const buttonClass = activeEntityType === 'vendor' 
    ? 'bg-vendor-primary hover:bg-vendor-primary/90 text-vendor-primary-foreground' 
    : '';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          TradeFlow
        </Link>
        <Button onClick={onCreateEntity} size="sm" className={cn(buttonClass)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </div>
    </header>
  );
}
