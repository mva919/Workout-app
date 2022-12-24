import { useState } from "react";

export default function WorkoutPage({ }) {
  const [templates, setTemplates] = useState([]);
  return (
    <>
      <h1>Start Workout</h1>

      <div>
        <h3>Quick Start</h3>
        <button>Start an Empty Workout</button>
      </div>

      <div>
        <h2>Templates</h2>
        <div>
          <h3>My templates ({templates.length})</h3>
          <button>+ Template</button>
        </div>

      </div>


    </>
  );
}