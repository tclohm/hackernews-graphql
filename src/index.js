const { GraphQLServer } = require('graphql-yoga')
const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: '.env' })
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')

const { PubSub } = require('graphql-yoga')

const pubsub = new PubSub()

// graphQL schema, defines simple query called info
// schema has three special root types: query, mutation, subscription
// const typeDefs;

// actual implementation of graphQL schema
// structure is identical of type definition inside typeDefs: Query.info
const resolvers = {
	Query,
	Mutation,
	Subscription,
	User,
	Link,
	Vote,
};

const prisma = new PrismaClient()

// schema and resolvers are bundled and passed to the GraphQLServer which is imported from graphql-yoga
const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	context: request => {
		return {
			...request,
			prisma,
			pubsub
		}
	},
});

const port = process.env.PORT || 4000

server.start(() => console.log(`🚀 Server is running on ${port}`))
