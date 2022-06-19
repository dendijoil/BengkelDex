const { gql } = require("apollo-server");
const axios = require("axios");
const Redis = require("ioredis");
const redis = new Redis();

const typeDefs = gql`
  type Workshop {
    id: ID!
    name: String!
    address: String
    statusOpen: Boolean!
    balance: Int!
    location: Point
  }

  type Query {
    getWorkshop(id: ID!): Workshop
    getWorkshops: [Workshop]
  }
`;

const resolvers = {
  Query: {
    getWorkshops: async () => {
      try {
        const workshops = await axios.get(
          "https://localhost:4002/workshops"
        );
        return workshops.data;
      } catch (error) {
        
      }
    }
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
