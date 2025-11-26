/* eslint-disable */
/**
 * Generated `ComponentApi` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { FunctionReference } from "convex/server";

/**
 * A utility for referencing a Convex component's exposed API.
 *
 * Useful when expecting a parameter like `components.myComponent`.
 * Usage:
 * ```ts
 * async function myFunction(ctx: QueryCtx, component: ComponentApi) {
 *   return ctx.runQuery(component.someFile.someQuery, { ...args });
 * }
 * ```
 */
export type ComponentApi<Name extends string | undefined = string | undefined> =
  {
    reactions: {
      deleteReactionsForContent: FunctionReference<
        "mutation",
        "internal",
        { contentId: string },
        null,
        Name
      >;
      getReactionsForContentAndUserReactions: FunctionReference<
        "query",
        "internal",
        { contentId: string; userId: string },
        {
          counts: Record<string, number>;
          userReactions: Array<{
            _creationTime: number;
            _id: string;
            byUserId: string;
            contentId: string;
            reaction: string;
          }>;
        },
        Name
      >;
      toggleReaction: FunctionReference<
        "mutation",
        "internal",
        { byUserId: string; contentId: string; reaction: string },
        null,
        Name
      >;
    };
  };
