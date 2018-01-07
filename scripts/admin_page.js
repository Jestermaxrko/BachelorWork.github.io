

var selected_test_id;
var selected_user_id;
var users_to_display=[];
var opened_row_indexes = [];
var sort_conditon;
var current_games = [];
var table_full_screen = false;
var is_preview_open = false;
var all_games =[]; 

initFirebase();
//SignIn();

//$( "#result" ).load( "testpage.html" );


checkSignIn();

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

function SignIn(login,pass){
  firebase.auth().signInWithEmailAndPassword("jestermaxrko@gmail.com","max450384rko").catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
    });
}

function signOut(){
	firebase.auth().signOut().then(function() {
    console.log("user is OUT");
}).catch(function(error) {
  // An error happened.
  console.log(error);
});
}

function checkSignIn(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
   			firebase.database().ref('/users/'+user.uid+"/admin").once('value').then(function(snapshot) {
	  			var admin = snapshot.val();
	  			if(admin){

	  				document.getElementById("container").style.display = "";
	  				document.getElementById("login_page").style.display = "none";
	  				document.body.style.backgroundColor = "#2f3648";
	  				current_games = [];
	  				users_to_display=[];
					opened_row_indexes = [];
					selected_test_id = null;
					selected_user_id = null;
					readAllTests();
					readAllGames();
				}
			});
   
  		} else {
   			document.getElementById("login_page").style.display = "block";
   			document.getElementById("container").style.display = "none";
   			document.body.style.backgroundColor = "";
  		}
	});
}


function readAllTests(){

firebase.database().ref('/tests/').once('value').then(function(snapshot) {
  var tests_tmp = snapshot.val();

  var selected_test = [];
  for(var keys in tests_tmp){
  	tests_tmp[keys].uid = keys;
    selected_test.push(tests_tmp[keys]);
  }

  console.log(tests_tmp);
  console.log(selected_test);
  displayTests(selected_test);
  //findUserByTestId();

});

}

function readAllGames() {
	firebase.database().ref('/games/').once('value').then(function(snapshot) {
  	all_games = snapshot.val();
  	//console.log(games_tmp)
  	document.getElementById("random").max = Object.keys(all_games).length;
  	displayGames(all_games);
  //findUserByTestId();

});
	
}

function displayTests(names){

  	var list = document.getElementById("test_list");
  	list.innerHTML = "";
	
		for(var i =0;i<names.length;i++){

		
		    var item = document.createElement("li");
		    var link = document.createElement("a");
		    link.setAttribute("onclick", "findUserByTestId(this)");
		    link.id = names[i].uid;
		    link.innerHTML = names[i].name +"<span> (" +  names[i].uid+ ")</span>";
		    item.appendChild(link);
		    list.appendChild(item); 
		
  	}

}


function displayGames(games){
 
	var list = document.getElementById("games_list");
	list.innerHTML = "";

	console.log(games.length);

	for(var i in games){

		console.log("yes");
		var li = document.createElement("li");
		var game_name = document.createElement("a");
		var add_game_btn = document.createElement("a");
		game_name.classList.add("display_inline");
		game_name.classList.add("game_name");
		add_game_btn.classList.add("display_inline");
		add_game_btn.classList.add("add_game_btn");
		game_name.innerHTML = games[i].name;

		game_name.setAttribute("onclick","openPreview(this.innerHTML)");



		game_name.target="_blank";

		add_game_btn.setAttribute("onclick","addGameToTest(this)");

		li.appendChild(game_name);
		li.appendChild(add_game_btn);
		list.appendChild(li);
	}


}


function findUserByTestId(elem){

	document.getElementById("sort_select").selectedIndex = "0";
	selected_test_id = elem.id;

	users_to_display = [];


	var selected_li = document.getElementsByClassName("selected_li");
	if(selected_li){
		for(var i=0;i<selected_li.length;i++){
			selected_li[i].classList.remove("selected_li");
		}
	}

	elem.classList.add("selected_li");

  	firebase.database().ref('/users/').once('value').then(function(snapshot) {
  	var all_users = snapshot.val();
	for(var i in all_users){
		all_users[i].id = i;
	    if('tests' in all_users[i]){
	      	if (selected_test_id in all_users[i].tests){
	        	users_to_display.push(all_users[i]);
			}

	    }
  	}



  	

  	users_to_display.sort(compareMax);


  	if(users_to_display.length>0){
  		displayShortResults(users_to_display);
  	}
  	else{
  		document.getElementById("user_results").innerHTML ="";
  		document.getElementById("sortpanel").style.display="none";
  		var message_div = document.getElementById("message");
  		message_div.style.display="";
  		message_div.children[0].innerHTML = "Цей тест ще ніхто не пройшов";
  		message_div.children[0].style.background = "url(../images/sad_smile.png) no-repeat;"

  	}
  	
});

}

