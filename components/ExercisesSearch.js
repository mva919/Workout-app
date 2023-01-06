import { useState, useEffect, useContext } from "react";
import DropdownButton from "../components/DropdownButton";
import { ExercisesContext } from "../lib/ExercisesContext";
import { BODY_PARTS, EXERCISE_CATEGORIES } from "../lib/constants";


export default function ExercisesSearch({ handleExerciseClick }) {
  const exercises = useContext(ExercisesContext);
  const [searchWorkout, setSearchWorkout] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [category, setCategory] = useState("");
  const [workoutList, setWorkoutList] = useState(exercises);
  const [workoutData, setWorkoutData] = useState(exercises);


  useEffect(() => {
    const filteredWorkouts = searchWorkoutList(
      searchWorkout, bodyPart, category);
    setWorkoutList(filteredWorkouts);
  }, [bodyPart, category]);


  const handleChange = (e) => {
    setSearchWorkout(e.target.value);
    const filteredWorkouts = searchWorkoutList(
      e.target.value, bodyPart, category);
    setWorkoutList(filteredWorkouts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const searchWorkoutList = (searchVal, bodyFilter, categoryFilter) => {
    // converts the first letter of each word to upper case to match with the
    // workouts list and removes any extra spaces.
    console.log(searchVal, bodyFilter, categoryFilter);

    const convertedStr = searchVal.trim().split(/\s+/).map((word) => {
      if (word[0] === undefined) return;
      return word[0].toUpperCase() + word.substring(1);
    }).join(" ");

    console.log(workoutData);
    const resultsArray = workoutData.filter(workout => {
      return workout.muscle.includes(bodyFilter) &&
        workout.equipment.includes(categoryFilter)
        && workout.name.includes(convertedStr);
    });
    console.log(resultsArray);

    return resultsArray;
  };


  return (
    <div className="text-center rounded shadow py-4 my-2">
      <form onSubmit={handleSubmit}>
        <input
          className="bg-slate-50 my-4 rounded px-2 py-2 w-1/2"
          type="text"
          placeholder="Search"
          id="search"
          value={searchWorkout}
          onChange={handleChange}
        />
      </form>

      <div className="flex flex-row items-start justify-center gap-2">
        <DropdownButton
          dropdownOptions={EXERCISE_CATEGORIES}
          buttonName="Any Category"
          selectedCategory={btnCategory => setCategory(btnCategory)}
        />
        <DropdownButton
          dropdownOptions={BODY_PARTS}
          buttonName="Any Body Part"
          selectedCategory={btnBodyPart => setBodyPart(btnBodyPart)}
        />
      </div>

      <ul className="flex flex-col items-start mx-auto bg-slate-50 w-1/2
        shadow-sm rounded"
      >
        {/* ready state, displaying json data */}
        {workoutList.map((workout) => {
          return (
            <li
              key={workout.id}
              className="cursor-pointer flex flex-col items-start
              justify-center px-4 py-1 border-b border-slate-200 w-full 
              hover:bg-slate-100 hover:rounded"
              onClick={(e) => handleExerciseClick(workout)}
            >
              <p className="font-semibold">{workout.name}</p>
              <p>{workout.muscle}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
