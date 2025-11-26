import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { TableAggregate } from "@convex-dev/aggregate";
import { vv } from "./schema";
import { KNOWN_REACTION_TYPES, encodeReaction } from "./reactionTypes";

const reactionAggregate = new TableAggregate<{
  Key: [string, string];
  DataModel: DataModel;
  TableName: "reactions";
}>(components.aggregate, {
  sortKey: (doc) => [doc.contentId, doc.reaction],
});

export const getReactionsForContentAndUserReactions = query({
  args: { contentId: v.string(), userId: v.string() },
  returns: v.object({
    counts: v.record(v.string(), v.number()),
    userReactions: v.array(vv.doc("reactions")),
  }),
  handler: async (ctx, args) => {
    const userReactions = await ctx.db
      .query("reactions")
      .withIndex("by_contentId_byUserId", (q) =>
        q.eq("contentId", args.contentId).eq("byUserId", args.userId),
      )
      .collect();

    // Use aggregate to efficiently count each known reaction type
    const counts: Record<string, number> = {};
    for (const emoji of KNOWN_REACTION_TYPES) {
      const encodedReaction = encodeReaction(emoji);
      counts[encodedReaction] = await reactionAggregate.count(ctx, {
        bounds: {
          lower: { key: [args.contentId, encodedReaction], inclusive: true },
          upper: { key: [args.contentId, encodedReaction], inclusive: true },
        },
      });
    }

    return {
      counts,
      userReactions,
    };
  },
});

export const toggleReaction = mutation({
  args: {
    contentId: v.string(),
    byUserId: v.string(),
    reaction: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const reactionFromUser = await ctx.db
      .query("reactions")
      .withIndex("by_contentId_byUserId_reaction", (q) =>
        q
          .eq("contentId", args.contentId)
          .eq("byUserId", args.byUserId)
          .eq("reaction", args.reaction),
      )
      .first();

    // A user cant add the same reaction twice
    if (reactionFromUser) {
      // Delete from aggregate
      await reactionAggregate.delete(ctx, reactionFromUser);

      // Delete the reaction from the user
      await ctx.db.delete(reactionFromUser._id);

      return;
    }

    // Add the reaction from the user
    const reactionId = await ctx.db.insert("reactions", {
      contentId: args.contentId,
      byUserId: args.byUserId,
      reaction: args.reaction,
    });

    // Get the inserted document to pass to aggregate
    const insertedReaction = await ctx.db.get(reactionId);
    if (insertedReaction) await reactionAggregate.insert(ctx, insertedReaction);
  },
});

export const deleteReactionsForContent = mutation({
  args: {
    contentId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_contentId_byUserId", (q) =>
        q.eq("contentId", args.contentId),
      )
      .collect();

    for (const reaction of reactions) {
      await reactionAggregate.delete(ctx, reaction);
      await ctx.db.delete(reaction._id);
    }
  },
});
