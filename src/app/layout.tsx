
import type {Metadata} from 'next';
import {Geist} from 'next/font/google'; // Geist_Mono removed as not explicitly used in body
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TradeFlow',
  description: 'Customer Management with AI-Powered Suggestions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
