import { MongoClient, ObjectId} from 'mongodb' 
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
				return null
		}
	},

	// returns all the documents in the given collection as an array
	async findAll(collection) {
		return await this.translateCollection(collection).find({}).toArray()
	},
	
	// search a document with the matching id in the collection
	async findOneById(collection, id) {
		return await this.translateCollection(collection).findOne({_id: new ObjectId(id)})
	},
	
	// search a document in the collection via a query
	async findOneWithQuery(collection, query) {
		return await this.translateCollection(collection).findOne(query)
	},
	
	// returns all of the documents who matchs the query
	async findWithQuery(collection, query) {
		return await this.translateCollection(collection).find(query).toArray()
	},
	
	// inserts a single document
	async insertDocument(collection, document) {
		return await this.translateCollection(collection).insertOne(document)
	},
	
	// replace a document
	async replaceDocument(collection, query, content) {
		await this.translateCollection(collection).replaceOne(query, content)
	},

	// inserts multiple documents
	async insertDocuments(collection, documents) {
		await this.translateCollection(collection).insertMany(documents)
	},
	
	async updateDocumentById(collection, id, update) {
		await this.updateDocument(collection, {_id: new ObjectId(id)}, update)
	},

	/// updates the provided document
	// @param collection 
	// @param docuemt query that finds the document to update
	// @paream update object containing what to update
	async updateDocument(collection, query, update) {
		await this.translateCollection(collection).updateOne(query, { $set: update })
	},
	
	async deleteteDocumentById(collection, id) {
		await this.translateCollection(collection).deleteOne({_id: new ObjectId(id)})
	},

	async deleteDocuments(collection, query) {
		await this.translateCollection(collection).deleteMany(query)
	}
}

export { initMongoConnection, dbController }
