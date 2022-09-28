import { ApolloClient, InMemoryCache } from "@apollo/client";

export const ClientSetup = new ApolloClient({
  uri: process.env.URL_GRAPHQL,
  cache: new InMemoryCache(),
});
