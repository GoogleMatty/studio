import type { ReactNode } from 'react';
import { AppHeader } from './app-header';

interface MainLayoutProps {
  children: ReactNode;
  onCreateCustomer: () => void;
}

export function MainLayout({ children, onCreateCustomer }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader onCreateCustomer={onCreateCustomer} />
      <main className="flex-1">
        <div className="container py-8">
          {children}
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-muted/50">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Firebase Studio.
          </p>
        </div>
      </footer>
    </div>
  );
}
