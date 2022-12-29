import Navbar from '../components/Navbar';
import { ExercisesContext } from '../lib/ExercisesContext';
import { useExercisesData } from '../lib/hooks';
import '../styles/globals.css'


export default function App({ Component, pageProps }) {
  const exercises = useExercisesData();

  return (
    <ExercisesContext.Provider value={exercises}>
      <Navbar />
      <Component {...pageProps} />
    </ExercisesContext.Provider>

  );
}
