import jwt from 'jsonwebtoken' 
import { albumController } from '../controllers/album.controller.js'

const secret = process.env.JWT_SECRET

async function generateJWT(userId) {
	const userAlbum = await albumController.getAlbumOwnedBy(userId)
	console.log(userAlbum)
	const payload = {
		id: userId,
		albumId: userAlbum._id
	}
	const token = jwt.sign(payload, secret, {expiresIn: '24h'})
	return token
}

function authenticateRoute(req, res, next) {
	const authHeader = req.headers['authorization']
	
	if (!authHeader) {
		res.status(401).json({"msg": "no auth token provided"})
	}

	const token = authHeader.split(' ')[1] // Bearer <token> 

	if (!token) {
		res.status(401).json({"msg": "no auth token provided"})
	}

	// verify the JWT token validity
	jwt.verify(token, secret, (err, decoded) => {
		// handle the error in case
		if (err) {
			let msg
			switch (err.name) {
				case 'TokenExpiredError':
					msg = 'token expired'
					break
				default:
					msg = 'invalid token'
					break
			}	
			res.status(401).json({"message": msg})
		} else {
			// add the user object to the request
			req.user = decoded
			// pass on the protected routet
			next()
		}
	}) 
	
}

export { generateJWT, authenticateRoute }
