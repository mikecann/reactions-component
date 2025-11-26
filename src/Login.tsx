import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";

export function Login({
  onLogin,
}: {
  onLogin: (userId: Id<"users">) => void;
}) {
  const [name, setName] = useState("");
  const login = useMutation(api.messages.login);

  const handleSubmit = () => {
    if (name.trim() === "") return;
    login({ name: name.trim() })
      .then((userId) => {
        onLogin(userId);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-center">Enter your name</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder="Your name..."
          className="px-4 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-dark dark:text-light"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}

