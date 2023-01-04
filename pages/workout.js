import { useContext, useEffect, useState } from "react";
import ExercisesSearch from "../components/ExercisesSearch";
import ExerciseTracker from "../components/ExerciseTracker";
import { ExercisesContext } from "../lib/ExercisesContext";
import { v4 as uuid } from 'uuid';
import toast, { Toaster } from "react-hot-toast";
import { useDefaultTemplates, useExercisesData } from "../lib/hooks";

export default function WorkoutPage({ }) {
  const defaultTemplates = useDefaultTemplates();
  const [templates, setTemplates] = useState([]);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [addedExercises, setAddedExercises] = useState([]);
  const [workoutTitle, setWorkoutTitle] = useState("");
  const exercises = useContext(ExercisesContext);

  const handleStartWorkout = () => {
    setWorkoutStarted(true);
  };

  const handleCancelWorkout = () => {
    toast.error('Workout Canceled.');
    setWorkoutStarted(false);
  };

  const handleAddExercise = () => {
    setShowExercises(true);
  };

  const handleAddExerciseClick = (exercise) => {
    setShowExercises(false);
    setAddedExercises(addedExercises.concat({ ...exercise, uid: uuid() }));
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
      {!workoutStarted ?
        <>
          <h1 className="text-4xl font-bold mb-6">Start Workout</h1>

          <div className="flex flex-col gap-1 mb-4">
            <h2 className="font-bold text-xl">Quick Start</h2>
            <button
              className="bg-indigo-500 text-white py-2 rounded-md mx-1
              font-semibold hover:bg-indigo-700 ease-in duration-100"
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
              <button className="bg-slate-200 rounded-md px-4 py-1 
              hover:bg-indigo-500 hover:text-white ease-in duration-200">
                + Template
              </button>
            </div>

            <h3 className="font-bold">
              Example templates ({defaultTemplates.length})
            </h3>

            <div className="my-4">
              {defaultTemplates.map((template, index) => {
                return (
                  <TemplatePreview
                    key={index}
                    title={template.templateName}
                    workouts={template.workouts}
                    exercisesData={exercises}
                  />
                );
              })}
            </div>


          </div>
        </>
        :
        <>
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
                <div key={currExercise.uid} className="bg-slate-200 shadow rounded px-4 py-1 my-2">
                  <ExerciseTracker
                    exercise={currExercise}
                    handleRemoveClick={
                      () => handleRemoveExerciseClick(currExercise)
                    }
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
              mx-auto text-white my-1 shadow hover:bg-indigo-700 ease-in
              duration-100"
            >
              Add Workout
            </button>
            :
            <div>
              <ExercisesSearch handleExerciseClick={handleAddExerciseClick} />
            </div>
          }

          <button
            onClick={handleCancelWorkout}
            className="bg-red-400 rounded py-2 my-6 font-semibold block
            mx-auto w-1/2 text-white shadow hover:bg-red-700 ease-in
            duration-100"
          >
            Cancel Workout
          </button>
        </>

      }
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </main>
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

function TemplatePreview({ title, workouts, exercisesData }) {

  return (
    <div className="bg-slate-200 shadow w-1/4 p-2 rounded">
      <h1 className="font-semibold">{title}</h1>
      {workouts.map((workout, index) => {
        return (
          <div key={index}>
            <h2>
              {`${workout.sets.length} x 
              ${exercisesData.find((exercise) =>
                exercise.id === workout.workoutId).name}
              `}
            </h2>
          </div>
        );
      })}
    </div>
  );
}
