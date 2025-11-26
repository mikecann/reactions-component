/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as messages from "../messages.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  messages: typeof messages;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  reactions: {
    reactions: {
      deleteReactionsForContent: FunctionReference<
        "mutation",
        "internal",
        { contentId: string },
        null
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
        }
      >;
      toggleReaction: FunctionReference<
        "mutation",
        "internal",
        { byUserId: string; contentId: string; reaction: string },
        null
      >;
    };
  };
};
