import { useContext, useEffect, useState } from "react";
import ExercisesSearch from "../components/ExercisesSearch";
import ExerciseTracker from "../components/ExerciseTracker";
import { v4 as uuid } from 'uuid';
import { toast } from "react-hot-toast";
import Link from "next/link";
import { TemplateContext } from "../lib/TemplateContext";
import { useRouter } from "next/router";

export default function WorkoutPage({ }) {
  const { template, setTemplate } = useContext(TemplateContext);
  const addedExercisesInitialState = Object.keys(template).length !== 0 ?
    template.workouts : [];
  const workoutTitleInitialState = Object.keys(template).length !== 0 ?
    template.templateName : "";
  const [showExercises, setShowExercises] = useState(false);
  const [addedExercises, setAddedExercises] = useState(
    addedExercisesInitialState);
  const [workoutTitle, setWorkoutTitle] = useState(workoutTitleInitialState);
  const router = useRouter();

  const handleCancelWorkout = () => {
    toast.error('Workout Canceled.');
    setTemplate({});
    router.push("/template");
  };

  const handleAddExercise = () => {
    setShowExercises(true);
  };

  const handleAddExerciseClick = (workout) => {
    console.log(workout);
    // console.log(addedExercises);
    setShowExercises(false);
    setAddedExercises(addedExercises.concat({ ...workout, workoutId: uuid() }));
    console.log(addedExercises);
  };

  const handleRemoveExerciseClick = (exercise) => {
    const exerciseArray = [...addedExercises];
    const deleteIndex = exerciseArray.indexOf(exercise);
    console.log(deleteIndex);
    if (deleteIndex !== -1) {
      exerciseArray.splice(deleteIndex, 1);
      setAddedExercises(exerciseArray);
    }
  };

  const handleTitleChange = (e) => {
    console.log(e.target.value);
    setWorkoutTitle(e.target.value);
  };

  const handleWorkoutFinish = () => {
    setWorkoutStarted(false);
  };

  return (
    <main className="container mx-auto">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-4xl font-bold my-2">
          <input
            type="text"
            placeholder="New Workout"
            onChange={handleTitleChange}
            value={workoutTitle}
            className="rounded hover:outline-indigo-500 hover:outline
                ease-in duration-100"
          />
        </h1>
        <button
          className="bg-green-400 rounded px-4 py-2 font-semibold
              shadow hover:bg-green-700 hover:text-white ease-in 
              duration-200"
          onClick={handleWorkoutFinish}
        >
          Finish Workout
        </button>
      </div>
      <Timer />

      {addedExercises.length !== 0 ?
        addedExercises.map((currExercise) => {
          return (
            <div
              key={currExercise.workoutId}
              className="bg-slate-200 shadow rounded px-4 py-1 my-2"
            >
              <ExerciseTracker
                exerciseId={currExercise.id}
                handleRemoveClick={
                  () => handleRemoveExerciseClick(currExercise)
                }
                exerciseSets={currExercise.sets}
              />
            </div>
          );
        })
        :
        <div></div>
      }

      {!showExercises ?
        <button
          onClick={handleAddExercise}
          className="bg-indigo-500 rounded py-2 font-semibold w-1/2 block
              mx-auto text-white mt-8 shadow hover:bg-indigo-700 ease-in
              duration-100"
        >
          Add Workout
        </button>
        :
        <div className="bg-slate-200 rounded">
          <ExercisesSearch
            handleExerciseClick={handleAddExerciseClick}
            isPage={false}
          />
        </div>
      }

      <button
        className="bg-red-400 rounded py-2 my-6 font-semibold block
            mx-auto w-1/2 text-white shadow hover:bg-red-700 ease-in
            duration-100 text-center"
        onClick={handleCancelWorkout}
      >
        Cancel Workout
      </button>
    </main >
  );
}

function Timer() {
  const [elapsedTime, setElapsedTime] = useState(0);

  const refreshTimer = () => {
    setElapsedTime((elapsedTime) => elapsedTime + 1);
  };

  useEffect(() => {
    const timerId = setInterval(refreshTimer, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="bg-slate-200 rounded flex flex-row w-24 justify-center
    font-semibold cursor-default">
      <p>
        {Math.floor((elapsedTime / (60 * 60)) % 24) > 0 ?
          Math.floor((elapsedTime / (60 * 60)) % 24) + ":" : ""}
      </p>
      <p>
        {Math.floor((elapsedTime / 60) % 60) < 10 ?
          ("0" + Math.floor((elapsedTime / 60) % 60)) :
          Math.floor((elapsedTime / 60) % 60)}:
      </p>
      <p>
        {Math.floor(elapsedTime % 60) < 10 ?
          ("0" + Math.floor(elapsedTime % 60)) :
          Math.floor(elapsedTime % 60)}
      </p>
    </div>
  );
}
