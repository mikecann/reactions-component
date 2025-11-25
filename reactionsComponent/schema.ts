import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reactions: defineTable({
    contentId: v.id("content"),
    reactions: v.record(v.string(), v.number()),
  }).index("by_contentId", ["contentId"]),
});
