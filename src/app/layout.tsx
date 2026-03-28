import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tanay Tammineni — AI Engineer | ML Engineer | LLM Developer",
  description: "MS CS · 3.9 GPA · Published Researcher · AI Systems Developer building production LLM pipelines, RAG systems, and computer vision. Open to AI/ML roles across the US.",
  keywords: ["AI Engineer", "ML Engineer", "LLM Developer", "GenAI Engineer", "Machine Learning", "RAG", "LangChain", "PyTorch", "Computer Vision", "Tanay Tammineni"],
  authors: [{ name: "Tanay Tammineni" }],
  creator: "Tanay Tammineni",
  openGraph: {
    title: "Tanay Tammineni — AI Engineer | ML Engineer | LLM Developer",
    description: "MS CS · 3.9 GPA · Published Researcher · AI Systems Developer @ Automate365. Building production LLM pipelines, RAG systems, and CV models.",
    url: "https://tanaytammineni.vercel.app",
    siteName: "Tanay Tammineni Portfolio",
    images: [{ url: "https://github.com/TammineniTanay.png", width: 800, height: 600, alt: "Tanay Tammineni - AI Engineer" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tanay Tammineni — AI Engineer | ML Engineer",
    description: "MS CS · 3.9 GPA · Published Researcher · Open to AI/ML roles",
    images: ["https://github.com/TammineniTanay.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://tanaytammineni.vercel.app" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Tanay Tammineni",
  "url": "https://tanaytammineni.vercel.app",
  "image": "https://github.com/TammineniTanay.png",
  "jobTitle": "AI Systems Developer",
  "worksFor": { "@type": "Organization", "name": "Automate365" },
  "alumniOf": [
    { "@type": "CollegeOrUniversity", "name": "Southeast Missouri State University" },
    { "@type": "CollegeOrUniversity", "name": "CVR College of Engineering" }
  ],
  "knowsAbout": ["Machine Learning", "Large Language Models", "RAG", "Computer Vision", "Python", "PyTorch", "LangChain"],
  "sameAs": [
    "https://github.com/TammineniTanay",
    "https://www.linkedin.com/in/tanay-tammineni/",
    "https://tanaytammineni.vercel.app"
  ],
  "email": "tanaytammineni22@gmail.com",
  "address": { "@type": "PostalAddress", "addressLocality": "Irving", "addressRegion": "TX", "addressCountry": "US" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}