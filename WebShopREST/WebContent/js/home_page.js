var loggedUser = null;

$(document).ready(function() {
	loadHomePage();
});

function loadHomePage() {
	loggedUser = getLoggedUser();
	if (loggedUser == null) {
		$("#index_nav").hide();
		document.body.style.background = "#808080";
		loadLoginPage();
	} else {
		$("#index_nav").show();
		var x = document.getElementById("loggedUserDrop");
		x.innerHTML = loggedUser.email;
		$("#button_login").unbind().on("click", login);
		$("#div_center").load("html/virtualmachines.html");
		$("#logout").unbind().on("click", logout);

	}

}

function loadLoginPage() {
	$("#div_center").load("html/login.html", function() {
		$("#button_login").unbind().on("click", login);
	});

}
function login() {

	var obj = {};
	obj["email"] = $("#email_login").val();
	obj["password"] = $('#password_login').val();

	var submit = true;

	if (obj["email"]  == null || obj["email"]  == "") {
		nameError = "Please enter your email";
		document.getElementById("email_error").innerHTML = nameError;
		submit = false;
	}

	if (obj["password"]  == null || obj["password"] == "") {
		emailError = "Field cant be empty";
		document.getElementById("pass_email").innerHTML = emailError;
		submit = false;
	}
	if (submit) {
		$.ajax({
			async : false,
			url : "rest/users/login",
			type : 'POST',
			contentType : 'application/json',
			dataType : 'json',
			data : JSON.stringify(obj),
			success : function(response) {
				if (response == undefined) {
					toastr.error('Wrong username or password try again!');
				} else {
					toastr.success('Welcome ' + response);
				}
			},
			error : function(errorThrown) {
				toastr.error(errorThrown);
			}
		});
	}
}

function getLoggedUser() {

	var user = null;

	$.ajax({
		async : false,
		url : "rest/users/loggedUser",
		type : 'GET',
		dataType : 'json',
		success : function(data) {
			if (data) {
				user = data;
			}
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});

	return user;
}

function logout() {
	var success = null;

	$.ajax({
		async : false,
		url : 'rest/users/logout',
		type : 'GET',
		dataType : 'json',
		success : function(data) {
			if (data) {
				success = data;
				toastr.success("GoodBye");
			} else {
				toastr.error("Error!");
			}
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});

	if (success) {
		loadHomePage();
	}
}
