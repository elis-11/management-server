import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = 3022;

const mongoConnectString = 'mongodb://localhost:27017';
const client = new MongoClient(mongoConnectString);

const getData = async (done) => {
	await client.connect();
	const db = client.db('api002');
	done(db);
};

app.get('/', (req, res) => {
	getData(async (db) => {
		const users = await db.collection('users100').find()
        .project({
            name: 1,
            username: 1,
            email: 1,
            _id: 0
        }).toArray();
		res.json(users);
	});
});

app.listen(port, () => {
	console.log(`listening on port http://localhost:${port}`);
});
