const express = require("express");
const app = express();
let port = process.env.PORT || 3000;
app.use(express.static('public'));
var router = express.Router();

router.get("/",(req,res) => {
    res.sendFile(__dirname + '/public/index.html');
});

router.get("/about",function(req,res){
    res.sendFile(__dirname + "/public/about.html");
  });

app.use("/",router);

app.use("*",function(req,res){
  res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening at port: ${port}`)
});