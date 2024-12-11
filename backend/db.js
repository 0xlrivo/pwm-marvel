import { MongoClient} from 'mongodb' 
const connString = process.env.CONNECTION_STRING
const dbName = process.env.DB_NAME

let client
let db
let userCollection
let albumCollection
let orderCollection

// initialize the connection to a remote MongoDb instance
async function initMongoConnection() {
	console.log(connString)
	if (!client) {
		// connect to the remote Atlas client
		client = new MongoClient(connString)	
		await client.connect()

		// connect to the database
		db = client.db(dbName)

		// initialize the collections
		userCollection = db.collection('users')
		albumCollection = db.collection('albums')
		orderCollection = db.collection('orders')
	}
}

const dbController = {

	translateCollection(collectionAsString) {
		switch (collectionAsString) {
			case 'users':
				return userCollection
			case 'albums':
				return albumCollection
			case 'orders':
				return orderCollection
			default:
				break;
		}
	},

	// returns all the documents in the given collection as an array
	async findAll(collection) {
		return await this.translateCollection(collection).find({}).toArray()
	},

	// returns all the documents in the given collection that matches the filter
	async findWithQuery(collection, query, limit) {
		return await this.translateCollection(collection).find(query, limit).toArray()
	},

	async insertDocuments(collection, documents) {
		return await this.translateCollection(collection).insertMany(documents)
	},
	
	/// updates the provided document
	// @param collection 
	// @param docuemt query that finds the document to update
	// @paream update object containing what to update
	async updateDocument(collection, query, update) {
		return await this.translateCollection(collection).updateOne(query, { $set: update })
	},

	async deleteDocuments(collection, query) {
		return await this.translateCollection(collection).deleteMany(query)
	}
}

export { initMongoConnection, dbController }
