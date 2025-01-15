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
		try {
			const document = {
				username: username,
				email: email,
				password: password,
				favoriteHero: favoriteHero,
				credits: 10
			}
			const op = await dbController.insertDocument(collection, document)
			await albumController.createAlbum(op.insertedId)
		} catch (err) {
			if (err.code == 11000) 
				throw new Error("Duplicate username or email")
			else
				throw new Error("Register failed")
		}
	},
	
	/// updates an existing user
	async updateUser(id, update) {
		try {
			await dbController.updateDocumentById(collection, id, update)
		} catch (err) {
			if (err.code == 11000) 
				throw new Error("Duplicate username or email")
			else
				throw new Error("Profile update failed")
		}
	},

	async deleteUser(id) {
		try {
			await dbController.deleteDocumentById(collection, id)
		} catch (err) {
			throw new Error("Profile deletion failed")
		}
	},
	
	// add credits to a specific user
	async addCreditsTo(id, credits) {
		if (!credits) return
		const user = await this.getUserById(id)
		await dbController.updateDocumentById(
			collection,
			id,
			{credits: user.credits + credits}
		)
	},	

	// checks if such user has enough credits for the operation and then scales them
	async checkAndScaleCredits(id, requiredCredits) {
		if (!requiredCredits) return
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
