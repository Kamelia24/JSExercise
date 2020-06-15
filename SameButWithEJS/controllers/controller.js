var cat;
var dif;
let res;
require('dotenv').config();
const { Client} = require('pg');
client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
    port:process.env.DB_PORT
});
client.connect();
module.exports={

    home:function(req, result){ 
        result.render('index',{session:req.session.loggedin}); 
    },
    
    getQuiz:async function(req, result){ 
        let categories=[];
        let difficulties=[];
        try{
            res=await client.query('SELECT category FROM quiz.categories')
            for(let i=0;i<res.rows.length;i++){
                categories.push(res.rows[i]["category"])
            }
        }catch (err) {
            console.log('select categories:',err)
        }
        try{
            res=await client.query('SELECT difficulty FROM quiz.difficulties')
            for(let i=0;i<res.rows.length;i++){
                difficulties.push(res.rows[i]["difficulty"])
            }
            console.log("dif:",res.rows)
        }catch (err) {
            console.log ('select difficulties:',err)
        }
        result.render('beginning.ejs',{category:categories,difficulty:difficulties,session:req.session.loggedin});
            
    },
    sortQuiz:async function(req, result){
        console.log(req.body);
        let sorted=[];
        cat=req.body.category;
        dif=req.body.difficulty;
        try{
            res= await client.query(`SELECT question,answers,correct_answer FROM quiz.question_info inf
            left join quiz.categories cat on inf.category_id=cat.id
            left join quiz.difficulties dif on inf.difficulty_id=dif.id
            left join quiz.question_answers answ on answ.question_id=inf.id
            where cat.category='${cat}' and dif.difficulty='${dif}'`);
            console.log(res.rows);let num=1;
            for(let i=0;i<res.rows.length;i+=4){
                let f=0;
                let quizQuestion={};
                quizQuestion.question=[num,res.rows[i]["question"]];
                console.log(quizQuestion.question);
                quizQuestion.answers=[];
                do{
                    quizQuestion.answers.push(res.rows[i+f]["answers"]);
                    if(res.rows[i+f]["correct_answer"]==true){
                        quizQuestion.correct=f+1;
                    }
                    f++;
                }while(res.rows[i+f]!=undefined && res.rows[i+f-1]["question"]==res.rows[i+f]["question"]);
                console.log(quizQuestion.answers);
                quizQuestion.category=cat;console.log(quizQuestion.category);
                quizQuestion.difficulty=dif;console.log(quizQuestion.difficulty);
                console.log(quizQuestion);
                sorted[num-1]=quizQuestion;num++;console.log(sorted)
            }
        }catch (err) {
            console.log ('in sortQuiz:',err)
        }
        result.render('quizContent',{sorted:sorted,session:req.session.loggedin}); 
               
            
    },addUserScore:async function(req,result){
        console.log(req.body);
        score=req.body.score;
        date=req.body.date;
        answers=req.body.answers;
        correct=req.body.correct;
        username=req.session.username;
        let quizID;
        let quest_id;
        let userID;
        console.log(score,date,answers,cat,dif,req.session.username,correct);
        try{
           res=await client.query(`SELECT id FROM quiz.users where username='${username}'`)
           userID=res.rows[0];
           if(userID!=undefined){
            console.log("userID ",res.rows[0]);
            }else{result.send('Username not correct');} 
        } catch (err) {
            console.log('select userID:',err)
        }

        try{
            res=await client.query(`SELECT id from quiz.categories where category='${cat}'`)
            cat=res.rows[0];
            console.log("category id ",cat[0]);
        }catch (err) {
            console.log('select category id:',err)
        }
            
        try{
            res=await client.query(`SELECT id FROM quiz.difficulties where difficulty='${dif}'`)
            console.log("difficulty id ",res.rows[0])
            dif=res.rows[0];
        } catch (err) {
            console.log('select difficulty id:',err)
        }
        try{
            res=await client.query(`INSERT INTO quiz.quiz_results (score,date_taken,category_id,difficulty_id,user_id) VALUES (${score},current_timestamp,${cat.id},${dif.id},${userID.id})`)
            console.log('Success');        
        }catch (err) {
            console.log('insert in quiz_results:',err)
        }
        try{
            res=await client.query(`SELECT id FROM quiz.quiz_results order by id desc limit 1`)
            console.log("quizID ",res.rows[0])
            quizID=res.rows[0];
        }catch (err) {
            console.log('select quizID:',err)
        }

        try{
            res=await client.query(`SELECT id FROM quiz.question_info where category_id=${cat.id} and difficulty_id=${dif.id}`)
            console.log("question id ",res.rows)
            quest_id=res.rows;
        }catch(err) {
            console.log('select quest_id:',err)
        }
        let answersID;
        for(let f=0;f<quest_id.length;f++){
            try{
                res=await client.query(`select id from quiz.question_answers where question_id=${(quest_id[f]).id} order by id asc`)
                answersID=res.rows[answers[f]-1].id;
                console.log(quest_id[f]['id'],answersID,correct[f],quizID.id)
                console.log("answersID ",res.rows,answers[f]);
            }catch (err) {
                console.log('select answersID:',f,err)
            }
            try{
                res=await client.query(`INSERT INTO quiz.user_answers (question_id,answer_id,is_correct,quiz_id) values(${quest_id[f]['id']},${answersID},${correct[f]},${quizID.id})`)
                console.log('Success');
            }catch (err) {
                console.log('insert user_answers:',f,err)
            }
        }
    
    }
    /*addUserScore:function(req,result){
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
                                    let answersID;
                                    for(let f=0;f<quest_id.length;f++){
                                        client.query(`select id from quiz.question_answers where question_id=${(quest_id[f]).id} order by id asc`, (err, res) => {
                                            if (err) {
                                                console.log (err)
                                            }
                                            answersID=res.rows[answers[f]-1].id-1;
                                            console.log(quest_id[f]['id'],answersID,correct[f],quizID.id)
                                            console.log("answersID ",res.rows,answers[f]);
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
    }*/
}