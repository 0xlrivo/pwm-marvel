const express = require('express');
const { albumController } = require('../controllers/album.controller')
const router = express.Router()

router.get('/getAlbumOf:id', async (req, res) => {
	try {
		const id = req.params.id
		const album = await albumController.getAlbumOwnedBy(id)
		res.status(200).json(album)
	} catch (err) {
		console.log(err)
		res.status(500).json()
	}
})

module.exports = router
