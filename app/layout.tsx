import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Galleric",
  description: "A simple image gallery application",
  icons: {
    icon: "./favicon.svg",
  },
  openGraph: {
    title: "Galleric",
    description: "A simple image gallery application",
    siteName: "galleric.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Galleric",
    description: "A simple image gallery application",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          {/* <div>Hello world!</div> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
