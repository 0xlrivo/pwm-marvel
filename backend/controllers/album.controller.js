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
		for (let i = 0; i < album.cards.length; i++) {
			result.push(await marvelController.getCharacterById(album.cards[i]))
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

	async replaceAlbum(id, update) {
		await dbController.replaceDocumentById(collection, id, update)
	},

	// opens a packet and accredits the cards to the recipient
	async openPacket(recipientId) {
		const recipient = await userController.getUserById(recipientId)
		const album = await this.getAlbumOwnedBy(recipientId)
		
		// throws if the user doesn't have enough credits
		await userController.checkAndScaleCredits(recipientId, 10)
		
		const generatedCharacters = await marvelController.getRandomCharacters(5)
		console.log(generatedCharacters)

		let content = []
		for (let i = 0; i < 5; i++) {
			let id = generatedCharacters[i].id
			if (album.cards.indexOf(id) === -1) {
				// new cards, so add it to the album
				album.cards.push(id)
				content.push({"id": id, "isDuplicate": false})
			} else {
				// duplicate cards, don't add it
				content.push({"id": id, "isDuplicate": true})
			}
		}
		
		// update the album in the database
		await this.updateAlbum(album._id, album)

		// return the packet's content with duplicate information s for frontend
		return content
	}	
}

export { albumController }
