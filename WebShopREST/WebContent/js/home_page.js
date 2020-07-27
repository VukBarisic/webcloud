
var loggedUser = null;
var oldName = "";
var searchResults = [];
var filterResults = [];

$(document).ready(function() {
	loadHomePage();
});

function loadHomePage() {
	loggedUser = getLoggedUser();
	if (loggedUser == null) {
		$("#index_nav").hide();
		loadLoginPage();
	} else {
		$("#index_nav").show();
		getVirtualMachines();
		var x = document.getElementById("loggedUserDrop");
		x.innerHTML = loggedUser.email;
		$("#button_login").on("click", login);
		$("#home").on("click", getVirtualMachines);
		$("#organizations").on("click", getOrganizations);
		$("#users").on("click", getUsers);
		$("#disks").on("click", getDisks);
		$("#vmCategories").on("click", getCategories);
		$("#logout").on("click", logout);


	}

}


function loadLoginPage() {
	$("#div_center").load("html/login.html", function() {
		$("#button_login").on("click", login);
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
	$("#search-button").off().on("click", searchOrganizations);
	$("#add_organization").off().on("click", loadAddOrganization);
}



function addOrganizationTr(organization){
	let tr = $('<tr></tr>');
	let tdLogo = $('<td style="width:70%" class="w-25"><img style="width:100%;" class="img-responsive" src= imgs/' + organization.logo  + ' alt="Error loading"></td>');
	let tdBroj = $('<td>' + organization.description + '</td>');
	let tdIme = $('<td>' + organization.name + '</td>');
	var buttonDelId = "del_" + organization.name;
	var buttonEditId = "edit_" + organization.name;
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0">Update</button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0">Delete</button></td>');

	tr.append(tdLogo).append(tdBroj).append(tdIme).append(tdButtons);
	$('#organizationsTable tbody').append(tr);
	document.getElementById(buttonEditId).addEventListener("click", loadEditOrganization);
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
	// var file = $('#org_image').prop('files');
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
		url : 'rest/organizations/delete',
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

function loadEditOrganization() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	$("#div_center").load("html/add_organization.html", function() {
		
		$.post({
			url : 'rest/organizations/getByName',
			contentType : 'application/json',
			dataType : 'json',
			data : JSON.stringify(obj),
			success : function(organization) {
				fillEditFieldsOrg(organization);
			},
			error : function(errorThrown) {
				toastr.error(errorThrown);
			}
	
	});
		$("#button_add_org").on("click", editOrganization());
		
	});
}

function fillEditFieldsOrg(organization) {
	$("#org_name").val(organization.name);
	$("#button_add_org").html("update")

	
}

function editOrganization() {

	
}

function searchOrganizations() {
	var obj = {};
	obj["name"] = $("#search-input").val();
	$.ajax({
		url : 'rest/organizations/search',
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

function getVirtualMachines() {
	searchResults = [];
	filterResults = [];
	$.get({
		url : 'rest/vms/getAll',
		dataType : 'json',
		success : function(vms) {
	
			showVirtualMachines(vms);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function showVirtualMachines(virtualMachines){
	if (virtualMachines.length > 0) {
		$("#div_center").load("html/virtualmachines.html", function() {
			for (let vm of virtualMachines) {
				addVirtualMachineTr(vm);
			}
		});	
	}
	else {
		$("#div_center").load("html/no_vms.html");
	}
	$("#search-button").off().on("click", searchVirtualMachines);
	$("#filter_vm").off().on("click", filterVM);
	$("#add_vm").on("click", loadAddOrganization);
}

function addVirtualMachineTr(virtualMachine){
	let tr = $('<tr></tr>');
	let tdName = $('<td>' + virtualMachine.name.split(".")[0]  + '</td>');
	let tdCores = $('<td>' + virtualMachine.vMcategory.numberOfCores + '</td>');
	let tdRam = $('<td>' + virtualMachine.vMcategory.ram + '</td>');
	let tdGpuCores = $('<td>' + virtualMachine.vMcategory.numOfGpuCores + '</td>');
	let organization = $('<td>' + virtualMachine.organization + '</td>');
	var buttonDelId = "del_" + virtualMachine.name;
	var buttonEditId = "edit_" + virtualMachine.name;
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0">Update</button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0">Delete</button></td>');

	tr.append(tdName).append(tdCores).append(tdRam).append(tdGpuCores).append(organization).append(tdButtons);
	$('#vmTable tbody').append(tr);
	document.getElementById(buttonEditId).addEventListener("click", editVm);
	document.getElementById(buttonDelId).addEventListener("click", deleteVm);


}

function loadAddVm() {
	
	$("#div_center").load("html/add_vm.html", function() {
		$("#add_vm").on("click", addVirtualMachine);
		var options = [];
		$.get({
			url : 'rest/organizations/getAllNames',
			dataType : 'json',
			success : function(organizationNames) {
				var len = organizationNames.length;
				$("#selectOrganization").empty();
				$('#selectOrganization').append("<option value='"+ "" +"'>Select value</option>");
                for( var i = 0; i<len; i++){
                    var org = organizationNames[i];
                    $('#selectOrganization').append("<option value='"+org+"'>"+org+"</option>");
                }
			}
		});
		options = [];
		$.get({
			url : 'rest/vmcategories/getAllNames',
			dataType : 'json',
			success : function(categoryNames) {
				var len = categoryNames.length;
				$("#selectCategory").empty();
				$('#selectCategory').append("<option value='"+ "" +"'>Select value</option>");
                for( var i = 0; i<len; i++){
                    var cat = categoryNames[i];
                    $('#selectCategory').append("<option value='"+cat+"'>"+cat+"</option>");
                }
			}
		});
	});	

	
}
$(document).on("change", "#selectCategory", function(){
	var obj = {};
	obj["categoryName"] = $(this).val();
	$.post({
		url : 'rest/vmcategories/getByName',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(category) {
			$("#numOfCores").val(category.numberOfCores);
			$("#ram").val(category.ram);
			$("#gpu").val(category.numOfGpuCores);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
});
});

function addVirtualMachine() {
	
	var obj = {};
	obj["name"] = $("#vmname").val();
	obj["organization"] = $("#selectOrganization").val();
	obj["category"] = $('#selectCategory').val();
	
	let validate = true;
	
	if (obj["name"] == "") {
		 $("#validationName").show();
		 $("#vmname").css("border-color","red");
		 validate = false;
	}
	else{
		$("#validationName").hide();
		$("#vmname").css("border-color","#ced4da");
	}
	if (obj["organization"] == "") {
		 $("#validationOrg").show();
		 $("#selectOrganization").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationOrg").hide();
		$("#selectOrganization").css("border-color","#ced4da");
	}
	if (obj["category"] == "") {
		 $("#validationCat").show();
		 $("#selectCategory").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationCat").hide();
		$("#selectCategory").css("border-color","#ced4da");
	}

	if (!validate) {
		toastr.error("All fields must be filled!");
		return false;
	}

	
	$.ajax({
		async: false,
		type: 'POST',
		url : "rest/vms/add",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(data) {
			if(data == "existError")
			{
				toastr.error("Virtual machine already exists!");
			}
			else (data == "success")
			{
				toastr.success("You've successfully added virtual machine!");
        		getVirtualMachines();
			}
			},
		error: function(errorThrown ){
				toastr.error( errorThrown );
			}
		});
			
}

function editVm(){
	
}

function deleteVm(){var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	$.ajax({
		async : false,
		url : 'rest/vms/delete',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(vms) {
			showVirtualMachines(vms);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
	
}

function searchVirtualMachines(){
	var obj = {};
	obj["name"] = $("#search-input").val();
	if (obj["name"] == "") {
		toastr.error("Search input can't be empty");
		return false;
	}
	$.ajax({
		url : 'rest/vms/search',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(vms) {
			searchResults = vms;
			if (filterResults.length > 0) {
				showVirtualMachines(filterSearchIntersection(searchResults, filterResults));
			}
			else {
				showVirtualMachines(vms);
			}
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
	}

function filterVM(){
	var obj = {};
	obj["ramFrom"] = $("#ramFrom").val();
	obj["ramTo"] = $("#ramTo").val();
	obj["gpuFrom"] = $("#gpuFrom").val();
	obj["gpuTo"] = $("#gpuTo").val();
	obj["coresFrom"] = $("#coresFrom").val();
	obj["coresTo"] = $("#coresTo").val();
	
	//validation
	if ((obj["ramFrom"] == "" && obj["ramTo"] != "") || (obj["ramFrom"] != "" && obj["ramTo"] == "") )  {
		toastr.error("One ram filter field is filled");
		return false;
	}
	if ((obj["gpuFrom"] == "" && obj["gpuTo"] != "") || (obj["gpuFrom"] != "" && obj["gpuTo"] == "") )  {
		toastr.error("One gpu filter field is filled");
		return false;
	}
	if ((obj["coresFrom"] == "" && obj["coresTo"] != "") || (obj["coresFrom"] != "" && obj["coresTo"] == "") )  {
		toastr.error("One core filter field is filled");
		return false;
	}
	if (obj["ramFrom"] == "" && obj["gpuFrom"] == "" && obj["coresFrom"] == "") {
		toastr.error("All fields are empty");
		return false;
	}
	if (parseInt(obj["ramFrom"]) >= parseInt(obj["ramTo"])) {
		toastr.error("Right field number has to be bigger than left");
		return false;
	}
	if (parseInt(obj["gpuFrom"]) >= parseInt(obj["gpuTo"])) {
		toastr.error("Right field number has to be bigger than left");
		return false;
	}
	if (parseInt(obj["coresFrom"]) >= parseInt(obj["coresTo"])) {
		toastr.error("Right field number has to be bigger than left");
		return false;
	}
	
	//end of validation
	
	
	$.ajax({
		url : 'rest/vms/filter',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(vms) {
			filterResults = vms;
			if (searchResults.length > 0) {
				showVirtualMachines(filterSearchIntersection(searchResults, filterResults));
			}
			else {
				showVirtualMachines(vms);
			}
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
	}


function getUsers() {
	$.get({
		url : 'rest/users/getAll',
		dataType : 'json',
		success : function(users) {
			showUsers(users);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function showUsers(users) {
	if (users.length > 0) {
		$("#div_center").load("html/users.html", function() {
			for (let user of users) {
				addUserTr(user);
			}
		});	
	}
	else {
		$("#div_center").load("html/no_users.html");
	}
	$("#search-button").on("click", searchUsers);
	$("#add_user").on("click", loadAddUser);
}


function addUserTr(user){
	let tr = $('<tr></tr>');
	let tdEmail = $('<td>' + user.email  + '</td>');
	let tdFirstName = $('<td>' + user.firstName + '</td>');
	let tdLastName = $('<td>' + user.lastName  + '</td>');
	let tdOrg = "";
	if (user.organization == "") {
		tdOrg = $('<td>no organization</td>');
	}
	else {
		tdOrg = $('<td>' + user.organization +'</td>');
	}
	if (loggedUser.email == user.email) {
		tdButtons = $('<td>loggedUser</td>');
		tr.append(tdEmail).append(tdFirstName).append(tdLastName).append(tdOrg).append(tdButtons);
		$('#usersTable tbody').append(tr);
	}
	else{
		var buttonDelId = "deluser_" + user.email;
		var buttonEditId = "edituser_" + user.email;
		let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0">Update</button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0">Delete</button></td>');
		tr.append(tdEmail).append(tdFirstName).append(tdLastName).append(tdOrg).append(tdButtons);
		$('#usersTable tbody').append(tr);
		document.getElementById(buttonEditId).addEventListener("click", editUser);
		document.getElementById(buttonDelId).addEventListener("click", deleteUser);
	}
	}
	
function loadAddUser() {
	$("#div_center").load("html/add_user.html", function() {
		$("#button_add_user").on("click", addUser);
		$("#validationFirst").hide();
		$("#validationLast").hide();
		$("#validationEmail").hide();
		$("#validationPass").hide();
		$("#validationRole").hide();
		$("#validationOrg").hide();
		var options = [];
		$.get({
			url : 'rest/organizations/getAllNames',
			dataType : 'json',
			success : function(organizationNames) {
				var len = organizationNames.length;
				$("#selectOrganization").empty();
				$('#selectOrganization').append("<option value='"+ "" +"'>Select value</option>");
                for( var i = 0; i<len; i++){
                    var org = organizationNames[i];
                    $('#selectOrganization').append("<option value='"+org+"'>"+org+"</option>");
                }
			}
		});
	});
}



function addUser() {
		
	var obj = {};
	obj["email"] = $("#email").val();
	obj["firstName"] = $('#firstName').val();
	obj["lastName"] = $("#lastName").val();
	obj["organization"] = $('#selectOrganization').val();
	obj["password"] = $('#password').val();
	obj["role"] = $('input[name="userType"]:checked').val();
	let validate = true;
	if ($("#firstName").val() == "") {
		 $("#validationFirst").show();
		 $("#firstName").css("border-color","red");
		 validate = false;
	}
	else{
		$("#validationFirst").hide();
		$("#firstName").css("border-color","#ced4da");
	}
	if ($("#lastName").val() == "") {
		 $("#validationLast").show();
		 $("#lastName").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationLast").hide();
		$("#firstName").css("border-color","#ced4da");
	}
	if ($("#email").val() == "") {
		 $("#validationEmail").show();
		 $("#email").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationEmail").hide();
		$("#email").css("border-color","#ced4da");
	}
	if ( $('input[name="userType"]:checked').val() == undefined) {
		 $("#validationRole").show();
		 $('input[name="userType"]').css("border-color", "red");
		 validate = false;
	}
	else {
		$("#validationRole").hide();
		$("#firstName").css("border-color","#ced4da");
	}
	if ($('#selectOrganization').val() == "") {
		 $("#validationOrg").show();
		 $("#selectOrganization").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationOrg").hide();
		$("#selectOrganization").css("border-color","#ced4da");

	}
	if ($("#password").val() == "") {
		 $("#validationPass").show();
		 $("#password").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationPass").hide();
		$("#password").css("border-color","#ced4da");

	}
	
	if (!validate) {
		toastr.error("All fields must be filled!");
		return false;
	}

	
	$.ajax({
		async: false,
		type: 'POST',
		url : "rest/users/register",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(data) {
			if(data == "existError")
			{
				toastr.error("Email already exists!");
			}
			else (data == "success")
			{
				toastr.success("You've successfully added user!");
        		getUsers(); 
			}
		},
		error: function(errorThrown ){
			toastr.error( errorThrown );
		}
	});
	
}

function deleteUser() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var email = splitted[1];
	var obj = {};
	obj["email"] = email;
	$.ajax({
		async : false,
		url : 'rest/users/delete',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(users) {
			showUsers(users);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function editUser() {
   
}

function searchUsers() {
	var obj = {};
	obj["email"] = $("#search-input").val();
	$.ajax({
		url : 'rest/users/search',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(users) {
			showUsers(users);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function getCategories() {
	$.get({
		url : 'rest/vmcategories/getAll',
		dataType : 'json',
		success : function(categories) {
			showCategories(categories);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function showCategories(categories) {
	if (categories.length > 0) {
		$("#div_center").load("html/vmCategory.html", function() {
			for (let category of categories) {
				addCategoryTr(category);
			}
		});	
	}
	else {
		$("#div_center").load("html/no_vmcategory.html");
	}
	$("#search-button").on("click", searchCategories);
	$("#add_category").on("click", loadAddVmCategory);
}



function addCategoryTr(category){
	let tr = $('<tr></tr>');
	let tdName = $('<td>' + category.name  + '</td>');
	let tdCores = $('<td>' + category.numberOfCores + '</td>');
	let tdRam = $('<td>' + category.ram + 'GB</td>');
	let tdGpuCores = $('<td>' + category.numOfGpuCores + '</td>');
	var buttonDelId = "del_" + category.name;
	var buttonEditId = "edit_" + category.name;
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0">Update</button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0">Delete</button></td>');

	tr.append(tdName).append(tdCores).append(tdRam).append(tdGpuCores).append(tdButtons);
	$('#vmcategory_table tbody').append(tr);
	document.getElementById(buttonEditId).addEventListener("click", editCategory);
	document.getElementById(buttonDelId).addEventListener("click", deleteCategory);



}

function loadAddVmCategory() {
	$("#div_center").load("html/add_category.html", function() {
		$("#add_vmcategory").on("click", addCategory);
	});
}



function addCategory() {
		
	var obj = {};
	obj["name"] = $("#cat_name").val();
	obj["numOfCores"] = $('#numOfCores').val();
	obj["ram"] = $("#ram").val();
	obj["numOfGpuCores"] = $('#gpu').val();	
	if ($("#cat_name").val() == "")                                  
	    { 
	        window.alert("Please enter your name."); 
	        name.focus(); 
	        return false; 
	    } 
	$.ajax({
		async: false,
		type: 'POST',
		url : "rest/vmcategories/add",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(data) {
			if(data == "existError")
			{
				toastr.error("VM Category name already exists!");
			}
			else (data == "success")
			{
				toastr.success("You've successfully added VM category!");
        		getCategories(); 
			}
		},
		error: function(errorThrown ){
			toastr.error( errorThrown );
		}
	});
	
}


function deleteCategory() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	$.ajax({
		async : false,
		url : 'rest/vmcategories/delete',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(categories) {
			showCategories(categories);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function loadEditCategory() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	$("#div_center").load("html/add_organization.html", function() {
		
		$.post({
			url : 'rest/vmcategories/getByName',
			contentType : 'application/json',
			dataType : 'json',
			data : JSON.stringify(obj),
			success : function(category) {
				fillEditFieldsCategory(category);
			},
			error : function(errorThrown) {
				toastr.error(errorThrown);
			}
	
	});
		$("#add_vmcategory").on("click", editCategory());
		
	});
}

function fillEditFieldsCategory(category) {
	$("#cat_name").val(category.name);
	$("#add_vmcategory").html("update")

	
}

function editCategory() {

	
}

function searchCategories() {
	var obj = {};
	obj["name"] = $("#search-input").val();
	$.ajax({
		url : 'rest/vmcategory/search',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(categories) {
			showCategories(categories);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}



function getDisks() {
	$.get({
		url : 'rest/disks/getAll',
		dataType : 'json',
		success : function(disks) {
			showDisks(disks);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function showDisks(disks) {
	
	if (disks.length > 0) {
		$("#div_center").load("html/disks.html", function() {
			for (let disk of disks) {
				addDiskTr(disk);
			}
		});	
	}
	else {
		$("#div_center").load("html/no_disks.html");
	}
	$("#search-button").on("click", searchDisks);
	$("#load_add_disk").on("click", loadAddDisk);
}



function addDiskTr(disk){
	let tr = $('<tr></tr>');
	let tdName = $('<td>' + disk.name + '</td>');
	let tdType = $('<td>' + disk.diskType + '</td>');
	let tdCapacity = $('<td>' + disk.capacity + 'GB</td>');
	let tdOrganization = $('<td>' + disk.organization + '</td>');
	let tdVM = $('<td>not connected</td>');
	if (disk.virtualMachine != "") {
		tdVM = $('<td>' + disk.virtualMachine.split(".")[0] + '</td>');
	}
	var buttonDelId = "del_" + disk.name;
	var buttonEditId = "edit_" + disk.name;
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0">Update</button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0">Delete</button></td>');

	tr.append(tdName).append(tdType).append(tdCapacity).append(tdOrganization).append(tdVM).append(tdButtons);
	$('#disks_table tbody').append(tr);
	document.getElementById(buttonEditId).addEventListener("click", loadEditDisk);
	document.getElementById(buttonDelId).addEventListener("click", deleteDisk);


}

function loadAddDisk() {
	$("#div_center").load("html/add_disk.html", function() {
		$("#button_add_disk").on("click", addDisk);
		$.get({
			url : 'rest/organizations/getAllNames',
			dataType : 'json',
			success : function(organizationNames) {
				var len = organizationNames.length;
				$( "#selectVM" ).prop( "disabled", true );
				$("#selectOrganization").empty();
				$('#selectOrganization').append("<option value='"+ "" +"'>Select value</option>");
                for( var i = 0; i<len; i++){
                    var org = organizationNames[i];
                    $('#selectOrganization').append("<option value='" + org +"'>" + org + "</option>");
                }
			}
		});
	});
}

$(document).on("change", "#selectOrganization", function(){
	var obj = {};
	obj["organization"] = $(this).val();
	$.post({
		url : 'rest/vms/getByCompany',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(vms) {
			var len = vms.length;
			$("#selectVM").empty();
			if (len>0){
				$( "#selectVM" ).prop( "disabled", false );
				$('#selectVM').append("<option value='"+ "" +"'>Select value</option>");
				for( var i = 0; i<len; i++){
		               var vm = vms[i].split(".")[0];
		               $('#selectVM').append("<option value='"+vm+"'>"+vm+"</option>");
		           }
			}
			else {
				$( "#selectVM" ).prop( "disabled", true );
				$('#selectVM').append("<option value='"+ "" +"'>Not available</option>");
			}
           
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
});
});



function addDisk() {
		
	var obj = {};
	obj["name"] = $("#name").val();
	obj["diskType"] = $('input[name="diskType"]:checked').val();
	obj["capacity"] = $("#capacity").val();
	obj["virtualMachine"] = "";
	if ($("#selectVM").val() != "") {
		obj["virtualMachine"] = $("#selectVM").val() + "." + $('#selectOrganization').val();
	}
	obj["organization"] = $('#selectOrganization').val();

	
	$.post({
		url : "rest/disks/add",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(data) {
			if(data == "existError")
			{
				toastr.error("Disk name already exists!");
			}
			else (data == "success")
			{
				toastr.success("You've successfully added new disk!");
        		getDisks(); 
			}
		},
		error: function(errorThrown ){
			toastr.error( errorThrown );
		}
	});
	
	
}

function deleteDisk() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	$.post({
		url : 'rest/disks/delete',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(disks) {
			showDisks(disks);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function loadEditDisk() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	oldName = name;
	$("#div_center").load("html/edit_disk.html", function() {
		
		$.post({
			url : 'rest/disks/getByName',
			contentType : 'application/json',
			dataType : 'json',
			data : JSON.stringify(obj),
			success : function(disk) {
				fillEditFieldsDisk(disk);
			},
			error : function(errorThrown) {
				toastr.error(errorThrown);
			}
	
	});
		$("#button_edit_disk").on("click", editDisk);
		
	});
}

function fillEditFieldsDisk(disk) {
	$("#name").val(disk.name);
	$("#capacity").val(disk.capacity);
	$("input[name=diskType][value="+ disk.diskType+ "]").prop("checked",true);
	$("#organization").val(disk.organization);
	$("#organization").prop( "disabled", true);
	$("#button_edit_disk").html("Update disk")
	var obj = {};
	obj["organization"] = disk.organization;
	$.ajax({
		async: false,
		type: 'POST',
		url : 'rest/vms/getByCompany',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(vms) {
			var len = vms.length;
			$("#selectVM").empty();
			if (len>0){
				$( "#selectVM" ).prop( "disabled", false );
				for( var i = 0; i<len; i++){
	                var vm = vms[i].split(".")[0];
	                $('#selectVM').append("<option value='"+vm+"'>"+vm+"</option>");
	            }
				
			}
			else {
				$("#selectVM" ).prop( "disabled", true );
				$('#selectVM').append("<option value='"+ "" +"'>Not available</option>");
			}
            
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
});
	if (disk.virtualMachine == "") {
		$("#selectVM").val("not connected").change();
	}
	else {
		$("#selectVM").val(disk.virtualMachine.split(".")[0]).change();
	}

	
}

function editDisk() {
	var obj = {};
	obj["oldName"] = oldName;
	obj["name"] = $("#name").val();
	obj["diskType"] = $('input[name="diskType"]:checked').val();
	obj["capacity"] = $("#capacity").val();
	obj["virtualMachine"] = "";
	if ($("#selectVM").val() != "") {
		obj["virtualMachine"] = $("#selectVM").val() + "." + $('#organization').val();
	}
	obj["organization"] = $('#organization').val();

	
	$.post({
		url : "rest/disks/update",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(data) {
			if(data == "existError")
			{
				toastr.error("Disk name already exists!");
			}
			else (data == "success")
			{
				toastr.success("You've successfully updated disk!");
        		getDisks(); 
			}
		},
		error: function(errorThrown ){
			toastr.error( errorThrown );
		}
	});
	
}

function searchDisks() {
	var obj = {};
	if (obj["name"] == "") {
		toastr.error("Search input can't be empty");
		return false;
	}
	obj["name"] = $("#search-input").val();
	$.ajax({
		url : 'rest/disks/search',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(disks) {
			showDisks(disks);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown);
		}
	});
}

function validateNumber(evt) {
	var charCode = (evt.which) ? evt.which : evt.keyCode
	return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

function filterSearchIntersection(searchResults, filterResults){
	return searchResults.filter(a => filterResults.some(b => a.name === b.name));  
}





