import { makeSchema, queryComplexityPlugin } from "nexus"
import { nexusPrisma } from "nexus-plugin-prisma"
import path from "path"
import * as types from "./types"

export const schema = makeSchema({
  types,
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
      paginationStrategy: "prisma",
    }),
    queryComplexityPlugin(),
  ],
  outputs: {
    typegen: path.join(
      process.cwd(),
      "node_modules",
      "@types",
      "nexus-typegen",
      "index.d.ts"
    ),
  },
  sourceTypes: {
    modules: [{ module: ".prisma/client", alias: "PrismaClient" }],
  },
  contextType: {
    module: path.join(__dirname, "context.ts"),
    export: "Context",
  },
  shouldExitAfterGenerateArtifacts:
    process.env.SHOULD_EXIT_AFTER_GENERATE_ARTIFACTS === "true",
})
