import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeAnimation from "@/components/ThemeAnimation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Community Pledges - Share Gaming Server Costs with Your Community",
    template: "%s | Community Pledges"
  },
  description: "Keep community gaming servers alive! Share hosting costs with your community through monthly pledges. Support Minecraft, Rust, ARK, Valheim servers and more. Join thousands of gamers pledging together.",
  keywords: "gaming servers, community servers, server hosting, split costs, minecraft server, rust server, ARK server, server pledges, gaming community, share server costs",
  authors: [{ name: "Community Pledges" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://commpledge.vercel.app",
    siteName: "Community Pledges",
    title: "Community Pledges - Share Gaming Server Costs",
    description: "Keep community gaming servers alive! Share hosting costs with monthly pledges.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Community Pledges",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Pledges - Share Gaming Server Costs",
    description: "Keep community gaming servers alive! Share hosting costs with monthly pledges.",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ThemeAnimation />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
