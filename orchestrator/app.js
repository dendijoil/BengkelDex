if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { ApolloServer } = require("apollo-server");
const workshopSchema = require("./schemas/workshop");

const server = new ApolloServer({
  typeDefs: [workshopSchema.typeDefs],
  resolvers: [workshopSchema.resolvers],
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});