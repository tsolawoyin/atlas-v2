import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { createClient } from "@/utils/supabase/server";

// Context
import Shell from "@/components/store/shell";
import { ThemeProvider } from "@/components/store/theme-store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas",
  description: "The NEXT Jamb Practice Software",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser(); // simple.

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Shell supabase_user={data}>
            {children}
          </Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}

// enough of all the conventions. 
// I should name my app's files as I see fit.