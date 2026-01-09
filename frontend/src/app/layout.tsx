import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Tilt_Warp } from "next/font/google";
import "./globals.css";
import { OrderContextProvider } from "@/context/OrderContext";
import { ThemeProvider } from "@vapor-ui/core";
import Footer from "@/components/Footer";
import GlobalHeader from "@/components/GlobalHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

const tiltWarp = Tilt_Warp({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-tilt-warp',
});

export const metadata: Metadata = {
  title: "Hello Traveller",
  description: "즉흥 여행의 시작, Hello Traveller",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${tiltWarp.variable}`}>
        <OrderContextProvider>
          <ThemeProvider>
            <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 40px', background: 'white' }}>
              <GlobalHeader />
              <main style={{ minHeight: '100vh' }}>
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </OrderContextProvider>
      </body>
    </html>
  );
}
