const express = require('express');
const { userController } = require('../controllers/user.controller')

const router = express.Router()

router.get('/getAllUsers', async(req, res) => {
	res.json(await userController.getUsers())
})

router.get('/getUserById/:id', async(req, res) => {
	res.json(await userController.getUserById(id))
})

router.post('/register', async(req, res) => {
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const favoriteHero = req.body.favoriteHero;
	if (!username || !email || !password || !favoriteHero) {
		res.status(400).json()
	}
	else {
		await userController.registerUser(username, email, password, favoriteHero)
		res.status(201).json({"message": "user registered"})
	}
})

router.post('/login', async(req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if (!username || !password) {
		res.status(400).json()
	}
	else {
		const user = await userController.getUserByUsername(username)
		if (user && user[0].password === password) {
			// @todo generate JWT token
			res.status(200).json()
		}
		else {
			res.status(401).json({"message": "invalid username or password"})
		}
	}
})

router.put('/editProfile', async(req, res) => {
	const userId = req.user._id // from JWT
	await userController.updateUser(userId, {username: req.body.username})
	res.status(201).json({"message": "user updated"})
})

router.delete('/deleteProfile', async(req, res) => {
	const userId = req.user._id;
	await userController.deleteUser(userId)
	res.status(200).json({"message": "user deleted"})
})

module.exports = router
