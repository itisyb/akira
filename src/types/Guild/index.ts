import { objectType } from "nexus"

export const Guild = objectType({
  name: "Guild",
  definition(t) {
    t.model.id()
    t.model.prefix()
    t.model.language()
    t.model.createdAt()
    t.model.updatedAt()
  },
})
