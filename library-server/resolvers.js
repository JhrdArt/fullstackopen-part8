const { GraphQLError } = require("graphql");
const { UserInputError, AuthenticationError } = require("apollo-server");

const { PubSub } = require("graphql-subscriptions/dist/pubsub");
const pubsub = new PubSub();

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    me: (root, args, context) => {
      console.log("current user: ", context.currentUser);
      return context.currentUser;
    },
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => {
      return Author.find({});
    },
    allBooks: async (root, args) => {
      if (args.author && args.genres) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({
          $and: [
            { author: { $in: author.id } },
            { genres: { $in: args.genres } },
          ],
        }).populate("author");
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({ author: { $in: author.id } }).populate("author");
      }

      if (args.genre) {
        return await Book.find({ genres: args.genre }).populate("author");
      }

      return Book.find({}).populate("author");
    },
  },

  Author: {
    bookCount: async (root, args) => {
      const author = await Author.findOne({ name: root.name });
      const books = await Book.find({ author: author.id });
      return books.length;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      console.log("args", args);
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError("Not authenticated", {
          code: "BAD_USER_INPUT",
        });
      }

      let author = await Author.findOne({ name: args.author.name });
      if (!author) {
        author = new Author({ ...args.author });
        try {
          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, { invalidArgs: args });
        }
      }

      const existingBook = await Book.findOne({
        title: args.title,
        author: author._id,
      });

      if (existingBook) {
        throw new UserInputError("Book already exists", {
          invalidArgs: args.title,
        });
      }

      const book = new Book({ ...args, author });

      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("Not authenticated");
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) return null;

      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }

      return author;
    },

    createUser: async (root, args) => {
      const { username, password, favoriteGenre } = args;
      // const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ username, favoriteGenre });

      return user.save().catch((error) => {
        throw new GraphQLError("creating user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    editGenres: async (root, args, { currentUser }) => {
      console.log("ediGenres", args);
      if (!currentUser) {
        throw new AuthenticationError("Not authenticated");
      }

      const book = await Book.findOne({ title: args.title });
      if (!book) return null;

      // const newBook = [{...book, genres: args.setGenresTo}]
      book.genres = args.setGenresTo;

      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }

      return book;
    },

    login: async (root, args) => {
      const { username, password } = args;
      console.log("args: ", args);
      const user = await User.findOne({ username });
      console.log("user:", user);
      if (!user || password !== "secret") {
        throw new UserInputError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      // const passwordMatch = await bcrypt.compare(password, user.password);
      // if (!passwordMatch) {
      //   throw new GraphQLError("wrong credentials", {
      //     extensions: { code: "BAD_USER_INPUT" },
      //   });
      // }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
