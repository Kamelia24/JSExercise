const express = require('express');
const bodyParser= require("body-parser");
const Data=require('./data/data.js');
const quizAll=Data.getQuestions();
const categories=Data.getCategories();
const difficulties=Data.getDifficulties();
const { check, validationResult, matchedData } = require('express-validator');
const app = express();
app.set('view engine', 'ejs');
const fs=require('fs');
var rawdata=fs.readFileSync('data/userInfo.json');
let users=JSON.parse(rawdata);
//console.log(categories);console.log(difficulties);console.log(quizAll);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});
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
app.all('/addUserData', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});
app.all('/checkUserData', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});
app.all('/register', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});
app.all('/login', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});
app.all('/quiz', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});
app.get('/', (req, res)=>{ 
    res.render('index'); 
    }); 
app.get('/register', (req, res)=>{ 
    res.render('sign_up'); 
}); 
app.get('/login', (req, res)=>{ 
    res.render('sign_in'); 
}); 
app.get('/quiz', (req, res)=>{ 
    res.render('beginning',{category:categories,difficulty:difficulties}); 
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
    //var rawdata=fs.readFileSync('userInfo.json');
    //let users=JSON.parse(rawdata);
    //console.log(req.body.name);
    for(key in users){
        console.log(users[key][0].username,req.body.name)
        if(users[key][0].username==req.body.name){
            console.log("users.key",users[key]);
            output=users[key];
            
            break;
        }else{
            console.log("empty");
            output={'empty':'empty'};
        }
    }
    console.log(output);
    res.send(output);
});
app.post("/addUser",(req,res) => {
    console.log(req.body);
    //var rawdata=fs.readFileSync('userInfo.json');
    //let users=JSON.parse(rawdata);
    var hasUser=false;
    for(key in users){if(users[key][0].username==req.body.user){name=key;hasUser=true;}}
    let scored={};
    score=req.body.score;
    date=req.body.date;
    scored[`score`]=score;
    scored[`date`]=date;
    scored['category']=req.body.category;
    scored['difficulty']=req.body.difficulty;
    //console.log(scored);
    if(hasUser){
     users[`${name}`].push(scored);
    }
    //console.log(users[`${req.body.user}`][0]);
    let data = JSON.stringify(users);
    fs.writeFileSync('userInfo.json', data);
});
app.post("/addUserData",(req,res) => {
    console.log("income:",req.body);
    //var rawdata=fs.readFileSync('userInfo.json');
    //let users=JSON.parse(rawdata);
    var hasUser=false;
    for(key in users){if(key==req.body.user){hasUser=true;}}
    let data={};
    username=req.body.username;
    password=req.body.password;
    data[`username`]=username[0];
    data[`password`]=password[0];
    data['age']=req.body.age;
    console.log("data:",data);
    if(!hasUser){
    users[`${req.body.name}`]=[data];
    }
    //console.log(users[`${req.body.user}`][0]);
    let data1 = JSON.stringify(users);
    fs.writeFileSync('userInfo.json', data1);
    res.send({"success":"success"});
});
app.post("/checkUserData",(req,res) => {
    console.log("income:",req.body);
    //var rawdata=fs.readFileSync('userInfo.json');
    //let users=JSON.parse(rawdata);
    let outp={};
    var hasUser=false;
    for(key in users){
        if(users[key][0].username==req.body.username[1] &&
            req.body.password[1]==users[key][0].password){
            console.log(users[key][0].username,req.body.username[1])
            console.log(users[key][0].password,req.body.password[1])
            console.log("correct");
            outp={"correct":"correct"};
            break;
    }else{outp={"error":"error"};}
}res.send(outp);
});
var port=3000;
app.listen(port,()=>{console.log(`Node JS API is listening on port: ${port}`);});
