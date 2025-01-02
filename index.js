const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.73pqt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.db("admin").command({ ping: 1 });

    const menuCollection = client.db("menuDB").collection("menu");
    const reviewsCollection = client.db("menuDB").collection("reviews");
    const cartsCollection = client.db("menuDB").collection("carts");

    app.post("/addMenu", async (req, res) => {
      const query = req.body;
      const result = await menuCollection.insertOne(query);
      res.send(result);
    });

    app.get("/allMenu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    app.post("/addReview", async (req, res) => {
      const query = req.body;
      const result = await reviewsCollection.insertOne(query);
      res.send(result);
    });

    app.get("/allReviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    // Carts API

    app.post("/addCart", async (req, res) => {
      const query = req.body;
      const result = await cartsCollection.insertOne(query);
      res.send(result);
    });

    app.get("/allCart/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await cartsCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result)
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Bistro Boss Server");
});

app.listen(port, () => {
  console.log("Bistro Boss is running on the port", port);
});
