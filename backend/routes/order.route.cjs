const express = require('express');
const { orderController } = require('../controllers/order.controller')
const { authenticateRoute} = require('../middlewares/auth.middleware')
const router = express.Router()

router.get('/getAllOrders', async(req, res) => {
	try {
		const orders = await orderController.getAllOrder()
		res.status(200).json(orders)
	} catch (err) {
		console.log(err)
		res.status(500).json()
	}
})

router.get('/getAllUnfilledOrders', async(req, res) => {
	try {
		const orders = await orderController.gettAllUnfilledOrders()
		res.status(200).json(orders)
	} catch (err) {
		console.log(err)
		res.status(500).json()
	}
})

// [PROTECTED]
router.put('/createOrder', authenticateRoute, async(req, res) => {
	try {
		const creatorId = req.user.id; // JWT
		const offer = req.body.offer;
		const request = req.body.request;
		await orderController.createOrder(creatorId, offer, request)
		res.status(201).json({"message": "order created"})
	} catch (err) {
		console.error(err)
		res.status(400).json({"message": err.message})
	}
})

// [PROTECTED]
router.post('/fillOrder/:orderId', authenticateRoute, async(req, res) => {
	try {
		const fillerId = req.user.id; // JWT
		const orderId = req.params.orderId;
		await orderController.fillOrder(orderId, fillerId)
		res.status(200).json({"message": "order filled"})
	} catch (err) {
		res.status(500).json({"message": err.message})
	}
})


// [PROTECTED]
router.delete('/deleteOrder/:orderId', authenticateRoute, async(req, res) => {
	try {
		const callerId = req.user.id; // JWT
		const orderId = req.params.orderId;
		await orderController.deleteOrder(callerId, orderId)
		res.status(200).json({"message": "order deleted"})
	} catch (err) {
		res.status(400).json({"message": err.message})
	}
})

module.exports = router
