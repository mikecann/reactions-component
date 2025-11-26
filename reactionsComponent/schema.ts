import { typedV } from "convex-helpers/validators";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  reactionCounts: defineTable({
    contentId: v.string(),
    reactions: v.record(v.string(), v.number()),
  }).index("by_contentId", ["contentId"]),

  reactions: defineTable({
    contentId: v.string(),
    byUserId: v.string(),
    reaction: v.string(),
  })
    .index("by_contentId_byUserId", ["contentId", "byUserId"])
    .index("by_contentId_byUserId_reaction", [
      "contentId",
      "byUserId",
      "reaction",
    ]),
});
export default schema;

export const vv = typedV(schema);
