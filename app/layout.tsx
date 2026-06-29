import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothSectionScroll } from "@/components/SmoothSectionScroll";
import { findGalleryImageByFilename, getGalleryImages } from "@/lib/gallery";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-lato"
});

export const metadata: Metadata = {
  title: "Janet Lee Design Studio",
  description: "Interior design studio specializing in beautiful, functional spaces."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const galleryImages = await getGalleryImages();
  const headerLogo =
    findGalleryImageByFilename(galleryImages, "header-logo-text.png") ??
    findGalleryImageByFilename(galleryImages, "header-logo.png");
  const footerLogo = findGalleryImageByFilename(galleryImages, "hero-logo.png");

  const headerLogoUrl = headerLogo?.url ?? "/images/header-logo-text.png";
  const footerLogoUrl = footerLogo?.url ?? "/images/hero-logo.png";

  return (
    <html lang="en">
      <body className={lato.variable}>
        <Header logoUrl={headerLogoUrl} logoAlt={headerLogo?.alt || "Janet Lee Design Studio"} />
        <SmoothSectionScroll />
        {children}
        <Footer logoUrl={footerLogoUrl} logoAlt={footerLogo?.alt || "Janet Lee Design Studio"} />
      </body>
    </html>
  );
}
