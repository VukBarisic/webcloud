
var loggedUser = null;

$(document).ready(function() {
	loadHomePage();
});

function loadHomePage() {
	loggedUser = getLoggedUser();
	if (loggedUser == null) {
		$("#index_nav").hide();
		// document.body.style.background = "#808080";
		loadLoginPage();
	} else {
		$("#index_nav").show();
		var x = document.getElementById("loggedUserDrop");
		x.innerHTML = loggedUser.email;
		$("#button_login").unbind().on("click", login);
		$("#div_center").load("html/virtualmachines.html");
		$("#organizations").on("click", getOrganizations);
		$("#logout").on("click", logout);
		$("#home").on("click", loadVirtualMachines);

	}

}

$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        alert('You pressed a "enter" key in somewhere');    
    }
});

function loadVirtualMachines() {
	$("#div_center").load("html/virtualmachines.html");
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

function getOrganizations() {
	$.get({
		url : 'rest/organizations/getAll',
		dataType : 'json',
		success : function(organizations) {
			showOrganizations(organizations);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function showOrganizations(organizations) {
	
	if (organizations.length > 0) {
		$("#div_center").load("html/organizations.html", function() {
			for (let organization of organizations) {
				addOrganizationTr(organization);
			}
		});	
	}
	else {
		$("#div_center").load("html/no_organizations.html");
	}
	$("#search-button").on("click", searchOrganizations);
	$("#add_organization").on("click", loadAddOrganization);
}



function addOrganizationTr(organization){
	let tr = $('<tr></tr>');
	let tdLogo = $('<td style="width:70%" class="w-25"><img style="width:100%;" class="img-responsive" src= imgs/' + organization.logo  + ' alt="Error loading"></td>');
	let tdBroj = $('<td>' + organization.description + '</td>');
	let tdIme = $('<td>' + organization.name + '</td>');
	var buttonDelId = "del_" + organization.name;
	var buttonEditId = "edit_" + organization.name;
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0">Edit</button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0">Delete</button></td>');

	tr.append(tdLogo).append(tdBroj).append(tdIme).append(tdButtons);
	$('#organizationsTable tbody').append(tr);
	document.getElementById(buttonEditId).addEventListener("click", editOrganization);
	document.getElementById(buttonDelId).addEventListener("click", deleteOrganization);


}

function loadAddOrganization() {
	$("#div_center").load("html/add_organization.html", function() {
		$("#button_add_org").on("click", addOrganization);
	});
}



function addOrganization() {
		
	var obj = {};
	obj["name"] = $("#org_name").val();
	obj["description"] = $('#org_desc').val();
	//var file = $('#org_image').prop('files');
	var file = $("#org_image")[0].files[0];
	
	$.ajax({
		async: false,
		type: 'POST',
		url : "rest/organizations/add",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(data) {
			if(data == "existError")
			{
				toastr.error("Organization already exists!");
			}
			else (data == "success")
			{
				$.ajax({
					async: false,
					type: 'POST',
					url : "rest/organizations/uploadImage",
			        contentType : "multipart/form-data",
			        dataType: 'json',
			        data : file,
			        processData : false,
			        success: function(response)
			        {
			        	if(response == "success")
			        	{
			        		toastr.success("You've successfully added organization!");
			        		getOrganizations();
			        	}
			        },
					error: function(errorThrown){
						toastr.error( errorThrown );
					}
				}); 
			}
		},
		error: function(errorThrown ){
			toastr.error( errorThrown );
		}
	});
	
}

function deleteOrganization() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	$.ajax({
		async : false,
		url : 'rest/organizations/deleteOrganization',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(organizations) {
			showOrganizations(organizations);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function editOrganization() {
   $('#editOrgModal.modal').show();
}

function searchOrganizations() {
	var obj = {};
	obj["name"] = $("#search-input").val();
	$.ajax({
		url : 'rest/organizations/searchOrganization',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(organizations) {
			showOrganizations(organizations);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}




