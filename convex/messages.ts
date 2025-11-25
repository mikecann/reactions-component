import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const createMessage = mutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      content: args.content,
    });
  },
});

export const listMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("desc").collect();
    return messages;
  },
});
