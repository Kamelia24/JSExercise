const express = require('express');
const bodyParser= require("body-parser");
const Data=require('./data/data.js');
const session = require('express-session');
var controller=require('./controllers/controller.js');
var router = express.Router();
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

router.get('/',controller.home); 
router.get('/register',controller.register); 
router.get('/login',controller.login); 
router.get('/quiz',controller.getQuiz); 
router.get('/logOut',controller.logOut);
/*app.get('/surePage', (req, res)=>{ 
    res.render('finishing'); 
}); 
app.get("/category",(req, res) => {
        return res.send(categories);
    
});
app.get("/difficulty",(req, res) => {
    return res.json(difficulties);

});
app.get("/quizQuestions",(req, res) => {
    return res.json(quizAll);

});*/
router.post("/sort",controller.sortQuiz);
/*app.post('/nextQuestion', (req, res) => {
    res.render('quizContent',{sorted:sorted[curPage]});
    curPage++;
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
        if(users[key][0].username==req.session.username){
            console.log("users.key",users[key]);
            output=users[key];
            break;
        }else{
            console.log("empty");
            output="You haven't taken any quizes yet!";
        }
    }
    console.log(output);
    res.render('',{output:output});
});*/
router.post("/addUser",controller.addUserScore);
router.post("/addUserData",controller.newUser);
router.post("/checkUserData",controller.logInVerify);

var port=3000;
app.listen(port,()=>{console.log(`Node JS API is listening on port: ${port}`);});
