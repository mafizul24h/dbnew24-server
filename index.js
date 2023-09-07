const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
// const categories = require('./data/categories.json');
// const news = require('./data/new.json');

app.use(cors());
app.use(express.json());

//DBNews
//Wyd1Kv9GSrSV0LmZ



const uri = "mongodb+srv://DBNews:Wyd1Kv9GSrSV0LmZ@cluster0.3c2xoyj.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const newsCollection = client.db('dbNewsDB').collection('news');
        const categoriesCollection = client.db('dbNewsDB').collection('categories');

        app.get('/news', async (req, res) => {
            const result = await newsCollection.find().toArray();
            const reversedResult = result.reverse(); // Reverse the array
            res.send(reversedResult);
            // res.send(result);
        });

        app.get('/news/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await newsCollection.findOne(query);
            res.send(result)
        });

        app.get('/categories', async (req, res) => {
            const result = await categoriesCollection.find().toArray();
            // console.log(result);
            res.send(result);
        })

        // app.get('/categories/:id', async (req, res) => {
        //     const categoryId = req.params.id;
        //     console.log(categoryId);
        //     const query = { id: categoryId };
        //     const result = await categoriesCollection.findOne(query);
        //     res.send(result)
        //     // console.log(result);
        // })

        app.get('/categories/:id', async(req, res) => {
            const categoryId = req.params.id;

            if(categoryId == '0') {
                const result = await newsCollection.find({}).toArray();
                return res.send(result);
            }
            const result = await newsCollection.find({category: categoryId}).toArray();
            res.send(result);
        })

        app.post('/news', async (req, res) => {
            const news = req.body;
            // console.log(news);
            news.createdAt = new Date();
            const ruselt = await newsCollection.insertOne(news);
            // console.log(result);
            res.send(ruselt);
        });

        app.put('/news/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const filter = { _id: new ObjectId(id) };
            const news = req.body;
            // console.log(news);
            const options = { upsert: true };
            const updateNews = {
                $set: {
                    title: news.title, 
                    category: news.category, 
                    reporter: news.reporter, 
                    publish_date: news.publish_date, 
                    photo: news.photo, 
                    details: news.details, 
                }
            }
            const result = await newsCollection.updateOne(filter, updateNews, options);
            res.send(result)
        })

        app.delete('/news/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await newsCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('The Dragon New Is Running');
});

// app.get('/categories', (req, res) => {
//     res.send(categories);
// });

// app.get('/news', (req, res) => {
//     res.send(news);
// });

// app.get('/news/:id', (req, res) => {
//     const id = req.params.id;
//     const selectedNews = news.find(n => n._id === id);
//     res.send(selectedNews);
// });

// app.get('/categories/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     if (id == 0) {
//         res.send(news)
//     } else {
//         const categoryNews = news.filter(n => parseInt(n.category_id) === id);
//         res.send(categoryNews);
//     }
// })

app.listen(port, () => {
    console.log(`The New Dragon Server Running Port ${port}`);
});