er.classList.add("hide");
var curPage = 0;
var corrected = 0;
var myAnswers = [];
var myQuiz = []

var myHeader = document.getElementById("quizHeader");
var classname = document.getElementsByClassName("answer");
var myQuestion = document.getElementById("questions");
var progressBar = document.getElementById("progressBar");
var btnNext = document.getElementById("btnNext");
var btnPrevious = document.getElementById("btnPrevious");
var btnFinish = document.getElementById("finishQuiz");

var con=document.getElementById("submit");
var cat;
var dif;
con.addEventListener("click",getFilteredQuestions);
btnNext.addEventListener("click", moveNext);
btnPrevious.addEventListener("click", moveBack);
btnFinish.addEventListener("click", check);
btnYes.addEventListener("click",endQuiz);
btnNo.addEventListener("click",reload);
console.log(classname.length)
for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', myAnswer, false);
}

$(document).ready(function(){
function dropdownCategoryInfo(){
    var output=`<option value="" ></option>`;
    /*for(element in categories){
        output+=`<option value="${categories[element]}" > ${categories[element]} </option>`;
    }*/
    $.ajax({
        url:"http://localhost:3000/category",
        type: 'GET',
        success:function(msg){
            console.log(msg);
            for(element in msg){
                output+=`<option value="${msg[element]}" > ${msg[element]} </option>`;
            }
            document.getElementById("category").innerHTML=output;
        }

    });
    
}
dropdownCategoryInfo();

function dropdownDifficultyInfo(){
    var output='<option value="" ></option>';
    /*for(element in difficulties){
        output+=`<option value="${difficulties[element]}" > ${difficulties[element]} </option>`;
    }*/
    $.ajax({
        url:"http://localhost:3000/difficulty",
        type: 'GET',
        success:function(msg){
            console.log(msg);
            for(element in msg){
                output+=`<option value="${msg[element]}" > ${msg[element]} </option>`;
                console.log(output)
            }
             document.getElementById("difficulty").innerHTML=output;
        }

    });
   
}
dropdownDifficultyInfo();
});
function sortByCategory(){
    cat=document.getElementById("category").value;
}

function sortByDifficulty(){
    dif=document.getElementById("difficulty").value;
}

function getFilteredQuestions(){
    if(cat!=undefined && dif!=undefined && cat!="" && dif!=""){
        /*for(var i=0;i<myQuizАll.length;i++){
            if(myQuizАll[i].category==cat && myQuizАll[i].difficulty==dif){
                myQuiz.push(myQuizАll[i]);
            }
        }*/
        $.ajax({
        url:"http://localhost:3000/sort",
        type: 'POST',
        data: {"cat":cat,"dif":dif},
        success:function(msg){
            console.log(msg);
            myQuiz=msg;
            beginning.classList.add("hide");
            quizContent.classList.remove("hide");
            document.getElementById("checkScore").classList.add("hide");
            inputStats();
            checkPage();
        }
        });
        /*
        console.log(myQuiz)
        beginning.classList.add("hide");
        quizContent.classList.remove("hide");
        inputStats();
        //checkPage();*/
    }else{
        er.classList.remove("hide");
    }
}

function inputStats(){
    var output1="";
    for(var i=0;i<myQuiz.length;i++){
        
        output1+=`<p id="${i+1}" class="btn"></p><br>`;
    }
    document.getElementById("statistics").innerHTML=output1;
    addStatListener();
}
function addStatListener(){
var stat=document.getElementById("statistics").childNodes;
for (var i = 0; i < stat.length; i++) {
    stat[i].addEventListener('click',checked,false);
}
}


