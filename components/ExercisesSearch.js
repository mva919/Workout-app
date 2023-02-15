import { useState, useEffect, useContext, useRef } from "react";
import { ExercisesContext } from "../lib/ExercisesContext";
import { BODY_PARTS, EXERCISE_CATEGORIES } from "../lib/constants";
import { useOutsideClick } from "../lib/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { v4 as uuid } from 'uuid';
import { firestore } from "../lib/firebase";
import { UserContext } from "../lib/UserContext";

export default function ExercisesSearch({ handleAddClick, isPage,
  displayComponent }) {
  const { user, customExercises } = useContext(UserContext);
  const exercises = useContext(ExercisesContext);
  const [userExercises, setUserExercises] =
    useState([...exercises, ...customExercises]);
  const [searchWorkout, setSearchWorkout] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [category, setCategory] = useState("");
  const [workoutList, setWorkoutList] = useState(userExercises);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);

  useEffect(() => {
    const filteredWorkouts = searchWorkoutList(
      searchWorkout, bodyPart, category);
    setWorkoutList(filteredWorkouts);
  }, [bodyPart, category, userExercises]);

  const handleChange = (e) => {
    setSearchWorkout(e.target.value);
    const filteredWorkouts = searchWorkoutList(
      e.target.value, bodyPart, category);
    setWorkoutList(filteredWorkouts);
  };

  const handleClick = (workout, index) => {
    let oldArray = [...selectedWorkouts];
    const itemIndex = oldArray.findIndex(selectedWorkout =>
      selectedWorkout.index === index);

    if (itemIndex !== -1) {
      oldArray.splice(itemIndex, 1);
      setSelectedWorkouts(oldArray);
    } else {
      const newWorkout = { workout: workout, index: index };
      setSelectedWorkouts(oldWorkouts => [...oldWorkouts, newWorkout]);
    }
    console.log(selectedWorkouts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleNewWorkout = () => {
    setShowCreateWorkout(true);
  };

  const searchWorkoutList = (searchVal, bodyFilter, categoryFilter) => {
    // converts the first letter of each word to upper case to match with the
    // workouts list and removes any extra spaces.
    const convertedStr = searchVal.trim().split(/\s+/).map((word) => {
      if (word[0] === undefined) return;
      return word[0].toUpperCase() + word.substring(1);
    }).join(" ");

    console.log(userExercises);
    const resultsArray = userExercises.filter(workout => {
      return workout.muscle.includes(bodyFilter) &&
        workout.equipment.includes(categoryFilter)
        && workout.name.includes(convertedStr);
    });

    return resultsArray;
  };

  return (
    <div className="text-center rounded py-4 my-2 h-full relative">

      {!isPage && !showCreateWorkout &&
        <div className="flex justify-between px-6 items-center">
          <FontAwesomeIcon icon={faXmark}
            className="text-red-600 text-3xl hover:text-red-700"
            onClick={(e) => displayComponent(false)}
          />
          <div className="flex flex-row items-center gap-6">
            <button
              className="bg-indigo-500 text-white px-4 py-1 rounded
              enabled:hover:bg-indigo-700 ease-in duration-100
              disabled:bg-slate-300 disabled:text-slate-400"
              onClick={handleNewWorkout}
              disabled={!user}
            >
              New Workout
            </button>
            <button
              className="bg-indigo-500 text-white px-4 py-1 rounded
              enabled:hover:bg-indigo-700 ease-in duration-100 
              disabled:opacity-75"
              disabled={selectedWorkouts.length === 0}
              onClick={(e) => handleAddClick(selectedWorkouts)}
            >
              {selectedWorkouts.length === 0 ? "Add Workout" :
                selectedWorkouts.length > 1 ?
                  `Add (${selectedWorkouts.length}) workouts` :
                  `Add (${selectedWorkouts.length}) workout`
              }
            </button>
          </div>
        </div>
      }

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <div className="flex flex-col items-start justify-center w-1/2">
            {isPage &&
              <button
                className="bg-indigo-500 text-white px-4 py-1 rounded
                enabled:hover:bg-indigo-700 ease-in duration-100 
                disabled:bg-slate-200 disabled:text-slate-400"
                onClick={handleNewWorkout}
                disabled={!user}
              >
                New Workout
              </button>
            }
            <input
              className={`my-4 rounded px-2 py-2 w-full 
            ${isPage ? "bg-slate-200" : "bg-slate-50"}`}
              type="text"
              placeholder="Search"
              id="search"
              value={searchWorkout}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>

      <div className="flex flex-row items-start justify-center gap-2">
        <DropdownButton
          dropdownOptions={EXERCISE_CATEGORIES}
          buttonName="Any Category"
          selectedCategory={setCategory}
          isDark={isPage}
        />
        <DropdownButton
          dropdownOptions={BODY_PARTS}
          buttonName="Any Body Part"
          selectedCategory={setBodyPart}
          isDark={isPage}
        />
      </div>

      <div className="absolute w-full bg-blue-100">

        {showCreateWorkout &&

          <div className="flex justify-center z-10 my-4">
            <WorkoutCreator
              isPage={isPage}
              showComponent={setShowCreateWorkout}
              refreshExercises={setUserExercises}
            />
          </div>
        }
      </div>

      <div className="h-full">
        <ul
          className={`flex flex-col items-start mx-auto w-1/2 shadow-sm rounded
          overflow-y-scroll h-2/3 ${isPage ? "bg-slate-200" : "bg-slate-50"}
          `}
        >
          {/* ready state, displaying json data */}
          {workoutList.length !== 0 ? workoutList.map((workout, index) => {
            return (
              <li
                key={workout.id}
                className={`cursor-pointer px-4 py-1 border-b w-full 
                hover:rounded flex flex-row justify-between items-center
                ${isPage ? "border-slate-300" : "border-slate-200"}
                ${selectedWorkouts.find(elem => elem.index === index)
                    !== undefined ?
                    "bg-indigo-500 text-white hover:bg-indigo-700" :
                    "hover:bg-slate-300"
                  }
                `
                }
                onClick={(e) => { if (!isPage) handleClick(workout, index) }}
              >
                <div className=" flex flex-col items-start justify-center">
                  <p className="font-semibold">{workout.name}</p>
                  <p>{workout.muscle}</p>
                </div>
                {selectedWorkouts.find(elem => elem.index === index) !==
                  undefined && <FontAwesomeIcon icon={faCheck} />
                }

              </li>
            );
          }) :
            <h3 className="mx-auto py-2 font-semibold text-slate-500">
              No results
            </h3>
          }
        </ul>
      </div>
    </div >
  );
}

function DropdownButton({ dropdownOptions, buttonName,
  selectedCategory, isDark }) {
  const [toggle, setToggle] = useState(false);
  const [buttonText, setButtonText] = useState(buttonName);
  const ref = useRef();

  useOutsideClick(ref, () => {
    setToggle(false);
  });

  const handleToggle = () => setToggle(!toggle);
  const handleClick = (option) => {
    setToggle(!toggle);
    if (option === buttonText) {
      setButtonText(buttonName);
      selectedCategory("");
      return;
    }
    setButtonText(option);
    selectedCategory(option);
  };

  return (
    <div
      ref={ref}
      className="flex flex-col items-start content-center my-2 relative"
    >
      <button
        onClick={handleToggle}
        className={`px-2 py-2 rounded focus:outline 
        focus:outline-blue-700 w-64 ease-in duration-300
        hover:bg-indigo-500 hover:text-white
        ${isDark ? "bg-slate-200" : "bg-slate-50"}`}
      >
        {buttonText}
      </button>
      {toggle &&
        <div
          className={`rounded list-none my-1 px-2 py-1 w-64 absolute top-full 
          drop-shadow-xl ${isDark ? "bg-slate-200" : "bg-slate-50"}`}
        >
          {dropdownOptions.map((option, index) => {
            return (
              <li
                key={index}
                onClick={(e) => handleClick(option)}
                className={`cursor-pointer my-1 rounded 
                ${isDark ? "hover:bg-slate-300" : "hover:bg-slate-200"}`}
              >
                {option}
              </li>
            );
          })}
        </div>
      }
    </div>
  );
}

function WorkoutCreator({ isPage, showComponent, refreshExercises }) {
  const [category, setCategory] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const { user } = useContext(UserContext);

  const handleChange = (e) => {
    setExerciseName(e.target.value);
  };

  const handleSave = () => {
    console.log(category, bodyPart, exerciseName);
    if (exerciseName === "") {
      toast.error("Exercise name can not be empty.");
      return;
    }
    if (category === "" || bodyPart === "") {
      toast.error("Must select a category and body part.");
      return;
    }
    updateExistingDoc();
    showComponent(false);
  };

  const updateExistingDoc = async () => {
    const userDoc = doc(firestore, "users", user.uid);

    const newExercise = {
      id: uuid(),
      name: exerciseName,
      muscle: bodyPart,
      equipment: category
    };

    await updateDoc(userDoc, {
      customExercises: arrayUnion(newExercise)
    }).then(() => {
      console.log("Write to firestore. Added new custom exercise for user.");
    }).catch(error => {
      console.log(error);
    });

    refreshExercises(prevExercises => [...prevExercises, newExercise]);
  };


  return (
    <div className={`rounded shadow px-4 py-2 
    ${isPage ? "bg-slate-200" : "bg-slate-50"}`}
    >
      <div className="flex flex-row justify-between py-4">
        <FontAwesomeIcon
          icon={faXmark}
          className={`text-xl px-2 py-1 rounded hover:bg-red-500 
          hover:text-white ease-in duration-150
          ${isPage ? "bg-slate-50" : "bg-slate-200"}`}
          onClick={(e) => showComponent(false)}
        />
        <h1 className="font-bold">Create New Exercise</h1>
        <button
          className="font-semibold disabled:text-gray-500"
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      <input
        type="text"
        className={`rounded my-4 px-2 py-2 w-full 
          ${!isPage ? "bg-slate-200" : "bg-slate-50"}`}
        value={exerciseName}
        onChange={(e) => handleChange(e)}
      />
      <div className="flex flex-row items-start justify-center gap-2">
        <DropdownButton
          dropdownOptions={EXERCISE_CATEGORIES}
          buttonName="Any Category"
          selectedCategory={setCategory}
          isDark={!isPage}
        />
        <DropdownButton
          dropdownOptions={BODY_PARTS}
          buttonName="Any Body Part"
          selectedCategory={setBodyPart}
          isDark={!isPage}
        />
      </div>
    </div>
  );
}
