
var tries = 0;
function checkAnswer(){

	var answer = document.getElementById("answer").value;
	if(answer){
		tries++;
		document.getElementById("try").innerHTML="Tries : "+tries;

		if(answer==parseInt("10011",2)){
			parent.PassQuestion(true,tries);
		}
		else{
			
			var elem = document.getElementById("mistery_cell");
			elem.style.backgroundColor="rgba(255,0,0,.2)";

			setTimeout(function(){
				elem.style.backgroundColor="";
			},1000);
		}
	}else{

			var elem = document.getElementById("answer");
			elem.style.borderBottom="2px solid rgba(255,0,0,0.3)";

			setTimeout(function(){
				elem.style.borderBottom="";
			},1000);

	}
}


function passQuestion(){
	parent.PassQuestion(false,tries);
	var anchor = getElementsByTagName("pass_btn");
	history.replaceState(null, null, anchor[0].href);
}