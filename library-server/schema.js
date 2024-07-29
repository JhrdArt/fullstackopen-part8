const { gql } = require("apollo-server");

const typeDefs = gql`
  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }

  input AuthorInput {
    name: String!
    born: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  
  type Subscription {
    bookAdded: Book!
  }

  type Mutation {
    addBook(
      title: String!
      author: AuthorInput
      published: Int!
      genres: [String!]
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author

    createUser(username: String!, favoriteGenre: String!): User

    login(username: String!, password: String!): Token

    editGenres(title: String!, setGenresTo: [String!]!): Book
  }
`;

module.exports = typeDefs;
