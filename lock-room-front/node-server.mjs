import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import server from "./dist/server/server.js";

const app = new Hono();

app.use("*", serveStatic({ root: "./dist/client" }));
app.use("*", (c) => server.fetch(c.req.raw));

serve({
  fetch: app.fetch,
  port: parseInt(process.env.PORT || "3000", 10),
});
