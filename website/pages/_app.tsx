import { ChakraProvider } from "@chakra-ui/react"
import type { AppProps } from "next/app"
import Head from "next/head"
import { theme } from "../theme"

const App = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider theme={theme}>
    <Head>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
    </Head>
    <Component {...pageProps} />
  </ChakraProvider>
)

export default App
