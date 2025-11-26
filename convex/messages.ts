import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { api, components } from "./_generated/api";
import { FunctionReturnType } from "convex/server";

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
    return await ctx.runMutation(
      components.reactions.reactions.toggleReaction,
      {
        contentId: String(args.messageId),
        byUserId: String(args.userId),
        reaction: args.reaction,
      },
    );
  },
});

export const listMessagesWithReactions = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();

    const messagesWithReactions = await Promise.all(
      messages.map(async (message) => {
        const reactions = await ctx.runQuery(
          components.reactions.reactions.getReactionsForContent,
          { contentId: String(message._id) },
        );
        return {
          user: await ctx.db.get(message.byUserId),
          message,
          reactions,
        };
      }),
    );

    return messagesWithReactions;
  },
});

export type MessageWithReactions = FunctionReturnType<
  typeof api.messages.listMessagesWithReactions
>[number];
