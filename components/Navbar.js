import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/UserContext";

export default function Navbar({ }) {
  const { user } = useContext(UserContext);

  return (
    <nav className="mb-6 bg-slate-200 drop-shadow">
      <ul className="container mx-auto flex flex-row justify-center gap-4 py-4 
      text-lg font-bold">
        <Link href="/">
          <li className="hover:text-indigo-500">
            Profile
          </li>
        </Link>

        <Link href="/template">
          <li className="hover:text-indigo-500">
            Start Workout
          </li>
        </Link>

        <Link href="/exercises">
          <li className="hover:text-indigo-500">
            Exercises
          </li>
        </Link>
      </ul>
    </nav>
  );
}