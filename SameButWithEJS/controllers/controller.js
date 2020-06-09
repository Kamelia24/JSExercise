var cat;
var dif;
const { Client} = require('pg');
client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
	database: 'quiz',
	port:5432
});
client.connect();
module.exports={

    home:function(req, res){ 
        res.render('index',{session:req.session.loggedin}); 
    },
    
    getQuiz:function(req, result){ 
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
                result.render('beginning.ejs',{category:categories,difficulty:difficulties,session:req.session.loggedin});
            })
        }) 
    },
    sortQuiz:function(req, result){
        var quizLength=0;
        var curPage=0;
            console.log(req.body);
            var sorted=[];
           
            cat=req.body.category;
            dif=req.body.difficulty;
            client.query(`SELECT question,answers,correct_answer FROM quiz.question_info inf
            left join quiz.categories cat on inf.category_id=cat.id
            left join quiz.difficulties dif on inf.difficulty_id=dif.id
            left join quiz.question_answers answ on answ.question_id=inf.id
            where cat.category='${cat}' and dif.difficulty='${dif}'`, (err, res) => {
                if (err) {
                  console.log (err)
                }
                console.log(res.rows);let num=1;
                for(let i=0;i<res.rows.length;i+=4){
                    let f=0;
                    let quizQuestion={};
                   quizQuestion.question=[num,res.rows[i]["question"]];console.log(quizQuestion.question);
                   quizQuestion.answers=[];
                   do{
                        quizQuestion.answers.push(res.rows[i+f]["answers"]);
                        if(res.rows[i+f]["correct_answer"]==true){
                        quizQuestion.correct=f+1;
                        }
                        f++;
                   }while( res.rows[i+f]!=undefined && res.rows[i+f-1]["question"]==res.rows[i+f]["question"]);
                   
                   console.log(quizQuestion.answers);
                   
                   quizQuestion.category=cat;console.log(quizQuestion.category);
                   
                   quizQuestion.difficulty=dif;console.log(quizQuestion.difficulty);
                   console.log(quizQuestion);
                   sorted[num-1]=quizQuestion;num++;console.log(sorted)
                }
                   
            result.render('quizContent',{sorted:sorted,session:req.session.loggedin}); 
                
                })
            
    },
    addUserScore:function(req,result){
        console.log(req.body);
        score=req.body.score;
        date=req.body.date;
        answers=req.body.answers;
        correct=req.body.correct;
        console.log(score,date,answers,cat,dif,req.session.username,correct);
        client.query(`SELECT id FROM quiz.users where username='${req.session.username}'`, (err, res) => {
            if (err) {
                console.log (err)
            }
            userID=res.rows[0];
            console.log("userID ",userID)
            if(userID!=undefined){
                client.query(`SELECT id from quiz.categories where category='${cat}'`, (err, res) => {
                    if (err) {
                        console.log (err)
                    }
                    cat=res.rows[0];
                    console.log("category id ",cat)
                    client.query(`SELECT id FROM quiz.difficulties where difficulty='${dif}'`, (err, res) => {
                        if (err) {
                            console.log (err)
                        }
                        dif=res.rows[0];
                        console.log("difficulty id ",dif)
                        client.query(`INSERT INTO quiz.quiz_results (score,date_taken,category_id,difficulty_id,user_id) VALUES (${score},current_timestamp,${cat.id},${dif.id},${userID.id})`, (err, res) => {
                            if (err) {
                                console.log (err)
                            }
                            client.query(`SELECT id FROM quiz.quiz_results order by id desc limit 1`, (err, res) => {
                                if (err) {
                                    console.log (err)
                                }
                                quizID=res.rows[0];
                                console.log("quizID ",quizID)
                                client.query(`SELECT id FROM quiz.question_info where category_id=${cat.id} and difficulty_id=${dif.id}`, (err, res) => {
                                    if (err) {
                                        console.log (err)
                                    }
                                    quest_id=res.rows;
                                    console.log("question id ",quest_id[0]['id'])
                                    var answersID;
                                    for(let f=0;f<quest_id.length;f++){
                                        client.query(`select id from quiz.question_answers where question_id=${(quest_id[f]).id} order by id asc`, (err, res) => {
                                            if (err) {
                                                console.log (err)
                                            }
                                            answersID=res.rows[answers[f]].id-1;
                                            console.log("answersID ",res.rows[answers[f]].id-1);
                                            console.log(quest_id[f]['id'],answersID,correct[f],quizID.id)
                                            client.query(`INSERT INTO quiz.user_answers (question_id,answer_id,is_correct,quiz_id) values(${quest_id[f]['id']},${answersID},${correct[f]},${quizID.id})`, (err, res) => {
                                                if (err) {
                                                    console.log (err)
                                                }
                                            })
                                        })
                                    }
                                })
                            })
                        })
                    })
                })
            }
        })
    }
}