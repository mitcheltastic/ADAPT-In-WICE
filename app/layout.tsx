import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ADAPT-In: Poverty Alleviation Decision Support System',
  description: 'AI-Based Analytics Platform & Decision Support System (DSS) for Poverty Alleviation in Indonesia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-pink-300 selection:text-pink-700">
        {children}
      </body>
    </html>
  );
}
