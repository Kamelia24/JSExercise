var myQuizАll = [
    question1={
        question:[1,"What is addEventListener() used for?"],
        answers:["attach a click event","nothing","never use it","listens to HTML"],
        correct:"attach a click event",
        category:"javascript",
        difficulty:"easy"
    },
    question1={
        question:[2,"What does DOM stand for?"],
        answers:["Document Over Mountains","Document Object Model","Do Over Models","Nothing"],
        correct:"Document Object Model",
        category:"javascript",
        difficulty:"easy"
    },
    question1={
        question:[3,"What ?"],
        answers:["document  Model","nothing","Big  Model","Browser Model"],
        correct:"Browser Object Model",
        category:'javascript',
        difficulty:"easy"
    },
    question1={
        question:[4,"What does ?"],
        answers:[" Model","nothing","Big ","Browser Object Model"],
        correct:"Browser Object Model",
        category:'javascript',
        difficulty:"easy"
    },
    question1={
        question:[5,"What does  for?"],
        answers:["document Object","nothing","Object Model","Browser Object Model"],
        correct:"Browser Object Model",
        category:'javascript',
        difficulty:"easy"
    },
    question1={
        question:[1,"What is HTML?"],
        answers:["Hyper Text Markup Language","nothing","hig tbject Model lyrics","Browser Object Model"],
        correct:"Hyper Text Markup Language",
        category:'html',
        difficulty:'difficult'
    },
    question1={
        question:[1,"What does script stand for?"],
        answers:["tag","nothing","Big Object Model","Browser Object Model"],
        correct:"tag",
        category:'html',
        difficulty:'easy'
    },
    question1={
        question:[2,"What does class stand for?"],
        answers:["class","nothing","Big Object Model","Browser Object Model"],
        correct:"class",
        category:"html",
        difficulty:"easy"
    },
    question1={
        question:[1,"What does text stand for?"],
        answers:["text","nothing","Big Object Model","Browser Object Model"],
        correct:"text",
        category:"css",
        difficulty:"easy"
    },
    question1={
        question:[2,"What does BOM stand for?"],
        answers:["document Object Model","nothing","Big Object Model","Browser Object Model"],
        correct:"Browser Object Model",
        category:"css",
        difficulty:"easy"
    },
    question1={
        question:[1,"What does color stand for?"],
        answers:["color","nothing","Big Object Model","Browser Object Model"],
        correct:"color",
        category:'css',
        difficulty:"difficult"
    }
]
var categories=["html","css","javascript"]
var difficulties=["easy","difficult"]

module.exports.log=function(msg){
    if(msg.delete=="delete"){
        console.log("new array",myQuizАll);
        myQuizАll.pop();
        console.log("new array",myQuizАll);
    }else{
    myQuizАll.push(msg);
    }
    console.log("in");
}
const getQuestions=()=>{return myQuizАll;};
exports.getQuestions=getQuestions;
const getDifficulties=()=>{return difficulties;};
exports.getDifficulties=getDifficulties;
const getCategories=()=>{return categories;};
exports.getCategories=getCategories;