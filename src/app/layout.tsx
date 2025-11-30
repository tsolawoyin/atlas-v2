import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

import { createClient } from "@/utils/supabase/server";

// Context
import Shell from "@/shell/shell";
import { ThemeProvider } from "@/components/theme-store";


export const metadata: Metadata = {
  title: "Atlas",
  description: "The NEXT Jamb Practice Software",
};

const space_grotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"]
})

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
        className={`${space_grotesk.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Shell supabase_user={data}>
            <div className="grid items-center w-full h-screen">
              {children}
            </div>
          </Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}

// enough of all the conventions. 
// I should name my app's files as I see fit.