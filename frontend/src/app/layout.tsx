import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Orbitly Studio — Digital Product & Design Agency',
  description:
    'Orbitly Studio transforms bold startup ideas into world-class digital products, brand identities, and high-performance applications.',
  keywords: ['Digital Studio', 'UI/UX Design', 'Web Development', 'Mobile Apps', 'Brand Identity', 'Product Strategy'],
  authors: [{ name: 'Orbitly Studio' }],
  openGraph: {
    title: 'Orbitly Studio — Digital Product & Design Agency',
    description: 'Turning bold ideas into polished digital products for scale-ups.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-background text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
