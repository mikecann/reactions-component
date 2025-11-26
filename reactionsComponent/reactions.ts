import { v } from "convex/values";
import { DatabaseWriter, mutation, query, QueryCtx } from "./_generated/server";

export const getReactionsForContent = query({
  args: { contentId: v.string() },
  handler: async (ctx, args) => {
    const counts = await ctx.db
      .query("reactionCounts")
      .withIndex("by_contentId", (q) => q.eq("contentId", args.contentId))
      .first();

    const userReactions = await ctx.db
      .query("reactions")
      .withIndex("by_contentId_byUserId", (q) =>
        q.eq("contentId", args.contentId),
      )
      .collect();

    return {
      counts,
      userReactions,
    };
  },
});

const _incrementReactionCount = async (
  db: DatabaseWriter,
  { contentId, reaction }: { contentId: string; reaction: string },
) => {
  const counts = await db
    .query("reactionCounts")
    .withIndex("by_contentId", (q) => q.eq("contentId", contentId))
    .first();

  if (!counts)
    return await db.insert("reactionCounts", {
      contentId,
      reactions: { [reaction]: 1 },
    });

  await db.patch(counts._id, {
    reactions: {
      ...counts.reactions,
      [reaction]: (counts.reactions[reaction] ?? 0) + 1,
    },
  });
};

const _decrementReactionCount = async (
  db: DatabaseWriter,
  { contentId, reaction }: { contentId: string; reaction: string },
) => {
  const counts = await db
    .query("reactionCounts")
    .withIndex("by_contentId", (q) => q.eq("contentId", contentId))
    .first();

  if (!counts) return null;

  await db.patch(counts._id, {
    reactions: {
      ...counts.reactions,
      [reaction]: (counts.reactions[reaction] ?? 1) - 1,
    },
  });
};

export const toggleReaction = mutation({
  args: {
    contentId: v.string(),
    byUserId: v.string(),
    reaction: v.string(),
  },
  handler: async (ctx, args) => {
    const reactionFromUser = await ctx.db
      .query("reactions")
      .withIndex("by_contentId_byUserId", (q) =>
        q.eq("contentId", args.contentId).eq("byUserId", args.byUserId),
      )
      .first();

    // A user cant add the same reaction twice
    if (reactionFromUser) {
      // Decrement the reaction count
      await _decrementReactionCount(ctx.db, {
        contentId: args.contentId,
        reaction: args.reaction,
      });

      // Delete the reaction from the user
      await ctx.db.delete(reactionFromUser._id);
    }

    // Otherwise, increment the reaction count
    await _incrementReactionCount(ctx.db, {
      contentId: args.contentId,
      reaction: args.reaction,
    });

    // And add the reaction from the user
    await ctx.db.insert("reactions", {
      contentId: args.contentId,
      byUserId: args.byUserId,
      reaction: args.reaction,
    });
  },
});
