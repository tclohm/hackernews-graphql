const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
	const password = await bcrypt.hash(args.password, 10)
	const user = await context.prisma.user.create({ data: { ...args, password } })
	const token = jwt.sign({ userId: user.id }, APP_SECRET )

	return {
		token, 
		user,
	}

}

async function login(parent, args, context, info) {
	const user = await context.prisma.user.findOne({ where: { email: args.email }})
	if (!user) {
		throw new Error('No such user found')
	}

	const valid = await bcrypt.compare(args.password, user.password)
	if (!valid) {
		throw new Error('Invalid password')
	}

	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	return { 
		token, 
		user, 
	}
}

function post(parent, args, context, info) {
	const userId = getUserId(context)
	return context.prisma.link.create({
		data: {
			url: args.url, 
			description: args.description,
			postedBy: { connect: { id: userId } },
		}
	})
}

function updateLink(parent, args, context, info) {
	const userId = getUserId(context)
	const found = context.prisma.link.findOne({
		where: { id: Number(args.id) }
	})
	return context.prisma.link.update({
		where: { id: Number(args.id) },
		data: {
			url: args.url ? args.url : found.url,
			description: args.description ? args.description : found.description,
			postedBy: { upsert: { id: userId } },
		}
	})
}

function deleteLink(parent, args, context, info) {
	return context.prisma.link.delete({
		where: { id: Number(args.id) }
	})
}

module.exports = {
	signup,
	login,
	post,
	updateLink,
	deleteLink,
}