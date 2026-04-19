import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Navbar from "@/components/layout/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VirtualFit — AI-Powered Virtual Try-On",
  description:
    "Try on clothes virtually using AI. Upload your photo, choose an outfit, and see how it looks on you before buying.",
  keywords: ["virtual try-on", "AI fashion", "online shopping", "clothing preview"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans antialiased min-h-screen text-foreground selection:bg-primary/20 selection:text-primary relative overflow-x-hidden`} suppressHydrationWarning>
        {/* Background Decorative Blobs */}
        <div className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/30 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-primary/10 rounded-full blur-[80px] animate-float" />
        </div>

        <AuthProvider>
          <Navbar />
          <main className="relative z-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
