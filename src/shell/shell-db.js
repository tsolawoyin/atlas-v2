// This file maybe long but then it should be easy to navigate through

// All Supabase utility functions live here.
// Yupyup it works on the backend as well. 
// Thank you so much.
// it's just to invoke this function with a supabase instance. That's all...
export default function supabase_db_utility_fn(supabase) {
  return {
    profiles: {
      async createProfile(profileData) {
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

      async getProfileById(id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        return data;
      },

      async getProfileByUsername(username) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();

        if (error) throw error;
        return data;
      },

      async getAllProfiles() {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      },

      async updateProfile(id, updates) {
        const { data, error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return data;
      },

      async deleteProfile(id) {
        const { error } = await supabase.from("profiles").delete().eq("id", id);

        if (error) throw error;
        return { success: true };
      },

      async searchProfiles(searchTerm) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);

        if (error) throw error;
        return data;
      },

      async getCurrentUserProfile() {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("No authenticated user");

        return getProfileById(user.id);
      },

      async isUsernameAvailable(username) {
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

    subjects: {
      async create(data) {
        const { data: subject, error } = await supabase
          .from("subjects")
          .insert({
            name: data.name,
            topics_count: data.topics_count || 0,
            questions_count: data.questions_count || 0,
          })
          .select()
          .single();

        if (error)
          throw new Error(`Failed to create subject: ${error.message}`);
        return subject;
      },

      async getById(id) {
        const { data, error } = await supabase
          .from("subjects")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw new Error(`Failed to get subject: ${error.message}`);
        return data;
      },

      async getByName(name) {
        const { data, error } = await supabase
          .from("subjects")
          .select("*")
          .eq("name", name)
          .single();

        if (error) throw new Error(`Failed to get subject: ${error.message}`);
        return data;
      },

      async getWithTopics(id) {
        const { data, error } = await supabase
          .from("subjects")
          .select(
            `
        *,
        topics (*)
      `
          )
          .eq("id", id)
          .single();

        if (error)
          throw new Error(
            `Failed to get subject with topics: ${error.message}`
          );
        return data;
      },

      async getAll(options = {}) {
        let query = supabase.from("subjects").select("*");

        // Apply pagination
        if (options.limit) query = query.limit(options.limit);
        if (options.offset)
          query = query.range(
            options.offset,
            options.offset + (options.limit || 10) - 1
          );

        // Apply sorting
        if (options.orderBy) {
          query = query.order(options.orderBy, {
            ascending: options.ascending !== false,
          });
        } else {
          query = query.order("name", { ascending: true });
        }

        const { data, error } = await query;

        if (error) throw new Error(`Failed to get subjects: ${error.message}`);
        return data;
      },

      async update(id, data) {
        const { data: subject, error } = await supabase
          .from("subjects")
          .update({
            name: data.name,
            topics_count: data.topics_count,
            questions_count: data.questions_count,
          })
          .eq("id", id)
          .select()
          .single();

        if (error)
          throw new Error(`Failed to update subject: ${error.message}`);
        return subject;
      },

      async delete(id) {
        const { error } = await supabase.from("subjects").delete().eq("id", id);

        if (error)
          throw new Error(`Failed to delete subject: ${error.message}`);
        return { success: true };
      },
    },

    topics: {
      async create(data) {
        const { data: topic, error } = await supabase
          .from("topics")
          .insert({
            subject_id: data.subject_id,
            name: data.name,
            description: data.description || null,
            questions_count: data.questions_count || 0,
          })
          .select()
          .single();

        if (error) throw new Error(`Failed to create topic: ${error.message}`);
        return topic;
      },

      // Get a single topic by ID
      async getById(id) {
        const { data, error } = await supabase
          .from("topics")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw new Error(`Failed to get topic: ${error.message}`);
        return data;
      },

      // Get all topics
      async getAll(options = {}) {
        let query = supabase.from("topics").select("*");

        // Filter by subject
        if (options.subject_id)
          query = query.eq("subject_id", options.subject_id);

        // Apply pagination
        if (options.limit) query = query.limit(options.limit);
        if (options.offset)
          query = query.range(
            options.offset,
            options.offset + (options.limit || 10) - 1
          );

        // Apply sorting
        if (options.orderBy) {
          query = query.order(options.orderBy, {
            ascending: options.ascending !== false,
          });
        } else {
          query = query.order("name", { ascending: true });
        }

        const { data, error } = await query;

        if (error) throw new Error(`Failed to get topics: ${error.message}`);
        return data;
      },

      // Get topics by subject
      async getBySubject(subjectId) {
        const { data, error } = await supabase
          .from("topics")
          .select("*")
          .eq("subject_id", subjectId)
          .order("name", { ascending: true });

        if (error) throw new Error(`Failed to get topics: ${error.message}`);
        return data;
      },

      // Update a topic
      async update(id, data) {
        const { data: topic, error } = await supabase
          .from("topics")
          .update({
            subject_id: data.subject_id,
            name: data.name,
            description: data.description,
            questions_count: data.questions_count,
          })
          .eq("id", id)
          .select()
          .single();

        if (error) throw new Error(`Failed to update topic: ${error.message}`);
        return topic;
      },

      // Delete a topic
      async delete(id) {
        const { error } = await supabase.from("topics").delete().eq("id", id);

        if (error) throw new Error(`Failed to delete topic: ${error.message}`);
        return { success: true };
      },

      // Get topic with its questions
      async getWithQuestions(id, options = {}) {
        let query = supabase
          .from("topics")
          .select(
            `
        *,
        questions (*)
      `
          )
          .eq("id", id);

        // Filter visible questions only
        if (options.visibleOnly) {
          query = query.eq("questions.is_visible", true);
        }

        const { data, error } = await query.single();

        if (error)
          throw new Error(
            `Failed to get topic with questions: ${error.message}`
          );
        return data;
      },
    },

    questions: {
      async create(data) {
        const { data: question, error } = await supabase
          .from("questions")
          .insert({
            subject_id: data.subject_id,
            topic_id: data.topic_id,
            question: data.question,
            options: data.options,
            answer: data.answer,
            explanation: data.explanation || null,
            is_visible: data.is_visible !== undefined ? data.is_visible : true,
            version: data.version || 1,
          })
          .select()
          .single();

        if (error)
          throw new Error(`Failed to create question: ${error.message}`);
        return question;
      },

      // Get a single question by ID
      async getById(id) {
        const { data, error } = await supabase
          .from("questions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw new Error(`Failed to get question: ${error.message}`);
        return data;
      },

      // Get all questions
      async getAll(options = {}) {
        let query = supabase.from("questions").select("*");

        // Filter by subject
        if (options.subject_id)
          query = query.eq("subject_id", options.subject_id);

        // Filter by topic
        if (options.topic_id) query = query.eq("topic_id", options.topic_id);

        // Filter by visibility
        if (options.is_visible !== undefined)
          query = query.eq("is_visible", options.is_visible);

        // Apply pagination
        if (options.limit) query = query.limit(options.limit);
        if (options.offset)
          query = query.range(
            options.offset,
            options.offset + (options.limit || 10) - 1
          );

        // Apply sorting
        if (options.orderBy) {
          query = query.order(options.orderBy, {
            ascending: options.ascending !== false,
          });
        } else {
          query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query;

        if (error) throw new Error(`Failed to get questions: ${error.message}`);
        return data;
      },

      // Get questions by subject
      async getBySubject(subjectId, options = {}) {
        return await this.getAll({ ...options, subject_id: subjectId });
      },

      // Get questions by topic
      async getByTopic(topicId, options = {}) {
        return await this.getAll({ ...options, topic_id: topicId });
      },

      // Get random questions
      async getRandom(count, options = {}) {
        let query = supabase.from("questions").select("*");

        // Filter by subject
        if (options.subject_id)
          query = query.eq("subject_id", options.subject_id);

        // Filter by topic
        if (options.topic_id) query = query.eq("topic_id", options.topic_id);

        // Only visible questions
        query = query.eq("is_visible", true);

        const { data, error } = await query;

        if (error)
          throw new Error(`Failed to get random questions: ${error.message}`);

        // Shuffle and return requested count
        const shuffled = data.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      },

      // Update a question
      async update(id, data) {
        const { data: question, error } = await supabase
          .from("questions")
          .update({
            subject_id: data.subject_id,
            topic_id: data.topic_id,
            question: data.question,
            options: data.options,
            answer: data.answer,
            explanation: data.explanation,
            is_visible: data.is_visible,
            version: data.version,
          })
          .eq("id", id)
          .select()
          .single();

        if (error)
          throw new Error(`Failed to update question: ${error.message}`);
        return question;
      },

      // Delete a question
      async delete(id) {
        const { error } = await supabase
          .from("questions")
          .delete()
          .eq("id", id);

        if (error)
          throw new Error(`Failed to delete question: ${error.message}`);
        return { success: true };
      },

      // Toggle visibility
      async toggleVisibility(id) {
        const question = await this.getById(id);
        return await this.update(id, { is_visible: !question.is_visible });
      },

      // Bulk create questions
      async bulkCreate(questionsArray) {
        const { data, error } = await supabase
          .from("questions")
          .insert(questionsArray)
          .select();

        if (error)
          throw new Error(`Failed to bulk create questions: ${error.message}`);
        return data;
      },

      // Search questions
      async search(searchTerm, options = {}) {
        let query = supabase
          .from("questions")
          .select("*")
          .ilike("question", `%${searchTerm}%`);

        // Filter by subject
        if (options.subject_id)
          query = query.eq("subject_id", options.subject_id);

        // Filter by topic
        if (options.topic_id) query = query.eq("topic_id", options.topic_id);

        // Only visible questions
        if (options.visibleOnly) query = query.eq("is_visible", true);

        // Apply pagination
        if (options.limit) query = query.limit(options.limit);

        const { data, error } = await query;

        if (error)
          throw new Error(`Failed to search questions: ${error.message}`);
        return data;
      },
    },
  };
}

// supabase_db_utility_fn().subjects.
