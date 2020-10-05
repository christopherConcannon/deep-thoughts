// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs.  All type definitions need to specify what type of data is expected in return, no matter what
const typeDefs = gql`
${/*custom data type*/''}
type User {
  _id: ID 
  username: String
  email: String
  friendCount: Int
  thoughts: [Thought]
  friends: [User]
}

type Thought {
  _id: ID
  thoughtText: String
  createdAt: String
  username: String
  reactionCount: Int
  reactions: [Reaction]
}
${/* nested in the Thought type */''}
type Reaction {
  _id: ID
  reactionBody: String
  createdAt: String
  username: String
}

type Auth {
  token: ID!
  user: User
}

type Query {
  me: User
  users: [User]
  user(username: String!): User
  thoughts(username: String): [Thought]
  thought(_id: ID!): Thought
}

type Mutation {
  login(email: String!, password: String!): Auth
  ${/*addUser(username: String!, email: String!, password: String!): Auth*/''}
  addUser(username: String!, email: String!, password: String!): User
  addThought(thoughtText: String!): Thought
  addReaction(thoughtId: ID!, reactionBody: String!): Thought
  addFriend(friendId: ID!): User
}

`;

// export the typeDefs
module.exports = typeDefs;