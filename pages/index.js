import { faChild, faClock, faRightFromBracket, faRuler, faWeightScale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";
import { useCallback, useContext, useEffect, useState } from "react"
import ChevronToggler from "../components/ChevronToggler";
import { auth, firestore } from "../lib/firebase";
import { UserContext } from "../lib/UserContext";

export default function Home() {
  const { user, username, bodyMeasurements, workoutHistory } = useContext(UserContext);
  const [showPreviousWorkouts, setShowPreviousWorkouts] = useState(true);

  const toHoursAndMinutes = (totalSeconds) => {
    const totalMinutes = Math.floor(totalSeconds / 60);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { h: hours, m: minutes };
  }

  return (
    <main className="container mx-auto ">
      {user ?
        username ?
          <div>
            <div className="flex flex-row justify-between items-center">
              <div>
                <h1 className="text-xl">
                  Hello {user.displayName.split(" ")[0]} 👋
                </h1>
                <h1 className="font-bold text-3xl">Welcome back!</h1>
              </div>
              <SignOutButton />
            </div>

            <div className="flex flex-row my-10 items-center justify-center
            gap-8"
            >
              <div className="bg-indigo-500 shadow text-center px-8 py-4 
              rounded-3xl text-white w-1/6"
              >
                <FontAwesomeIcon icon={faWeightScale} className="text-3xl" />
                <h2 className="font-semibold mt-2">Weight</h2>
                <p>{bodyMeasurements.weight} lbs</p>
              </div>
              <div className="bg-indigo-500 shadow text-center px-8 py-4 
              rounded-3xl text-white w-1/6"
              >
                <FontAwesomeIcon icon={faRuler} className="text-3xl" />
                <h2 className="font-semibold mt-2">Height</h2>
                <p>{bodyMeasurements.height.feet} ft {bodyMeasurements.height.inches} in</p>
              </div>
              <div className="bg-indigo-500 shadow text-center px-8 py-4 
              rounded-3xl text-white w-1/6"
              >
                <FontAwesomeIcon icon={faChild} className="text-3xl" />
                <h2 className="font-semibold mt-2">Body Fat</h2>
                <p>{bodyMeasurements.bodyFat} %</p>
              </div>
            </div>

            <div className="flex flex-row gap-4 items-center">
              <h1 className="text-xl font-bold">Your Previous Workouts</h1>
              <ChevronToggler showItems={setShowPreviousWorkouts} />
            </div>

            {showPreviousWorkouts ?
              <div className="flex flex-row gap-2">
                {workoutHistory.map(workout => {
                  return (
                    <div key={workout.dateCompleted}
                      className="bg-slate-50 shadow px-4 py-2 rounded w-1/6"
                    >
                      <h2 className="font-semibold text-lg">{workout.title}</h2>
                      <p>{new Date(workout.dateCompleted).toDateString()}</p>
                      <div className="flex flex-row items-center gap-2">
                        <FontAwesomeIcon icon={faClock} />
                        <p>{Math.floor(workout.workoutDuration / 3600) !== 0 ?
                          `${Math.floor(workout.workoutDuration / 3600)}h` : ""} {
                            Math.floor(workout.workoutDuration / 60) !== 0 ?
                              `${Math.floor(workout.workoutDuration / 60)}m` :
                              `${workout.workoutDuration}s`}
                        </p>
                      </div>
                      <h2 className="font-semibold">Exercise</h2>
                      <ul className="pb-2">
                        {workout.exercises.length ?
                          workout.exercises.map(exercise => {
                            return (
                              <li key={exercise.exerciseId}>
                                {exercise?.sets?.length ?
                                  exercise?.sets?.length : 1} x {exercise.name}
                              </li>
                            );
                          })
                          :
                          <p>None</p>
                        }
                      </ul>
                    </div>
                  );
                })}
              </div> : <div></div>
            }
          </div>
          :
          <UsernameForm /> :
        <div className="flex flex-col items-center bg-slate-100 rounded w-1/3
        shadow h-64 mx-auto justify-between">
          <div className="bg-indigo-500 w-full rounded-t flex items-center
          justify-center h-24">
            <h1 className="font-semibold text-4xl text-white">
              Sign In
            </h1>
          </div>
          <div className="mb-12">
            <SignInButton />
          </div>
        </div>
      }
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
      className="bg-slate-50 flex flex-row items-center gap-4 py-2 px-6
      rounded shadow hover:bg-slate-200 ease-in duration-100"
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

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create refs for user and username documents
    const userDoc = doc(firestore, "users", user.uid);
    const usernameDoc = doc(firestore, "usernames", formValue);

    // commit botch docs together as a batch write
    const batch = writeBatch(firestore);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
      templates: [],
      workoutSessions: []
    });
    batch.set(usernameDoc, { uid: user.uid });

    // Commit the batch
    await batch
      .commit()
      .then(() => {
        console.log("Batch operation successful");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }
    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }

  };

  // useCallback allows for proper debounce since it memoizes the function
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore, "usernames", username);
        const docSnap = await getDoc(ref);
        console.log("Firestore read executed");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section className="flex flex-col text-center bg-slate-100 w-1/3
      mx-auto rounded shadow py-4">
        <h3 className="text-4xl font-semibold my-2">
          Create Username
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="h-32">
            <input
              value={formValue}
              placeholder="Username"
              onChange={handleChange}
              className="w-1/2 py-1 px-2 rounded my-4 bg-slate-200 shadow-sm"
            />
            <UsernameMessage
              username={formValue}
              isValid={isValid}
              loading={loading}
            />
          </div>

          <button
            disabled={!isValid}
            className="bg-indigo-500 text-white w-1/4 py-2 rounded shadow
            hover:bg-indigo-600 ease-in duration-100"
          >
            Choose
          </button>
          {/* <div>
            <p>value : {formValue}</p>
            <p>loading : {loading.toString()}</p>
            <p>valid : {isValid.toString()}</p>
          </div> */}
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p className="text-slate-600 font-semibold">
      Checking username...
    </p>;
  } else if (isValid) {
    return <p className="text-green-600 font-semibold">
      {username} is available
    </p>;
  } else if (username && !isValid) {
    return <p className="text-red-600 font-semibold">Username is taken</p>;
  } else {
    return <p></p>
  }
}
