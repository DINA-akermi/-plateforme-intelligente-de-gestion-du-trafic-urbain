import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, concat } from '@apollo/client';

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    }
  });

  return forward(operation);
});

const createClient = (uri) => {
  const httpLink = createHttpLink({ uri });
  return new ApolloClient({
    link: concat(authMiddleware, httpLink),
    cache: new InMemoryCache(),
  });
};

// Using 127.0.0.1 instead of localhost for better Windows compatibility
export const authClient = createClient('http://127.0.0.1:4001/graphql');
export const incidentClient = createClient('http://127.0.0.1:4004/graphql');
export const trafficClient = createClient('http://127.0.0.1:4006/graphql');
export const notificationClient = createClient('http://127.0.0.1:4005/graphql');
export const vehicleClient = createClient('http://127.0.0.1:4003/graphql');
