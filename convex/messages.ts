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
        contentId: args.messageId,
        byUserId: args.userId,
        reaction: args.reaction,
      },
    );
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

    await ctx.runMutation(
      components.reactions.reactions.deleteReactionsForContent,
      {
        contentId: String(args.messageId),
      },
    );

    await ctx.db.delete(args.messageId);
    return null;
  },
});

export const listMessagesWithReactions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();

    const messagesWithReactions = await Promise.all(
      messages.map(async (message) => {
        const reactions = await ctx.runQuery(
          components.reactions.reactions.getReactionsForContentAndUserReactions,
          { contentId: message._id, userId: message.byUserId },
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
