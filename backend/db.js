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

		// for the user collection we want username and email to be unique
		// we can achieve this by creating an index
		userCollection.createIndex( { username: 1 }, { unique: true } )
		userCollection.createIndex( { email: 1 }, { unique: true } )
		
	}
}

async function closeMongoConnection() {
	if (client) {
		await client.close()
	}
}

// those function propagates any error to the caller (controllers) that can chose how to handle them
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
				throw new Error("invalid collection")
		}
	},

	// returns all the documents in the given collection as an array
async findAll(collection) {
	try {
	  return await this.translateCollection(collection).find({}).toArray();
	} catch (err) {
	  throw err;
	}
  },
  
  // search a document with the matching id in the collection
  async findOneById(collection, id) {
	try {
	  return await this.translateCollection(collection).findOne({ _id: new ObjectId(id) });
	} catch (err) {
	  throw err;
	}
  },
  
  // search a document in the collection via a query
  async findOneWithQuery(collection, query) {
	try {
	  return await this.translateCollection(collection).findOne(query);
	} catch (err) {
	  throw err;
	}
  },
  
  // returns all of the documents who match the query
  async findWithQuery(collection, query) {
	try {
	  return await this.translateCollection(collection).find(query).toArray();
	} catch (err) {
	  throw err;
	}
  },
  
  // inserts a single document
  async insertDocument(collection, document) {
	try {
	  return await this.translateCollection(collection).insertOne(document);
	} catch (err) {
	  throw err;
	}
  },
  
  // replace a document
  async replaceDocument(collection, query, content) {
	try {
	  await this.translateCollection(collection).replaceOne(query, content);
	} catch (err) {
	  throw err;
	}
  },
  
  // replace a document by ID
  async replaceDocumentById(collection, id, content) {
	try {
	  await this.translateCollection(collection).replaceOne({ _id: new ObjectId(id) }, content);
	} catch (err) {
	  throw err;
	}
  },
  
  // inserts multiple documents
  async insertDocuments(collection, documents) {
	try {
	  await this.translateCollection(collection).insertMany(documents);
	} catch (err) {
	  throw err;
	}
  },
  
  // update a document by ID
  async updateDocumentById(collection, id, update) {
	try {
	  await this.updateDocument(collection, { _id: new ObjectId(id) }, update);
	} catch (err) {
	  throw err;
	}
  },
  
  // updates a document with the provided query and update data
  async updateDocument(collection, query, update) {
	try {
	  await this.translateCollection(collection).updateOne(query, { $set: update });
	} catch (err) {
	  throw err;
	}
  },
  
  // delete a document by ID
  async deleteDocumentById(collection, id) {
	try {
	  await this.translateCollection(collection).deleteOne({ _id: new ObjectId(id) });
	} catch (err) {
	  throw err;
	}
  },
  
  // delete multiple documents matching a query
  async deleteDocuments(collection, query) {
	try {
	  await this.translateCollection(collection).deleteMany(query);
	} catch (err) {
	  throw err;
	}
  }
  
}

export { initMongoConnection, closeMongoConnection, dbController }
