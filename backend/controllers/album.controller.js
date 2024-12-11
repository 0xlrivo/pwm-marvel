import { dbController } from '../db.js'

const collection = 'albums'

const albumController = {

	async getAlbumById(id) {
		return await dbController.findWithQuery(collection, {_id: id}, 1)
	},

	async getAlbumOwnedBy(ownerId) {
		return await dbController.findWithQuery(collection, {ownerId: ownerId}, 1)
	},
	
	// creates a new album
	async createAlbum(ownerId, description) {
		const document = {
			ownerId: ownerId,
			descriptiton: description,
			cards: []
		}
		await dbController.insertDocuments(collection, [document])
	},

	// update an album
	async updateAlbum(id, update) {
		await dbController.updateDocument(collection, {_id: id}, update)
	}

}

export { albumController }
