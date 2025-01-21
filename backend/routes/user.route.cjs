const express = require('express');
const crypto = require('crypto');
const { userController } = require('../controllers/user.controller')
const { generateJWT, authenticateRoute } = require('../middlewares/auth.middleware')
const router = express.Router()

router.get('/getAllUsers', async(req, res) => {
	res.json(await userController.getUsers())
})

router.get('/getUserById/:id', async(req, res) => {
	res.json(await userController.getUserById(req.params.id))
})

router.post('/register', async(req, res) => {
	const username = req.body.username;
	const email = req.body.email;
	let password = req.body.password;
	const favoriteHero = req.body.favoriteHero;
	if (!username || !email || !password || !favoriteHero) {
		res.status(400).json({"message": "invalid user input"})
	}
	else {
		const hash = crypto.createHash('sha256')
		password = hash.update(password).digest('hex')
		try {
			await userController.registerUser(username, email, password, favoriteHero)
			res.status(201).json({"message": "user registered"})
		} catch (err) {
			res.status(400).json({"message": err.message})
		}
	}
})

router.post('/login', async(req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if (!username || !password) {
		res.status(400).json({"message": "invalid user input"})
	}
	else {
		const user = await userController.getUserByUsername(username)
		const hash = crypto.createHash('sha256')
		const hashedPasswod = hash.update(password).digest('hex')
		if (user && user.password === hashedPasswod) {
			const jwt = await generateJWT(user._id)
			res.status(200).json({"token": jwt})
		}
		else {
			res.status(401).json({"message": "invalid username or password"})
		}
	}
})

router.put('/buyCredits', authenticateRoute, async(req, res) => {
	const userId = req.user.id
	await userController.addCreditsTo(userId, Math.floor(Math.random() * (6-1) + 1)) // random credits between 1 and 5
	res.status(201).json({"message": "credits added"})
})

router.put('/editProfile', authenticateRoute, async(req, res) => {
	const userId = req.user.id // from JWT
	if (req.body.password === "") {
		// if password is empty no need to change it
		delete req.body.password;
	} else {
		// otherwise hash it in sha256
		const hash = crypto.createHash('sha256')
		req.body.password = hash.update(req.body.password).digest('hex');
	}
	try {
		await userController.updateUser(userId, req.body)
		res.status(201).json({"message": "user updated"})
	} catch (err) {
		res.status(400).json({"message": err.message})
	}
})

router.delete('/deleteProfile', authenticateRoute, async(req, res) => {
	const userId = req.user.id; // JWT
	try {
		await userController.deleteUser(userId)
		res.status(200).json({"message": "user deleted"})
	} catch (err) {
		console.error(err.message)
		res.status(400).json({"message": err.message})
	}
	
})

module.exports = router
