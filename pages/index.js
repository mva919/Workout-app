import { faGun, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useContext, useState } from "react"
import { auth } from "../lib/firebase";
import { UserContext } from "../lib/UserContext";

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <main className="container mx-auto">
      {user ? <SignOutButton /> : <SignInButton />}
    </main>
  )
}

// Sign in with Google Button
function SignInButton() {
  const googleProvider = new GoogleAuthProvider();

  const googleSignIn = async () => {
    await signInWithPopup(auth, googleProvider)
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      })
  };

  return (
    <button
      className="bg-slate-200 flex flex-row items-center gap-4 py-2 px-6
      rounded shadow hover:bg-slate-300 ease-in duration-100"
      onClick={googleSignIn}
    >
      <img src={"/google-icon.png"} className="h-8 w-8" />
      Sign in with Google
    </button>
  );
}

function SignOutButton() {
  return (
    <button
      className="bg-red-600 font-semibold text-white flex flex-row
      items-center gap-4 py-2 px-6 rounded shadow hover:bg-red-700 ease-in
      duration-100"
      onClick={() => auth.signOut()}
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
      Sign out
    </button>
  );
}
