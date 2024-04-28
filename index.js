const express =require('express');
const cors = require('cors');
require("dotenv").config();
const app= express();
const port =process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// midware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ce00xrg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
 
console.log(uri);

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
    // await client.connect();
const artCollection = client.db('craftArtDB').collection('artCraft');
const newDataCollection=client.db('subcategoryDB').collection('subCat');



app.get('/artCraft',async(req,res)=>{
    const cursor = artCollection.find()
    const result = await cursor.toArray();
    res.send(result);
})

app.get('/subCat',async(req,res)=>{
    const cursor = newDataCollection.find();
    const result = await cursor.toArray();
    res.send(result);
    console.log(result);
});

app.get("/artCraft/:id",async(req,res)=>{
    const id =req.params.id;
    const query ={_id:new ObjectId(id)};
    const result = await artCollection.findOne(query);
    res.send(result);
});



app.get("/artCraft/email/:email",async(req,res)=>{
 
    console.log(req.params.email);
    const result =await artCollection.find({user_email:req.params.email}).toArray()
    res.send(result)
})

app.get('/artCraft/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id:new ObjectId(id)}
    const result = await artCollection.findOne(query)
    res.send(result)
})

app.put('/artCraft/:id',async(req,res) =>{
    const id =req.params.id;
    const filter = {_id:new ObjectId(id)}
    const options = {upsert:true}
    const updatedCraft=req.body;
    const craft ={
        $set:{
            processing_time:updatedCraft.processing_time,
            rating:updatedCraft.rating,
            price:updatedCraft.price,
            short_description:updatedCraft.short_description,
            stockStatus:updatedCraft.stockStatus,
            customization:updatedCraft.customization,
            image:updatedCraft.image,
            subcategory_name:updatedCraft.subcategory_name,
            item_name:updatedCraft.item_name,
        }

    }
    const result = await artCollection.updateOne(filter,craft,options)
    res.send(result)
})

app.delete('/artCraft/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id :new ObjectId(id)}
    const result = await artCollection.deleteOne(query)
    res.send(result)

})

    app.post('/artCraft',async(req,res)=>{
        const newArtCraft =req.body;
        console.log(newArtCraft);
        const result = await artCollection.insertOne(newArtCraft);
        res.send(result);

    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req,res)=>{
    res.send("art and craft running")
})

app.listen(port,()=>{
    console.log(`art and craft listening on: ${port}`);
})