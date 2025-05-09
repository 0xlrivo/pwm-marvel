const express = require('express');
const { albumController } = require('../controllers/album.controller')
const { marvelController  } = require('../marvel')
const { authenticateRoute } = require('../middlewares/auth.middleware')
const router = express.Router()

router.get('/getAlbumOf/:id', async (req, res) => {
	try {
		const id = req.params.id
		const album = await albumController.getAlbumOwnedBy(id)
		res.status(200).json(album)
	} catch (err) {
		console.log(err)
		res.status(500).json()
	}
})

// calls underlying Marvel API to get a single charactter data from his id (/id/full to get more data)
router.get('/getCharacterById/:id/:full?', async (req, res) => {
	try {
		const { id, full } = req.params
		console.log(full)
		const character = await marvelController.getCharacterById(id, full)
		res.status(200).json(character)
	} catch (err) {
		console.log(err)
		res.status(500).json()
	}
})

router.get('/getCharactersByName/:name', async (req, res) => {
	try {
		const name = req.params.name;
		const characters = await marvelController.getCharactersByName(name)
		res.status(200).json(characters)
	} catch (err) {
		console.log(err)
		res.status(500).json()
	}
})

router.get('/getAlbumCardsData/:id', async (req, res) => {
	try {
		const albumId = req.params.id;
		const cardsData = await albumController.getCardsData(albumId)
		res.status(200).json(cardsData)
	} catch (err) {
		console.log(err)
		return err
	}
})

router.post('/getCharactersByIds', async (req, res) => {
	try {
		const ids = req.body.ids;
		if (!ids) 
			throw new Error("no cards id passed")
		const characters = await marvelController.getCharactersByIds(ids)
		res.status(200).json(characters)
	} catch (err) {
		res.status(500).json()
	}
})

router.post('/openPacket', authenticateRoute, async (req, res) => {
	try {
		const owner = req.user.id; // JWT
		const packetContent = await albumController.openPacket(owner)
		res.status(200).json(packetContent)
	} catch (err) {
		res.status(500).json({"message": err.message})
	}
})

router.put('/sellCard/:id', authenticateRoute, async (req, res) => {
	try {
		console.log(req.user.id)
		console.log(req.params.id)
		const owner = req.user.id; // JWT
		await albumController.sellCard(owner, parseInt(req.params.id, 10));
		res.status(200).json()
	} catch (err) {
		res.status(500).json(err)
	}
})

module.exports = router
