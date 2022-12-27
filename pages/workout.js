import { useState } from "react";

export default function WorkoutPage({ }) {
  const [templates, setTemplates] = useState([]);
  return (
    <main className="container mx-auto">
      <h1 className="text-4xl font-bold">Start Workout</h1>

      <div className="flex flex-col gap-1">
        <h3 className="font-bold">Quick Start</h3>
        <button className="bg-indigo-500 text-white px-6 py-1 rounded-md">
          Start an Empty Workout
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold">Templates</h2>
        <div className="flex flex-row justify-between">
          <h3 className="font-bold">
            My templates ({templates.length})
          </h3>
          <button className="bg-slate-200 rounded-md px-2 py-1">
            + Template
          </button>
        </div>

      </div>


    </main>
  );
}
