import { useContext, useState } from "react";
import ExercisesSearch from "../components/ExercisesSearch";
import ExerciseTracker from "../components/ExerciseTracker";
import { v4 as uuid } from 'uuid';
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import { UserContext } from "../lib/UserContext";
import { ExercisesContext } from "../lib/ExercisesContext";

export default function NewTemplatePage({ }) {
  const { user, customExercises } = useContext(UserContext);
  const defaultExercises = useContext(ExercisesContext);
  const [showExercises, setShowExercises] = useState(false);
  const [addedExercises, setAddedExercises] = useState([]);
  const [workoutTitle, setWorkoutTitle] = useState("");
  const router = useRouter();

  const handleCancelTemplate = () => {
    toast.error('Template Creation Canceled.');
    router.push("/template");
  };

  const handleAddExercise = () => {
    setShowExercises(true);
  };

  const handleAddExerciseClick = (exercises) => {
    const filteredExercises = exercises.map(exercise => {
      return {
        ...exercise.workout,
        exerciseId: uuid(),
        sets: [{
          weight: "",
          reps: "",
          completed: false,
          setId: uuid(),
          setType: "normal"
        }]
      }
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

  const handleSaveTemplate = () => {
    console.log(addedExercises);
    console.log(user.uid);

    const userDoc = doc(firestore, "users", user.uid);
    console.log(userDoc);

    updateExistingDoc();
    router.push("/template");
  }

  const updateExistingDoc = async () => {
    const userDoc = doc(firestore, "users", user.uid);

    await updateDoc(userDoc, {
      templates: arrayUnion({
        title: workoutTitle === "" ? "New Workout" : workoutTitle,
        exercises: addedExercises,
        templateId: uuid()
      })
    }).then(() => {
      console.log("Write to firestore. Added new template to user.");
    }).catch(error => {
      console.log(error);
    });
  };

  const handleUpdateSets = (updatedSets, index) => {
    console.log(updatedSets, index);
    const exerciseArray = [...addedExercises];
    const exercise = exerciseArray[index];
    exercise.sets = updatedSets;
    exerciseArray[index] = exercise;
    setAddedExercises(exerciseArray);
    console.log(addedExercises);
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
          className="bg-green-500 rounded px-2 py-1 md:py-2 font-semibold
              shadow hover:bg-green-700 text-white ease-in 
              duration-200"
          onClick={handleSaveTemplate}
        >
          Save Template
        </button>
      </div>

      {addedExercises.length !== 0 ?
        addedExercises.map((currExercise, exerciseIndex) => {
          return (
            <div
              key={currExercise.workoutId}
              className="bg-slate-200 shadow rounded px-4 py-1 my-2"
            >
              <ExerciseTracker
                uid={currExercise.exerciseId}
                exerciseId={currExercise.id}
                handleRemoveClick={
                  () => handleRemoveExerciseClick(currExercise)
                }
                exerciseSets={currExercise.sets}
                previewMode={true}
                updateSets={
                  (updatedSet) => handleUpdateSets(updatedSet, exerciseIndex)
                }
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
        <div className="bg-slate-200 rounded">
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
        onClick={handleCancelTemplate}
      >
        Cancel Template
      </button>
    </main >
  );
}
