import { faCheck, faLock, faRulerHorizontal, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { ExercisesContext } from "../lib/ExercisesContext";
import { useOutsideClick } from "../lib/hooks";

export default function ExerciseTracker({ exerciseId, handleRemoveClick,
  exerciseSets, previewMode, updateSets }) {
  const exercises = useContext(ExercisesContext);
  const exercise = exercises.find((exercise) => exercise.id === exerciseId);
  const setsInitialState = exerciseSets !== undefined ?
    exerciseSets.map((exercise) => {
      return {
        ...exercise, completed: false, setId: uuid(), setType: "normal"
      };
    }) : [{
      weight: "", reps: "", completed: false, setId: uuid(), setType: "normal"
    }];
  const [sets, setSets] = useState(setsInitialState);

  const handleClick = () => {
    setSets(sets.concat({
      weight: "", reps: "", completed: false, setId: uuid(), setType: "normal"
    }));
    console.log(sets);
    updateSets(sets);
  };

  const handleWeightChange = (e, index) => {
    let setsArray = [...sets];
    let set = { ...setsArray[index] };
    set.weight = e.target.value;
    setsArray[index] = set;
    setSets(setsArray);
    updateSets(setsArray);
  };

  const handleRepChange = (e, index) => {
    let setsArray = [...sets];
    let set = { ...setsArray[index] };
    set.reps = e.target.value;
    setsArray[index] = set;
    setSets(setsArray);
    updateSets(setsArray);
  };

  const handleCompletedChange = (index) => {
    let setsArray = [...sets];
    let set = { ...setsArray[index] };
    if (set.weight === "" || set.reps === "") {
      toast.error("Weight and reps must be filled in to complete set.");
    } else {
      set.completed = !set.completed;
      setsArray[index] = set;
      setSets(setsArray);
      updateSets(setsArray);
    }
    console.log(sets);
  };

  const handleSetClick = (index, setType) => {
    let setsArray = [...sets];
    let set = { ...setsArray[index] };
    set.setType = setType;
    setsArray[index] = set;
    setSets(setsArray);
    updateSets(setsArray);
    console.log(setsArray);
  };

  const handleRemoveSet = (index) => {
    let setsArray = [...sets];
    setsArray.splice(index, 1);
    setSets(setsArray);
    updateSets(setsArray);
    console.log(setsArray);
  };

  return (
    <div className="my-2">
      <div className="flex flex-row justify-between my-1">
        <h2 className="font-bold">{exercise.name}</h2>
        <button
          className="text-red-500 hover:text-red-700 p-2"
          onClick={handleRemoveClick}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>

      <div>
        <div className="flex flex-row justify-between">
          <h3 className="font-semibold px-2">Set</h3>
          <h3 className="font-semibold">Weight(lbs)</h3>
          <h3 className="font-semibold">Reps</h3>
          {previewMode ?
            <FontAwesomeIcon
              className="px-4 text-slate-500"
              icon={faLock}
            />
            :
            <FontAwesomeIcon
              className="px-4"
              icon={faCheck}
            />
          }
        </div>

        {sets.map((set, index) => {
          return (
            <div
              key={set.setId}
              className={
                set.completed ?
                  "bg-slate-50 px-2 py-1 items-center rounded flex flex-row justify-between my-1" :
                  "px-2 py-1 items-center rounded flex flex-row justify-between my-1"
              }
            >
              <SetButton
                text={(index + 1).toString()}
                updateSetType={handleSetClick}
                setIndex={index}
              />

              <input
                type="text"
                value={set.weight}
                placeholder="0"
                onChange={(e) => handleWeightChange(e, index)}
                className="bg-slate-50 rounded text-center"
              />

              <input
                type="text"
                value={set.reps}
                placeholder="0"
                onChange={(e) => handleRepChange(e, index)}
                className="bg-slate-50 rounded text-center"
              />


              <div className="flex flex-row gap-2">
                {previewMode ?
                  <button disabled>
                    <FontAwesomeIcon
                      className="bg-slate-300 text-slate-500
                      w-2 py-1 px-2 rounded font-bold"
                      icon={faLock}
                    />
                  </button>
                  :
                  <button>
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={
                        set.completed ?
                          "bg-green-300 p-1 rounded" :
                          "bg-slate-50 p-1 rounded hover:bg-green-300 ease-in duration-100"
                      }
                      onClick={(e) => handleCompletedChange(index)}
                    />
                  </button>
                }

                <button>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="bg-red-500 w-2 py-1 px-2 rounded font-bold
                  text-white hover:bg-red-700 ease-in duration-100"
                    onClick={(e) => handleRemoveSet(index)}
                  />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      <button
        className="bg-indigo-500 text-white px-4 py-1 rounded my-2 w-1/8
        hover:bg-indigo-700 ease-in duration-100"
        onClick={handleClick}
      >
        + Add Set
      </button>
    </div >
  );
}

function SetButton({ text, updateSetType, setIndex }) {
  const [buttonText, setButtonText] = useState(text);
  const [buttonToggle, setButtonToggle] = useState(false);
  const ref = useRef();

  useOutsideClick(ref, () => {
    setButtonToggle(false);
  });

  useEffect(() => {
    setButtonText(text);
  }, [text]);

  const handleButtonClick = () => {
    setButtonToggle(!buttonToggle);
  };

  const handleOptionClick = (setType) => {
    updateSetType(setIndex, setType);
    if (buttonText === setType[0]) {
      setButtonText(text);
    } else {
      setButtonText(setType[0]);
    }
    setButtonToggle(false);
  };

  return (
    <div
      className="flex flex-col items-start relative"
      ref={ref}
    >
      <button
        className="bg-slate-50 rounded w-8"
        onClick={handleButtonClick}
      >
        {buttonText}
      </button>
      {buttonToggle ?
        <div className="flex flex-col bg-slate-50 rounded items-center 
          justify-center list-none w-24 py-1 gap-1 px-2 absolute top-full z-10
          shadow-xl mt-1"
        >
          <li
            onClick={(e) => handleOptionClick("Warm-up")}
            className="hover:bg-slate-200 w-full text-center rounded px-1"
          >
            Warm-up
          </li>
          <li
            onClick={(e) => handleOptionClick("Drop Set")}
            className="hover:bg-slate-200 w-full text-center rounded px-1"
          >
            Drop Set
          </li>
          <li
            onClick={(e) => handleOptionClick("Failure")}
            className="hover:bg-slate-200 w-full text-center rounded px-1"
          >
            Failure
          </li>
        </div>
        :
        <></>
      }

    </div>
  );
}
