// Good morning Temidayo. How are you?
// Today we start writing the code for Atlas.
// The new version.

// Be the author and finisher, only seek help when needed.

// I have learned a lot of lessons already with all the AI burst and AI hype.
// I'm Marijn apprentice, be like your boss. Thank you.

// This is the app's shell.
// I'm gonna design Atlas to be beautiful code wise and Visual wise. Just wait and see.

// I love the ease at which I set up supabase without any AI intervention.

"use client";

// Supabase
import { createClient } from "@/utils/supabase/client";

// React
import { createContext, useEffect } from "react";

// Next
import { usePathname } from "next/navigation";

export const ShellContext = createContext();

export default function Shell({ children, supabase_user }) {
  const user = supabase_user;
  const currentPath = usePathname();

  useEffect(() => {
    console.log("Welcome to Atlas", user);
  }, []);

  return (
    <ShellContext.Provider value={{ user, currentPath }}>{children}</ShellContext.Provider>
  );
}
