const express = require('express');
const bodyParser= require("body-parser");
const Data=require('./data');
const quizAll=Data.getQuestions();
const categories=Data.getCategories();
const difficulties=Data.getDifficulties();
const { check, validationResult, matchedData } = require('express-validator');
const app = express();
//console.log(categories);console.log(difficulties);console.log(quizAll);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all('/category', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next()
    });
app.all('/difficulty', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next()
    });
app.all('/sort', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next()
    });
app.get("/category",(req, res) => {
        return res.send(categories);
    
});
app.get("/difficulty",(req, res) => {
    return res.json(difficulties);

});
app.post("/sort",(req, res) => {
    //console.log(req.body.cat);
    var sorted=[];
    const cat=req.body.cat;//console.log(cat);
    const dif=req.body.dif;//console.log(dif);
    for(var i=0;i<quizAll.length;i++){
        if(quizAll[i].category==cat && quizAll[i].difficulty==dif){
            sorted.push(quizAll[i]);
        }
    }
    console.log(sorted)
    res.send(sorted);
});
var port=3000;
app.listen(port,()=>{console.log(`Node JS API is listening on port: ${port}`);});
