var add=document.getElementById("addQuestion");
var show=document.getElementById("showQuestion");
var questions=document.getElementById("questions");
var deleted=document.getElementById("deleteQuestion")
console.log(document.getElementById("submit"));
//document.getElementById("submit").addEventListener("click",SubmitForm);
add.addEventListener("click",addQuestion);
show.addEventListener("click",showQuestion);
deleted.addEventListener("click",deleteQuestion);
function deleteQuestion(){
    $.ajax({
        url:"http://localhost:3000/deleteQuestion",
        type: 'POST',
        data: {'delete':"delete"},
        success:function(msg){
            
        }

    });
}
function showQuestion(){
$.ajax({
    url:"http://localhost:3000/quizQuestions",
    type: 'GET',
    success:function(msg){
        //console.log(msg);
        let output="";
        var myQuizAll=msg;
        for(let i=0;i<msg.length;i++){
            output+=`<div class="question1"><p value="${msg[i]}" > <span style="font-weight: bold;font-size:1.3em">Question ${i+1}:</span> ${msg[i].question} <br>`;
            for(let f=0;f<msg[i].answers.length;f++){
                output+=`<p value="${msg[i]}" ><span style="font-weight: bold;font-size:1em"> Answer ${f+1} :</span> ${msg[i].answers[f]} <br>`;
            }
            output+="</div>"
        }
        document.getElementById("questions").innerHTML=output;
        document.getElementById("questions").classList.remove("hide");
    }
    
});
}
function addQuestion(){
    
    $.ajax({
        url:"http://localhost:3000/category",
        type: 'GET',
        success:function(msg){
            //console.log(msg);
            let output=`<option value="" ></option>`;
            for(element in msg){
                output+=`<option value="${msg[element]}1" > ${msg[element]} </option>`;
            }
            document.getElementById("category").innerHTML=output;
        }

    });
    $.ajax({
        url:"http://localhost:3000/difficulty",
        type: 'GET',
        success:function(msg){
            //console.log(msg);
            let output=`<option value="" ></option>`;
            for(element in msg){
                output+=`<option value="${msg[element]}" > ${msg[element]} </option>`;
            }
            document.getElementById("difficulty").innerHTML=output;
        }

    });
    document.getElementById("pattern").classList.remove("hide")
}

$('#pattern').on('submit',function(event){
    event.preventDefault();
    var serialized=$( "form" ).serialize();
    if(document.getElementById("category").value!="" && document.getElementById("difficulty").value!=""){
        document.getElementById("message").classList.add("hide");
    serialized+=`&category=${document.getElementById("category").value}&difficulty=${document.getElementById("difficulty").value}`;
    console.log(serialized);
    $.ajax({
        url: "http://localhost:3000/newQuestion",
        type:   'POST',
        data: serialized ,
        success: function(msg){
            console.log(msg);
            document.getElementById("pattern").classList.add("hide");
        },
        error: function() {
            $("#failed").css("visibility","visible")
            //document.getElementById("SubmitButton").disabled = false;
        }
    });
}
else{
    document.getElementById("message").classList.remove("hide");
}
});

