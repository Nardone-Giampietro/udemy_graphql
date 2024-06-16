import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `
    #graphql
    type Query {
        greeting: String
    }
`;

const resolvers = {
    Query: {
        greeting: () => {
            return "Hello World!";
        }
    },
};

const server = new ApolloServer({typeDefs, resolvers});
const info = await startStandaloneServer(server, {listen: {port: 3000}});
console.log("Server started at: ", info.url);
