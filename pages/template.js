import { useContext, useEffect, useState } from "react";
import { ExercisesContext } from "../lib/ExercisesContext";
import { v4 as uuid } from 'uuid';
import { useDefaultTemplates } from "../lib/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import { TemplateContext } from "../lib/TemplateContext";
import { UserContext } from "../lib/UserContext";
import { toast } from "react-hot-toast";

export default function TemplatePage({ }) {
  const { user } = useContext(UserContext);
  const { template, setTemplate } = useContext(TemplateContext);
  const defaultTemplates = useDefaultTemplates();
  const [templates, setTemplates] = useState([]);
  const exercises = useContext(ExercisesContext);
  const router = useRouter();

  const handleStartDefaultWorkout = (templateId) => {
    const defaultTemplate = defaultTemplates.find((template) =>
      template.templateId === templateId);

    setTemplate(defaultTemplate);
    console.log(template.workouts);
    router.push("/workout");
  };

  const handleAddTemplate = () => {
    if (!user) {
      toast.error('Must sign in to create template.');
      router.push("/");
    }
    else {
      router.push("/new-template");
    }
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
          <button
            className="bg-slate-200 rounded-md px-4 py-1 
          hover:bg-indigo-500 hover:text-white ease-in duration-200"
            onClick={handleAddTemplate}
          >
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

        <div className="my-4 flex flex-row gap-3 items-stretch justify-start flex-wrap">
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
  const PREVIEW_MAX = 6;
  return (
    <div className="bg-slate-100 outline outline-2 outline-slate-500 shadow
     w-64 p-2 rounded flex flex-col justify-between">
      <div>
        <h1 className="font-semibold">{template.templateName}</h1>
        {template.workouts.slice(0, PREVIEW_MAX).map((workout, index) => {
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
        {template.workouts.length > PREVIEW_MAX ?
          <p className="text-slate-400 font-semibold">
            {`& ${template.workouts.length - PREVIEW_MAX} more
            ${template.workouts.length - PREVIEW_MAX > 1 ?
                "workouts" : "workout"}`
            }
          </p>
          : <p></p>}
      </div>

      <button
        className="bg-indigo-500 rounded px-4 py-1 mb-2 mt-6 
      text-white mx-auto block hover:bg-indigo-700 ease-in duration-100"
        onClick={(e) => startWorkout(template.templateId)}
      >
        Start Workout
      </button>
    </div>
  );
}
