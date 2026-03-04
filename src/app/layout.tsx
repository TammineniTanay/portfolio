import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tanay Tammineni — AI & Machine Learning Engineer",
  description: "MS CS · 3.9 GPA · Published Researcher · AI Engineer bridging the gap between deep learning and secure cloud deployments.",
  openGraph: {
    title: "Tanay Tammineni — AI Engineer",
    description: "MS CS · 3.9 GPA · Published Researcher · AI Engineer @ Automate365",
    url: "https://tanaytammineni.vercel.app",
    siteName: "Tanay Tammineni Portfolio",
    images: [
      {
        url: "https://github.com/TammineniTanay.png",
        width: 800,
        height: 600,
        alt: "Tanay Tammineni - AI Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tanay Tammineni — AI Engineer",
    description: "MS CS · 3.9 GPA · Published Researcher",
    images: ["https://github.com/TammineniTanay.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}