import Dexie from "dexie";

export const db = new Dexie("Atlas");

// Stop thinking like fly...
db.version(1).stores({
  subjects: "id, name, topics_count, question_count, created_at, updated_at",
  topics:
    "id, subject_id, name, description, questions_count, created_at, updated_at",
  questions:
    "id, subject_id, topic_id, question, options, answer, explanation, is_visible, version, created_at, updated_at",
  //   jobs: "id, operation, eid",
});
