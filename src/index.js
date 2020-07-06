const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client')

// graphQL schema, defines simple query called info
// schema has three special root types: query, mutation, subscription
// const typeDefs;

// actual implementation of graphQL schema
// structure is identical of type definition inside typeDefs: Query.info
const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		// context arg entire prisma client instance
		feed: async (parent, args, context) => {
			return context.prisma.link.findMany()
		},
		link: (parent, args, context) => {
			return context.prisma.link.findOne({
				where: {
					id: Number(args.id)
				}
			})
		}
	},
	Mutation: {
		post: (parent, args, context, info) => {
			const newLink = context.prisma.link.create({
				data: {
					url: args.url,
					description: args.description,
				},
			})
			return newLink
		},
		updateLink: (parent, args, context, info) => {
			const found = context.prisma.link.findOne({
				where: { id: Number(args.id) }
			});

			const link = context.prisma.link.update({
				where: { id: Number(args.id) },
				data: {
					url: args.url ? args.url : found.url,
					description: args.description ? args.description : found.description
				}
			})
			return link
		},
		deleteLink: (parent, args, context, info) => {
			const link = context.prisma.link.delete({
				where: { id: Number(args.id) },
			})
			return link
		}
	}
};

const prisma = new PrismaClient()

// schema and resolvers are bundled and passed to the GraphQLServer which is imported from graphql-yoga
const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	context: request => {
		...request,
		prisma,
	}
});

server.start(() => console.log(`🚀 Server is running on 4000`))
