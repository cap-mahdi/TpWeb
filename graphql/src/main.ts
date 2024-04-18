import { createServer } from "http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema/schema";
import { db } from "./db/db";

function main() {
  const yoga = createYoga({ schema, context: { db } });
  const server = createServer(yoga);
  server.listen(4000, () => {
    console.info("Server is running on http://localhost:4000/graphql");
  });
}

main();
