var reveal=document.getElementById("checkScore");
reveal.addEventListener("click",showInputField);
function showInputField(){
    document.getElementById("users").classList.remove("hide");
    var user=document.getElementById("username").value;
    console.log(user);
    $.ajax({
        url: "http://localhost:3000/showPrevious",
        type:   'POST',
        data: {'name': user} ,
        success: function(msg){
            console.log(msg);
            var output="";
            for(var key in msg){
                if(key=="empty"){
                     output='<div>You are new here,better start the quiz. :) </div>';
                    document.getElementById("showResult").innerHTML=output;
                    document.getElementById("showResult").classList.remove("hide");
                }else{
                    for(let i=1;i<msg.length;i++){
                     output+=`<div>You scored:${msg[i].score} on ${msg[i].date} at the ${msg[i].difficulty} ${msg[i].category} quiz</div><br>`;
                    }
                    document.getElementById("showResult").innerHTML=output;
                    document.getElementById("showResult").classList.remove("hide");
                    break;
                }
            }
        },
        error: function() {
            $("#failed").css("visibility","visible")
            //document.getElementById("SubmitButton").disabled = false;
        }
    });
}
$('#users').on('submit',function(event){
    event.preventDefault();
    //var serialized=$( "form" ).serialize();
    var user=document.getElementsByTagName("input")[2].value;
    $.ajax({
        url: "http://localhost:3000/showPrevious",
        type:   'POST',
        data: {'name': user} ,
        success: function(msg){
            console.log(msg);
            let output="";
            for(var key in msg){
                if(key=="empty"){
                     output='<div>You are new here,better start the quiz. :) </div>';
                    document.getElementById("showResult").innerHTML=output;
                    document.getElementById("showResult").classList.remove("hide");
                }else{
                    for(let i=0;i<msg.length;i++){
                     output+=`<div>You scored:${msg[i].score} on ${msg[i].date} at the ${msg[i].difficulty} ${msg[i].category} quiz</div><br>`;
                    }
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
});