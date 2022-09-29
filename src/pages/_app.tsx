import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";

import { ClientSetup } from "../graphql";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={ClientSetup}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
