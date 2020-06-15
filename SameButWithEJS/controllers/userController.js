let users;
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Client} = require('pg');
let res;
console.log(process.env.DB_HOST);
client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
    port:process.env.DB_PORT
});
client.connect();
module.exports={
    login:function(req, result){ 
        if(req.session.loggedin){
            result.redirect('/profile')
        }else{
            result.render('sign_in'); 
        }
    },
    register:function(req, result){ 
        if(req.session.loggedin){
            result.redirect('/profile')
        }else{
            result.render('sign_up'); 
        }
        
    },
    logInVerify:async function(req,result){
        console.log("income:",req.body);
        let outp={};
        let userPassword;
        let password=req.body.password;
        let isCorrect;
        try{
            res=await client.query(`SELECT password FROM quiz.users WHERE username='${req.body.username}'`)
            userPassword=res.rows[0];
            console.log("result:",userPassword,password);
        }catch (err) {
              console.log (err)
        }
        try{
            res=await bcrypt.compare(password, userPassword.password)
            isCorrect=res;
            console.log(res)
        }catch(err){
            console.log('in bcrypt:',err)
        }
        if(userPassword!=undefined && isCorrect){
            console.log("correct");
            req.session.loggedin = true;
            req.session.username = req.body.username;
            result.redirect('/quiz');
        }else{outp="Incorect username or password,please try again!";
        result.send(outp);
        }
    },
    logOut:function(req,result,next){
        if (req.session) {
            req.session.destroy(function(err) {
            if(err) {
                return next(err);
            }else {
                return result.redirect('/');
            }
            });
        }
    },
    profileInfo:async function(req,result){
        console.log("username:",req.session.username)
        try{
            res=await client.query(`SELECT * FROM quiz.users WHERE username='${req.session.username}'`)
            users=res.rows;
        }catch (err) {
              console.log ('select user info:',err)
        }
        if(users!=undefined){
            console.log(users)
            try{
                res=await client.query(`SELECT score,date_taken,category,difficulty
                FROM quiz.quiz_results res
                left join quiz.categories cat on res.category_id=cat.id
                left join quiz.difficulties dif on res.difficulty_id=dif.id
                where user_id=${users[0]["id"]}`)
                //console.log("profile:",prof,"quiz",data);
                result.render('profile.ejs',{prof:[users[0]["name"],users[0]["age"],users[0]["username"]],data:res.rows,session:req.session.loggedin})
            }catch (err) {
                console.log ('select user quiz data:',err)
            }  
        }
    },
    newUser:async function(req,result){
        console.log("income:",req.body);
        let username=req.body.username;
        let body=req.body;
        let hasUserIs;
        try{
            res=await client.query(`SELECT * FROM quiz.users WHERE username='${username}'`)
            if(res.rows[0]===undefined){
                hasUserIs=body;
            }
        }catch(err){
            result.send('User already exists')
        }  
        if(typeof hasUserIs !='string'){
            let username=body.username;
            let password=body.password;
            let age=body.age;
            let name=body.name;
            let hashedPassword;
            console.log(username,password,age,name)
            if(age<10 || age >90){result.send("Age is not valid!");}
            try{
                res=await bcrypt.hash(password, saltRounds)
                hashedPassword = res;
            }catch(err){
                console.log('hash pass:',err)
            }
            try{
                res=await client.query(`insert into quiz.users
                (name,username,password,age)
                values('${name}','${username}','${hashedPassword}',${age})`);
                result.render('sign_in.ejs');
            }catch(err) {
                console.log ('insert user info:',err);
            }
        }
    }/*,
    newUser:function(req,result){    
        function isThereUser(username){
            return new Promise((reoslve,reject)=>{
                client.query(`SELECT * FROM quiz.users WHERE username='${username}'`, (err, res) => {
                    if(res.rows[0]===undefined){
                    reoslve(body);
                    }else{reject('User already exists')}  
                })
            })
        }
        isThereUser(username).then((body)=>{
            let username=body.username;
            let password=body.password;
            let age=body.age;
            let name=body.name;
            console.log(username,password,age,name)
            if(age<10 || age >90){result.send("Age is not valid!");}
            bcrypt.hash(password, saltRounds, function(err, hash) {
                let hashedPassword = hash;
                client.query(`insert into quiz.users
                (name,username,password,age)
                values('${name}','${username}','${hashedPassword}',${age})`, (err, res) => {
                    if (err) {
                        console.log (err);
                    }
                    result.render('sign_in.ejs');
                })
            });
        }).catch((err)=>{result.send(err)})
    }*/ /*,
    newUser:function(req,result){    
    client.query(`SELECT * FROM quiz.users WHERE username='${req.body.username}'`, (err, res) => {
            if(res.rows[0]===undefined){
            let username=req.body.username;
            let password=req.body.password;
            let age=req.body.age;
            if(age<10 || age >90){result.send("Age is not valid!");}
            bcrypt.hash(password, saltRounds, function(err, hash) {
               let hashedPassword = hash;
                client.query(`insert into quiz.users
                (name,username,password,age)
                values('${req.body.name}','${username}','${hashedPassword}',${age})`, (err, res) => {
                    if (err) {
                        console.log (err);
                    }
                    result.render('sign_in.ejs');
                })
            });
            
           
               
            }else{res.send("This username already exists!Try another one.")}      
        })
    }*/
}