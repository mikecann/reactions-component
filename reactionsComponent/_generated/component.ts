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
      addReaction: FunctionReference<
        "mutation",
        "internal",
        { contentId: string; count: number; reaction: string },
        any,
        Name
      >;
      getReactions: FunctionReference<
        "query",
        "internal",
        { contentId: string },
        any,
        Name
      >;
      removeReaction: FunctionReference<
        "mutation",
        "internal",
        { contentId: string; count: number; reaction: string },
        any,
        Name
      >;
    };
  };
