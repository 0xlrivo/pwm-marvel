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

		const creator = userController.getUserById(creatorId)
		const creatorAlbum = await albumController.getAlbumOwnedBy(creatorId)

		console.log(offer)
		console.log(request)

		// creator must have enough credits
		if (offer.credits > 0 && creator.credits < offer.credits) {
			throw new Error("You don't have enough credits")
		}

		// offer cards validation
		let cards = offer.cards
		for (let i = 0; i < cards.length; i++) {
			// find the index of cards[i] in the album cards array
			let idx = creatorAlbum.cards.indexOf(cards[i])

			// check that creator have all the offer cards
			if (idx === -1) {
				throw new Error("Cannot offer cards you don't have")
			}
	
			// also check that he's not requesting a card he's also offering
			if (request.cards.indexOf(cards[i]) !== -1) {
				throw new Error("Cannot request same card you offered")
			}

			// if ok, temporary remove those cards from his album, if he deletes the order he can have them back
			creatorAlbum.cards.splice(idx, 1)
		}
		
		// User state update
		await userController.checkAndScaleCredits(creatorId, offer.credits)

		// Album state update (the creatorAlbum object is modified in-memory and replaced here)
		await dbController.replaceDocumentById('albums', creatorAlbum._id, creatorAlbum)

		// Order state update
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
		if (order.request.cards.length > 3 || order.offer.cards.length > 3) {
			throw new Error("Max 3 cards")
		}
		
		// fetch both albums
		const creatorAlbum = await albumController.getAlbumOwnedBy(order.creatorId);
		const fillerAlbum = await albumController.getAlbumOwnedBy(fillerId)

		// add offer cards to the filler album
		let cards = order.offer.cards
		for (let i = 0; i < cards.length; i++) {			
			// if duplicate card avoid adding it twice to the filler
			if (fillerAlbum.cards.indexOf(cards[i]) === -1) {
				fillerAlbum.cards.push(cards[i])
			}
		}
		
		// add filler cards to the creator of the order
		cards = order.request.cards
		for (let i = 0; i < cards.length; i++) {
			if (fillerAlbum.cards.indexOf(cards[i]) !== -1) {
				fillerAlbum.cards.splice(fillerAlbum.cards.indexOf(cards[i]), 1)
			} else {
				throw new Error("Filler doesn't have this card")
			}
			// if duplicate card
			if (creatorAlbum.cards.indexOf(cards[i]) !== -1) {
				throw new Error("Creator already has this card")
			} else {
				creatorAlbum.cards.push(cards[i])
			}
		}
		
		// assert filler has enough credits
		// (if this fails no state is writted after)
		await userController.checkAndScaleCredits(fillerId, order.request.credits) // @todo non funziona bene l'aggiunta di crediti al filler
		
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

		// recover offer cards to the creator's album (in-memory edit)
		const creatorAlbum = await albumController.getAlbumOwnedBy(callerId)
		let cards = order.offer.cards
		for (let i = 0; i < cards.length; i++) {
			// if he found the card again in some packet avoid re-adding it
			if (creatorAlbum.cards.indexOf(cards[i]) === -1) {
				creatorAlbum.cards.push(cards[i])
			}
		}

		// refund offer creator
		if (order.offer.credits > 0) {
			await userController.addCreditsTo(callerId, order.offer.credits)
		}
		// update the creatorAlbum state
		await dbController.replaceDocumentById('albums', creatorAlbum._id, creatorAlbum)
		// remove the order from database
		await dbController.deleteDocumentById(collection, order._id)
	}
	
}

export { orderController }
