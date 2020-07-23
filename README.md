## Steps to generate this app 
### 1. npm i g express-generator
#### Scafolding an express spplication
### 2. express conFusionServer 
### 3. cd conFusionServer
### 4. npm install
#### Run the initialized App
### 5. npm start

## App MongoDB instance
### 1. install MongoDB regarding the documentation, Go to http://www.mongodb.org, then download and install MongoDB as per the instructions given there.
### Create a folder named mongodb on your computer and create a subfolder under it named data.
### Move to the mongodb folder and then start the MongoDB server by typing the following at the prompt:
### <b>mongod --dbpath=data --bind_ip 127.0.0.1</b>
### Open another command window and then type the following at the command prompt to start the mongo REPL shell:
### <b>mongo</b>

### The Mongo REPL shell will start running and give you a prompt to issue commands to the MongoDB server. At the Mongo REPL prompt, type the following commands one by one and see the resulting behavior:
### <b>db</b>
## Create a database instance
### <b>use conFusion</b>
### <b>db</b>
### <b>db.help()</b>

### You will now create a collection named dishes, and insert a new dish document in the collection:
### <b>db.dishes.insert({name: "Uthappizza", description: "Test" })</b>

### Check the data record in JSON format
### <b>db.dishes.find().pretty();</b>

### Look into the Id object
### <b>var id = new ObjectId(); id.getTimestamp();</b>


