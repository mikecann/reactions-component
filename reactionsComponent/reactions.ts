import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getReactions = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    return ctx.db.query("reactions").collect();
  },
});

export const addReaction = mutation({
  args: { contentId: v.id("content"), reaction: v.string(), count: v.number() },
  handler: async (ctx, args) => {
    const reaction = await ctx.db
      .query("reactions")
      .withIndex("by_contentId", (q) => q.eq("contentId", args.contentId))
      .first();

    if (!reaction)
      await ctx.db.insert("reactions", {
        contentId: args.contentId,
        reactions: { [args.reaction]: args.count },
      });
    else
      await ctx.db.patch(reaction._id, {
        reactions: {
          ...reaction.reactions,
          [args.reaction]:
            (reaction.reactions[args.reaction] ?? 0) + args.count,
        },
      });
  },
});

export const removeReaction = mutation({
  args: { contentId: v.id("content"), reaction: v.string(), count: v.number() },
  handler: async (ctx, args) => {
    const reaction = await ctx.db
      .query("reactions")
      .withIndex("by_contentId", (q) => q.eq("contentId", args.contentId))
      .first();

    if (!reaction) return null;

    await ctx.db.patch(reaction._id, {
      reactions: {
        ...reaction.reactions,
        [args.reaction]: reaction.reactions[args.reaction] - args.count,
      },
    });
  },
});
