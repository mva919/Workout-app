import Link from "next/link";

export default function Navbar({ }) {
  return (
    <nav className=" bg-blue-300">
      <ul className="flex flex-row justify-center gap-4 bg-slate-200 py-4 
      text-lg font-bold">
        <Link href="/">
          <li className="hover:text-indigo-500">
            Profile
          </li>
        </Link>

        <Link href="/history">
          <li className="hover:text-indigo-500">
            History
          </li>
        </Link>

        <Link href="/workout">
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