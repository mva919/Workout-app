import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { ExercisesContext } from '../lib/ExercisesContext';
import { useExercisesData, useUserData } from '../lib/hooks';
import { TemplateContext } from '../lib/TemplateContext';
import { UserContext } from '../lib/UserContext';
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  const userData = useUserData();
  const exercises = useExercisesData();
  const [template, setTemplate] = useState({});
  const templateValue = { template, setTemplate };

  return (
    <UserContext.Provider value={userData}>
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
    </UserContext.Provider>

  );
}
