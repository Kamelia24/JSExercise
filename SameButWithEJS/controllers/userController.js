let users;
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { Client} = require('pg');
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
    register:function(req, res){ 
        if(req.session.loggedin){
            result.redirect('/profile')
        }else{
            res.render('sign_up'); 
        }
        
    },
    logInVerify:function(req,result){
        console.log("income:",req.body);
        let outp={};
        
        let userPassword;
        let password=req.body.password;
        client.query(`SELECT password FROM quiz.users WHERE username='${req.body.username}'`, (err, res) => {
            if (err) {
              console.log (err)
            }
            userPassword=res.rows[0];
            console.log("result:",userPassword,password);
            bcrypt.compare(password, userPassword.password, function(err, res) {
            let isCorrect=res;
            console.log(err,res)
            if(userPassword!=undefined && isCorrect){
                let categories=[];
                let difficulties=[];
                client.query('SELECT category FROM quiz.categories', (err, res) => {
                    if (err) {
                      console.log (err)
                    }
                    for(let i=0;i<res.rows.length;i++){
                        categories.push(res.rows[i]["category"])
                    }
                    client.query('SELECT difficulty FROM quiz.difficulties', (err, res) => {
                        if (err) {
                          console.log (err)
                        }
                        for(let i=0;i<res.rows.length;i++){
                            difficulties.push(res.rows[i]["difficulty"])
                        }
                        console.log("dif:",res.rows)
                        req.session.loggedin = true;
                        req.session.username = req.body.username;
                        result.render('beginning.ejs',{category:categories,difficulty:difficulties,session:req.session.loggedin});
                    })
                })
                
                console.log("correct");
                
            }else{outp="Incorect username or password,please try again!";result.send(outp);}
            });
    
        })
            
    },
    logOut:function(req,res,next){
        if (req.session) {
            req.session.destroy(function(err) {
              if(err) {
                return next(err);
              } else {
                return res.redirect('/');
              }
            });
          }
    },
    profileInfo:function(req,result){
        console.log("username:",req.session.username)
        client.query(`SELECT * FROM quiz.users WHERE username='${req.session.username}'`, (err, res) => {
            if (err) {
              console.log (err)
            }
            users=res.rows;
            if(users!=undefined){
                console.log(users)
                client.query(`SELECT score,date_taken,category,difficulty
                 FROM quiz.quiz_results res
                 left join quiz.categories cat on res.category_id=cat.id
                 left join quiz.difficulties dif on res.difficulty_id=dif.id
                 where user_id=${users[0]["id"]}`, (err, res) => {
                    if (err) {
                      console.log (err)
                    }
                    console.log("profile:",prof,"quiz",data);
                    result.render('profile.ejs',{prof:[users[0]["name"],users[0]["age"],users[0]["username"]],data:res.rows,session:req.session.loggedin})
                })
                
            }
        
        
        })
    },
    newUser:async function(req,result){
        console.log("income:",req.body);
        let username=req.body.username;
        let body=req.body;
            let promise=new Promise((reoslve,reject)=>{
                client.query(`SELECT * FROM quiz.users WHERE username='${username}'`, (err, res) => {
                    if(res.rows[0]===undefined){
                    reoslve(body);
                    }else{reject('User already exists')}  
                })
            });
            let hasUserIs=await promise;
            console.log(hasUserIs)
            if(typeof hasUserIs !='string'){
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
                }else{
                    result.send(hasUserIs)
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