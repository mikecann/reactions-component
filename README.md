[![Authoring You Own Convex Components Changes the Game for Backend Development!](https://thumbs.video-to-markdown.com/81ae15ed.jpg)](https://youtu.be/H4JiHUxZZ6k)

# Reactions Component Demo

A demo Convex Component built for educational purposes as part of a video tutorial on Component Authoring.

> ⚠️ **Note**: This is a demo component for learning purposes. If you need a production-ready reactions component for your app, check out the [official Reactions Component](https://github.com/get-convex/reactions) which is more robust and feature-complete.

## What is this?

This project demonstrates how to build a **Sibling Component** in Convex - a component that sits alongside your main Convex code in your project. The component provides reactions functionality (like emoji reactions) for any piece of content in your app.

## Features

- ✅ Toggle reactions on content items
- ✅ Track reaction counts efficiently using the Aggregate component
- ✅ Query reactions for content with user-specific data
- ✅ Clean client API via `ReactionsClient` class
- ✅ Demonstrates nested components (uses Aggregate component internally)
- ✅ Example messaging app to see it in action

## Component Structure

This is a **Sibling Component** that lives in the `reactionsComponent/` directory:

```
reactionsComponent/
├── convex.config.ts      # Component definition & Aggregate dependency
├── schema.ts             # Component's isolated database schema
├── reactions.ts          # Queries and mutations
├── ReactionsClient.ts    # Client API wrapper class
└── reactionTypes.ts      # Reaction type definitions
```

## How it works

The component provides three main functions:

1. **`toggleReaction`** - Adds or removes a reaction from a user on a piece of content
2. **`getReactionsForContentAndUserReactions`** - Gets reaction counts and user's reactions for content
3. **`deleteReactionsForContent`** - Cleans up all reactions when content is deleted

The component uses the [Aggregate component](https://github.com/convex-dev/aggregate) internally to efficiently track reaction counts, demonstrating how components can be nested.

### Client Pattern

Instead of calling component functions directly (which can be verbose), the component provides a `ReactionsClient` class for a cleaner API:

```typescript
const reactions = new ReactionsClient(components.reactions);

// Much nicer than ctx.runMutation(components.reactions.reactions.toggleReaction, {...})
await reactions.forContent(messageId).toggle(ctx, {
  byUserId: userId,
  reaction: "👍",
});
```

## Running the Demo

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up Convex (if not already):

   ```bash
   npx convex dev
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the app and:
   - Sign in with a name
   - Create a message
   - Add reactions to messages
   - See real-time sync across multiple tabs!

## Important Concepts Demonstrated

### Component Isolation

- Components have their own isolated database schema
- Components cannot be called directly from the frontend
- All access must go through your app's UDFs (queries/mutations)

### Transaction Boundaries

- Component calls are separate function invocations
- Each call counts against your Convex quota
- Understanding transaction boundaries is crucial (see [docs](https://docs.convex.dev/components/using#transactions))

### When to Use Components

Components are great for:

- ✅ Common backend functionality (rate limiting, aggregates, AI agents)
- ✅ Sharing code between multiple projects
- ✅ Building reusable features for the community

Consider the trade-offs:

- ⚠️ Added complexity when breaking up your app
- ⚠️ Each component call is a separate function invocation (costs count)
- ⚠️ May be overkill for small teams/projects

## Learn More

- 📖 [Component Authoring Docs](https://docs.convex.dev/components/authoring)
- 📖 [Using Components Guide](https://docs.convex.dev/components/using)
- 🏆 [Component Authoring Challenge](https://www.convex.dev/components/challenge)
- 📦 [Submit Your Component](https://www.convex.dev/components/submit)

## Other Reactions Components

- 🔥 [Official Reactions Component](https://github.com/get-convex/reactions) - Production-ready version with more features

## License

See [LICENSE.txt](./LICENSE.txt)
