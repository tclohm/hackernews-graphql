const jwt = require('jsonwebtoken')
const APP_SECRET = process.env.SECRET || 'helloworld'
console.log(APP_SECRET)

function getUserId(context) {
	const Auth = context.request.get('Authorization')
	if (Auth) {
		const token = Auth.replace('Bearer ', '')
		const { userId } = jwt.verify(token, APP_SECRET)
		return userId
	}

	throw new Error('Not authenticated')
}

module.exports = {
	APP_SECRET,
	getUserId,
}