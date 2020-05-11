
function myAnswer() {
    var idAnswer = this.getAttribute("data-id");
    myAnswers[curPage] = idAnswer;
    if(myQuiz[curPage].correct == myQuiz[curPage].answers[idAnswer-1] ) {

    } else {

    }
    addBox();
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

function outputed(){
    var result=" ";
    for (var i = 0; i < myQuiz.length; i++) {
        var output1=" ";
        if ( myAnswers[i]) {
            result = 'Answered';
            
        }else {
            result = 'Not Answered';
        }
        output1 = output1 + 'Question ' + (i + 1) + '==> ' + result + ' <br> ';
        document.getElementsByTagName("p")[i+1].innerHTML = output1;
    }
}


function capitalise(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}