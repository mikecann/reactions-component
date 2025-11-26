import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reactionCounts: defineTable({
    contentId: v.string(),
    reactions: v.record(v.string(), v.number()),
  }).index("by_contentId", ["contentId"]),

  reactions: defineTable({
    contentId: v.string(),
    byUserId: v.string(),
    reaction: v.string(),
  }).index("by_contentId_byUserId", ["contentId", "byUserId"]),
});
