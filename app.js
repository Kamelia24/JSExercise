var curPage = 0,
    correct = 0;
var myAnswers = [];
/*var myQuiz = [
    ["What is addEventListener() used for?", 1, "attach a click event", "nothing", "never use it", "listens to HTML"],
    ["What does DOM stand for", 1, "Document Object Model ", "Document Over Mountains", "Do Over Models", "Nothing"],
    ["What does BOM stand for", 4, "document Object Model", "nothing", "Big Object Model", " Browser Object Model "]
];
var myQuiz = [
    question1={
        question:"What is addEventListener() used for?",
        answers:["attach a click event","nothing","never use it","listens to HTML"],
        correct:"attach a click event"
    },
    question1={
        question:"What does DOM stand for?",
        answers:["Document Over Mountains","Document Object Model","Do Over Models","Nothing"],
        correct:"Document Object Model"
    },
    question1={
        question:"What does BOM stand for?",
        answers:["document Object Model","nothing","Big Object Model","Browser Object Model"],
        correct:"Browser Object Model"
    }
]
*/
var myHeader = document.getElementById("quizHeader");
var classname = document.getElementsByClassName("answer");
var myQuestion = document.getElementById("questions");
var progressBar = document.getElementById("progressBar");
var btnNext = document.getElementById("btnNext");
var btnPrevious = document.getElementById("btnPrevious");
var btnFinish = document.getElementById("finishQuiz");
var stat=document.getElementById("statistics").childNodes;
//console.log(stat);
checkPage();
btnNext.addEventListener("click", moveNext);
btnPrevious.addEventListener("click", moveBack);
btnFinish.addEventListener("click", check);
btnYes.addEventListener("click",endQuiz);
btnNo.addEventListener("click",reload);
for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', myAnswer, false);
}
for (var i = 1; i < stat.length; i++) {
    
    stat[i].addEventListener('click',checked,false);
    //console.log(stat[i],i)
}
function myAnswer() {
    var idAnswer = this.getAttribute("data-id");
    /// check for correct answer
    myAnswers[curPage] = idAnswer;
    console.log(myAnswers)
    if (myQuiz[curPage].correct == myQuiz[curPage].answers[idAnswer-1] ) {
        //console.log('Correct Answer');
    } else {
        //console.log('Wrong Answer');
    }
    addBox();
}
function checked(){
    var i=this.getAttribute("id");
    console.log("btn",i, "is clicked")
    checkPage(i-1);
}
function addBox() {
    for (var i = 0; i < myQuestion.children.length; i++) {
        var curNode = myQuestion.children[i];
        if (myAnswers[curPage] == (i + 1)) {
            curNode.classList.add("selAnswer");
        } else {
            curNode.classList.remove("selAnswer");
        }
    }
}

