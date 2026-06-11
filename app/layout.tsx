import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Inter, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";

const nunitoSansHeading = Nunito_Sans({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "São Miguel Estofados Decor | Londrina - PR",
  description:
    "Sofás, poltronas e móveis de alto padrão em Londrina. Visite nossa loja no Norte Shopping. Conforto que transforma seu lar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("h-full", "antialiased", playfair.variable, montserrat.variable, "font-sans", inter.variable, nunitoSansHeading.variable)}>
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="#D6A25F" showSpinner={false} height={3} />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
