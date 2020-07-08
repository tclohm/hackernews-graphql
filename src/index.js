const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client')

require('dotenv').config({ path: '.env' })

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

// graphQL schema, defines simple query called info
// schema has three special root types: query, mutation, subscription
// const typeDefs;

// actual implementation of graphQL schema
// structure is identical of type definition inside typeDefs: Query.info
const resolvers = {
	Query,
	Mutation,
	User,
	Link
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
		}
	},
});

const port = process.env.PORT || 4000

server.start(() => console.log(`🚀 Server is running on ${port}`))
