require("dotenv/config");
const express = require("express");
const cors = require('cors');
const { join } = require("path");
const path = require("path");
require("dotenv/config")

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());

app.use(express.json());

app.use('/Public', express.static(path.join(__dirname, '/Public')))

//#region API ROUTES
const {adminRouter,userRouter,productRouter,transactionRouter,
  addressRouter,rajaongkirRouter,warehouseRouter, 
  cartRouter, locationProductRouter,logRouter,dashboardRouter} = require('./routers')

// ===========================
// NOTE : Add your routes here
app.use('/api/admin', adminRouter)
app.use('/api/product', productRouter)
app.use('/api/users', userRouter)
app.use('/api/transaction', transactionRouter)
app.use('/api/shipping', addressRouter)
app.use('/api/rajaongkir', rajaongkirRouter)
app.use('/api/warehouse', warehouseRouter)
app.use('/api/cart', cartRouter)
app.use('/api/location', locationProductRouter)
app.use('/api/log', logRouter)
app.use('/api/dash', dashboardRouter)

// ### Sequelize Synchronous
// const Sequelize = require('sequelize');
// const Models = require('./models');
// Models.sequelize.sync({
//     force : false,
//     alter: true,
//     logging : console.log
// }).then(function () {
//     console.log('Database is Synchronized!')

// }).catch(function (err) {
//     console.log(err, "Something Went Wrong with Database Update!")
// });

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
