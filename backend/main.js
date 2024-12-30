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
)
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// SwaggerUi setup
const swaggerDocument = './swagger.json'
/*swaggerAutogen(swaggerDocument, ['./main.js'], {
	info: {
		title: "AFSE Developer Portal",
		description: "AFSE API documentation"
	}
})*/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// regitser route handlers
app.use('/api/user', userRoutes)
app.use('/api/album', albumRoutes)
app.use('/api/order', orderRoutes)

// initialize the MongoDB connection
await initMongoConnection()

app.listen(port, () => {console.log('[INFO] App listening on port ${port}')})

