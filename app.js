//NPM Modules
const express = require("express");
require('dotenv').config()
const path = require('path')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

//Local Modules
const rootDir = require('./utils/rootDir')
const dbConfig = require('./config/dbconfig')

//variables and objects
const app = express()
dbConfig()

//public path setup
app.use(helmet({contentSecurityPolicy: true}))
app.use(express.static(path.join(rootDir,"/public")))
app.use(cookieParser())

//Routes Import
const {homeController,auth} = require('./routes')



//middlewear
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//view engine 
app.set("view engine","ejs")
app.set("views","views")
//Routes Management
app.use(homeController)
app.use(auth)

// server listen
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port http://localhost:${port} 🔥`));