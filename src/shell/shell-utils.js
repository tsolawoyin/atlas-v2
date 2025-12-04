// Utility function for the entire app.
// Everything is cached by default this days. 
// Shey you get.
export default function utils(supabase, db) {
  return {
    async fetchSubjectsAndTopics() {
      try {
        // First, check IndexedDB
        const subjects = await db.subjects.toArray();
        const topics = await db.topics.toArray();

        // If we have data in IndexedDB, return it
        if (subjects.length > 0 && topics.length > 0) {
          const topicsWithSubject = topics.map((topic) => {
            return {
              ...topic,
              subject: topic.subject_id,
            };
          });

          // Group topics by subject name
          const topicsBySubject = topicsWithSubject.reduce((acc, topic) => {
            if (!acc[topic.subject]) {
              acc[topic.subject] = [];
            }
            acc[topic.subject].push(topic);
            return acc;
          }, {});

          return {
            data: {
              subjects,
              topicsBySubject,
              // allTopics: topicsWithSubject,
            },
            error: null,
          };
        }

        // If not found in IndexedDB, fetch from Supabase
        const [subjectsResult, topicsResult] = await Promise.all([
          supabase
            .from("subjects")
            .select(
              "id, name, topics_count, questions_count, created_at, updated_at"
            )
            .order("name"),
          supabase
            .from("topics")
            .select(
              "id, subject_id, name, description, questions_count, created_at, updated_at"
            )
            .order("subject_id, name"),
        ]);

        if (subjectsResult.error) throw subjectsResult.error;
        if (topicsResult.error) throw topicsResult.error;

        // Map topics to include subject name (for compatibility with existing codebase)
        const topicsWithSubject = topicsResult.data.map((topic) => {
          return {
            ...topic,
            subject: topic.subject_id, // Add subject field for compatibility
          };
        });

        // Group topics by subject name
        const topicsBySubject = topicsWithSubject.reduce((acc, topic) => {
          if (!acc[topic.subject]) {
            acc[topic.subject] = [];
          }
          acc[topic.subject].push(topic);
          return acc;
        }, {});

        const configData = {
          subjects: subjectsResult.data,
          topicsBySubject,
          // topics: topicsWithSubject,
        };

        // Save to IndexedDB for next time
        try {
          // Clear existing data first
          await db.subjects.clear();
          await db.topics.clear();

          // Save subjects with new schema format
          await db.subjects.bulkAdd(subjectsResult.data);

          // Save topics with new schema format (without the subject field we added)
          await db.topics.bulkAdd(topicsResult.data);
        } catch (dbError) {
          console.error("Error saving to IndexedDB:", dbError);
          // Continue even if IndexedDB save fails
        }

        return {
          data: configData,
          error: null,
        };
      } catch (error) {
        console.error("Error fetching config data:", error);
        return { data: null, error };
      }
    },
  };
}
