import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import ExercisesSearch from "../components/ExercisesSearch";
import { ExercisesContext } from "../lib/ExercisesContext";

export default function WorkoutPage({ }) {
  const { exercises } = useContext(ExercisesContext);
  const [templates, setTemplates] = useState([]);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [addedExercises, setAddedExercises] = useState([]);

  const handleStartWorkout = () => {
    setWorkoutStarted(true);
  };

  const handleEndWorkout = () => {
    setWorkoutStarted(false);
  };

  const handleAddExercise = () => {
    setShowExercises(true);

  };

  const handleAddExerciseClick = (exercise) => {
    setShowExercises(false);
    setAddedExercises(addedExercises.concat(exercise));
  };

  const handleRemoveExerciseClick = (exercise) => {

  };

  return (
    <main className="container mx-auto">
      {!workoutStarted ?
        <>
          <h1 className="text-4xl font-bold">Start Workout</h1>

          <div className="flex flex-col gap-1">
            <h3 className="font-bold">Quick Start</h3>
            <button
              className="bg-indigo-500 text-white px-6 py-1 rounded-md"
              onClick={handleStartWorkout}
            >
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
        </>
        :
        <>
          <h1>New Workout</h1>

          {addedExercises.length !== 0 ?
            addedExercises.map((exercise) => {
              return (
                <div>
                  {exercise}
                  <button className="text-red-500">
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              );
            })
            :
            <div></div>
          }

          {!showExercises ?
            <button
              onClick={handleAddExercise}
              className="bg-blue-400 rounded px-4 py-1 font-semibold"
            >
              Add Workout
            </button>
            :
            <div>
              <ExercisesSearch />
              {/* {exercises.map((exercise) => {
                return (
                  <li
                    key={exercise.id}
                    className="cursor-pointer list-none hover:bg-slate-200 hover:rounded px-2"
                    onClick={(e) => handleAddExerciseClick(exercise.name)}
                  >
                    <p className="font-semibold">{exercise.name}</p>
                    <p>{exercise.muscle}</p>
                  </li>
                );
              })} */}
            </div>
          }


          <button
            onClick={handleEndWorkout}
            className="bg-red-400 rounded px-4 py-1 my-1 font-semibold"
          >
            End Workout
          </button>
        </>

      }
    </main>
  );
}