function moveNext() {
    ///check if an answer has been made
   // if (myAnswers[curPage]) {
        //console.log('okay to proceed');
        if (curPage < (myQuiz.length - 1)) {
            curPage++;
            checkPage(curPage);
        } else {
            ///check if quiz is completed
            //console.log(curPage + ' ' + myQuiz.length);
            if (myQuiz.length >= curPage) {
                endQuiz();
            } else {
                //console.log('end of quiz Page ' + curPage);
            }
        }
    //} else {
        //console.log('not answered');
   // }
}
function check(){
    var isAnswered=false;
    for(let i=0;i<myQuiz.length;i++){
        console.log(myAnswers[i]);console.log("not answered")
        if(myAnswers[i]===undefined){isAnswered=true;}
    }
    if(isAnswered){
        
        //output='<p style="text-align:center;font-size:2.5em">You have unanswered questions.<br>Are you sure you want to finish?</p>';
        //document.getElementById("quizContent").innerHTML = output;
        finishing.classList.remove("hide");
        btnYes.classList.remove("hide");
        btnNo.classList.remove("hide");
        quizContent.classList.add("hide");

    }
    else{endQuiz();}
}
function reload(){
    curPage=0;
    console.log(curPage);
        finishing.classList.add("hide");
        btnYes.classList.add("hide");
        btnNo.classList.add("hide");
        quizContent.classList.remove("hide");
    checkPage(curPage);
}
function output(){
    
    var result=" ";
    for (var i = 0; i < myQuiz.length; i++) {var output1=" ";
        if ( myAnswers[i]) {
            result = 'Answered';
            correct++;
        }else {result = 'Not Answered'}
        
        output1 = output1 + 'Question ' + (i + 1) + '==> ' + result + ' <br> ';
        //console.log(document.getElementsByTagName("p"));
        document.getElementsByTagName("p")[i].innerHTML = output1;
    }
    //output1 = output1 + '<p>You scored ' + correct + ' out of ' + myQuiz.length + '</p></div> ';
    
    for(var i=1;i<=myQuiz.length;i++){
        //console.log(stat.length);
    //document.getElementById("i").id = i;
    }
}
function endQuiz() {
    //if (myAnswers[2]) {
        btnYes.classList.add("hide");
        btnNo.classList.add("hide");
        finishing.classList.add("hide");
        quizContent.classList.remove("hide");
        var output = "<div class='output'>Quiz Results<BR>";
        var questionResult = "NA";
        //console.log('Quiz Over');
        console.log(myAnswers.length);
        for (var i = 0; i < myQuiz.length; i++) {
            if (myQuiz[i].correct == myAnswers[i]) {
                questionResult = '<span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>';
                correct++;
            } else if(myQuiz[i].correct!=myAnswers[i] && myAnswers[i]){
                questionResult = '<span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>';
            }else {questionResult = '<span>Not Answered</span>'}
            
            output = output + '<p>Question ' + (i + 1) + ' ' + questionResult + '</p> ';
        }
        output = output + '<p>You scored ' + correct + ' out of ' + myQuiz.length + '</p></div> ';
        document.getElementById("quizContent").innerHTML = output;
  //  } else {
        //console.log('not answered');
   // }
}

function checkPage(i) {
    console.log("thissss",i);
    if(i!=undefined){curPage=i;}
    /// add remove disabled buttons if there are no more questions in que
    if (curPage == 0) {
        btnPrevious.classList.add("hide");
    } else {
        btnPrevious.classList.remove("hide");
    }
    if ((curPage + 1) < (myQuiz.length)) {
        btnNext.classList.remove("hide");
    } else {
        btnNext.classList.add("hide");
        btnFinish.classList.remove("hide");
    }
    console.log(myQuiz[curPage])
    myHeader.innerHTML = myQuiz[curPage].question;///add question
    for (var i = 0; i < myQuestion.children.length; i++) {
        var curNode = myQuestion.children[i];
        curNode.childNodes[1].innerHTML = capitalise(myQuiz[curPage].answers[i]); ///add possible answers
        //check if answered already
        if (myAnswers[curPage] == (i + 1)) {
            curNode.classList.add("selAnswer");
        } else {
            curNode.classList.remove("selAnswer");
        }
    }
    /*let p=0;
     for(let answ in myQuiz[curPage]){
         if(answ!="question" && answ !="correct"){
         var curNode = myQuestion.children[p];
         console.log(curNode)
         

         curNode.childNodes[1].innerHTML = myQuiz[curPage][answ];
         console.log(myQuiz[curPage],answ,myQuiz[curPage][answ]);
        
         if (myAnswers[curPage] == (p + 1)) {
            curNode.classList.add("selAnswer");
        } else {
            curNode.classList.remove("selAnswer");
        }
         
          p++;}
     }*/
    ///update progress bar
    var increment = Math.ceil((curPage) / (myQuiz.length) * 100);
    progressBar.style.width = (increment) + '%';
    progressBar.innerHTML = (increment) + '%';
    output();
}

function moveBack() {
    if (curPage > 0) {
        curPage--;
        checkPage(curPage);
    } else {
        //console.log('end of quiz Page ' + curPage);
    }
}

function capitalise(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}
