import express from 'express'
import cors from 'cors'
import { initMongoConnection } from './db.js'
import userRoutes from './routes/user.route.cjs'
const port = process.env.PORT || 3000;

const app = express() 

app.use(express.json())
app.use(cors({ origin: '*'}))

// regitser route handlers
app.use('/api/users', userRoutes)

// initialize the MongoDB connection
await initMongoConnection()

app.listen(port, () => {console.log('[INFO] App listening on port ${port}')})

