import { useState } from "react";

export default function DropdownButton({ dropdownOptions, buttonName,
  selectedCategory, isDark }) {
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
    <div className="flex flex-col items-start content-center my-2 relative">
      <button
        onClick={handleToggle}
        className={`px-2 py-2 rounded focus:outline 
        focus:outline-blue-500 w-64 ${isDark ? "bg-slate-200" : "bg-slate-50"}`}
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
                className={`cursor-pointer my-1 rounded ${isDark ? "hover:bg-slate-300" : "hover:bg-slate-200"}`}
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