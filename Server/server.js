const express = require('express');
const bodyParser= require("body-parser");
const Data=require('./data.js');
const quizAll=Data.getQuestions();
const categories=Data.getCategories();
const difficulties=Data.getDifficulties();
const { check, validationResult, matchedData } = require('express-validator');
const app = express();
const fs=require('fs');
var rawdata=fs.readFileSync('userInfo.json');
let users=JSON.parse(rawdata);
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
app.all('/quizQuestions', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next()
});
app.all('/newQuestion', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});
app.all('/deleteQuestion', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});
app.all('/showPrevious', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});
app.all('/addUser', function(req, res, next) {
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
app.get("/quizQuestions",(req, res) => {
    return res.json(quizAll);

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
app.post('/newQuestion', (req, res) => {
    console.log(req.body);
    Data.log(req.body);
});
app.post('/deleteQuestion', (req, res) => {
    //console.log(req.body);
    Data.log(req.body);
});
app.post("/showPrevious",(req,res) => {
    var rawdata=fs.readFileSync('userInfo.json');
    let users=JSON.parse(rawdata);
    console.log(req.body.name);
    for(key in users){
        if(key==req.body.name){
            console.log("users.key",users[key]);
            res.send(users[key]);
            
            break;
        }else{
            console.log("empty");
            res.send({'empty':'empty'});
        }
    }
});
app.post("/addUser",(req,res) => {
    console.log(req.body);
    //var rawdata=fs.readFileSync('userInfo.json');
    //let users=JSON.parse(rawdata);
    var hasUser=false;
    for(key in users){if(key==req.body.user){hasUser=true;}}
    let scored={};
    score=req.body.score;
    date=req.body.date;
    scored[`score`]=score;
    scored[`date`]=date;
    scored['category']=req.body.category;
    scored['difficulty']=req.body.difficulty;
    //console.log(scored);
    if(users=={} || !hasUser){
    users[`${req.body.user}`]=[];
    }
    users[`${req.body.user}`].push(scored);
    //console.log(users[`${req.body.user}`][0]);
    let data = JSON.stringify(users);
    fs.writeFileSync('userInfo.json', data);
});
var port=3000;
app.listen(port,()=>{console.log(`Node JS API is listening on port: ${port}`);});
