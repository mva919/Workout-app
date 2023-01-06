import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { ExercisesContext } from '../lib/ExercisesContext';
import { useExercisesData } from '../lib/hooks';
import { TemplateContext } from '../lib/TemplateContext';
import '../styles/globals.css'


export default function App({ Component, pageProps }) {
  const exercises = useExercisesData();
  const [template, setTemplate] = useState({});
  const templateValue = { template, setTemplate };

  return (
    <ExercisesContext.Provider value={exercises}>
      <TemplateContext.Provider value={templateValue}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          reverseOrder={false}
        />
      </TemplateContext.Provider >
    </ExercisesContext.Provider>

  );
}
