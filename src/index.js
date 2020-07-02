const { GraphQLServer } = require('graphql-yoga');

// graphQL schema, defines simple query called info
// schema has three special root types: query, mutation, subscription
// const typeDefs;

let links = [{
	id: 'link-0',
	url: 'www.youtube.com',
	description: 'heaps of bad videos'
}];

// actual implementation of graphQL schema
// structure is identical of type definition inside typeDefs: Query.info
const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed:() => links,
	},

	Link: {
		id: (parent) => parent.id,
		description: (parent) => parent.description,
		url: (parent) => parent.url,
	}
};

// schema and resolvers are bundled and passed to the GraphQLServer which is imported from graphql-yoga
const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers
});

server.start(() => console.log(`🚀 Server is running on 4000`))
