import express from 'express'
import cors from 'cors'
import { initMongoConnection } from './db.js'
import userRoutes from './routes/user.route.cjs'
const port = process.env.PORT || 3000;

const app = express() 

// middlewares configuration
app.use(express.json())				// JSON body parser
app.use(cors({ origin: '*'}))		// CORS

// regitser route handlers
app.use('/api/user', userRoutes)
app.use('/api/album', albumRoutes)
app.use('/api/order', orderRoutes)

// initialize the MongoDB connection
await initMongoConnection()

app.listen(port, () => {console.log('[INFO] App listening on port ${port}')})

