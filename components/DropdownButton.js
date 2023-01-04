import { useState } from "react";

export default function DropdownButton({ dropdownOptions, buttonName, selectedCategory }) {
  const [toggle, setToggle] = useState(false);
  const [buttonText, setButtonText] = useState(buttonName)

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
    <div className="inline-flex flex-col items-start content-center my-2">
      <button
        onClick={handleToggle}
        className="bg-slate-50 px-2 py-2 rounded focus:outline 
        focus:outline-blue-500 w-64"
      >
        {buttonText}
      </button>
      {toggle &&
        <div
          className="bg-slate-50 rounded list-none my-1 px-2 py-1 w-64"
        >
          {dropdownOptions.map((option, index) => {
            return (
              <li
                key={index}
                onClick={(e) => handleClick(option)}
                className="cursor-pointer my-1"
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