function sortResults(condition){

	if(condition==1){
		users_to_display.sort(compareMax);
	}else{
		sort_conditon = condition;
		users_to_display.sort(compareMin);
	}

	displayShortResults(users_to_display);
}

function compareMax(a,b) {
	
  if (a['tests'][selected_test_id].right < b['tests'][selected_test_id].right)
    return -1;
  if (a['tests'][selected_test_id].right > b['tests'][selected_test_id].right)
    return 1;
  return 0;
}

function compareMin(a,b) {
	
  if (a['tests'][selected_test_id][sort_conditon] > b['tests'][selected_test_id][sort_conditon])
    return -1;
  if (a['tests'][selected_test_id][sort_conditon] < b['tests'][selected_test_id][sort_conditon])
    return 1;
  return 0;
}
                    
function displayShortResults(user_results){

	document.getElementById("sortpanel").style.display="";
	document.getElementById("message").style.display="none";


	var table = document.getElementById("user_results");
	table.innerHTML = "";
	var first_row = table.insertRow(0);
	first_row.classList.add("first_table_row");
	var cols_names =["Користувач","Час","Спроби","Очки"];
	for(var i=0;i<cols_names.length;i++){
		var cell=first_row.insertCell(i);
		cell.innerHTML=cols_names[i];
	} 

	var fieds = ["time","tries","right"];
	var j=0;

	var rows = table.getElementsByTagName("tr").length;


	for(var tr=0;tr<10;tr++){
		for(var i=0;i<user_results.length;i++){
			var row = table.insertRow(rows);
			row.setAttribute("onclick","showRes(this)");
			row.classList.add("first_table_row");

			for(var j=0;j<4;j++){
				var cell= row.insertCell(j);
				if(j==0){
					cell.innerHTML=(user_results[i].firstname+" "+user_results[i].lastname);
					
				}
				else{

					if(j==1)
						cell.innerHTML= getTimeString(user_results[i]['tests'][selected_test_id][fieds[j-1]]);
						else
					cell.innerHTML=(user_results[i]['tests'][selected_test_id][fieds[j-1]]);
				}
			}

			var hidden_table = document.createElement("table");
			hidden_table.classList.add("hidden_table");

			var hidden_row = table.insertRow(rows+1);
			hidden_row.classList.add("deteil_info");
			hidden_row.style.display = "none";
			hidden_row.classList.add("first_table_row");
			hidden_row.classList.add("no_hover");
			var user_answers = [];
			var tmp_answers = [];

			for (var key in user_results[i]['tests'][selected_test_id]['games'])
				tmp_answers.push(user_results[i]['tests'][selected_test_id]['games'][key]);

			hidden_table.innerHTML ="<tr><th>Гра</th><th>Час</th><th>Спроби</th><th>Відповідь</th></tr>";

			for(var f=0;f<tmp_answers.length;f++){

				user_answers.push({
					name:tmp_answers[f].name,
					time:tmp_answers[f].time,
					tries:tmp_answers[f].tries,
					answer:tmp_answers[f].answer
				});

			}

			
			for(var k=0;k<user_answers.length;k++){
				var row = hidden_table.insertRow(k+1);


				var h=0;
				for(var key in user_answers[k]){
					var cell= row.insertCell(h++);
					if(key!="answer")
						if(key=="time"){
							cell.innerHTML=getTimeString(user_answers[k][key]);
						}else
							cell.innerHTML=user_answers[k][key];
					else{

						
						if(user_answers[k][key]==false){
							cell.className="wrong_anwser";
						}
						else{
							cell.className ="right_anwser"; 
						}
					}

				}
			}

			var hidden_cell = hidden_row.insertCell(0);
			hidden_cell.colSpan =4;
			hidden_cell.appendChild(hidden_table); 
		}

	}



}


function addGameToTest(elem){

	if(typeof elem === "string")
		var name = elem;
	else
		var name = elem.parentNode.children[0].innerHTML;

	if(!isGameOnTest(name)){
		current_games.push(name);
		var list = document.getElementById("current_games");
		var li = document.createElement("li");
		var game_name = document.createElement("a");
		var delete_btn = document.createElement("a");
		game_name.classList.add("display_inline");
		game_name.classList.add("game_name");
		delete_btn.classList.add("display_inline");
		delete_btn.classList.add("delete_btn");
		game_name.innerHTML = name
		game_name.href = name+".html";
		game_name.target="_blank";
		//delete_btn.innerHTML = "X";
		delete_btn.setAttribute("onclick","deleteGameFromTest(this)");
		li.appendChild(game_name);
		li.appendChild(delete_btn);
		list.appendChild(li);
		document.getElementById("save_test_btn").style.display="block";
		document.getElementById("games_count").innerHTML = "Games ("+current_games.length+")";
	}
}

