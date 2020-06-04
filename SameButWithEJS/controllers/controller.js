const Data=require('../data/data.js');
//const quiz;
//const answers;
const quizAll=Data;
let categories;
let difficulties;
const fs=require('fs');
var rawdata=fs.readFileSync('data/userInfo.json');
let users=JSON.parse(rawdata);
const { Client} = require('pg');
client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
	database: 'second',
	port:5432
});
client.connect();
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
client.query(`SELECT question,category,difficulty 
FROM quiz.question_info inf
left join quiz.categories cat on inf.category_id=cat.id
left join quiz.difficulties dif on inf.difficulty_id=dif.id`, (err, res) => {
    if (err) {
      console.log (err)
    }
    difficulties=res;
})
module.exports={

    home:function(req, res){ 
        client.query('SELECT * FROM quiz.users', (err, res) => {
            if (err) {
              console.log (err)
            }
            console.log(res.rows)
        });
        client.query(`SELECT * FROM quiz.quiz_results`, (err, res) => {
            if (err) {
              console.log (err)
            }
            console.log(res.rows);
        })
        client.query('SELECT category FROM quiz.categories', (err, res) => {
            if (err) {
              console.log (err)
            }
            console.log(res.rows);
        })
        client.query(`SELECT question,category,difficulty 
FROM quiz.question_info inf
left join quiz.categories cat on inf.category_id=cat.id
left join quiz.difficulties dif on inf.difficulty_id=dif.id`, (err, res) => {
    if (err) {
      console.log (err)
    }
    console.log(res.rows);
})
        res.render('index',{session:req.session.loggedin}); 
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
    }
}