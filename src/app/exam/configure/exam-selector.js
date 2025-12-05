"use client";

import { useContext } from "react";
import { ConfigCtx } from "./configProvider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Play, AlertCircle } from "lucide-react";
import Selection from "./selector";

export default function ExamSelector() {
  const {
    selections,
    addSelection,
    selectedForMerge,
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
  } = useContext(ConfigCtx);

  const canMerge = selectedForMerge.length >= 2;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Configure Your Exam</h1>
        <p className="text-sm text-muted-foreground">
          Set up your practice session with custom topics and preferences
        </p>
      </div>

      {/* Selections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Exam Configurations</h2>
          <span className="text-sm text-muted-foreground">
            {selections.length} {selections.length === 1 ? "exam" : "exams"}
            {selectedForMerge.length > 0 &&
              ` • ${selectedForMerge.length} selected`}
          </span>
        </div>

        {/* Merge Banner */}
        {canMerge && (
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg border">
            <div>
              <p className="font-medium">Merge Selected Exams</p>
              <p className="text-sm text-muted-foreground">
                Combine {selectedForMerge.length} exams into one
              </p>
            </div>
            <Button onClick={mergeSelections} size="sm">
              Merge Now
            </Button>
          </div>
        )}

        {/* Selection Cards */}
        <div className="space-y-3">
          {selections.map((selection, index) => (
            <Selection
              key={selection.id}
              selection={selection}
              index={index}
              isLast={index === selections.length - 1}
            />
          ))}
        </div>

        {/* Add Button */}
        <Button
          variant="outline"
          onClick={addSelection}
          className="w-full border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Exam
        </Button>
      </div>

      <Separator />

      {/* Options */}
      <div className="space-y-6">
        {/* Time Settings */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Time Limit</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours" className="text-sm">
                Hours
              </Label>
              <Input
                id="hours"
                type="number"
                min="0"
                placeholder="0"
                value={time.hour || ""}
                onChange={(e) =>
                  setTime((draft) => {
                    draft.hour = parseInt(e.target.value) || 0;
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minutes" className="text-sm">
                Minutes
              </Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                placeholder="0"
                value={time.minute || ""}
                onChange={(e) =>
                  setTime((draft) => {
                    draft.minute = parseInt(e.target.value) || 0;
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <h3 className="text-base font-medium">Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="instant"
                checked={markInstantly}
                onCheckedChange={(checked) => setMarkInstantly(checked)}
              />
              <Label
                htmlFor="instant"
                className="text-sm font-normal cursor-pointer"
              >
                Mark answers instantly
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="negative"
                checked={negativeMarking}
                onCheckedChange={(checked) => setNegativeMarking(checked)}
              />
              <Label
                htmlFor="negative"
                className="text-sm font-normal cursor-pointer"
              >
                Enable negative marking
              </Label>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Start Button */}
        <Button
          onClick={startExam}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting Exam...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Exam
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
