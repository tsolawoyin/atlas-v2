// This will be a client component
import ConfigProvider from "./configProvider";
import ExamSelector from "./exam-selector";

export default function Page() {
  return (
    <div className="py-3">
      <div>
        <h3 className="text-2xl text-center">Configure Your Exam</h3>
      </div>
      <ConfigProvider>
        {/* <Selector /> */}
        <ExamSelector />
      </ConfigProvider>
    </div>
  );
}

// what if I need a function on the backend?
// hmmm...
// I don't think this thing I'm doing will help on the long run...
