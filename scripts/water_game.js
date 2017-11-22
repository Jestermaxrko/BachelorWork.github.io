var five_liters_div = document.getElementById("five_title");
var three_liters_div = document.getElementById("three_title");
var left_transfer_bar = document.getElementById("left_to_right");
var right_transfer_bar = document.getElementById("right_to_left");
var top_controls = document.getElementById("top_controls");
var five_weight = 0;
var three_weight = 0;
var water_to_transfer =0;
var three_max =3;
var five_max =5;
var are_ways_selected=false;


function fiveSelected(){
	if(!are_ways_selected){
		left_transfer_bar.style.display="block";
		top_controls.style.visibility="hidden";
		are_ways_selected = true;
	}
}

function rightToLeft(){
	var to_transfer = five_weight;
	five_weight=five_weight-(three_max-three_weight);
	three_weight+=to_transfer;
	if(three_weight>3) three_weight=3;
	if(five_weight<0) five_weight=0;
	updateLiters();
	left_transfer_bar.style.display="none";
	top_controls.style.visibility="visible";
}

function rightToOut(){
	five_weight=0;
	updateLiters();
	left_transfer_bar.style.display="none";
}

function threeSelected(){
	if(!are_ways_selected){
		right_transfer_bar.style.display="block";
		top_controls.style.visibility="hidden";
		are_ways_selected = true;
	}
}


function leftToRight(){
	var to_transfer = three_weight;
	console.log(to_transfer);
	three_weight=three_weight-(five_max-five_weight);
	five_weight+=to_transfer;
	if(five_weight>5) five_weight=5;
	if(three_weight<0) three_weight=0;
	updateLiters();
	right_transfer_bar.style.display="none";
	top_controls.style.visibility="visible";
}


function leftToOut(){
	three_weight=0;
	updateLiters();
	right_transfer_bar.style.display="none";
}

function toLeft(){
	five_weight=5;
	updateLiters();
}

function toRight(){
	three_weight=3;
	updateLiters();
}

function cancelTransfer(){
	right_transfer_bar.style.display="none";
	left_transfer_bar.style.display="none";
	top_controls.style.visibility="visible";
	are_ways_selected=false;
}

function updateLiters(){
	three_liters_div.innerHTML = three_weight+" liters";
	five_liters_div.innerHTML= five_weight+" liters"; 
	are_ways_selected=false;
}