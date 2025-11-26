import type {
  GenericQueryCtx,
  GenericMutationCtx,
  GenericDataModel,
} from "convex/server";
import type { ComponentApi } from "./_generated/component";

/**
 * Client API for the reactions component.
 * Provides a clean interface for interacting with reactions functionality.
 */
export class ReactionsClient {
  constructor(private component: ComponentApi) {}

  /**
   * Reactions for a specific content item.
   */
  forContent(contentId: string) {
    return {
      /**
       * Get reaction counts and user's reactions for a specific content item.
       */
      getReactions: async (
        ctx: Pick<GenericQueryCtx<GenericDataModel>, "runQuery">,
        { userId }: { userId: string },
      ) => {
        return await ctx.runQuery(
          this.component.reactions.getReactionsForContentAndUserReactions,
          { contentId, userId },
        );
      },

      /**
       * Toggle a reaction on a content item.
       * If the user already has this reaction, it will be removed.
       * Otherwise, it will be added.
       */
      toggle: async (
        ctx: Pick<GenericMutationCtx<GenericDataModel>, "runMutation">,
        { byUserId, reaction }: { byUserId: string; reaction: string },
      ) => {
        return await ctx.runMutation(this.component.reactions.toggleReaction, {
          contentId,
          byUserId,
          reaction,
        });
      },

      /**
       * Delete all reactions for a specific content item.
       */
      deleteAll: async (
        ctx: Pick<GenericMutationCtx<GenericDataModel>, "runMutation">,
      ) => {
        return await ctx.runMutation(
          this.component.reactions.deleteReactionsForContent,
          { contentId },
        );
      },
    };
  }
}
