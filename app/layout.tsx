import Providers from "@/lib/providers/providers";
import "./globals.css";
import { Poppins, Montserrat, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClerkAuthSync from "@/components/auth/ClerkAuthSync";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable} ${inter.variable}`}>
      <body className={inter.className}>
        <Providers>
          <ClerkProvider>
            <ClerkAuthSync />
            <Header />
            {children}
            <Footer />
            <FloatingWhatsApp />
          </ClerkProvider>
        </Providers>
      </body>
    </html>
  );
}
