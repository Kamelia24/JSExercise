module.exports={

    home:function(req, res){ 
        res.render('index'); 
    },
    login:function(req, res){ 
        res.render('sign_in'); 
    },
    register:function(req, res){ 
        res.render('sign_up'); 
    },
    getQuiz:function(req, res){ 
        res.render('beginning',{category:categories,difficulty:difficulties}); 
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
            res.render('quizContent',{sorted:sorted}); 
    },
    addUserScore:function(req,res){
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
    },
    newUser:function(req,res){
        console.log("income:",req.body);
        //var rawdata=fs.readFileSync('userInfo.json');
        //let users=JSON.parse(rawdata);
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
        //var rawdata=fs.readFileSync('userInfo.json');
        //let users=JSON.parse(rawdata);
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
                res.render('beginning.ejs',{category:categories,difficulty:difficulties});
                break;
        }else{outp="Incorect username or password,please try again!";}
    }res.send(outp);
    },
    logOut:function(req,res,next){
        if (req.session) {
            // delete session object
            req.session.destroy(function(err) {
              if(err) {
                return next(err);
              } else {
                return res.redirect('/');
              }
            });
          }
    }

}