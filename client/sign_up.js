signin=document.getElementById("sign_in_button");
signup=document.getElementById("sign_up_button");
takequiz=document.getElementById("take_quiz");
signin.addEventListener("click",signining);
signup.addEventListener("click",signuping);
takequiz.addEventListener("click",takeTheQuiz);
function signining(){
    document.getElementById("sign").classList.remove("hide");
    document.getElementById("sign_in").classList.remove("hide");
    document.getElementById("buttons").classList.add("hide");
}
function signuping(){
    document.getElementById("sign").classList.remove("hide");
    document.getElementById("sign_up").classList.remove("hide");
    document.getElementById("buttons").classList.add("hide");
}
function takeTheQuiz(){
    document.getElementById("sign").classList.add("hide");
    document.getElementById("sign_in").classList.add("hide");
    document.getElementById("buttons").classList.add("hide");
    document.getElementById("beginning").classList.remove("hide");
}
$('#sign_up').on('submit',function(event){
    event.preventDefault();
var info=$( "form" ).serialize();
document.getElementById("sign_up").classList.add("hide");
$.ajax({
    url: "http://localhost:3000/addUserData",
    type:   'POST',
    data: info ,
    success: function(msg){
        
        document.getElementById("sign").classList.remove("hide");
        document.getElementById("sign_up").classList.add("hide");
        document.getElementById("sign_in").classList.remove("hide");
    },
    error: function() {
        $("#failed").css("visibility","visible")
        //document.getElementById("SubmitButton").disabled = false;
    }
});
});
$('#sign_in').on('submit',function(event){
    event.preventDefault();
var info=$( "form" ).serialize();
$.ajax({
    url: "http://localhost:3000/checkUserData",
    type:   'POST',
    data: info ,
    success: function(msg){
        console.log(msg);
        if(msg.correct!="correct"){document.getElementById("error_message").classList.remove("hide");}
        else{
        document.getElementById("sign_in").classList.add("hide");
        document.getElementById("beginning").classList.remove("hide");
    }
    },
    error: function() {
        $("#failed").css("visibility","visible")
        //document.getElementById("SubmitButton").disabled = false;
    }
});
});