var reveal=document.getElementById("checkScore");
reveal.addEventListener("click",showInputField);
function showInputField(){
    document.getElementById("users").classList.remove("hide");
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
});
