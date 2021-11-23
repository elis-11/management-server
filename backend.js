import express from 'express';
import mongodb, { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const port = process.env.PORT || 3022;
const mongoConnectString = process.env.MONGODB_URI;
const client = new MongoClient(mongoConnectString);

app.use(cors());
app.use(express.json());

const execMongo = async (done) => {
	await client.connect();
	const db = client.db('api002');
	done(db);
};

app.get('/', (req, res) => {
	execMongo(async (db) => {
		const users = await db
			.collection('users100')
			.find()
			.project({
				_id: 1,
				name: 1,
				username: 1,
				email: 1
			})
			.sort({ _id: -1 })
			.toArray();
		res.json(users);
	});
});

app.delete('/deleteuser/:id', (req, res) => {
	const id = req.params.id;
	execMongo(async (db) => {
		const deleteResult = await db
		.collection('users100')
		.deleteOne({ _id: new mongodb.ObjectId(id) });
		res.json({
			result: deleteResult
		});
	});
});

app.post('/adduser', (req, res) => {
	const user = req.body.user;
	execMongo(async (db) => {
		const insertResult = await db.collection('users100').insertOne(user);
		res.json({
			result: insertResult
		});
	});
});

// app.get("/getuser/:id", (req, res) => {
// 	const id = req.params.id;
// 	execMongo(async (db) => {
// 	  const user = await db
// 		.collection("users100")
// 		.find({ _id: new mongodb.ObjectId(id) })
// 		.project({ _id: 1, name: 1, username: 1, email: 1 })
// 		.toArray();
// 	  res.json(user);
// 	});
//   });  

app.patch('/edituser/:id', (req, res) => {
	const id = req.params.id;
	const email = req.body.email;
	execMongo(async (db) => {
		const updateResult = await db.
        collection('users100')
		.updateOne
        ({ _id: new mongodb.ObjectId(id) }, 
		{ $set: { email } }
		);
		res.json({
			result: updateResult 
		});
	});
});

app.listen(port, () => {
	console.log(`listening on port http://localhost:${port}`);
});
