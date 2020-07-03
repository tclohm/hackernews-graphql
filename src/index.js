const { GraphQLServer } = require('graphql-yoga');

// graphQL schema, defines simple query called info
// schema has three special root types: query, mutation, subscription
// const typeDefs;

let links = [{
		id: 'link-0',
		url: 'www.youtube.com',
		description: 'heaps of bad videos'
	},
	{
		id: 'link-1',
		url: 'www.vimeo.com',
		description: 'better quality videos'
	},
	{
		id: 'link-2',
		url: 'www.netflix.com',
		description: 'industry shaker'
	}
];

// actual implementation of graphQL schema
// structure is identical of type definition inside typeDefs: Query.info
let idCount = links.length
const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: () => links,
		link: (parent, args) => links.find(link => args.id == link.id)
	},
	Mutation: {
		post: (parent, args) => {
			const link = {
				id: `link-${idCount++}`,
				description: args.description,
				url: args.url,
			}
			links.push(link)
			return link
		},
		updateLink: (parent, args) => {
			let link = links.find(link => link.id == args.id)
			link.url = (args.url == undefined) ? link.url : args.url
			link.description = (args.description == undefined) ? link.description : args.description 
			return link
		},
		deleteLink: (parent, args) => {
			let link = links.find(el => el.id == args.id)
			let index = links.indexOf(link)
			links.splice(index, 1)
			return link
		}
	}
};

// schema and resolvers are bundled and passed to the GraphQLServer which is imported from graphql-yoga
const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers
});

server.start(() => console.log(`🚀 Server is running on 4000`))
