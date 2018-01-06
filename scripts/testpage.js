
var li_number=0;
var question_number=0;
var current_game_index=0;
var timer;
var time =0;
var li ;
var quest_time =[];
var is_show = true;
var uid;
var all_time=0;
var q_count=0;

var all_games =[];
var current_games=[];
var test_games_names = [];
var user_answers = [];
var testUid;
//------------FireBase-----------------///

initFirebase();

checkSignIn();





window.onbeforeunload = function (e) {
    e = e || window.event;

    signOut();

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'If you leave this page test will be failed.Leave ?';
    }

    // For Safari
    return 'If you leave this page test will be failed.Leave ?';
};



//setId();



function setId(){
	var link =  localStorage.getItem("testUid");
	var field = localStorage.getItem("currentTestFieldName");

	if(link && field){

		document.getElementById("field_name").innerHTML = field;
		document.getElementById("testUid").value=link;
		localStorage.removeItem("testUid");
		localStorage.removeItem("currentTestFieldName");
		//.value=link;
	}
}

function initFirebase(){
	var config = {
    apiKey: "AIzaSyAK4JKAV1MoraBCv84IGJ3afkU2LBiyYw8",
    authDomain: "gamesbase-11d6f.firebaseapp.com",
    databaseURL: "https://gamesbase-11d6f.firebaseio.com",
    projectId: "gamesbase-11d6f",
    storageBucket: "gamesbase-11d6f.appspot.com",
    messagingSenderId: "766781485651"
  };
  firebase.initializeApp(config);
}


function signIn(mail,pass,recivedTestUid){

	console.log(mail);
	console.log(pass);
	console.log(recivedTestUid);

	if(mail && pass && recivedTestUid){



		firebase.auth().signInWithEmailAndPassword(mail,pass).catch(function(error) {
		  	var errorCode = error.code;
		  	var errorMessage = error.message;
		  	document.getElementById("error_box").style.display="block";
		  	document.getElementById("error_message").innerHTML="Incorrect login or password";
		});
	}
	else{

		document.getElementById("error_box").style.display="block";
	  	document.getElementById("error_message").innerHTML="Enter all fields";
	}

}

function readGames(){
	return firebase.database().ref("games").once('value').then(function(snapshot) {
  	var username = snapshot.val();
  	for(var key in username){
  			all_games.push(username[key]);
  	}
});
}

function readTest(id){
	firebase.database().ref("tests/"+id+"/games").once('value').then(function(snapshot) {
  	var games_in_test = snapshot.val();
  	console.log(games_in_test);
  	for(var key in games_in_test){
  		test_games_names.push(games_in_test[key]);
  	}
  	if(games_in_test){
  		checkTestPermission();
  	}else {
  		document.getElementById("error_box").style.display="block";
  		document.getElementById("error_message").innerHTML="Incorect test identifier";
  	}
});

}

function filterGames(){

	console.log(test_games_names);
	for(var i=0;i<test_games_names.length;i++){
		for(var j=0;j<all_games.length;j++){
			if(test_games_names[i]==all_games[j].name){
				current_games.push(all_games[j]);
			}
		}
	}
	createUI();
	console.log(current_games);
}


function createUI(){
	var list = document.getElementById("list");

	for(var i =0;i<current_games.length;i++){
		var item = document.createElement("li");
		item.innerHTML= "Game  " +(i+1);
		list.appendChild(item);	}

	var last_li = document.createElement("li");
	last_li.innerHTML = "Results";
	list.appendChild(last_li);


	li = document.getElementById("list").getElementsByTagName("li");
}

function registerUser(){
  var email ="jestermaxrko@gmail.com";
  var password = "max450384rko";
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log("user is REGISTRED");
});
}

function checkSignIn(){
	firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("yesSignIn");
    uid = firebase.auth().currentUser.uid;
    readGames();
    testUid=document.getElementById("tests").value;
    readTest(testUid);
   
  } else {
   console.log("no");
  }
});
}


function checkTestPermission(){

	firebase.database().ref("users/"+uid+"/tests").once('value').then(function(snapshot) {
  	var user_tests = snapshot.val();
  	if(user_tests){
	  	user_tests_tmp = Object.keys(user_tests);
	  	console.log(user_tests);
	  	console.log(user_tests_tmp);
		var test_is_firsttime=true;
		for(var i=0;i<user_tests_tmp.length;i++){
			if (testUid==user_tests_tmp[i]) {
				test_is_firsttime=false;
				break;
			}
		}

		if(test_is_firsttime){
			console.log("Yes");
			allowPassTest();
		}
		else {

			if(user_tests[testUid]["wasStarted"]==false){
				allowPassTest();
			}
			else{
				document.getElementById("error_box").style.display="block";
  				document.getElementById("error_message").innerHTML="You dosent have acces to this test.Please try again later";
			}
		}
	}else allowPassTest();
  	  	
});
}	


function allowPassTest(){
	firebase.database().ref('users/' + uid+"/tests/"+testUid).set({
    wasStarted: false
  });

	filterGames();
	document.getElementById("start_page").style.display ="none";
	document.getElementById("main").style.display="";
	localStorage.removeItem("testUid");
}

