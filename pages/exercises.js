import { useContext } from "react";
import ExercisesSearch from "../components/ExercisesSearch";
import { ExercisesContext } from "../lib/ExercisesContext";

export default function ExercisesPage({ }) {

  return (
    <main className="container mx-auto">
      <h1 className="text-4xl font-bold text-center">
        Exercises
      </h1>
      <ExercisesSearch isPage={true} />
    </main>
  );
}
