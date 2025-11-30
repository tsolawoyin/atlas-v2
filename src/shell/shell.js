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

// React
import { createContext, useState, useEffect } from "react";

// Next
import { usePathname } from "next/navigation";

// Supabase
import { createClient } from "@/utils/supabase/client";

export const ShellContext = createContext();

// So once the App loads we initialize a supabase client for the entire application.
// That makes sense instead of wasting supabase object everywhere
export default function Shell({ children, supabase_user }) {
  // Initialize supabase client for some useful things
  const supabase = createClient();
  // Set user to user from server
  const [user, setUser] = useState(supabase_user.user);

  const currentPath = usePathname();

  // Auth functions
  const auth = {
    login: async function (credentials) {
      // credentials is an object
      let { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error) {
        throw new Error(error);
      }

      return true;
    },

    signUp: async function (credentials) {
      let { data, error } = await supabase.auth.signUp(credentials);
    },

    authStateChange: function () {
      return supabase.auth.onAuthStateChange((event) => {
        // Update context/state when auth changes
        if (event === "INITIAL_SESSION") {
          console.log("Welcome home User");
        } else if (event === "SIGNED_IN") {
          console.log("User Signed in");
        } else if (event === "SIGNED_OUT") {
          // handle sign out event
          console.log("User signed out");
        } else if (event === "PASSWORD_RECOVERY") {
          // handle password recovery event
        } else if (event === "TOKEN_REFRESHED") {
          // handle token refreshed event
        } else if (event === "USER_UPDATED") {
          // handle user updated event
        }
      });
    },
  };

  // some things are unnecessary. Like use memo for instance.
  // next.js have memoize somethings

  useEffect(() => {
    console.log("Welcome to Atlas", user);
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = auth.authStateChange();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ShellContext.Provider value={{ user, currentPath, supabase, auth }}>
      {children}
    </ShellContext.Provider>
  );
}

// the best thing I suppose is to have the auth object somewhere as wel

// Something like, I just want the shell to expose authentication as well
// how can we do it?
