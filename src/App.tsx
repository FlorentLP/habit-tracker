import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAlB8wKOxhbTsBflmneZM8T9spGv8cZsuk",
    authDomain: "my-habit-tracker-4d426.firebaseapp.com",
    projectId: "my-habit-tracker-4d426",
    storageBucket: "my-habit-tracker-4d426.firebasestorage.app",
    messagingSenderId: "131083893159",
    appId: "1:131083893159:web:616295a2c82067fca71e82",
    measurementId: "G-V7ERYDDD0W"
};

// Définition du type Habit
interface Habit {
    id: string;
    text: string;
    completed: boolean;
    date: string;
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
    const [habit, setHabit] = useState("");
    const [habits, setHabits] = useState<Habit[]>([]);

    useEffect(() => {
        try {
            const unsubscribe = onSnapshot(collection(db, "habits"), (snapshot) => {
                const newHabits: Habit[] = snapshot.docs.map((doc) => ({
                    ...(doc.data() as Habit),
                }));
                setHabits(newHabits);
            });
            return () => unsubscribe();
        }
        catch (error) {
            console.error("Firestore error:", error);
        }
    }, []);

    const addHabit = async () => {
        if (habit.trim() === "") return;
        await addDoc(collection(db, 'habits'), {
            text: habit,
            completed: false,
            date: "",
        });
        setHabit("");
    };

    const toggleCompleted = async (habit : Habit) => {
        const habitRef = doc(db, 'habits', habit.id);
        await updateDoc(habitRef, {
            completed: !habit.completed,
            date: !habit.completed ? new Date().toLocaleDateString() : ""
        });
    };

    const deleteHabit = async (habitId : string) => {
        await deleteDoc(doc(db, 'habits', habitId));
    };

    const totalHabits = habits.length;
    const completedHabits = habits.filter((h) => h.completed).length;

    const data = [
        { name: "Total", value: totalHabits },
        { name: "Complétées", value: completedHabits },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold mb-4">Habit Tracker</h1>

            <div className="bg-gray-800 p-4 rounded-lg mb-4 w-full max-w-md">
                <p className="text-lg">📌 Total Habitudes: <span className="font-bold">{totalHabits}</span></p>
                <p className="text-lg">✅ Complétées: <span className="font-bold">{completedHabits}</span></p>
            </div>

            <div className="w-full max-w-md mb-4">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={habit}
                    onChange={(e) => setHabit(e.target.value)}
                    placeholder="Ajoute une habitude..."
                    className="px-3 py-2 border border-gray-600 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={addHabit} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">
                    Ajouter
                </button>
            </div>

            <ul className="w-full max-w-md">
                {habits.map((h) => (
                    <li key={h.id} className="flex items-center justify-between p-2 bg-gray-800 rounded mb-2 shadow-lg">
                        <span className={`flex-1 min-w-[200px] text-lg ${h.completed ? "line-through text-gray-400" : ""}`}>{h.text}</span>
                        <button onClick={() => toggleCompleted(h)} className="px-3 py-1 bg-green-600 rounded hover:bg-green-500">
                            {h.completed ? "✔️" : "⭕"}
                        </button>
                        <span className="text-sm text-gray-400 min-w-[100px]">{h.date ? `(${h.date})` : "(not done yet)"}</span>
                        <button onClick={() => deleteHabit(h.id)} className="px-3 py-1 bg-red-600 rounded hover:bg-red-500">
                            🗑️
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
