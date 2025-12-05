"use client";

import { useContext, useState, useEffect } from "react";
import { ConfigCtx } from "./configProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, BookOpen, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Selection({ selection, index, isLast }) {
  const {
    selections,
    updateSelection,
    removeSelection,
    selectedForMerge,
    toggleMergeSelection,
    subjectsAndTopics,
  } = useContext(ConfigCtx);

  const [isOpen, setIsOpen] = useState(false);
  const [qty, setQty] = useState(selection.qty || 10);

  const canRemove = selections.length > 1;
  const isSelected = selectedForMerge.includes(selection.id);
  const isMerged = selection.type === "m";
  const isExam = selection.type === "e";

  // Update local qty when selection changes
  useEffect(() => {
    setQty(selection.qty || 10);
  }, [selection.qty]);

  const handleQtyChange = (e) => {
    const value = e.target.value;
    // Allow empty string for user to type freely
    if (value === "") {
      setQty("");
      return;
    }
    // Parse and validate
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setQty(numValue);
      updateSelection(selection.id, "qty", numValue);
    }
  };

  // Handle blur to enforce min/max constraints
  const handleQtyBlur = () => {
    if (qty === "" || qty < 1) {
      setQty(10);
      updateSelection(selection.id, "qty", 10);
    } else if (qty > 60) {
      setQty(60);
      updateSelection(selection.id, "qty", 60);
    }
  };

  const handleRemove = () => {
    removeSelection(selection.id);
  };

  const handleSelect = () => {
    if (!isMerged) {
      toggleMergeSelection(selection.id);
    }
  };

  const hasConfiguration = selection.subject_id && selection.topic_id;

  return (
    <div
      className={cn(
        "relative border rounded-lg p-4 transition-colors",
        isSelected && "border-primary bg-accent",
        isMerged && "bg-muted"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Checkbox for merging */}
          {hasConfiguration && !isMerged && (
            <Checkbox checked={isSelected} onCheckedChange={handleSelect} />
          )}

          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium">
                {isMerged
                  ? "Merged Exam"
                  : isExam
                  ? "Exam Mode"
                  : "Exam Configuration"}
              </h4>
              {selection.subject_name && (
                <p className="text-xs text-muted-foreground">
                  {selection.subject_name}
                </p>
              )}
            </div>
          </div>
        </div>

        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Configuration */}
      <div className="space-y-4">
        {/* Subject & Topic Selection */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Course & Topic</Label>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={isMerged}
                className="w-full justify-start text-left h-auto min-h-10"
              >
                {hasConfiguration ? (
                  <div className="flex flex-col items-start w-full">
                    <span className="text-xs text-muted-foreground">
                      {selection.subject_name}
                    </span>
                    <span className="text-sm font-medium">
                      {selection.topic_name}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    Choose Course & Topic
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <SelectionModal
              selectionId={selection.id}
              currentSubjectId={selection.subject_id}
              currentTopicId={selection.topic_id}
              onClose={() => setIsOpen(false)}
            />
          </Dialog>
        </div>

        {/* Merged Topics Display */}
        {isMerged && selection.mergedTopics?.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium">Merged Topics</Label>
            <div className="space-y-1">
              {selection.mergedTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="text-xs p-2 bg-background rounded border"
                >
                  <span className="font-medium">{topic.topic_name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    • {topic.qty} questions
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <Label
            htmlFor={`qty-${selection.id}`}
            className="text-xs font-medium"
          >
            Number of Questions
          </Label>
          <Input
            id={`qty-${selection.id}`}
            type="number"
            min="1"
            max="60"
            value={qty}
            onChange={handleQtyChange}
            onBlur={handleQtyBlur}
            disabled={!hasConfiguration || isMerged}
            placeholder="10"
          />
          <p className="text-xs text-muted-foreground">
            Between 1 and 60 questions
          </p>
        </div>
      </div>
    </div>
  );
}

// Selection Modal Component
function SelectionModal({
  selectionId,
  currentSubjectId,
  currentTopicId,
  onClose,
}) {
  const { updateSelection, subjectsAndTopics } = useContext(ConfigCtx);
  const [step, setStep] = useState(currentSubjectId ? 2 : 1);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentSubjectId && subjectsAndTopics?.data?.subjects) {
      const subject = subjectsAndTopics.data.subjects.find(
        (s) => s.id === currentSubjectId
      );
      if (subject) {
        setSelectedSubject(subject);
        setStep(2);
      }
    }
  }, [currentSubjectId, subjectsAndTopics]);

  if (!subjectsAndTopics?.data) {
    return (
      <DialogContent>
        <div className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DialogContent>
    );
  }

  const { subjects, topicsBySubject } = subjectsAndTopics.data;

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setStep(2);
    setSearchQuery("");
  };

  const handleTopicSelect = (topic) => {
    updateSelection(selectionId, "subject_id", selectedSubject.id);
    updateSelection(selectionId, "subject_name", selectedSubject.name);
    updateSelection(selectionId, "topic_id", topic.id);
    updateSelection(selectionId, "topic_name", topic.name);
    updateSelection(selectionId, "type", topic.isExam ? "e" : "s");
    onClose();
  };

  const handleBack = () => {
    setStep(1);
    setSearchQuery("");
  };

  // Get topics for selected subject
  const availableTopics = selectedSubject
    ? topicsBySubject[selectedSubject.id] || []
    : [];

  // Add exam mode option
  const examTopic = {
    id: `exam_${selectedSubject?.id}`,
    name: "Exam (All Topics)",
    isExam: true,
  };

  const topicsWithExam = selectedSubject
    ? [examTopic, ...availableTopics]
    : availableTopics;

  const filteredTopics = topicsWithExam.filter((topic) =>
    topic.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] mx-4 sm:mx-auto">
      <DialogHeader>
        <DialogTitle>
          {step === 1 ? "Select a Course" : "Choose Your Topic"}
        </DialogTitle>
        <DialogDescription>
          {step === 1
            ? "Pick the course you want to practice"
            : `Select a topic from ${selectedSubject?.name || ""}`}
        </DialogDescription>
      </DialogHeader>

      <div className="overflow-y-auto max-h-[60vh]">
        {step === 1 ? (
          // Subject Selection
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
            {subjects?.map((subject) => (
              <button
                key={subject.id}
                onClick={() => handleSubjectSelect(subject)}
                className="p-4 text-left border rounded-lg hover:border-primary hover:bg-accent transition-colors"
              >
                <h3 className="font-medium">{subject.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {subject.topics_count || 0} topics
                </p>
              </button>
            ))}
          </div>
        ) : (
          // Topic Selection
          <div className="space-y-4">
            <Button variant="ghost" onClick={handleBack} size="sm">
              ← Back to Courses
            </Button>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Topics List */}
            <div className="space-y-2">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicSelect(topic)}
                    className={cn(
                      "w-full p-3 text-left border rounded-lg hover:border-primary hover:bg-accent transition-colors",
                      topic.isExam && "bg-muted border-primary/50",
                      currentTopicId === topic.id && "border-primary bg-accent"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {topic.isExam && (
                        <Sparkles className="h-4 w-4 text-primary" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{topic.name}</p>
                        {topic.isExam && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Random questions from all topics
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No topics found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}
