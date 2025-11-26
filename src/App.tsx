import { useState, useEffect } from "react";
import { Id } from "../convex/_generated/dataModel";
import { Login } from "./Login";
import { Messages } from "./Messages";

const USER_ID_KEY = "userId";

export default function App() {
  const [userId, setUserId] = useState<Id<"users"> | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem(USER_ID_KEY);
    if (storedUserId) {
      setUserId(storedUserId as Id<"users">);
    }
  }, []);

  if (!userId) {
    return (
      <Login
        onLogin={(id) => {
          setUserId(id);
          localStorage.setItem(USER_ID_KEY, id);
        }}
      />
    );
  }

  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
        Convex + React
      </header>
      <main className="p-8 flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">Convex + React</h1>
        <Messages meUserId={userId} />
      </main>
    </>
  );
}
