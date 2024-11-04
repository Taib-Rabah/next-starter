import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "./Providers";
import { Header, Footer } from "~/components/layout";
import "./globals.scss";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Next.js Template",
  description: "Next.js Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}>
        <div className="flex grow flex-col ~xs/2xl:~gap-6/20">
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  );
}
