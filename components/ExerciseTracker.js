import { faCheck, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { v4 as uuid } from "uuid";

export default function ExerciseTracker({ exercise, handleRemoveClick }) {
  const [sets, setSets] = useState([{
    weight: "", reps: "", completed: false, id: uuid(), setType: "normal"
  }]);

  const handleClick = () => {
    setSets(sets.concat({
      weight: "", reps: "", completed: false, id: uuid(), setType: "normal"
    }));
  };

  const handleWeightChange = (e, index) => {
    let setsArray = [...sets];
    let set = { ...setsArray[index] };
    set.weight = e.target.value;
    setsArray[index] = set;
    setSets(setsArray);
  };

  const handleRepChange = (e, index) => {
    let setsArray = [...sets];
    let set = { ...setsArray[index] };
    set.reps = e.target.value;
    setsArray[index] = set;
    setSets(setsArray);
  };

  const handleCompletedChange = (index) => {
    let setsArray = [...sets];
    let set = { ...setsArray[index] };
    set.completed = !set.completed;
    setsArray[index] = set;
    setSets(setsArray);
  };

  const handleSetClick = (index, setType) => {
    let setsArray = [...sets];
    let set = { ...setsArray[index] };
    set.setType = setType;
    setsArray[index] = set;
    setSets(setsArray);
    console.log(setsArray);
  };

  return (
    <div className="my-2">
      <div className="flex flex-row justify-between my-1">
        <h2 className="font-bold">{exercise.name}</h2>
        <button
          className="text-red-500"
          onClick={handleRemoveClick}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>

      <div>
        <div className="flex flex-row justify-between">
          <h3 className="font-semibold px-2">Set</h3>
          <h3 className="font-semibold">lbs</h3>
          <h3 className="font-semibold">Weight</h3>
          <FontAwesomeIcon
            icon={faCheck}
          />
        </div>

        {sets.map((set, index) => {
          return (
            <div key={set.id} className={
              set.completed ?
                "bg-slate-200 px-2 py-1 items-center rounded flex flex-row justify-between my-1" :
                "px-2 py-1 items-center rounded flex flex-row justify-between my-1"
            }>
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
                className="bg-slate-200 rounded text-center"
              />

              <input
                type="text"
                value={set.reps}
                placeholder="0"
                onChange={(e) => handleRepChange(e, index)}
                className="bg-slate-200 rounded text-center"
              />

              <button>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={
                    set.completed ?
                      "bg-green-300 p-1 rounded " :
                      "bg-slate-200 p-1 rounded"
                  }
                  onClick={(e) => handleCompletedChange(index)}
                />
              </button>

            </div>
          );
        })}
      </div>

      <button
        className="bg-slate-200 px-2 py-1 rounded my-2 mx-auto"
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
    <div className="flex flex-col items-start">
      <button
        className="bg-slate-200 rounded w-8"
        onClick={handleButtonClick}
      >
        {buttonText}
      </button>
      {buttonToggle ?
        <div className="flex flex-col bg-slate-200 rounded items-center 
          justify-center list-none w-24 py-1 gap-1 px-2"
        >
          <li
            onClick={(e) => handleOptionClick("Warm-up")}
            className="hover:font-semibold hover:text-indigo-600"
          >
            Warm-up
          </li>
          <li
            onClick={(e) => handleOptionClick("Drop Set")}
            className="hover:font-semibold hover:text-indigo-600"
          >
            Drop Set
          </li>
          <li
            onClick={(e) => handleOptionClick("Failure")}
            className="hover:font-semibold hover:text-indigo-600"
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