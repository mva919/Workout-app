import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function ChevronToggler({ showItems }) {
  const [toggled, setToggled] = useState(false);

  const handleClick = () => {
    showItems(toggled);
    setToggled(!toggled);
  };

  return (
    <div onClick={handleClick}>
      {toggled ?
        <FontAwesomeIcon icon={faChevronUp} className="h-4" />
        :
        <FontAwesomeIcon icon={faChevronDown} className="h-4" />
      }
    </div>
  );
}
