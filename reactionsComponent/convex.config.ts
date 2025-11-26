import { defineComponent } from "convex/server";
import aggregate from "@convex-dev/aggregate/convex.config.js";

const component = defineComponent("reactions");
component.use(aggregate);

export default component;
