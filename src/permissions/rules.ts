import { rule } from "graphql-shield"
import type { Context } from "../context"

export const rules = {
  isAuthenticated: rule({ cache: "contextual" })(
    async (_parent, _args, ctx: Context) => {
      return ctx.request.isAuthenticated()
    }
  ),
}
