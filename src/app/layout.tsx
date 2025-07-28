import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anubhav AI - Powered by Gemini",
  description: "An intelligent AI chatbot created by Anubhav, a Software Developer from IIT Mandi. Powered by Google's Gemini API with advanced text-to-speech capabilities and voice recognition.",
  keywords: "AI chatbot, Gemini API, Anubhav, IIT Mandi, voice recognition, text-to-speech, artificial intelligence",
  authors: [{ name: "Anubhav", url: "https://github.com/anubhav" }],
  creator: "Anubhav - Software Developer from IIT Mandi",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Anubhav AI - Intelligent Chatbot with Voice Features",
    description: "Experience the future of AI conversation with Anubhav AI. Created by a Software Developer from IIT Mandi, featuring Gemini API integration, voice recognition, and text-to-speech.",
    url: "https://anubhav-ai.vercel.app",
    siteName: "Anubhav AI",
    images: [
      {
        url: "/ai-anubhav.jpeg",
        width: 1200,
        height: 630,
        alt: "Anubhav AI - Intelligent Chatbot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anubhav AI - Powered by Gemini",
    description: "Intelligent AI chatbot with voice features, created by Anubhav from IIT Mandi",
    images: ["/ai-anubhav.jpeg"],
    creator: "@anubhav",
  },
  icons: {
    icon: [
      { url: "/ai-anubhav.jpeg", sizes: "any", type: "image/jpeg" },
      { url: "/ai-anubhav.jpeg", sizes: "16x16", type: "image/jpeg" },
      { url: "/ai-anubhav.jpeg", sizes: "32x32", type: "image/jpeg" },
    ],
    apple: [
      { url: "/ai-anubhav.jpeg", sizes: "180x180", type: "image/jpeg" },
    ],
    shortcut: [
      { url: "/ai-anubhav.jpeg", type: "image/jpeg" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/jpeg",
        sizes: "192x192",
        url: "/ai-anubhav.jpeg",
      },
    ],
  },
  manifest: "/manifest.json",
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
        {children}
      </body>
    </html>
  );
}
