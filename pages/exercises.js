import ExercisesSearch from "../components/ExercisesSearch";

export default function ExercisesPage({ }) {
  return (
    <main className="container mx-auto">
      <h1 className="text-4xl font-bold">
        Exercises
      </h1>
      <ExercisesSearch />
    </main>
  );
}
