import cors from 'cors';
import { ApolloServer } from "@apollo/server";
import {expressMiddleware as apolloMiddleware} from "@apollo/server/express4";
import express from 'express';
import { readFile } from "node:fs/promises";
import { authMiddleware, handleLogin } from './auth.js';
import {resolvers} from "./resolvers.js";
import {getUser} from "./db/users.js";
import {createCompanyLoader} from "./db/companies.js";

const PORT = 9000;
const app = express();
const typeDefs = await readFile("./schema.graphql", "utf-8");
const apolloServer = new ApolloServer({ typeDefs, resolvers} );
await apolloServer.start();

async function getContext({req}){
  const companyLoader = createCompanyLoader();
  const context = {companyLoader};
  if (req.auth) {
    context.user = await getUser(req.auth.sub);
  }
  return context;
}

app.use(cors(), express.json(), authMiddleware);
app.post('/login', handleLogin);
app.use("/graphql", apolloMiddleware(apolloServer, {context: getContext}));


app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
