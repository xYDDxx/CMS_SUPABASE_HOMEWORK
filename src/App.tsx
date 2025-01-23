import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function App() {
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [homeworks, setHomeworks] = useState<
    {
      id: number;
      subject_id: number;
      description: string;
      due_date: string;
      subjects: { name: string };
    }[]
  >([]);
  const [newHomework, setNewHomework] = useState({
    subjectId: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchSubjects();
    fetchHomeworks();
  }, []);

  async function fetchSubjects() {
    const { data, error } = await supabase.from("subjects").select();
    if (error) {
      console.error("Error fetching subjects:", error);
    } else {
      setSubjects(data || []);
    }
  }

  async function fetchHomeworks() {
    const { data, error } = await supabase
      .from("homework")
      .select("*, subjects(name)")
      .order("due_date", { ascending: true });
    if (error) {
      console.error("Error fetching homework:", error);
    } else {
      setHomeworks(data || []);
    }
  }

  async function addHomework() {
    if (
      !newHomework.subjectId ||
      !newHomework.description ||
      !newHomework.dueDate
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const { error } = await supabase.from("homework").insert({
      subject_id: parseInt(newHomework.subjectId, 10),
      description: newHomework.description,
      due_date: newHomework.dueDate,
    });

    if (error) {
      console.error("Error adding homework:", error);
    } else {
      setNewHomework({ subjectId: "", description: "", dueDate: "" });
      fetchHomeworks();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Hausaufgabenliste
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Neue Hausaufgabe hinzufügen
          </h2>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              addHomework();
            }}
          >
            <div>
              <label className="block font-medium mb-1">Fach:</label>
              <select
                className="w-full border rounded p-2"
                value={newHomework.subjectId}
                onChange={(e) =>
                  setNewHomework({ ...newHomework, subjectId: e.target.value })
                }
              >
                <option value="">-- Wähle ein Fach --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Beschreibung:</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={newHomework.description}
                onChange={(e) =>
                  setNewHomework({
                    ...newHomework,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Fälligkeitsdatum:
              </label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={newHomework.dueDate}
                onChange={(e) =>
                  setNewHomework({ ...newHomework, dueDate: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
            >
              Hinzufügen
            </button>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Hausaufgaben</h2>
          <ul className="space-y-3">
            {homeworks.map((hw) => (
              <li key={hw.id} className="border-b pb-2 last:border-b-0">
                <p className="font-medium">
                  {hw.subjects.name}: {hw.description}
                </p>
                <p className="text-sm text-gray-600">
                  Fällig am {new Date(hw.due_date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
