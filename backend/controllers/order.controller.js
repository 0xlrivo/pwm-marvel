import { ObjectId } from 'mongodb'
import { dbController } from '../db.js'
import { userController } from './user.controller.js'
import { albumController } from './album.controller.js'

const collection = 'orders'

/*
	order {
		creatorId:  ObjectId
		fillerId : ObjectId   (NULL se unfilled)
		offer: {
			cards: [] Array,
			credits: Number

			// what the creator is offering to the filler
		},
		request: {
			cards: [] Array,
			credits: Number

			// what the creator is requesting the filler
		}
	}
*/

const orderController = {

	async getAllOrder() {
		return await dbController.findAll(collection)
	},
	
	// returns all of the active orders waiting for a filler
	async gettAllUnfilledOrders() {
		return await dbController.findWithQuery(collection, {fillerId: null})
	},

	async getOrderById(id) {
		return await dbController.findOneById(collection, id)
	},
	
	// returns all of the orders created by userId
	async getOrdersCreatedBy(userId) {
		return await dbController.findWithQuery(collection, {creatorId: new ObjectId(userId)})
	},
	
	// returns all of the orders filled by userId
	async getOrdersFilledBy(userId) {
		return await dbController.findWithQuery(collection, {fillerId: new ObjectId(userId)})
	},
	
	// creates a new order
	// @param creatorId id of the user that is creatting the order
	// @param offer the offer made by the creator (cards, credits)
	// @param request what cards/credits the creator expects from the filler
	async createOrder(creatorId, offer, request) {

		// @todo if this throw, without try catch, execution stops?
		// make sure order creator has enough credits
		if (offer.credits > 0) {
			await userController.checkAndScaleCredits(creatorId, offer.credits)
		}
		
		const creatorAlbum = albumController.getAlbumOwnedBy(creatorId)

		// assert creator has the cards he's offering
		let cards = order.offer.cards
		for (let i = 0; i < cards.length; i++) {
			if (creatorAlbum.cards.indexOf(cards[i]) !== -1)
				throw new Error("Cannot offer cards you don't have")

			// also check that he's not requesting same card
			if (order.request.cards.indexOf(cards[i]) !== -1) {
				throw new Error("Cannot request same card you offered")
			}
		}
		
		// write the order in database
		const order = {
			creatorId: creatorId,
			fillerId: null,
			offer: offer,
			request: request
		}
		await dbController.insertDocument(collection, order)	
	},

	// fill an order
	// @param orderId the order id to fill
	// @param user id of the filler
	async fillOrder(orderId, fillerId) {
		const order = await this.getOrderById(orderId)
		// input validation
		if (!order) {
			throw new Error("Order don't exists")
		}
		if (order.fillerId !== null) {
			throw new Error("Order already filled")
		}
		if (order.creatorId === fillerId) {
			throw new Error("Cannot fill your own orders")
		}
		
		// fetch both albums
		const creatorAlbum = await albumController.getAlbumOwnedBy(order.creatorId);
		const fillerAlbum = await albumController.getAlbumOwnedBy(fillerId)

		// remove offer cards from tthe creator album and	
		// add offer cards to the filler
		let cards = order.offer.cards
		for (let i = 0; i < cards.length; i++) {
			
			// remove from creator album
			creatorAlbum.cards.splice(creatorAlbum.cards.indexOf(cards[i]), 1)
			
			// if duplicate card
			if (fillerAlbum.cards.indexOf(cards[i]) !== -1) {
				throw new Error("Filler already has this card")
			} else {
				fillerAlbum.cards.push(cards[i])
			}
		}
		
		// add filler cards to the creator of the order
		cards = order.request.cards
		for (let i = 0; i < cards.length; i++) {
			fillerAlbum.cards.splice(fillerAlbum.cards.indexOf(cards[i]), 1)
			// if duplicate card
			if (creatorAlbum.cards.indexOf(cards[i]) !== -1) {
				throw new Error("Creator already has this card")
			} else {
				creatorAlbum.cards.push(cards[i])
			}
		}
		
		// assert filler has enough credits
		await userController.checkAndScaleCredits(fillerId, order.request.credits)
		
		// add the offer credits to the filler
		await userController.addCreditsTo(fillerId, order.offer.credits)

		// update the albums
		await albumController.replaceAlbum(creatorAlbum._id, creatorAlbum)
		await albumController.replaceAlbum(fillerAlbum._id, fillerAlbum)
		
		// mark the order as filled
		await dbController.updateDocumentById(collection, orderId, {fillerId: fillerId})
	},

	// allwows the owner of an order to delete it
	// @param callerId the id of the user trying to delete this order
	// @param orderId the order to delete
	async deleteOrder(callerId, orderId) {
		const order = await this.getOrderById(orderId)

		if (!order) {
			throw new Error("Inexistent order")
		}
		if (order.creatorId !== callerId) {
			throw new Error("You don't own this order")
		}

		// refund offer creator
		if (order.offer.credits > 0) {
			await userController.addCreditsTo(callerId, order.offer.credits)
		}
		
		// remove the order from database
		await dbController.deleteteDocumentById(collection, order._id)
	}
	
}

export { orderController }
