import { Fragment } from "react"
import { chakra, Heading } from "@chakra-ui/react"
import Head from "next/head"
import pkg from "../package.json"

const Main = chakra("main")

const Home = () => (
  <Fragment>
    <Head>
      <title>Home - Akira</title>
      <meta
        name="description"
        content="🤖 Akira is a multipurpose Discord bot."
      />
    </Head>
    <Main>
      <Heading>{pkg.name}</Heading>
    </Main>
  </Fragment>
)

export default Home
