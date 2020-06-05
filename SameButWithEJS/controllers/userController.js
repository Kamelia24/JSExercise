const fs=require('fs');
var rawdata=fs.readFileSync('data/userInfo.json');
let users;

const { Client} = require('pg');
client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
	database: 'second',
	port:5432
});
client.connect();
client.query('SELECT * FROM quiz.users', (err, res) => {
    if (err) {
      console.log (err)
    }
    users=res.rows;
})

module.exports={
    login:function(req, result){ 
        if(req.session.loggedin){
        var data=[];
        var prof=[];
        console.log("username:",req.session.username)
        client.query(`SELECT * FROM quiz.users WHERE username='${req.session.username}'`, (err, res) => {
            if (err) {
              console.log (err)
            }
            users=res.rows;
            if(users!=undefined){
                console.log(users)
                prof.push(users[0]["name"],users[0]["age"],users[0]["username"]);
                client.query(`SELECT * FROM quiz.quiz_results where user_id=${users[0]["id"]}`, (err, res) => {
                    if (err) {
                      console.log (err)
                    }
                    data.push(res.rows);
                })
                
            }
        
        console.log("profile:",prof,"quiz",data);
        result.render('profile.ejs',{prof:prof,data:data,session:req.session.loggedin})
        })
        }else{
        result.render('sign_in'); 
        }
    },
    register:function(req, res){ 
        res.render('sign_up'); 
    },
    logInVerify:function(req,result){
        console.log("income:",req.body);
        let outp={};
        let hasPass=false;
        var userPassword;
        client.query(`SELECT password FROM quiz.users WHERE username='${req.body.username}'`, (err, res) => {
            if (err) {
              console.log (err)
            }
            userPassword=res.rows[0];
            hasPass=true;
            console.log("result:",userPassword);
            if(hasPass && userPassword!=undefined && req.body.password==userPassword.password){
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
        var data=[];
        var prof=[];
        console.log("username:",req.session.username)
        client.query(`SELECT * FROM quiz.users WHERE username='${req.session.username}'`, (err, res) => {
            if (err) {
              console.log (err)
            }
            users=res.rows;
            if(users!=undefined){
                console.log(users)
                prof.push(users[0]["name"],users[0]["age"],users[0]["username"]);
                client.query(`SELECT * FROM quiz.quiz_results where user_id=${users[0]["id"]}`, (err, res) => {
                    if (err) {
                      console.log (err)
                    }
                    data.push(res.rows);
                })
                
            }
        
        console.log("profile:",prof,"quiz",data);
        result.render('profile.ejs',{prof:prof,data:data,session:req.session.loggedin})
        })
    },
    newUser:function(req,result){
        console.log("income:",req.body);
        var hasUser=false;
        client.query(`SELECT * FROM quiz.users WHERE username='${req.session.username}'`, (err, res) => {
            if (err) {
              console.log (err)
            }
            console.log(res)
            if(res.rows[0]!=undefined){hasUser=true;}
            let username=req.body.username;
            let password=req.body.password;
            let age=req.body.age;
            if(!hasUser){
                client.query(`insert into quiz.users
                (name,username,password,age)
                values('${req.body.name}','${username}','${password}',${age})`, (err, res) => {
                    if (err) {
                        console.log (err);
                    }
                    result.render('sign_in.ejs');
                })
            }        
        })
    }
}