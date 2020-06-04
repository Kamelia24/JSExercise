const fs=require('fs');
var rawdata=fs.readFileSync('data/userInfo.json');
let users;
let categories;
let difficulties;
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
client.query('SELECT category FROM quiz.categories', (err, res) => {
    if (err) {
      console.log (err)
    }
    categories=res.rows;
})
client.query('SELECT difficulty FROM quiz.difficulties', (err, res) => {
    if (err) {
      console.log (err)
    }
    difficulties=res.rows;
})
module.exports={
    login:function(req, res){ 
        if(req.body.session){
        var data=[];
        var prof=[];
        for(let i=0;i<users.length;i++){
            console.log(users[i].username,req.session.username)
            if(users[i].username==req.session.username){
                prof.push(users[i]);
                client.query(`SELECT * FROM quiz.quiz_results where user_id=${i}`, (err, res) => {
                    if (err) {
                      console.log (err)
                    }
                    data.push(res.rows);
                })
                break;
            }
        }
        console.log("profile:",prof,"quiz",data);
        res.render('profile.ejs',{prof:prof,data:data,session:req.session.loggedin})
        }else{
        res.render('sign_in'); 
        }
    },
    register:function(req, res){ 
        res.render('sign_up'); 
    },
    logInVerify:function(req,res){
        console.log("income:",req.body);
        let outp={};
        var hasUser=false;
        for(let i=0;i<users.length;i++){
    console.log(users[i].username,req.body.username)
                console.log(users[i].password,req.body.password)
            if(users[i].username==req.body.username &&
                req.body.password==users[i].password){
                
                console.log("correct");
                req.session.loggedin = true;
                req.session.username = req.body.username;
                res.render('beginning.ejs',{category:categories,difficulty:difficulties,session:req.session.loggedin});
                break;
        }else{outp="Incorect username or password,please try again!";}
    }//res.send(outp);
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
    profileInfo:function(req,res){
        var data=[];
        var prof=[];
        for(let i=0;i<users.length;i++){
            console.log(users[i].username,req.session.username)
            if(users[i].username==req.session.username){
                prof.push(users[i]);
                client.query(`SELECT * FROM quiz.quiz_results where user_id=${i}`, (err, res) => {
                    if (err) {
                      console.log (err)
                    }
                    data.push(res.rows);
                })
                break;
            }
        }
        console.log("profile:",prof,"quiz",data);
        res.render('profile.ejs',{prof:prof,data:data,session:req.session.loggedin})
    },
    newUser:function(req,res){
        console.log("income:",req.body);
        var hasUser=false;
        for(let i=0;i<users.length;i++){if(users[i].name==req.body.user){hasUser=true;}}
        let data={};
        username=req.body.username;
        password=req.body.password;
        age==req.body.age;
        //data[`username`]=username;
        //data[`password`]=password;
        //data['age']=age;
        //console.log("data:",data);
        if(!hasUser){
            client.query(`insert into quiz.users
            (name,username,password,age)
            values(${req.body.name},${username},${password},${age})`, (err, res) => {
                if (err) {
                  console.log (err)
                }
                
            })
        //users[`${req.body.name}`]=[data];
        }
        //console.log(users[`${req.body.user}`][0]);
        //let data1 = JSON.stringify(users);
        //fs.writeFileSync('userInfo.json', data1);
        res.render('sign_in.ejs');
    }
}