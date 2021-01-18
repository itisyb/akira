import { queryField } from "nexus"

export const me = queryField("me", {
  type: "Profile",
  resolve: (_parent, _args, { request }) => {
    if (!request.user) {
      throw new Error("No user")
    }

    return request.user
  },
})
