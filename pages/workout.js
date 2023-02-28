import { useContext, useEffect, useState } from "react";
import ExercisesSearch from "../components/ExercisesSearch";
import ExerciseTracker from "../components/ExerciseTracker";
import { v4 as uuid } from 'uuid';
import { toast } from "react-hot-toast";
import { TemplateContext } from "../lib/TemplateContext";
import { useRouter } from "next/router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { UserContext } from "../lib/UserContext";
import { ExercisesContext } from "../lib/ExercisesContext";

export default function WorkoutPage({ }) {
  const defaultExercises = useContext(ExercisesContext);
  const { user, customExercises } = useContext(UserContext);
  const { template, setTemplate } = useContext(TemplateContext);
  const addedExercisesInitialState = Object.keys(template).length !== 0 ?
    template.exercises : [];
  const workoutTitleInitialState = Object.keys(template).length !== 0 ?
    template.title : "";
  const [showExercises, setShowExercises] = useState(false);
  const [addedExercises, setAddedExercises] = useState(
    addedExercisesInitialState);
  const [workoutTitle, setWorkoutTitle] = useState(workoutTitleInitialState);
  const router = useRouter();
  const [workoutDuration, setWorkoutDuration] = useState(0);

  const handleCancelWorkout = () => {
    toast.error('Workout Canceled.');
    setTemplate({});
    router.push("/template");
  };

  const handleAddExercise = () => {
    setShowExercises(true);
  };

  const handleAddExerciseClick = (exercises) => {
    const filteredExercises = exercises.map(exercise => {
      return { ...exercise.workout, exerciseId: uuid() }
    });
    setAddedExercises(prevExercises =>
      [...prevExercises, ...filteredExercises]);
    setShowExercises(false);
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

  const handleExerciseChange = (sets, exerciseUid) => {
    let prevExercises = [...addedExercises];
    const exerciseIndex = prevExercises.findIndex(exercise =>
      exercise.exerciseId === exerciseUid);
    const selectedExercise = addedExercises[exerciseIndex];
    selectedExercise.sets = sets;
    prevExercises[exerciseIndex] = selectedExercise;
    setAddedExercises(prevExercises);
  };

  const handleWorkoutFinish = () => {
    console.log(addedExercises);
    updateExistingDoc();
    router.push("/template");
    toast.success("Workout completed");
    setTemplate({});
  };

  const updateExistingDoc = async () => {
    const userDoc = doc(firestore, "users", user.uid);

    await updateDoc(userDoc, {
      previousWorkouts: arrayUnion({
        title: workoutTitle === "" ? "New Workout" : workoutTitle,
        exercises: addedExercises,
        templateId: uuid(),
        dateCompleted: new Date().toISOString(),
        workoutDuration: workoutDuration
      })
    }).then(() => {
      console.log("Write to firestore. Added new workout session for user.");
    }).catch(error => {
      console.log(error);
    });
  };

  return (
    <main className="container mx-auto px-1">
      <div className="flex flex-col items-start md:flex-row md:justify-between 
      md:items-center mb-2 gap-x-4">
        <input
          type="text"
          placeholder="New Workout"
          onChange={handleTitleChange}
          value={workoutTitle}
          className="rounded hover:outline-indigo-500 hover:outline ease-in
          duration-100 text-xl md:text-4xl font-bold my-2 w-full md:flex-1"
        />
        <button
          className="bg-green-400 rounded px-4 py-2 font-semibold
              shadow hover:bg-green-700 hover:text-white ease-in 
              duration-200"
          onClick={handleWorkoutFinish}
        >
          Finish Workout
        </button>
      </div>
      <Timer update={setWorkoutDuration} />

      {addedExercises.length !== 0 ?
        addedExercises.map((currExercise) => {
          return (
            <div
              key={currExercise.exerciseId}
              className="bg-slate-200 shadow rounded w-full py-1 my-2 px-1"
            >
              <ExerciseTracker
                uid={currExercise.exerciseId}
                exerciseId={currExercise.id}
                handleRemoveClick={
                  () => handleRemoveExerciseClick(currExercise)
                }
                exerciseSets={currExercise.sets}
                previewMode={false}
                updateSets={handleExerciseChange}
                exercises={[...defaultExercises, ...customExercises]}
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
        <div className="bg-slate-200 rounded h-[32rem]">
          <ExercisesSearch
            handleAddClick={handleAddExerciseClick}
            isPage={false}
            displayComponent={setShowExercises}
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

function Timer({ update }) {
  const [elapsedTime, setElapsedTime] = useState(0);

  const refreshTimer = () => {
    setElapsedTime((elapsedTime) => {
      update(elapsedTime);
      return elapsedTime + 1
    });
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
