import { defineApp } from "convex/server";
import reactionsComponent from "../reactionsComponent/convex.config.js";

const app = defineApp();

app.use(reactionsComponent);

export default app;
