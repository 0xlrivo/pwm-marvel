import { dbController } from '../db.js'

const collection = 'users'

const userController = {


	async getUsers() {
		return await dbController.findAll(collection)
	},

	async getUserById(id) {
		return await dbController.findWithQuery(collection, {_id: id})	
	},

	async getUserByUsername(username) {
		return await dbController.findWithQuery(collection, {username: username})
	},

	async getUserByEmail(email) {
		return await dbController.findWithQuery(collection, {email: email})
	},
	
	/// registers a new user
	async registerUser(username, email, password, favoriteHero) {
		// @todo create the view with the unique fileds to make this work correctly
		const document = {
			username: username,
			email: email,
			password: password,
			favoriteHero: favoriteHero
		}
		await dbController.insertDocuments(collection, [document])
	},
	
	/// updates an existing user
	async updateUser(id, update) {
		await dbController.updateDocument(collection, {_id: id}, update)
	},

	async deleteUser(id) {
		await dbController.deleteDocuments(collection, {_id: id})
	}

}

export { userController }
