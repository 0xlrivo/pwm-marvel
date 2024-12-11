import { dbController } from '../db.js'

const collection = 'orders'

const orderController = {

	async getAllOrder() {
		return await dbController.findAll(collection)
	},
	
	// returns all of the active orders waiting for a filler
	async gettAllUnfilledOrders() {
		return await dbController.findWithQuery(collection, {fillerId: null})
	},

	async getOrderById(id) {
		return await dbController.findWithQuery(collection, {_id: id})
	},
	
	// returns all of the orders created by userId
	async getOrdersCreatedBy(userId) {
		return await dbController.findWithQuery(collection, {creatorId: userId})
	},
	
	// returns all of the orders filled by userId
	async getOrdersFilledBy(userId) {
		return await dbController.findWithQuery(collection, {fillerId: userId})
	},
	
	// creates a new order
	// @param creatorId id of the user that is creatting the order
	// @param offer the offer made by the creator (cards, credits)
	// @param request what cards/credits the creator expects from the filler
	async createOrder(creatorId, offer, request) {
		if (!offer.cards || !offer.credits || !request.cards || !request.credits) {
			return
		}
		const order = {
			creatorId: creatorId,
			offer: offer,
			request: request
		}
		await dbController.insertDocuments(collection, [order])	
	},

	// fill an order
	// @param orderId the order id to fill
	async fillOrder(orderId, fillerId) {
		const order = await this.getOrderById(orderId)[0]
		const creator = await dbController.findWithQuery('users', {_id: order.creatorId})
		const filler = await dbController.findWithQuery('users', {_id: fillerId})

		// sanitizations
		if (order.fillerId !== null) {
			return;
		}
		if (order.creatorId === fillerId) {
			return;
		}
		// check that the filler has enough credits to fullfill the request
		if (filler.credits < order.request.credits) {
			return
		}
		// check that the owner has enough credits to fulfill the offer
		if (creator.credits < order.offer.credits) {
			return;
		}
		
		// decrement credits from both parties
		creator.credits -= order.offer.credits
		filler.credits -= order.request.credits
		
		// add cards to both parties
		// @todo
		
		// write back changes
		await dbController.replaceDocument(collection, {_id: order.creatorId}, creator)
		await dbController.replaceDocument(collection, {_id: fillerId}, filler)

	},

	// allwows the owner of an order to delete it
	// @param callerId the id of the user trying to delete this order
	// @param orderId the order to delete
	async deleteOrder(callerId, orderId) {
		const order = this.getOrderById(orderId)[0]
		if (order.creatorId !== callerId) {
			console.log("error invalid owner")
			return
		}
		await dbController.deleteDocuments(collection, {_id: id})
	}
	
}

export { orderController }
