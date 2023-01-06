import { useContext, useEffect, useState } from "react";
import { ExercisesContext } from "../lib/ExercisesContext";
import { v4 as uuid } from 'uuid';
import { useDefaultTemplates } from "../lib/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import { TemplateContext } from "../lib/TemplateContext";

export default function TemplatePage({ }) {
  const { template, setTemplate } = useContext(TemplateContext);
  const defaultTemplates = useDefaultTemplates();
  const [templates, setTemplates] = useState([]);
  const exercises = useContext(ExercisesContext);
  const router = useRouter();

  const handleStartDefaultWorkout = (templateId) => {
    const defaultTemplate = defaultTemplates.find((template) =>
      template.templateId === templateId);

    setTemplate(defaultTemplate);
    router.push("/workout");
  };

  return (
    <main className="container mx-auto">
      <h1 className="text-4xl font-bold mb-6">Start Workout</h1>

      <div className="flex flex-col gap-1 mb-4">
        <h2 className="font-bold text-xl">Quick Start</h2>
        <Link
          href="/workout"
          className="bg-indigo-500 text-white py-2 rounded-md mx-1
          font-semibold hover:bg-indigo-700 ease-in duration-100 w-full
          text-center"
        >
          Start an Empty Workout
        </Link>

      </div>

      <div>
        <h2 className="text-xl font-bold">Templates</h2>
        <div className="flex flex-row justify-between">
          <h3 className="font-bold">
            My templates ({templates.length})
          </h3>
          <button className="bg-slate-200 rounded-md px-4 py-1 
              hover:bg-indigo-500 hover:text-white ease-in duration-200">
            + Template
          </button>
        </div>

        {templates.length === 0 ?
          <h1 className="block text-center text-slate-500 my-2 text-lg">
            No templates
          </h1>
          :
          <div>
          </div>
        }

        <h3 className="font-bold">
          Example templates ({defaultTemplates.length})
        </h3>

        <div className="my-4">
          {defaultTemplates.map((defaultTemplate) => {
            return (
              <TemplatePreview
                key={defaultTemplate.templateId}
                template={defaultTemplate}
                exercisesData={exercises}
                startWorkout={handleStartDefaultWorkout}
              />
            );
          })}
        </div>
      </div>

    </main>
  );
}

function TemplatePreview({ template, startWorkout, exercisesData }) {
  return (
    <div className="bg-slate-100 outline outline-2 outline-slate-500 shadow
     w-1/4 p-2 rounded">
      <h1 className="font-semibold">{template.templateName}</h1>
      {template.workouts.map((workout, index) => {
        return (
          <div key={index}>
            <h2>
              {`${workout.sets.length} x 
              ${exercisesData.find((exercise) =>
                exercise.id === workout.workoutId).name}
              `}
            </h2>
          </div>
        );
      })}
      <button
        className="bg-indigo-500 rounded px-4 py-1 my-2 
      text-white mx-auto block hover:bg-indigo-700 ease-in duration-100"
        onClick={(e) => startWorkout(template.templateId)}
      >
        Start Workout
      </button>
    </div>
  );
}
