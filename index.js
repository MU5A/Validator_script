
//Code That Deals with Transitioning the State of the Log In/Auth Pane
$('#register-link').click(function() {
	$('#login-form').toggle(); 
	$('#register-form').toggle(); 
});

$('#forgotten-link').click(function() {
	$('#forgotten-form').show(); 
	$('#before-reset').show(); 	
	$('#login-form').hide(); 
});

$('#login-link-modal').click(function() {
	$("#after-reset").hide();
	$('#login-form').show(); 
});

$('#login-trigger').click(function() {	
	handle_auth();
});

//Code that deals with initial display for modal pane that deals with authentication and, for a user that's logged in, logging them out.
function handle_auth() {
//The function below lets us know if/who is logged in- you can read more about it here: https://firebase.google.com/docs/auth/web/manage-users. 
var user = firebase.auth().currentUser;
console.log("dealing with " + user); 
	
if (!user) {
	//If there's no user (user var is null)  
	$('#login-content').toggle();
  //Reset/hide other forms and div's so the login page displays right.
  $('#register-form').hide();
  $('#before-reset').hide(); 
  $("#after-reset").hide();
  $("#if-error").hide();
  $('#login-form').show();
} else {
// Sign out the current user
firebase.auth().signOut().then(function() {
// Sign-out successful.
console.log("Signed out " + user.email) 
	}).catch(function(error) {
	// An error happened.
	alert("Something went wrong.");
	});
	$("#auth-text").text("Log In");
	}
}

//This listens for a submit event on the login form. For more on this type of event, see https://api.jquery.com/submit/. It then passes the inputs to the function you see below it. 
$('#login-form').submit(function(){
	// pass the login email and pwd to our login handler function (below)
	login_user($('#login_email').val(), $('#login_pwd').val());
});

function login_user(email, pwd) {
	console.log("attempting to login user " + email); 
  
  // use the Firebase API to sign in the user
  firebase.auth().signInWithEmailAndPassword(email, pwd).then(function(user) {
  	//clear the form inputs 
  	$("#login-form input[type=text], input[type=password]").val('');
    //deal with errors
    }, function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("For now, this is a stand-alone system. If you haven’t created an account here, just click create account. Sorry for the extra step!" + errorMessage);
  });
}

//This takes the registration form inputs and passes them to the function below.
$('#register-form').submit(function(){
			// pass the registration data to our register function (below)
			register_user($('#register_email').val(), $('#register_pwd').val(),$('#register_re_pwd').val());
});

function register_user(email, pwd, re_pwd) {
	console.log("I'll try to register user " + email); 
  chk_domain = check_domain(email);
  // ensure password and re_password match
  if(!chk_domain){
  	$('#reg-error-response').text("Error: not a valid email domain. You must be from HinH, or Alex's website.");
    $("#if-reg-error").show();
    return;
  }
  if(pwd != re_pwd){
  	$('#reg-error-response').text("Error: passwords do not match.");
    $("#if-reg-error").show();
    //alert("Error: passwords do not match.");
  } else {
  	// register the user with the Firebase API (NOTE: auto logs in)
    firebase.auth().createUserWithEmailAndPassword(email, pwd).then(function(user) {
    if (user) {
    	//clear the form
      $("#register-form input[type=text], input[type=password]").val('');
    }
    }, function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
				console.log("oh my: " + errorMessage);
				$('#reg-error-response').text(errorMessage);
        $("#if-reg-error").show();
    });
  }	
}

//Validates email domain
function check_domain(email) {
	OKdomains = get_domains();
  //IRL, you'd want to validate the email address through an email (which Firebase does)
  thisdomain = email.replace(/.*@/, "");
  if(OKdomains.indexOf(thisdomain) > -1){
  	return true;
  } else {
  	return false;
  }
}

function get_domains() {
	domains = ['hvachurry.com', 'alexandercowan.com', 'corp.hvachurry.com'];
  return(domains);
    //IRL, we'd probably want to pull this from a central source, but I decided to keep it simple for our puroses here ; ) 
}


//This takes the inputs for the forget password form and passes them to the function below. 
$('#forgotten-form').submit(function(){
	recover_password($('#recovery_email').val());
});

function recover_password(email) {
	console.log("sending recovery to " + email); 
  firebase.auth().sendPasswordResetEmail(email).then(function() {
  	//Email sent, give an alert with a prompt for further action
		console.log("sending recovery to " + email); 
		$("#before-reset").hide();
		$("#after-reset").show();
		$('#submitted-email').text(email);
    $("#forgotten-form input[type=text], input[type=password]").val('');
  }).catch(function(error) {
  	//An error happened...display the error so the User knows what's going wrong
    var errorCode = error.code;
    var errorMessage = error.message;
		console.log("oh my: " + errorMessage);
		$('#error-response').text(errorMessage + ' Reminder: This is a stand-alone system you need to register for separately (sorry for the nuisance!).');
		$("#before-reset").hide(); 
		$("#after-reset").hide();
		$("#if-error").show();
});
  //Notes: This will send an email with a template specified in the Firebase Console.  That template has a lot of powerful tools to help make good looking emails, and the password reset is completely handled by Google without any need for developer work to support it.
}

//Code That Deals with Checking Whether Users are Signed In
//This is an observer that will wait for the firebase user object to change auth state.
//This is the recommended way to detect when you log in, as it will check upon page load.

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    //alert("Welcome " + user.email + "!");
		console.log("welcoming now..." + user.email);
    $("#auth-text").text("Log Out");
		//$("#login-trigger").css("display", "inline"); //not working as inteded yet
		$('#login-content').toggle();  
  } else {
		console.log('onAuthStateChanged running with no user')
    // No user is signed in.
  }
	console.log('end of onAuthState...')
	var nowuser = firebase.auth().currentUser;
});


//Code to Deal with Parts Search
$("#search-btn").on("click", function() {
		//On new search, start w/ all parts to start
		$('.catalog-part').show(); 
		var user = firebase.auth().currentUser;
		console.log('you have ' + user.email);
		
		//Code to filter by Manufacturer
    var selmfr = $('#dd-mfr').find(':selected').val(); //JQuery event for drop-down
		console.log("selected mfr " + selmfr); //just for testing
		
		if(selmfr!="All") {
   		$('.catalog-part').each(function(){ //.each lets you do something to all items in the selected class
       if ($(this).attr('mfr').indexOf(selmfr) < 0) {
			 		$(this).hide();  	
				} //inner if statement ends here
			});
		} //outer if statement ends here
		
		//Very similar code to filter by Model
		var selmodel = $('#dd-model').find(':selected').val();
		console.log("selected model " + selmodel); 
		if(selmodel!="All") {
    $('.catalog-part').each(function(){
       if($(this).attr('model').indexOf(selmodel) < 0) {
			 		$(this).hide(); 
				}
		});
    }
		
});
	
	
