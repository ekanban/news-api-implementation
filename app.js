var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var routeFunctions = require("./routes/routeFunctions")

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", routeFunctions.welcome)

app.post("/apiCall", routeFunctions.getNews)

app.listen(process.env.PORT || 3000, function (req, res) {
    console.log("The server has started.")
})

module.exports = app;