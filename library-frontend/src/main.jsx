import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

const authLink = setContext((_, { headers }) => {
  try {
    const token = localStorage.getItem("library-user-token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : null
      }
    };
  } catch (error) {
    console.error("Error retrieving token from localStorage:", error);
    return { headers };
  }
});

console.log("authLink", authLink)

const httpLink = createHttpLink({
  uri: "http://localhost:4000/"
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true
  }
})
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
});

console.log("client", client)

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
