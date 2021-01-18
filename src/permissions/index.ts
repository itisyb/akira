import { shield } from "graphql-shield"
import { rules } from "./rules"

export const permissions = shield({
  Query: {
    me: rules.isAuthenticated,
  },
})
