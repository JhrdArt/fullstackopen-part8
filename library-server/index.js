const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log("Connecting to MONGODB");

const User = require("./models/user");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`connected to Mongo`);
  })
  .catch((error) =>
    console.log(`Error connection to MONGODB: ${error && error.message}`)
  );

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;

    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      console.log("currentUser", currentUser);
      return { currentUser };
    }
  },
}).then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});

// server.listen(4000).then(({ url }) => {
//   console.log(`Server ready at ${url}`);
// });
