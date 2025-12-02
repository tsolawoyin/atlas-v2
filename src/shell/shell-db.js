// This file maybe long but then it should be easy to navigate through

// All Supabase utility functions live here.
export default function supabase_db_utility_fn(supabase) {
  return {
    profiles: {
      createProfile: async (profileData) => {
        const { data, error } = await supabase
          .from("profiles")
          .insert([
            {
              id: profileData.id,
              username: profileData.username,
              avatar_url: profileData.avatar_url,
              full_name: profileData.full_name,
              bio: profileData.bio,
              is_admin: profileData.is_admin || false,
            },
          ])
          .select()
          .single();

        if (error) throw error;
        return data;
      },

      getProfileById: async (id) => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        return data;
      },

      getProfileByUsername: async (username) => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();

        if (error) throw error;
        return data;
      },

      getAllProfiles: async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      },

      updateProfile: async (id, updates) => {
        const { data, error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      },

      deleteProfile: async (id) => {
        const { error } = await supabase.from("profiles").delete().eq("id", id);

        if (error) throw error;
        return { success: true };
      },

      searchProfiles: async (searchTerm) => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);

        if (error) throw error;
        return data;
      },

      getCurrentUserProfile: async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("No authenticated user");

        return getProfileById(user.id);
      },

      isUsernameAvailable: async (username) => {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", username)
          .single();

        if (error && error.code === "PGRST116") {
          // No rows returned means username is available
          return true;
        }

        if (error) throw error;
        return false;
      },
    },
  };
}
