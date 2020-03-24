var curPage = 0,
    correct = 0;
var myAnswers = [];
var myQuiz = [
    ["What is addEventListener() used for?", 1, "attach a click event", "nothing", "never use it", "listens to HTML",false],
    ["What does DOM stand for", 1, "Document Object Model ", "Document Over Mountains", "Do Over Models", "Nothing",false],
    ["What does BOM stand for", 4, "document Object Model", "nothing", "Big Object Model", " Browser Object Model ",false]
];
var myHeader = document.getElementById("quizHeader");
var classname = document.getElementsByClassName("answer");
var myQuestion = document.getElementById("questions");
var progressBar = document.getElementById("progressBar");
var btnNext = document.getElementById("btnNext");
var btnPrevious = document.getElementById("btnPrevious");
var btnFinish = document.getElementById("finishQuiz");
checkPage();
btnNext.addEventListener("click", moveNext);
btnPrevious.addEventListener("click", moveBack);
btnFinish.addEventListener("click", check);
btnYes.addEventListener("click",endQuiz);
btnNo.addEventListener("click",reload);

for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', myAnswer, false);
}

function myAnswer() {
    var idAnswer = this.getAttribute("data-id");
    /// check for correct answer
    myAnswers[curPage] = idAnswer;
   // addBox();
    if (myQuiz[curPage][1] == idAnswer && !myQuiz[curPage][6]) {
        console.log('Correct Answer');
        addBoxCorrect();
        myQuiz[curPage][6]=true;
    } else if(!myQuiz[curPage][6]){
        console.log('Wrong Answer');
        addBoxWrong();
        myQuiz[curPage][6]=true;
    }
    
}
function addBox() {
    for (var i = 0; i < myQuestion.children.length; i++) {
        var curNode = myQuestion.children[i];
        if (myAnswers[curPage] == (i + 1) ) {
            if(!myQuiz[curPage][6]){
                console.log("adedPink");
            curNode.classList.add("selAnswer");}
        } else {
            console.log("removedPink");
            curNode.classList.remove("selAnswer");
        }
    }
}
function addBoxCorrect() {
    for (var i = 0; i < myQuestion.children.length; i++) {
        var curNode = myQuestion.children[i];
        if (myAnswers[curPage] == (i + 1) ) {
            if(!myQuiz[curPage][6]){
                console.log("addedGreen");
            curNode.classList.add("greenBox");}
        } else {
            console.log("removedGreen");
            curNode.classList.remove("greenBox");
        }
    }
}

function addBoxWrong() {
    for (var i = 0; i < myQuestion.children.length; i++) {
        var curNode = myQuestion.children[i];
        if (myAnswers[curPage] == (i + 1)  ) {
            if(!myQuiz[curPage][6]){
                console.log("addedRed");
            curNode.classList.add("redBox");
            }
        } else {
            console.log("removedRed");
            curNode.classList.remove("redBox");
        }
    }
}

function moveNext() {
    ///check if an answer has been made
   // if (myAnswers[curPage]) {
        //console.log('okay to proceed');
        //if(!myAnswers[curPage]){iunanswered++;}
        if (curPage < (myQuiz.length - 1)) {
            curPage++;
            checkPage(curPage);
        } else {
            ///check if quiz is completed
            //console.log(curPage + ' ' + myQuiz.length);
            if (myQuiz.length >= curPage) {
                ckeck();
               // endQuiz();
            } else {
                //console.log('end of quiz Page ' + curPage);
            }
        }
   // } else {
        //console.log('not answered');
    //}
}
function check(){
    if(myAnswers.length !=myQuiz.length){
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
function endQuiz() {
    //if (myAnswers[2]) {
        btnYes.classList.add("hide");
        btnNo.classList.add("hide");
        finishing.classList.add("hide");
        quizContent.classList.remove("hide");
        var output = "<div class='output'>Quiz Results<br>";
        var questionResult = "NA";
        console.log('Quiz Over');
        for (var i = 0; i < myQuiz.length; i++) {
            if (myQuiz[i][1] == myAnswers[i]) {
                questionResult = '<span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>';
                correct++;
            } else if(myQuiz[i][1]!=myAnswers[i] && myAnswers[i]){
                questionResult = '<span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>';
            }else{questionResult = '<span>Not Answered</span>'}
            output = output + '<p>Question ' + (i + 1) + ' ' + questionResult + '</p> ';
        }
        output = output + '<p><br>You scored ' + correct + ' out of ' + myQuiz.length + '</p></div> ';
        document.getElementById("quizContent").innerHTML = output;
    //} else {
        //console.log('not answered');
   // }
}

function checkPage(i) {
    console.log("checkpage")
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
    myHeader.innerHTML = myQuiz[curPage][0];
    for (var i = 0; i < myQuestion.children.length; i++) {
        var curNode = myQuestion.children[i];
        curNode.childNodes[1].innerHTML = capitalise(myQuiz[curPage][(i + 2)]);
        //check if answered already
        console.log(myAnswers[curPage-1]);
        if (myAnswers[curPage] == (i + 1) ) {
            if(myQuiz[curPage][1] == myAnswers[curPage]){
                curNode.classList.add("greenBox");
            }
            else if(myQuiz[curPage][1] != myAnswers[curPage] && myAnswers[curPage]){
                curNode.classList.add("redBox");
            }
            //curNode.classList.add("selAnswer");
            //console.log("yes");
        } else {
            //curNode.classList.remove("selAnswer");
            curNode.classList.remove("greenBox");
            curNode.classList.remove("redBox");
            //console.log('no');
        }
    }
    ///update progress bar
    var increment = Math.ceil((curPage+1) / (myQuiz.length) * 100);
    progressBar.style.width = (increment) + '%';
    progressBar.innerHTML = (increment) + '%';
}

function moveBack() {
    if (curPage > 0) {
        curPage--;
        console.log(curPage)
        checkPage(curPage);
    } else {
        //console.log('end of quiz Page ' + curPage);
    }
}

function capitalise(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}