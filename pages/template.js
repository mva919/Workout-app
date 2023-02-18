import { useContext, useState } from "react";
import { ExercisesContext } from "../lib/ExercisesContext";
import { useDefaultTemplates } from "../lib/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import { TemplateContext } from "../lib/TemplateContext";
import { UserContext } from "../lib/UserContext";
import { toast } from "react-hot-toast";
import ChevronToggler from "../components/ChevronToggler";

export default function TemplatePage({ }) {
  const { user, customTemplates } = useContext(UserContext);
  const { template, setTemplate } = useContext(TemplateContext);
  const defaultTemplates = useDefaultTemplates();
  const [showCustomTemplates, setShowCustomTemplates] = useState(true);
  const [showDefaultTemplates, setShowDefaultTemplates] = useState(true);
  const router = useRouter();

  const handleStartDefaultWorkout = (templateId) => {
    const defaultTemplate = defaultTemplates.find((template) =>
      template.templateId === templateId);

    setTemplate(defaultTemplate);
    console.log(template.defaultExercises);
    router.push("/workout");
  };

  const handleStartCustomWorkout = (templateId) => {
    const customTemplate = customTemplates.find((template) =>
      template.templateId === templateId
    );

    console.log(customTemplate);

    setTemplate(customTemplate);
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
          <div className="flex flex-row justify-start items-center gap-2">
            <h3 className="font-bold">
              My templates ({customTemplates.length})
            </h3>
            <ChevronToggler showItems={setShowCustomTemplates} />
          </div>
          <button
            className="bg-green-500 rounded-md px-4 py-1 
          hover:bg-green-700 text-white ease-in duration-200"
            onClick={handleAddTemplate}
          >
            Add New Template
          </button>
        </div>
        {showCustomTemplates ?
          <div>
            {
              customTemplates.length === 0 ?
                <h1 className="block text-center text-slate-500 my-2 text-lg">
                  No templates
                </h1>
                :
                <div className="my-4 flex flex-row gap-3 items-stretch
                justify-start flex-wrap">
                  {customTemplates.map(template => {
                    return (
                      <TemplatePreview
                        key={template.templateId}
                        template={template}
                        startWorkout={handleStartCustomWorkout}
                      />
                    );
                  })}
                </div>
            }
          </div>
          :
          <div></div>
        }

        <div className="flex flex-row justify-start items-center gap-2 mt-12">
          <h3 className="font-bold">
            Example templates ({defaultTemplates.length})
          </h3>
          <ChevronToggler showItems={setShowDefaultTemplates} />
        </div>
        {showDefaultTemplates ?
          <div>
            <div className="my-4 flex flex-row gap-3 items-stretch justify-start
            flex-wrap">
              {defaultTemplates.map((defaultTemplate) => {
                return (
                  <TemplatePreview
                    key={defaultTemplate.templateId}
                    template={defaultTemplate}
                    startWorkout={handleStartDefaultWorkout}
                  />
                );
              })}
            </div>
          </div>
          :
          <div></div>
        }

      </div>
    </main >
  );
}

function TemplatePreview({ template, startWorkout }) {
  const defaultExercises = useContext(ExercisesContext);
  const { customExercises } = useContext(UserContext);
  const exercises = [...defaultExercises, ...customExercises];
  const PREVIEW_MAX = 6;

  return (
    <div className="bg-white drop-shadow-md hover:drop-shadow-2xl w-64 p-2 
    rounded-lg flex flex-col justify-between">
      <div>
        <h1 className="font-bold">{template.title}</h1>
        {template.exercises.slice(0, PREVIEW_MAX).map((workout, index) => {
          return (
            <div key={index}>
              <h2>
                {`${workout.sets.length} x 
                ${exercises.find((exercise) =>
                  exercise.id === workout.id)?.name}
              `}
              </h2>
            </div>
          );
        })}
        {template.exercises.length > PREVIEW_MAX ?
          <p className="text-slate-400 font-semibold">
            {`& ${template.exercises.length - PREVIEW_MAX} more
            ${template.exercises.length - PREVIEW_MAX > 1 ?
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
