import { useState } from "react";

export default function DropdownButton({ dropdownOptions, buttonName, selectedCategory }) {
  const [toggle, setToggle] = useState(false);
  const [buttonText, setButtonText] = useState(buttonName)

  const handleToggle = () => setToggle(!toggle);
  const handleClick = (option) => {
    setButtonText(option);
    setToggle(!toggle);
    selectedCategory(option);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleToggle}
        className="bg-slate-200 rounded-md"
      >
        {buttonText}
      </button>
      {toggle &&
        <div className="bg-slate-200 rounded-md list-none">
          {dropdownOptions.map((option, index) => {
            return (
              <li
                key={index}
                onClick={(e) => handleClick(option)}
                className="cursor-pointer"
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