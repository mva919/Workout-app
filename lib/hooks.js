import { useEffect, useState } from "react";

export function useExercisesData() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch("/api/staticdata")
      .then((res) => res.json())
      .then((data) => setExercises(JSON.parse(data)));
  }, []);

  return { exercises };
}
