import { ObjectId } from 'mongodb'
import { dbController } from '../db.js'
import { userController } from './user.controller.js'

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
		if (!offer.cards || !offer.credits || !request.cards || !request.credits) {
			return
		}

		// check that creator has enough credits and scale those immediately
		await userController.checkAndScaleCredits(creatorId, offer.credits)

		const order = {
			creatorId: creatorId,
			offer: offer,
			request: request
		}
		await dbController.insertDocument(collection, order)	
	},

	// fill an order
	// @param orderId the order id to fill
	async fillOrder(orderId, fillerId) {
		const order = await this.getOrderById(orderId)

		// sanitizations
		if (order.fillerId !== null) {
			return;
		}
		if (order.creatorId === fillerId) {
			return;
		}
		
		// now try to add cards to both

	},

	// allwows the owner of an order to delete it
	// @param callerId the id of the user trying to delete this order
	// @param orderId the order to delete
	async deleteOrder(callerId, orderId) {
		const order = this.getOrderById(orderId)
		if (order.creatorId !== callerId) {
			console.log("error invalid owner")
			return
		}

		// refund order creator
		await userController.addCredits(order.creatorId, order.offer.credits)
		
		// remove the order from database
		await dbController.deleteteDocumentById(collection, id)
	}
	
}

export { orderController }
