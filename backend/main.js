import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerAutogen from 'swagger-autogen'
import { initMongoConnection } from './db.js'
import userRoutes from './routes/user.route.cjs'
import albumRoutes from './routes/album.route.cjs'
import orderRoutes from './routes/order.route.cjs'
const port = process.env.PORT || 3000;

const app = express() 

// middlewares configuration
app.use(
	cors({ 
		origin: 'http://localhost:5173'
	})
)		// CORS
app.use(express.json())				// JSON body parser

// regitser route handlers
app.use('/api/user', userRoutes)
app.use('/api/album', albumRoutes)
app.use('/api/order', orderRoutes)

// SwaggerUi setup
const swaggerDocument = './swagger.json'
/*swaggerAutogen(swaggerDocument, ['./main.js'], {
	info: {
		title: "AFSE Developer Portal",
		description: "AFSE API documentation"
	}
})*/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// initialize the MongoDB connection
await initMongoConnection()

app.listen(port, () => {console.log('[INFO] App listening on port ${port}')})

