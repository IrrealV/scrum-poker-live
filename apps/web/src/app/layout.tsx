import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Scrum Poker Live | Estimación Ágil en Tiempo Real',
  description: 'Herramienta de planning poker en tiempo real para equipos ágiles. Estima historias de usuario de forma colaborativa con tu equipo.',
  keywords: ['scrum', 'poker', 'planning poker', 'agile', 'estimation', 'team collaboration'],
  authors: [{ name: 'Scrum Poker Live' }],
  openGraph: {
    title: 'Scrum Poker Live',
    description: 'Estimación ágil en tiempo real para equipos',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              borderRadius: '10px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
