const Data=require('../data/data.js');
const quizAll=Data.getQuestions();
const categories=Data.getCategories();
const difficulties=Data.getDifficulties();
const fs=require('fs');
var rawdata=fs.readFileSync('data/userInfo.json');
let users=JSON.parse(rawdata);
module.exports={

    home:function(req, res){ 
        res.render('index',{session:req.session.loggedin}); 
    },
    login:function(req, res){ 
        if(req.body.session){
        var data=[];
        var prof=[];
        for(key in users){
            console.log(users[key][0].username,req.session.username)
            if(users[key][0].username==req.session.username){
                prof.push(key,users[key][0]);
                for(let i=1;i<users[key].length;i++){
                data.push(users[key][i]);
                }
                
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
    getQuiz:function(req, res){ 
        res.render('beginning',{category:categories,difficulty:difficulties,session:req.session.loggedin}); 
    },
    sortQuiz:function(req, res){
        var quizLength=0;
        var curPage=0;
            console.log(req.body);
            var sorted=[];
            const cat=req.body.category;//console.log(cat);
            const dif=req.body.difficulty;//console.log(dif);
            for(var i=0;i<quizAll.length;i++){
                //console.log(quizAll[i].category,cat,quizAll[i].difficulty,dif);
                if(`${quizAll[i].category}`==cat && `${quizAll[i].difficulty}`==dif){
                    //console.log(quizAll[i]);
                    sorted.push(quizAll[i]);
                    quizLength++;
                }
            }
            console.log(sorted)
            res.render('quizContent',{sorted:sorted,session:req.session.loggedin}); 
    },
    addUserScore:function(req,res){
        console.log(req.body);
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
    },
    newUser:function(req,res){
        console.log("income:",req.body);
        var hasUser=false;
        for(key in users){if(key==req.body.user){hasUser=true;}}
        let data={};
        username=req.body.username;
        password=req.body.password;
        data[`username`]=username;
        data[`password`]=password;
        data['age']=req.body.age;
        console.log("data:",data);
        if(!hasUser){
        users[`${req.body.name}`]=[data];
        }
        //console.log(users[`${req.body.user}`][0]);
        let data1 = JSON.stringify(users);
        fs.writeFileSync('userInfo.json', data1);
        res.render('sign_in.ejs');
    },
    logInVerify:function(req,res){
        console.log("income:",req.body);
        let outp={};
        var hasUser=false;
        for(key in users){
    console.log(users[key][0].username,req.body.username)
                console.log(users[key][0].password,req.body.password)
            if(users[key][0].username==req.body.username &&
                req.body.password==users[key][0].password){
                
                console.log("correct");
                req.session.loggedin = true;
                req.session.username = req.body.username;
                res.render('beginning.ejs',{category:categories,difficulty:difficulties,session:req.session.loggedin});
                break;
        }else{outp="Incorect username or password,please try again!";}
    }res.send(outp);
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
        for(key in users){
            console.log(users[key][0].username,req.session.username)
            if(users[key][0].username==req.session.username){
                prof.push(key,users[key][0]);
                for(let i=1;i<users[key].length;i++){
                data.push(users[key][i]);
                }
                
                break;
            }
        }
        console.log("profile:",prof,"quiz",data);
        res.render('profile.ejs',{prof:prof,data:data,session:req.session.loggedin})
    }

}