'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/styles/globals.css';
import '@/styles/calendar.css';

// import Toast from '@/components/Toast';

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang='en'>
        {/* <Toast /> */}
        <body>{children}</body>
      </html>
    </QueryClientProvider>
  );
}
