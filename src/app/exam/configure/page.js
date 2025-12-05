"use client";

import ConfigProvider from "./configProvider";
import ExamSelector from "./exam-selector";

export default function Page() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <ConfigProvider>
        <ExamSelector />
      </ConfigProvider>
    </div>
  );
}
