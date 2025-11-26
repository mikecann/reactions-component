import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
  }),

  messages: defineTable({
    content: v.string(),
    byUserId: v.id("users"),
  }),
});
