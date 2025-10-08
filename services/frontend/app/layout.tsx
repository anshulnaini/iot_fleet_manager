import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from './providers';
import { LiveProvider } from './live-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IoT Fleet Manager",
  description: "A simple IoT fleet manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <LiveProvider>{children}</LiveProvider>
        </Providers>
      </body>
    </html>
  );
}
