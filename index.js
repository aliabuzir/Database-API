// index.js
//
// Name: Ali Abuzir
// Course: CS 480 Spring 2024
// Project: Project 2
//
// Header: API implementation to allow clients to retreive content from databases MongoDB and MySQL.
//


/*------------------------------------------
--------------------------------------------
Include all drivers for server setup, database connections, and resource sharing.
--------------------------------------------
--------------------------------------------*/
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const ID = require('mongodb').ObjectId;

// MongoDB connection string.
const uri = "mongodb+srv://" + process.env['usermongo'] + ":" + process.env['passwordmongo'] + "@cluster0.o3gujmz.mongodb.net/?retryWrites=true&w=majority&appName=" + process.env['cluster'];

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


/*------------------------------------------
--------------------------------------------
parse application/json
--------------------------------------------
--------------------------------------------*/
app.use(bodyParser.json());
app.use(cors({origin: '*'}));


/*------------------------------------------
--------------------------------------------
SQL Database Connection
--------------------------------------------
--------------------------------------------*/
const conn = mysql.createConnection({
  host: process.env['hostsql'],
  user: process.env['usersql'] /* MySQL User */,
  password: process.env['passwordsql'] /* MySQL Password */,
  database: process.env['databasesql'] /* MySQL Database */,
});


/*------------------------------------------
--------------------------------------------
Shows Mysql Connect
--------------------------------------------
--------------------------------------------*/
conn.connect((err) => {
  if (err) throw err;
  console.log("Mysql Connected with App...");
});


/*------------------------------------------
--------------------------------------------
MongoDB Database Connection
--------------------------------------------
--------------------------------------------*/
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("cs480-project2").command({ ping: 1 });
    await client.db("sample_mflix").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    // Ensures that the client will close when you finish/error
    await client.close();
    throw err;
  }
}
run().catch(console.dir);


/*------------------------------------------
--------------------------------------------
Default endpoint of the API that sends the client a brief description of what this API does.
--------------------------------------------
--------------------------------------------*/
app.get("/", (req, res) => {
  res.send("API is used for getting database information for the user and sending it back in JSON format.");
});


/*------------------------------------------
--------------------------------------------
Endpoint to get all the rows from the actor table in sakila.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/actors", (req, res) => {
  let sqlQuery = "SELECT * FROM actor";

  let query = conn.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get the row identified by the given actor_id from the actor table in sakila.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/actors/:id", (req, res) => {
  let sqlQuery = "SELECT * FROM actor WHERE actor_id = ?";
  
  let query = conn.query(sqlQuery, req.params.id, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get all the rows from the film table in sakila or the rows that contain titles that contain a given sequence of characters in them.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/films", (req, res) => {
  let sqlQuery;

  if (req.query.query) {
    sqlQuery = "SELECT * FROM film WHERE title LIKE ?";
  }
  else {
    sqlQuery = "SELECT * FROM film";
  }

  let query = conn.query(sqlQuery, ("%" + req.query.query.toUpperCase() + "%"), (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
  
});


/*------------------------------------------
--------------------------------------------
Endpoint to get the row from the film table in sakila that is identified by the given film_id.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/films/:id", (req, res) => {
  let sqlQuery = "SELECT * FROM film WHERE film_id = ?";

  let query = conn.query(sqlQuery, req.params.id, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get all the rows from the customer table in sakila.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/customers", (req, res) => {
  let sqlQuery = "SELECT * FROM customer";

  let query = conn.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get the row from the customer table in sakila identified by the given customer_id.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/customers/:id", (req, res) => {
  let sqlQuery = "SELECT * FROM customer WHERE customer_id = ?";

  let query = conn.query(sqlQuery, req.params.id, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get the row from the inventory table in sakila identified by the given inventory_id.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/inventory/:id", (req, res) => {
  let sqlQuery = "SELECT * FROM inventory WHERE inventory_id = ?";

  let query = conn.query(sqlQuery, req.params.id, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get all the rows from the store table in sakila.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/stores", (req, res) => {
  let sqlQuery = "SELECT * FROM store";

  let query = conn.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get the row from the store table in sakila identified by the given store_id.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/stores/:id", (req, res) => {
  let sqlQuery = "SELECT * FROM store WHERE store_id = ?";

  let query = conn.query(sqlQuery, req.params.id, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get all the rows from the staff table in sakila.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/staff", (req, res) => {
  let sqlQuery = "SELECT * FROM staff";

  let query = conn.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get the row from the staff table in sakila identified by the given staff_id.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/staff/:id", (req, res) => {
  let sqlQuery = "SELECT * FROM staff WHERE staff_id = ?";

  let query = conn.query(sqlQuery, req.params.id, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get all the films from the film table in sakila that a given actor was part of.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/actors/:id/films", (req, res) => {
  let sqlQuery = "SELECT * FROM film WHERE film_id IN (SELECT film_id FROM film_actor WHERE actor_id = ?)";

  let query = conn.query(sqlQuery, req.params.id, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get all the actors from the actor table in sakila that a given movie had in it.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/films/:id/actors", (req, res) => {
  let sqlQuery = "SELECT * FROM actor WHERE actor_id IN (SELECT actor_id FROM film_actor WHERE film_id = ?)";

  let query = conn.query(sqlQuery, req.params.id, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get the row from the film_list view in sakila identified by the given FID.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/films/:id/detail", (req, res) => {
  let sqlQuery = "SELECT * FROM film_list WHERE FID = ?";

  let query = conn.query(sqlQuery, req.params.id, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});

/*------------------------------------------
--------------------------------------------
Endpoint to get the row from the customer_list view in sakila identified by the given ID.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/customers/:id/detail", (req, res) => {
  let sqlQuery = "SELECT * FROM customer_list WHERE ID = ?";

  let query = conn.query(sqlQuery, req.params.id, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});

/*------------------------------------------
--------------------------------------------
Endpoint to get the row from the actor_info view in sakila identified by the given actor_id.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/actors/:id/detail", (req, res) => {
  let sqlQuery = "SELECT * FROM actor_info WHERE actor_id = ?";

  let query = conn.query(sqlQuery, req.params.id, (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});



/*------------------------------------------
--------------------------------------------
Endpoint to get all inventory ids for a given film in stock at a given store retrieved by calling stored procedure film_in_stock.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/inventory-in-stock/:film_id/:store_id", (req, res) => {
  let sqlQuery = "CALL film_in_stock(?, ?, @res)";

  let query = conn.query(sqlQuery, [req.params.film_id, req.params.store_id], (err, results) => {
    if (err) {
      console.error("An error has occurred: " + err + "\n");
      res.send(apiResponse(["An error has occurred."]));
    }
    else {
      res.send(apiResponse(results));
    }
  });
});


/*------------------------------------------
--------------------------------------------
Endpoint to get all of the documents in the sample_mflix database movies collection or if a query parameter is given, then returns all of the documents in the movies collection that contain the given genre in their genres field.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/movies", async (req, res) => {

  let query;

  try {
    if (req.query.genre) {
      query = await ((client.db('sample_mflix')).collection('movies')).find({genres: req.query.genre}).limit(10).toArray();
      if (query == null) {
        query = [];
      }
    }
    else {
      query = await ((client.db('sample_mflix')).collection('movies')).find({}).limit(10).toArray();
      if (query == null) {
        query = [];
      }
    }
  }
  catch (err) {
    console.error("An error has occurred: " + err + "\n");
    query = ["An error has occurred."];
  }

  res.send(apiResponse(query));

});


/*------------------------------------------
--------------------------------------------
Endpoint to get all of the documents in the cs480-project2 database colors collection
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/colors", async (req, res) => {

  let query;

  try {
      query = await ((client.db('cs480-project2')).collection('colors')).find({}).limit(1000).toArray();
    if (query == null) {
      query = [];
    }
  }
  catch (err) {
    console.error("An error has occurred: " + err + "\n");
    query = ["An error has occurred."];
  }
  finally {
    res.send(apiResponse(query));
  }

});


/*------------------------------------------
--------------------------------------------
Endpoint to add a document in the cs480-project2 database colors collection. color field is specified in the HTTP request's body.
--------------------------------------------
--------------------------------------------*/
app.post("/api/v1/colors", async (req, res) => {

  let query;

  try {
    console.log(JSON.stringify(req.body));
    if (req.body) {
      query = await ((client.db('cs480-project2')).collection('colors')).insertOne({"color": req.body.color});
      //console.log(query);
      if (query == null) {
        query = [];
      }
    }
    else {
      console.log("here");
      query = [];
    }
  }
  catch (err) {
    console.error("An error has occurred: " + err + "\n");
    query = ["An error has occurred."]
  }
  finally {
    res.send(apiResponse(query));
  }

});