function deleteGameFromTest(elem){

		var name = elem.parentNode.children[0].innerHTML;

		var index_to_delete = current_games.indexOf(name);
		if (index_to_delete > -1) {
   			current_games.splice(index_to_delete, 1);
   		}

		document.getElementById("current_games").removeChild(elem.parentNode);
		document.getElementById("games_count").innerHTML = "Games ("+current_games.length+")";

		if(current_games.length==0) 
			document.getElementById("save_test_btn").style.display="none";
}


function generateRandomTest(length){


	if(length && length>0){
		var random_games = [];
		
		if(length>Object.keys(all_games).length){
			length =Object.keys(all_games).length;
			document.getElementById("random").value=length;
		}

		while(random_games.length<length){

			var index = Math.floor((Math.random() * Object.keys(all_games).length));
			var name = all_games[Object.keys(all_games)[index]].name;
			var is_in = false;

			for(var i =0;i<random_games.length;i++){
				if(random_games[i]==name){
					is_in = true;
					break;
				}
			}

			if(!is_in){
				random_games.push(name);
			}
		}

		current_games = [];
		document.getElementById("current_games").innerHTML="";
		
		for(var i=0;i<random_games.length;i++){
			addGameToTest(random_games[i]);
		}
	}else {
		document.getElementById("random").style.border = "2px solid red";

		setTimeout("document.getElementById('random').style.border = '';",500);
	}

}

function createNewTestObject(test_name){


	if(test_name.length>0){
		var new_test = {};
		var games_for_new_test = {};

		for(var i=0;i<current_games.length;i++){
			games_for_new_test[i] = current_games[i];
		}

		new_test.name = test_name;
		new_test.games = games_for_new_test;
		firebase.database().ref("tests").push(new_test);
	}else {

		document.getElementById("new_test_name").style.border = "2px solid red";

		setTimeout("document.getElementById('new_test_name').style.border = '';",500);

	}
}


function openPreview(name){
	is_preview_open=true;
	document.getElementById("preview_div").style.display  = "";
	document.getElementById("preview_frame").src = name+".html";

}


function isRowOpened(index){
	var open = false;
	for(var i=0;i<opened_row_indexes.length;i++){

		if(index==opened_row_indexes[i]){
			open = true;
			break;
		}
	}
	return open;
}

function showRes(row){
	var row_index = row.rowIndex;
	rows = document.getElementById("user_results").getElementsByClassName("first_table_row");

	if(isRowOpened(row_index+1)){
		rows[row_index+1].style.display="none";
		var index_to_delete = opened_row_indexes.indexOf(row_index+1);
		if (index_to_delete > -1) {
   			opened_row_indexes.splice(index_to_delete, 1);
   		row.style.borderBottom = "";
	}

	}else{
		rows[row_index+1].style.display="";
		opened_row_indexes.push(row_index+1);
		row.style.borderBottom = "none";
	}
}


function isGameOnTest(name){

	var isOn = false;

	for(var i=0;i<current_games.length;i++){

		if(current_games[i]==name){
			isOn = true;break;
		}
	}
	return isOn;
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

function clearName(){

	
	document.getElementById("new_test_name").value ="";
}

function changeTableMode(){

	if(!table_full_screen){

		table_full_screen = true;
		document.getElementById("test_page").style.display = "none";
		document.getElementById("user_page").style.width = "100%";
		document.getElementById("screen_img").src = "images/unfull.png";

	}else {
		table_full_screen = false;
		document.getElementById("test_page").style.display = "";
		document.getElementById("user_page").style.width = "70%";
		document.getElementById("screen_img").src = "images/full.png";
	}


}


function removeActiveLi(){


	var li = document.getElementById("nav_list").getElementsByClassName("active_menu");
	if(li.length>0)
		li[0].classList.remove("active_menu");

}

function loadHomePage (){
	removeActiveLi();
	document.getElementById("new_test_page").style.display="none";
	document.getElementById("results_page").style.display="none";
	document.getElementById("home_page").style.display = "";
}

function loadResults(){
	removeActiveLi();
	document.getElementById("nav_list").children[1].classList.add("active_menu");
	document.getElementById("new_test_page").style.display="none";
	document.getElementById("home_page").style.display = "none";
	document.getElementById("results_page").style.display="";

}

function loadCreator(){
	removeActiveLi();
	document.getElementById("nav_list").children[2].classList.add("active_menu");
	document.getElementById("new_test_page").style.display="";
	document.getElementById("home_page").style.display = "none";
	document.getElementById("results_page").style.display="none";
	
}

function hidePreview()
{
	
	/*if(is_preview_open){
		console.log("BOOOODYYY");
		is_preview_open = false;
		document.getElementById("preview_div").style.display  = "none";
	}*/


}

