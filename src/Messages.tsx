import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";
import { MessageItem } from "./MessageItem";

export function Messages({ userId }: { userId: Id<"users"> }) {
  const [inputValue, setInputValue] = useState("");
  const messages = useQuery(api.messages.listMessagesWithReactions) ?? [];
  const createMessage = useMutation(api.messages.createMessage);

  const handleSubmit = () => {
    if (inputValue.trim() === "") return;
    void createMessage({ content: inputValue.trim(), byUserId: userId });
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
            <MessageItem key={message.message._id} message={message} />
          ))
        )}
      </div>
    </div>
  );
}
