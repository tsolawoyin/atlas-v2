"use client";

import { createContext, useContext } from "react";
import { useImmer } from "use-immer";
import { v4 } from "uuid";
import { ShellContext } from "@/shell/shell";

export const ConfigCtx = createContext();

export default function ConfigProvider({ children }) {
  const { subjectsAndTopics } = useContext(ShellContext);

  // Selections state
  const [selections, setSelections] = useImmer([
    {
      id: v4(),
      type: "s", // s=single, m=merged, e=exam mode
      subject_id: "",
      subject_name: "",
      topic_id: "",
      topic_name: "",
      qty: 10,
      mergedTopics: [], // Only for merged type
    },
  ]);

  // Selected exams for merging
  const [selectedForMerge, setSelectedForMerge] = useImmer([]);

  // Exam options
  const [time, setTime] = useImmer({ hour: 0, minute: 0 });
  const [markInstantly, setMarkInstantly] = useImmer(true);
  const [negativeMarking, setNegativeMarking] = useImmer(false);

  // Error state
  const [error, setError] = useImmer(null);

  // Loading state
  const [loading, setLoading] = useImmer(false);

  // Add a new selection
  function addSelection() {
    setSelections((draft) => {
      draft.push({
        id: v4(),
        type: "s",
        subject_id: "",
        subject_name: "",
        topic_id: "",
        topic_name: "",
        qty: 10,
        mergedTopics: [],
      });
    });
  }

  // Update a selection property
  function updateSelection(id, property, value) {
    setSelections((draft) => {
      const selection = draft.find((s) => s.id === id);
      if (selection) {
        selection[property] = value;
      }
    });
  }

  // Remove a selection
  function removeSelection(id) {
    setSelections((draft) => draft.filter((s) => s.id !== id));
    setSelectedForMerge((draft) => draft.filter((sid) => sid !== id));
  }

  // Toggle selection for merging
  function toggleMergeSelection(id) {
    setSelectedForMerge((draft) => {
      const index = draft.indexOf(id);
      if (index > -1) {
        draft.splice(index, 1);
      } else {
        draft.push(id);
      }
    });
  }

  // Merge selected exams
  function mergeSelections() {
    if (selectedForMerge.length < 2) {
      setError("Please select at least 2 exams to merge");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setSelections((draft) => {
      const toMerge = draft.filter((s) => selectedForMerge.includes(s.id));

      // Check if all selected have valid subjects and topics
      const invalidSelections = toMerge.filter(
        (s) => !s.subject_id || !s.topic_id
      );
      if (invalidSelections.length > 0) {
        setError("All selected exams must have a subject and topic configured");
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Check if all from same subject
      const subjects = [...new Set(toMerge.map((s) => s.subject_id))];
      if (subjects.length > 1) {
        setError("Can only merge exams from the same subject");
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Create merged exam
      const totalQty = toMerge.reduce((sum, s) => sum + (s.qty || 10), 0);
      const mergedTopics = toMerge.map((s) => ({
        subject_id: s.subject_id,
        subject_name: s.subject_name,
        topic_id: s.topic_id,
        topic_name: s.topic_name,
        qty: s.qty || 10,
      }));

      const merged = {
        id: v4(),
        type: "m",
        subject_id: toMerge[0].subject_id,
        subject_name: toMerge[0].subject_name,
        topic_id: `merged_${v4()}`,
        topic_name: `Merged: ${toMerge.length} topics`,
        qty: Math.min(totalQty, 60),
        mergedTopics,
      };

      // Remove merged selections and add new merged one
      const remaining = draft.filter((s) => !selectedForMerge.includes(s.id));
      remaining.push(merged);

      return remaining;
    });

    setSelectedForMerge([]);
  }

  // Start exam (placeholder)
  function startExam() {
    setLoading(true);

    // Validate: at least one valid selection
    const validSelections = selections.filter(
      (s) => s.subject_id && s.topic_id
    );

    if (validSelections.length === 0) {
      setError("Please configure at least one exam to start");
      setLoading(false);
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Validate time
    if (!time.hour && !time.minute) {
      setError("Please set a time limit for the exam");
      setLoading(false);
      setTimeout(() => setError(null), 3000);
      return;
    }

    // TODO: Create exam session and navigate
    console.log("Starting exam with:", {
      selections: validSelections,
      time,
      markInstantly,
      negativeMarking,
    });

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      // router.push('/exam/...')
    }, 2000);
  }

  return (
    <ConfigCtx.Provider
      value={{
        selections,
        addSelection,
        updateSelection,
        removeSelection,
        selectedForMerge,
        toggleMergeSelection,
        mergeSelections,
        time,
        setTime,
        markInstantly,
        setMarkInstantly,
        negativeMarking,
        setNegativeMarking,
        error,
        loading,
        startExam,
        subjectsAndTopics,
      }}
    >
      {children}
    </ConfigCtx.Provider>
  );
}
