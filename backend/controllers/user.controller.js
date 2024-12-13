import { dbController } from '../db.js'
import { albumController } from './album.controller.js'

const collection = 'users'

const userController = {


	async getUsers() {
		return await dbController.findAll(collection)
	},

	async getUserById(id) {
		return await dbController.findOneById(collection, id)	
	},

	async getUserByUsername(username) {
		return await dbController.findOneWithQuery(collection, {username: username})
	},

	async getUserByEmail(email) {
		return await dbController.findOneWithQuery(collection, {email: email})
	},
	
	/// registers a new user
	async registerUser(username, email, password, favoriteHero) {
		// @todo create the view with the unique fileds to make this work correctly
		const document = {
			username: username,
			email: email,
			password: password,
			favoriteHero: favoriteHero,
			credits: 100
		}
		const op = await dbController.insertDocument(collection, document)
		await albumController.createAlbum(op.insertedId)
	},
	
	/// updates an existing user
	async updateUser(id, update) {
		await dbController.updateDocumentById(collection, id, update)
	},

	async deleteUser(id) {
		await dbController.deleteteDocumentById(collection, id)
	},
	
	// add credits to a specific user
	async addCreditsTo(id, credits) {
		const user = await this.getUserById(id)
		await dbController.updateDocumentById(
			collection,
			id,
			{credits: user.credits + credits}
		)
	},	

	// checks if such user has enough credits for the operation and then scales them
	async checkAndScaleCredits(id, requiredCredits) {
		const user = await this.getUserById(id)
		if (user.credits >= requiredCredits) {
			await dbController.updateDocumentById(
				collection, 
				id, 
				{credits: user.credits - requiredCredits}
			)
		} else {
			throw new Error("Not enough credits")
		}
	}
}

export { userController }
