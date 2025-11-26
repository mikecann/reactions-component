import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { api, components } from "./_generated/api";
import { FunctionReturnType } from "convex/server";
import { ReactionsClient } from "../reactionsComponent/ReactionsClient";

const reactions = new ReactionsClient(components.reactions);

export const login = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      name: args.name,
    });
  },
});

export const createMessage = mutation({
  args: {
    content: v.string(),
    byUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      content: args.content,
      byUserId: args.byUserId,
    });
  },
});

export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
    reaction: v.string(),
  },
  handler: async (ctx, args) => {
    return await reactions.forContent(args.messageId).toggle(ctx, {
      byUserId: args.userId,
      reaction: args.reaction,
    });
  },
});

export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");
    await reactions.forContent(args.messageId).deleteAll(ctx);
    await ctx.db.delete(args.messageId);
    return null;
  },
});

export const listMessagesWithReactions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("messages").collect();

    const messagesWithReactions = await Promise.all(
      messages.map(async (message) => {
        return {
          user: await ctx.db.get(message.byUserId),
          message,
          reactions: await reactions.forContent(message._id).getReactions(ctx, {
            userId: args.userId,
          }),
        };
      }),
    );

    return messagesWithReactions;
  },
});

export type MessageWithReactions = FunctionReturnType<
  typeof api.messages.listMessagesWithReactions
>[number];
