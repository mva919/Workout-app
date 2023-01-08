import { useEffect, useState } from "react";
import { firestore, auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, doc, onSnapshot } from 'firebase/firestore';

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
  useEffect(() => {
    // turn off real time subscription
    let unsubscribe;

    if (user) {
      const collectionRef = collection(firestore, "users");
      const docRef = doc(firestore, "users", user.uid);
      unsubscribe = onSnapshot(docRef, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}