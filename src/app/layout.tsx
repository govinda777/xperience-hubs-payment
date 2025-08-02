import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PrivyProvider } from '@privy-io/react-auth';
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Xperience Hubs Payment',
  description: 'Plataforma de pagamentos com integração blockchain e NFTs',
  keywords: ['blockchain', 'nft', 'pix', 'payment', 'smart-contracts', 'ethereum'],
  authors: [{ name: 'Xperience Hubs Team' }],
  creator: 'Xperience Hubs Team',
  publisher: 'Xperience Hubs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    title: 'Xperience Hubs Payment',
    description: 'Plataforma de pagamentos com integração blockchain e NFTs',
    siteName: 'Xperience Hubs Payment',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xperience Hubs Payment',
    description: 'Plataforma de pagamentos com integração blockchain e NFTs',
    creator: '@xperiencehubs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
          config={{
            loginMethods: ['email', 'wallet'],
            appearance: {
              theme: 'light',
              accentColor: '#3b82f6',
              showWalletLoginFirst: false,
            },
            defaultChain: 11155111, // Sepolia testnet
            supportedChains: [1, 11155111, 137, 80001], // Ethereum, Sepolia, Polygon, Mumbai
          }}
        >
          <Providers>
            {children}
          </Providers>
        </PrivyProvider>
      </body>
    </html>
  );
} 