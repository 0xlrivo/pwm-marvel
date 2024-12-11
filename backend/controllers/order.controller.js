import { dbController } from '../db.js'

const collection = 'orders'

const orderController = {

	async getAllOrder() {
		return await dbController.findAll(collection)
	},
	
	// returns all of the active orders waiting for a filler
	async gettAllUnfilledOrders() {
		return await dbController.findWithQuery(collection, {filledBy: null})
	},

	async getOrderById(id) {
		return await dbController.findWithQuery(collection, {_id: id})
	},
	
	// returns all of the orders created by userId
	async getOrdersCreatedBy(userId) {
		return await dbController.findWithQuery(collection, {creator: userId})
	},
	
	// returns all of the orders filled by userId
	async getOrdersFilledBy(userId) {
		return await dbController.findWithQuery(collection, {filledBy: userId})
	}

}

export { orderController }
