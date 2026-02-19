import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://monitoring.fisiohome.id";

export const metadata: Metadata = {
  title: {
    default: "Fisiohome Monitoring Dashboard",
    template: "%s | Fisiohome Monitoring Dashboard",
  },
  description: "Operational Dashboard for Fisiohome monitoring and management.",
  keywords: [
    "Fisiohome",
    "Monitoring",
    "Dashboard",
    "Fisioterapi",
    "Home Visit",
    "Kesehatan",
  ],
  authors: [{ name: "Fisiohome Team" }],
  creator: "Fisiohome",
  publisher: "Fisiohome",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://monitoring.fisiohome.id",
  ),
  openGraph: {
    title: "Fisiohome Monitoring Dashboard",
    description:
      "Operational Dashboard for Fisiohome monitoring and management.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://monitoring.fisiohome.id",
    siteName: "Fisiohome Monitoring",
    images: [
      {
        url: `${appUrl}/logo.png`,
        width: 800,
        height: 600,
        alt: "Fisiohome Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fisiohome Monitoring Dashboard",
    description:
      "Operational Dashboard for Fisiohome monitoring and management.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
        className={`${notoSans.variable} font-sans antialiased bg-[#F3F6F8]`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
