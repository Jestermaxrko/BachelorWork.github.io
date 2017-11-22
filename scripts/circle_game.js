
var tries =0;

function checkAnswer(){
	

	if(!hasEmptyCells()){
		tries++;
		document.getElementById("try").innerHTML = "Tries : "+tries;
		if(!hasSameNumbers()){

			var central_line = checkSum(document.getElementsByClassName("central_line"));
			var left_line = checkSum(document.getElementsByClassName("left_line"));
			var right_line = checkSum(document.getElementsByClassName("right_line"));
			var inner_line = checkSum(document.getElementsByClassName("inner_line"));
			var outer_line = checkSum(document.getElementsByClassName("outer_line"));

			console.log(central_line);

			if(central_line==12 && left_line==12 && right_line==12 && inner_line==12 && outer_line==12){
				parent.PassQuestion(true,tries);
			}
			else{
				document.getElementById("game").style.backgroundColor="#ffbaba";
				setTimeout(
					function(){
						document.getElementById("game").style.backgroundColor="";
					},800);
			}
		}
		else{
			console.log("Wrong");
		}
	}
	else{
		console.log("empty");
	}
}

function hasSameNumbers(){
	var all_elems = document.getElementsByTagName("input");
	console.log(all_elems);
	var is_same = false;
	for(var i =0;i<all_elems.length;i++){
		for(var j=0;j<all_elems.length;j++){
			if(i!=j){
				if(all_elems[i].value===all_elems[j].value || all_elems[i].value >7 || all_elems[i].value <1) {
					is_same = true;

					all_elems[i].style.backgroundColor = "#ffbaba";
					if(all_elems[i].value <7 && all_elems[i].value >0)
						all_elems[j].style.backgroundColor = "#ffbaba";
					setTimeout(function(){
						for(var k=0;k<all_elems.length;k++)
							all_elems[k].style.backgroundColor="";
						
					},800)
					break;
				}
				if(is_same) break;
			}
		}
	}

	return is_same;
}

function hasEmptyCells(){
	var all_elems = document.getElementsByTagName("input");
	var is_empty = false;
	for(var i =0;i<all_elems.length;i++){
		if(!all_elems[i].value){
			is_empty=true;
			all_elems[i].style.backgroundColor = "#ffbaba";
			setTimeout(function(){
				all_elems[i].style.backgroundColor="";
			},800)
			break;
		}
	}
	return is_empty;
}

function checkSum(elems){

	var sum =0;
	for (var i = 0; i < elems.length; i++) {
		sum+=parseInt(elems[i].value);
	}
	return sum;
}

function passQuestion(){
	parent.PassQuestion(false,tries);
}