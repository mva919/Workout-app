import { useState } from "react";

export default function ExerciseTracker({ exercise }) {
  const [sets, setSets] = useState([]);

  const handleClick = () => {
    setSets(sets.concat());
  };

  const handleSetChange = (e, index) => {

  };

  const handleRepChange = (e, index) => {

  };

  return (
    <>
      <h2 className="font-bold">{exercise.name}</h2>

      <div className="flex flex-row gap-1">
        <div>
          <h3 className="font-semibold">Sets</h3>
          {sets.map((set, index) => {
            return (
              <input type="text" value={index + 1} />
            );
          })}
        </div>
        <div>
          <h3 className="font-semibold">lbs</h3>
          {sets.map((set, index) => {
            return (
              <input
                type="text"
                placeholder="0"
                value={sets[index].weight}
              />
            );
          })}
        </div>
        <div>
          <h3 className="font-semibold">Reps</h3>
          {sets.map((set, index) => {
            return (
              <input
                type="text"
                placeholder="0"
                value={sets[index].reps}
                onChange={(e, index) => handleSetChange(e, index)}
              />
            );
          })}
        </div>
      </div>

      <button
        className="bg-slate-200 px-2 py-1 rounded"
        onClick={handleClick}
      >
        + Add Set
      </button>
    </>
  );
}