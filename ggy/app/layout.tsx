import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Anek_Devanagari, Anek_Gujarati, Anek_Latin } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { INDEXABLE, SITE_URL } from "@/lib/site";

// Gambetta (quotations and unconfirmed values) and Switzer (text) by the Indian Type Foundry, from Fontshare, under the
// ITF Free Font License. Self-hosting for our own website is permitted.
// The official .woff2 files are served unmodified (the licence forbids
// subsetting or conversion) and must not be redistributed, for example by
// publishing them in a public repository.
const gambetta = localFont({
  variable: "--font-gambetta",
  display: "swap",
  src: [
    { path: "./fonts/Gambetta-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Gambetta-LightItalic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/Gambetta-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Gambetta-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Gambetta-Medium.woff2", weight: "500", style: "normal" },
  ],
});

const switzer = localFont({
  variable: "--font-switzer",
  display: "swap",
  src: [
    { path: "./fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
  ],
});

// Display: Anek by Ek Type (Mumbai), SIL Open Font License 1.1. One design
// across Latin, Devanagari and Gujarati, with a width axis; set extended and light.
const anekLatin = Anek_Latin({ variable: "--font-anek-latin", subsets: ["latin"], axes: ["wdth"], display: "swap" });
const anekDevanagari = Anek_Devanagari({ variable: "--font-anek-devanagari", subsets: ["devanagari"], axes: ["wdth"], display: "swap", preload: false });
const anekGujarati = Anek_Gujarati({ variable: "--font-anek-gujarati", subsets: ["gujarati"], axes: ["wdth"], display: "swap", preload: false });

const description =
  "Good Governance Yatra is an immersive journey into governance and leadership. The upcoming edition travels through Maharashtra, Goa and Gujarat. Dates to be announced.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Good Governance Yatra: Maharashtra, Goa and Gujarat",
  description,
  alternates: { canonical: "/" },
  applicationName: "Good Governance Yatra",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Good Governance Yatra",
    title: "Good Governance Yatra: Maharashtra, Goa and Gujarat",
    description,
  },
  twitter: { card: "summary_large_image" },
  // Kept out of search results until the content is confirmed: set
  // NEXT_PUBLIC_ALLOW_INDEXING=true to publish (see lib/site.ts).
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#710017" },
  ],
};

// Marks browsers that accept motion before first paint, so the hero's intro
// never flashes its final state first. No class means no intro.
const motionFlag = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion')}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${anekLatin.variable} ${gambetta.variable} ${switzer.variable} ${anekDevanagari.variable} ${anekGujarati.variable}`}
    >
      <head>
        {/* suppressHydrationWarning: some browser extensions inject their own
            <script> into <head> before hydration runs, which otherwise shows
            up as a mismatch on this element. Not caused by our code. */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      {/* suppressHydrationWarning: some browser extensions (e.g. ColorZilla's
          cz-shortcut-listen) add attributes to <body> before hydration runs,
          which otherwise shows up as a mismatch on this element. Not caused
          by our code. */}
      <body suppressHydrationWarning className="min-h-dvh bg-paper text-ink">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <MotionProvider>
          <SmoothScroll />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
