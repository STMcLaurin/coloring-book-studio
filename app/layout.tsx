import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coloring Book Studio',
  description: 'Plan, create, design, validate, and publish beautiful coloring books.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
