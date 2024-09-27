import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import SolanaWalletProvider from "@/components/WalletProvider"; // Import the wallet provider

// Load custom fonts
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

// Metadata for the application
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
  icons: "/solfootball-black.svg",
};

// Root Layout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-theme to-purple-500`}
      >
        <SolanaWalletProvider>
          {" "}
          {/* Wrap the application with the Solana Wallet provider */}
          <div className="flex flex-col min-h-screen max-w-screen relative text-black font-sans">
            <Header />

            {/* Render the children components */}
            {children}

            {/* <Footer /> */}
          </div>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
