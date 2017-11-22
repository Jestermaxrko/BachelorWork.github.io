

initFirebase();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("error_box").style.display="block";
	document.getElementById("error_message").innerHTML="You have been succesgylly registred";
	document.getElementById("warn_image").src="images/yes.png";
}
	
});

function signOut(){
	firebase.auth().signOut().then(function() {
	console.log("Out");
	}).catch(function(error) {
  // An error happened.
	});
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





function register(firstname,lastname,email,password,phone){

	console.log(firstname);
	console.log(lastname);
	console.log(email);
	console.log(password);
	console.log(phone);

	if(firstname && lastname && email && password && phone){

		firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){

			firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
		    email: email,
		    firstname: firstname,
		    lastname: lastname,
		    phone: phone
		  }).then(function(){
		  	signOut();
		  });
		},function(error) {
  		var errorCode = error.code;
  		var errorMessage = error.message;

  		if(errorMessage){
	  		document.getElementById("error_box").style.display="block";
			document.getElementById("error_message").innerHTML=errorMessage;
			document.getElementById("warn_image").src="images/warning.png";
		}
		});

	}else{
		document.getElementById("error_box").style.display="block";
		document.getElementById("error_message").innerHTML="Enter all fields";
	}

}
