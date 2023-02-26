import { useEffect, useState } from "react";
import { firestore, auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export function useExercisesData() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch("/api/staticdata")
      .then((res) => res.json())
      .then((data) => setExercises(JSON.parse(data)));
  }, []);

  return exercises;
}

export function useDefaultTemplates() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetch("api/defaulttemplates")
      .then((res) => res.json())
      .then((data) => setTemplates(JSON.parse(data)));
  }, []);

  return templates;
}

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [customExercises, setCustomExercises] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState(null);
  const [customTemplates, setCustomTemplates] = useState(null);
  const [bodyMeasurements, setBodyMeasurements] = useState(null);

  useEffect(() => {
    // turn off real time subscription
    let unsubscribe;

    if (user) {
      const docRef = doc(firestore, "users", user.uid);
      unsubscribe = onSnapshot(docRef, (doc) => {
        setUsername(doc.data()?.username);
        setCustomExercises(doc.data()?.customExercises);
        setWorkoutHistory(doc.data()?.previousWorkouts);
        setCustomTemplates(doc.data()?.templates);
        setBodyMeasurements(doc.data()?.bodyMeasurements);
      });

      console.log("Read to firestore! Retrieved user data");
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return {
    user, username, customExercises, workoutHistory, customTemplates,
    bodyMeasurements
  };
}

export function useOutsideClick(ref, callback) {
  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };
}
