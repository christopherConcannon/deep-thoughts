const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // if user has been returned by authMiddleware...ie validated user
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id})
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');
  
          return userData
      }

      throw new AuthenticationError('Not logged in');
    },
    // get all thoughts. parent (1st arg) is a placeholder in this case
    thoughts: async (parent, { username }) => {
      // if optional username string was passed, use it, otherwise don't
      const params = username ? { username } : {}
      return Thought.find(params).sort({ createdAt: -1 })
    },
    // get single thought by id
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id })
    },
    // get all users
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      // sign a token and return an object that combines the token with the user's data
      const token = signToken(user);

      return { token, user};
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials')
      }

      const correctPw = await user.isCorrectPassword(password)

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials')
      }
      // if password is correct, sign token and return token and user
      const token = signToken(user);
      return { token, user };
    },

    addThought: async (parent, args, context) => {
      // only logged in users can add thought
      if (context.user) {
        const thought = await Thought.create({ ...args, username: context.user.username });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );

        return thought;
      }

      throw new AuthenticationError('You need to be logged in');
    },

    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        // add reaction to Thought's reaction array
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $push: { reactions: { reactionBody, username: context.user.username } } },
          { new: true, runValidators: true }
        )

        return updatedThought;
      }

      throw new AuthenticationError('You need to be logged in');
    }, 

    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        // add friend's user id to user's friends array
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          // prevent duplicate entries with addToSet
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate('friends');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in');
    }

  }
}

module.exports = resolvers;