function signOut(){
	firebase.auth().signOut().then(function() {
    console.log("user is OUT");
}).catch(function(error) {
  // An error happened.
  console.log(error);
});
}


function writeTestInfo(gameres,last) {
  firebase.database().ref('users/' + uid + "/tests/" + testUid+"/games/"+gameres.name+"/").set({
    name : gameres.name,
    tries :gameres.tries,
    time : gameres.time,
    answer : gameres.answer
  }).then(function(){
  	if(last) signOut();
  });
}


function hello(){
	console.log("Hello");
}

$(window).focus(function() {
   console.log("Focus");
});

$(window).blur(function() {
   //document.body.innerHTML = "";
});


function starTest(){

	/*firebase.database().ref("users/"+uid+"/tests/"+testUid).set({
		wasStarted:true
	});*/
	document.getElementById("start_test_page").style.display ="none";
	document.getElementById("test_area").style.display="block";
	li[li_number].classList.remove("active");
	li[++li_number].className="active";
	//document.getElementById("frame").src = current_games[0].name+".html";
	$( "#irame" ).load( current_games[0].name+".html" );
	timer = setInterval(updateTimer,1000);
}

function PassQuestion(answer,tries){
	li[li_number].classList.remove("active");

	li_number++
	

	if(!quest_time.length) {
		quest_time.push(time);
		all_time=time;
		console.log(all_time);
	}
	else{
		console.log(all_time);
		quest_time.push(time-all_time);
		//cur_time = time-quest_time[quest_time.length-1];
		all_time=time;
	}

	user_answers.push({
		name:current_games[current_game_index++].name,
		time:quest_time[q_count++],
		tries:tries,
		answer:answer
	});

	if(li_number>li.length-2){
		document.getElementById("test_area").style.display ="none";
		li[li.length-1].className="active";
		clearTimeout(timer);
		displayResultsPage();
		writeAllResultToDataBase();
		
	}
	else 
		li[li_number].className="active";

	if(current_game_index<current_games.length){
		//document.getElementById("frame").src = current_games[current_game_index].name+".html";

		$( "#irame" ).load( current_games[current_game_index].name+".html" );
		console.log(current_games[current_game_index].name);
	}
	console.log(user_answers[current_game_index-1]);
	
}

function writeAllResultToDataBase(){
	for(var i=0;i<user_answers.length;i++){
		
		if(i==user_answers.length-1) 
			writeTestInfo(user_answers[i],true);
		else 
			writeTestInfo(user_answers[i],false);
	}

	//signOut();
}

function displayResultsPage(){

	document.getElementById("result_page").style.display="";
	var table = document.getElementById("res_table");

	//recreateTime();

	for(var i=0;i<user_answers.length;i++){
		var row = table.insertRow(i+1);
		var j=0;
		for(var key in user_answers[i]){
			var cell= row.insertCell(j++);
			if(key!="answer")
				if(key=="time"){
					cell.innerHTML=getTimeString(user_answers[i][key]);
				}else
					cell.innerHTML=user_answers[i][key];
			else{
				console.log("answer = " + user_answers[i][key]);
				if(user_answers[i][key]==false)
					cell.className="wrong_anwser";
				else cell.className ="right_anwser"; 
			}

		}
	}

	var sum_tries=0;
	var sum_right_answers = 0;

	for(var i=0;i<user_answers.length;i++){

		sum_tries+=user_answers[i].tries;
		if(user_answers[i].answer==true)
			sum_right_answers++;
	}

	var row = table.insertRow(table.rows.length);
	row.className="total_row";
	row.insertCell(0).innerHTML ="Total";
	row.insertCell(1).innerHTML = getTimeString(time);
	row.insertCell(2).innerHTML = sum_tries;
	row.insertCell(3).innerHTML = sum_right_answers;

	writeSummary(time,sum_tries,sum_right_answers);	
}


function writeSummary(time,tries,right){

firebase.database().ref("users/"+uid+"/tests/"+testUid).set({
		time:time,
		tries:tries,
		right:right,
		wasStarted:false
	});
}


function recreateTime(){
	for(var i=0;i<user_answers.length;i++){
    	user_answers[i].time=getTimeString(user_answers[i].time);
	}
}


function getTimeString(value){
	var hours   = checkTime(Math.floor(value / 3600) % 24)
    var minutes = checkTime(Math.floor(value / 60) % 60)
    var seconds = checkTime(value % 60)   
    return hours+":"+minutes+":"+seconds;
}

function checkTime(value){
	if(value<10) value="0"+value;
	return value;
}

function updateTimer(){
	time++;
	document.getElementById("time").innerHTML=getTimeString(time);
}


function ShowHide(){
	if(is_show){
		document.getElementById("timer_div").style.display="none";
		document.getElementById("arrow").style.transform="rotate(180deg)";
		is_show=false;
	}
	else {
		document.getElementById("timer_div").style.display="block";
		document.getElementById("arrow").style.transform="rotate(0deg)";
		is_show=true;
	}
}


function test(tries){
	console.log(tries);
}

