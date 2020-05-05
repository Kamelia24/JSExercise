
function check(){
    var isAnswered=false;
    for(let i=0;i<myQuiz.length;i++){
        if(myAnswers[i]===undefined){
            isAnswered=true;
        }
    }
    if(isAnswered){
        finishing.classList.remove("hide");
        btnYes.classList.remove("hide");
        btnNo.classList.remove("hide");
        quizContent.classList.add("hide");

    }
    else{
        endQuiz();
    }
}

function reload(){
    for(var i=0;i<myQuiz.length;i++){
        if(myAnswers[i]==undefined){
            curPage=i;
            break;
        }
    }
    
    finishing.classList.add("hide");
    btnYes.classList.add("hide");
    btnNo.classList.add("hide");
    quizContent.classList.remove("hide");
    checkPage(curPage);
}
function endQuiz() {
    console.log();
    btnYes.classList.add("hide");
    btnNo.classList.add("hide");
    finishing.classList.add("hide");
    quizContent.classList.remove("hide");
    var output = "<div class='output'>Quiz Results<BR>";
    var questionResult = "NA";
    for (var i = 0; i < myQuiz.length; i++) {
        if (myQuiz[i].correct == myQuiz[i].answers[myAnswers[i]-1]) {
            questionResult = '<span class="glyphicon glyphicon-ok-circle" aria-hidden="true"></span>';
            corrected++;
        }else if(myQuiz[i].correct!=myQuiz[i].answers[myAnswers[i]-1] && myAnswers[i]){
            questionResult = '<span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>';
        }else {
            questionResult = '<span>Not Answered</span>';
        }
        output = output + '<p>Question ' + (i + 1) + ' ' + questionResult + '</p> ';
    }
    output = output + '<p>You scored ' + corrected + ' out of ' + myQuiz.length + '</p></div> ';
    document.getElementById("quizContent").innerHTML = output;
    
    var date=new Date();
    var day=date.getDate();
    var month=date.getMonth();
    var year=date.getFullYear();
    var hour=date.getHours();
    var minutes=date.getMinutes();
    let info={
        user:document.getElementById("username").value,
        score:`${corrected}/${myQuiz.length}`,
        date:`${day}.${month}.${year} ${hour}:${minutes}`,
        category:`${document.getElementById("category").value}`,
        difficulty:`${document.getElementById("difficulty").value}`
    }
    console.log(info);
    $.ajax({
        url: "http://localhost:3000/addUser",
        type:   'POST',
        data: info ,
        success: function(msg){
            console.log(msg);
            for(var key in msg){
                if(key=="empty"){
                    let output='<div>You are new here,better start the quiz. :) </div>';
                    document.getElementById("showResult").innerHTML=output;
                    document.getElementById("showResult").classList.remove("hide");
                }else{
                    let output=`<div>${msg}</div>`;
                    document.getElementById("showResult").innerHTML=output;
                    document.getElementById("showResult").classList.remove("hide");
                }
            }
        },
        error: function() {
            $("#failed").css("visibility","visible")
            //document.getElementById("SubmitButton").disabled = false;
        }
    });
}

function checked(){
    var i=this.getAttribute("id");
    console.log("in")
    checkPage(i-1);
}

function checkPage(i) {
    if(i!=undefined){
        curPage=i;
    }
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
    let quest=`Question ${curPage+1} <br><br> ${myQuiz[curPage].question} <br>`;
    myHeader.innerHTML = quest;///add question
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
    
    ///update progress bar
    var increment = Math.ceil((curPage) / (myQuiz.length) * 100);
    progressBar.style.width = (increment) + '%';
    progressBar.innerHTML = (increment) + '%';
    outputed();
}

function moveNext() {
    if (curPage < (myQuiz.length - 1)) {
        curPage++;
        checkPage(curPage);
    } else {
        if (myQuiz.length >= curPage) {
            endQuiz();
        } 
    }
}

function moveBack() {
    if (curPage > 0) {
        curPage--;
        checkPage(curPage);
    }
}
