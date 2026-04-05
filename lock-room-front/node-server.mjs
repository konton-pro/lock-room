import { serve } from "@hono/node-server";
import server from "./dist/server/server.js";

serve({
  fetch: server.fetch,
  port: parseInt(process.env.PORT || "3000", 10),
});