/*------------------------------------------
--------------------------------------------
Endpoint to get the document in the cs480-project2 database colors collection identified by the given id.
--------------------------------------------
--------------------------------------------*/
app.get("/api/v1/colors/:id", async (req, res) => {

  let query;

  try {
    if (req.params.id && req.params.id.length == 24 && /^[a-z0-9]*$/.test(req.params.id)) {
      query = await ((client.db('cs480-project2')).collection('colors')).findOne({"_id": new ID(req.params.id)});
      if (query == null) {
        query = [];
      }
    }
    else {
      query = [];
    }
  }
  catch (err) {
    console.error("An error has occurred: " + err + "\n");
    query = ["An error has occurred."];
  }
  finally {
    res.send(apiResponse(query));
  }

});


/*------------------------------------------
--------------------------------------------
Endpoint to update the document in the cs480-project2 database colors collection identified by the given id. Updated color field is given in HTTP request's body.
--------------------------------------------
--------------------------------------------*/
app.put("/api/v1/colors/:id", async (req, res) => {

  let query;

  try {
    if (req.params.id && req.params.id.length == 24 && /^[a-f0-9]*$/.test(req.params.id) && req.body.color) {
      query = await ((client.db('cs480-project2')).collection('colors')).updateOne({"_id": new ID(req.params.id)}, {$set : {color: req.body.color}});
      if (query == null) {
        query = [];
      }
    }
    else {
      query = [];
    }
  }
  catch (err) {
    console.error("An error has occurred: " + err + "\n");
    query = ["An error has occurred."];
  }
  finally {
    res.send(apiResponse(query));
  }

});


/*------------------------------------------
--------------------------------------------
Endpoint to delete the document in the cs480-project2 database colors collection identified by the given id.
--------------------------------------------
--------------------------------------------*/
app.delete("/api/v1/colors/:id", async (req, res) => {

  let query;
  
  try {
    if (req.params.id && req.params.id.length == 24 && /^[a-f0-9]*$/.test(req.params.id)) {
      
      query = await ((client.db('cs480-project2')).collection('colors')).deleteOne({"_id": new ID(req.params.id)});
      if (query == null) {
        query = [];
      }
    }
    else {
      query = [];
    }
  }
  catch (err) {
    console.error("An error has occurred: " + err + "\n");
    query = ["An error has occurred."];
  }
  finally {
    res.send(apiResponse(query));
  }

});


/*------------------------------------------
--------------------------------------------
API response to send back to the client
--------------------------------------------
--------------------------------------------*/
function apiResponse(results) {
  return JSON.stringify(results);
}


/*------------------------------------------
--------------------------------------------
Server listening
--------------------------------------------
--------------------------------------------*/
app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
