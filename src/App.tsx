import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
        Convex + React
      </header>
      <main className="p-8 flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">Convex + React</h1>
        <Messages />
      </main>
    </>
  );
}

function Messages() {
  const [inputValue, setInputValue] = useState("");
  const messages = useQuery(api.messages.listMessages) ?? [];
  const createMessage = useMutation(api.messages.createMessage);

  const handleSubmit = () => {
    if (inputValue.trim() === "") return;
    void createMessage({ content: inputValue.trim() });
    setInputValue("");
  };

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          placeholder="Type a message and press Enter..."
          className="flex-1 px-4 py-2 border-2 border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-dark dark:text-light"
        />
      </div>
      <div className="flex flex-col gap-2">
        {messages.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-4">
            No messages yet. Send one to get started!
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700"
            >
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                {new Date(message._creationTime).toLocaleString()}
              </p>
              <p className="text-dark dark:text-light">{message.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
