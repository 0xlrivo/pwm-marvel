const express = require('express');
const { orderController } = require('../controllers/order.controller')
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

router.get('/getAllUnfilledOrder', async(req, res) => {
	try {
		const orders = await orderController.gettAllUnfilledOrders()
		res.status(200).json(orders)
	} catch (err) {
		console.log(err)
		res.status(500).json()
	}
})

// [PROTECTED]
router.put('/createOrder', async(req, res) => {
	try {
		const creatorId = req.user._id; // JWT
		const offer = req.body.offer;
		const request = req.body.request;
		await orderController.createOrder(creatorId, offer, request)
		res.status(201).json({"message": "order created"})
	} catch (err) {
		console.log(err)
		res.status(500).json()
	}
})

// [PROTECTED]
router.post('/fillOrder', async(req, res) => {
	try {
		const fillerId = req.user._id; // JWT
		const orderId = req.body.orderId;
		await orderController.fillOrder(orderId, fillerId)
		res.status(200).json({"message": "order filled"})
	} catch (err) {
		console.log(err)
		res.status(500).json()
	}
})


// [PROTECTED]
router.delete('/deleteOrder', async(req, res) => {
	try {
		const callerId = req.user._id; // JWT
		const orderId = req.body.orderId;
		await orderController.deleteOrder(callerId, orderId)
		res.status(200).json({"message": "order deleeted"})
	} catch (err) {
		console.log(err)
		res.status(500).json()
	}
})

module.exports = router
