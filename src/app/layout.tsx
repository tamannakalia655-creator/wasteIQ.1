import type {Metadata} from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'WasteIQ – Smarter Waste Management. Cleaner Communities.',
  description: 'Smarter Waste Management. Cleaner Communities. Smart civic waste management and monitoring platform for Baripada, Odisha.',
  openGraph: {
    title: 'WasteIQ – Smarter Waste Management. Cleaner Communities.',
    description: 'Smarter Waste Management. Cleaner Communities. Smart civic waste management and monitoring platform for Baripada, Odisha.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20">
        <FirebaseClientProvider>
          <ThemeProvider defaultTheme="light" storageKey="wasteiq-theme">
            {children}
            <Toaster />
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
