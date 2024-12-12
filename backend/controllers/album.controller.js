import { ObjectId } from 'mongodb'
import { dbController } from '../db.js'
import { marvelController } from '../marvel.js'
import { userController } from './user.controller.js'

const collection = 'albums'

const albumController = {

	async getAlbumById(id) {
		return await dbController.findOneById(collection, id)
	},

	async getAlbumOwnedBy(ownerId) {
		return await dbController.findOneWithQuery(collection, {ownerId: new ObjectId(ownerId)})
	},
	
	async getCardsData(id) {
		const album = await this.getAlbumById(id)
		let result = []
		for (card in album.cards) {
			result.push(await marvelController.getCharacterById(card.id))
		}
		return result;
	},

	// creates a new album
	async createAlbum(ownerId, description) {
		const document = {
			ownerId: ownerId,
			descriptiton: description,
			cards: []
		}
		await dbController.insertDocument(collection, document)
	},

	// update an album
	async updateAlbum(id, update) {
		await dbController.updateDocumentById(collection, id, update)
	},
	
	// opens a packet and accredits the cards to the recipient
	async openPacket(recipientId) {
		const recipient = await userController.getUserById(recipientId)
		const album = await this.getAlbumOwnedBy(recipientId)
		
		// throws if the user doesn't have enough credits
		await userController.checkAndScaleCredits(recipientId, 10)

		// generate 10 random id
		let content = []
		for (let i = 0; i < 10; i++) {
			content.push(Math.floor(Math.random() * 100000))	
		}
		
		// add cards to the user's album @todo

		return content
	},
	
	async updateCards(albumId, newCards) {
		const album = await this.getAlbumById(albumId)
		// @todo handle duplicate cards accountting
	}
}

export { albumController }
