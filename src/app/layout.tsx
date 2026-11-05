import type { Metadata } from "next";
import { DM_Mono, Inter_Tight } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-inter-tight",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HC Wellness",
    template: "%s | HC Wellness",
  },
  description:
    "Saunas, cold plunges and red light for the home you have. From HavenCraft. Made to HavenCraft's spec. Inspected, warrantied and supported by our team in Canada.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-linen font-body text-bark">
        <MotionProvider>
          <CartProvider>
            <SiteHeader />
            <div id="content" className="flex flex-1 flex-col">
              {children}
            </div>
            <SiteFooter />
          </CartProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
