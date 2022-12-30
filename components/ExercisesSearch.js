import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import DropdownButton from "../components/DropdownButton";
import { ExercisesContext } from "../lib/ExercisesContext";
import { BODY_PARTS, EXERCISE_CATEGORIES } from "../lib/constants";


export default function ExercisesSearch({ handleExerciseClick }) {
  const { exercises } = useContext(ExercisesContext);
  const [searchWorkout, setSearchWorkout] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [category, setCategory] = useState("");
  const [workoutList, setWorkoutList] = useState(exercises);
  const [workoutData, setWorkoutData] = useState(exercises);

  const handleChange = (e) => {
    setSearchWorkout(e.target.value);
    // converts the first letter of each word to upper case to match with the
    // workouts list and removes any extra spaces.
    const convertedStr = e.target.value.trim().split(/\s+/).map((word) => {
      if (word[0] === undefined) return;
      return word[0].toUpperCase() + word.substring(1);
    }).join(" ");

    const resultsArray = workoutData.filter(workout =>
      workout.name.includes(convertedStr));

    setWorkoutList(resultsArray);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="bg-slate-200 my-4 rounded px-2 py-1"
          type="text"
          placeholder="Search"
          id="search"
          value={searchWorkout}
          onChange={handleChange}
        />

        <button>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>

        <p>{category}</p>
        <p>{bodyPart}</p>
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

      <ul>
        {/* ready state, displaying json data */}
        {workoutList.map((workout) => {
          return (
            <li
              key={workout.id}
              className="cursor-pointer"
              onClick={(e) => handleExerciseClick(workout)}
            >
              <p className="font-semibold">{workout.name}</p>
              <p>{workout.muscle}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
