import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AppHeaderProps {
  onCreateCustomer: () => void;
}

export function AppHeader({ onCreateCustomer }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          TradeFlow
        </Link>
        <Button onClick={onCreateCustomer} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Customer
        </Button>
      </div>
    </header>
  );
}
