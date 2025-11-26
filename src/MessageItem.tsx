import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { encodeReaction, decodeReaction } from "./reactionUtils";
import { MessageWithReactions } from "../convex/messages";

const COMMON_REACTIONS = ["👍", "❤️", "😂", "😮", "😢"];

export function MessageItem(props: { message: MessageWithReactions }) {
  const { user, message, reactions } = props.message;
  const toggleReaction = useMutation(api.messages.toggleReaction);

  const counts = reactions?.counts?.reactions ?? {};
  const userReactions = reactions?.userReactions ?? [];
  const userReaction = userReactions.find(
    (r: { byUserId: string }) => r.byUserId === user?._id,
  );

  return (
    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
        <span className="font-semibold">{user?.name ?? "Unknown"}</span> ·{" "}
        {new Date(message._creationTime).toLocaleString()}
      </p>
      <p className="text-dark dark:text-light mb-2">{message.content}</p>
      <div className="flex gap-2 flex-wrap">
        {COMMON_REACTIONS.map((reaction) => {
          const encodedReaction = encodeReaction(reaction);
          const count = counts[encodedReaction] ?? 0;
          const isActive =
            userReaction && decodeReaction(userReaction.reaction) === reaction;
          return (
            <button
              key={reaction}
              onClick={() => {
                if (!user?._id) return;
                void toggleReaction({
                  messageId: message._id,
                  userId: user._id,
                  reaction: encodedReaction,
                });
              }}
              className={`px-2 py-1 rounded-md text-sm border-2 flex items-center gap-1 ${
                isActive
                  ? "bg-blue-200 dark:bg-blue-800 border-blue-400 dark:border-blue-600"
                  : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
              }`}
            >
              <span>{reaction}</span>
              {count > 0 && <span className="text-xs">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
