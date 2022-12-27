import { useState, useEffect } from "react";
import useSWR from "swr";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import DropdownButton from "../components/DropdownButton";

// wraps a native fetch function and return the result of a call to url in json
const fetcher = (url) => fetch(url).then((res) => res.json());

const EXERCISE_CATEGORIES = ["Barbell", "Dumbbell", "Machine/Other",
  "Weighted Bodyweight", "Assisted Bodyweight", "Reps Only", "Cardio",
  "Duration"];

export default function ExercisesPage({ }) {
  // const { data, error } = useSWR("/api/staticdata", fetcher);
  const [searchWorkout, setSearchWorkout] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [category, setCategory] = useState("");
  const [workoutList, setWorkoutList] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);

  useEffect(() => {
    fetch("/api/staticdata")
      .then((res) => res.json())
      .then(data => {
        setWorkoutData(JSON.parse(data));
        setWorkoutList(JSON.parse(data))
      });
  }, []);

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
    <main className="container mx-auto">
      <h1 className="text-4xl font-bold">
        Exercises
      </h1>
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
        <DropdownButton
          dropdownOptions={EXERCISE_CATEGORIES}
          buttonName="Any Category"
          selectedCategory={btnCategory => setCategory(btnCategory)}
        />
        <p>{category}</p>
      </form>

      <div className="flex flex-row gap-2">
        <button className="bg-slate-200 px-2 py-1 rounded">
          Any Body Part
        </button>
        <button className="bg-slate-200 px-2 py-1 rounded">
          Any Category
        </button>
      </div>

      <ul>
        {/* ready state, displaying json data */}
        {workoutList.map((workout) => {
          return (
            <li key={workout.id} className="">
              <p className="font-semibold">{workout.name}</p>
              <p>{workout.muscle}</p>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
