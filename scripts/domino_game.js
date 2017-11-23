var is_selected = false;
var first_selected_elem;
var moves =2;
var tries=0;
var table = document.getElementById("game_table").cloneNode(true);
console.log(table);
console.log("work");

function dominoSelected(elem){

	if(moves >0){
	
		if(first_selected_elem===elem){
			console.log("yes");
			first_selected_elem.classList.remove("active");
			is_selected = false;
			first_selected_elem = undefined;
			return;
		}

		if(!is_selected){
			elem.classList.add("active");
			first_selected_elem=elem;
			is_selected = true;
			return;
		}

		if(is_selected){
			console.log("change");
			var tmp_src = elem.src;
			elem.src = first_selected_elem.src;
			first_selected_elem.src = tmp_src;
			is_selected = false;
			first_selected_elem.classList.remove("active");
			moves--;

			if(moves==0) calcAnswer();
				

		}
	}
}

function calcAnswer(){

	var is_right_answer = true;
	var ids = ["first_row","second_row","third_row","first_col","second_col","third_col"];
	var sums = [];

	for(var i=0;i<ids.length;i++){
		var tmp_sum =0;
		var elems = document.getElementsByClassName(ids[i]);
		for(var j = 0;j<elems.length;j++){
			tmp_sum+=parseNumbers(elems[j].src);
		}

		console.log( ids[i]+" : " + tmp_sum);
		if(tmp_sum!=15){
			is_right_answer = false;
			break;
		}
		sums.push(tmp_sum);
	}

	if(is_right_answer){
		parent.PassQuestion(true,tries);
	}
	else{
		document.getElementById("lose").style.visibility="visible";
	}

}

function parseNumbers(link){
	var and_index = link.indexOf("and");
	return +link[and_index-1]+(+link[and_index+3]);
}

function resetTable(){
	console.log("yses");
	document.getElementById("game").innerHTML = "";
	document.getElementById("game").appendChild(table);
	document.getElementById("lose").style.visibility="hidden";
	table = table.cloneNode(true);
	moves =2;
	is_selected = false;
	first_selected_elem = undefined;
	tries++;
	document.getElementById("try").innerHTML="Tries : "+tries;
	//document.getElementById("lose").style.dispay="";
}

function passQuestion(){

	parent.PassQuestion(false,tries);
} 