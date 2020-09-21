import { makeSchema, mutationType, objectType, queryType } from "@nexus/schema";
import { nexusSchemaPrisma } from "nexus-plugin-prisma/dist/schema";
import path from "path";

const ROOT = process.cwd();

const GuildSettings = objectType({
  name: "GuildSettings",
  definition(t) {
    t.model.id();
    t.model.prefix();
    t.model.updatedBy();
    t.model.action();
  },
});

const Query = queryType({
  definition(t) {
    t.crud.guildSettings();
  },
});

const Mutation = mutationType({
  definition(t) {
    t.crud.createOneGuildSettings();
    t.crud.updateOneGuildSettings();
    t.crud.deleteOneGuildSettings();
  },
});

export const schema = makeSchema({
  types: { Query, Mutation, GuildSettings },
  plugins: [nexusSchemaPrisma({ experimentalCRUD: true })],
  outputs: {
    schema: path.join(ROOT, "src/graphql/schema.graphql"),
    typegen: path.join(ROOT, "types/nexus.d.ts"),
  },
  typegenAutoConfig: {
    contextType: "{ prisma: PrismaClient.PrismaClient }",
    sources: [
      {
        source: ".prisma/client",
        alias: "PrismaClient",
      },
    ],
  },
});
