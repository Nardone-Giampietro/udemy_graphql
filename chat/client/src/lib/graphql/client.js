import { ApolloClient, ApolloLink, concat, createHttpLink, InMemoryCache, split } from '@apollo/client';
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {createClient as createWsClient} from "graphql-ws";
import { getAccessToken } from '../auth';
import {getMainDefinition} from "@apollo/client/utilities";
import {Kind, OperationTypeNode} from "graphql/language";


const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

const wsLink = new GraphQLWsLink(createWsClient({
  url: "ws://localhost:9000/graphql",
  connectionParams: () => ({authToken: getAccessToken()})
}));

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });


export const apolloClient = new ApolloClient({
  link: split(isSubscription,
      wsLink,
      concat(authLink, httpLink)
      ),
  cache: new InMemoryCache(),
});


function isSubscription(operation) {
  const definition = getMainDefinition(operation.query);
  return definition.kind === Kind.OPERATION_DEFINITION
      && definition.operation === OperationTypeNode.SUBSCRIPTION;
}