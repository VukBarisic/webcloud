
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
		getVirtualMachines();
		var x = document.getElementById("loggedUserDrop");
		x.innerHTML = loggedUser.email;
		$("#button_login").unbind().on("click", login);
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
	$("#search-button").on("click", searchVirtualMachines);
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
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0">Edit</button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0">Delete</button></td>');

	tr.append(tdName).append(tdCores).append(tdRam).append(tdGpuCores).append(organization).append(tdButtons);
	$('#vms_table tbody').append(tr);
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
		let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0">Edit</button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0">Delete</button></td>');
		tr.append(tdEmail).append(tdFirstName).append(tdLastName).append(tdOrg).append(tdButtons);
		$('#usersTable tbody').append(tr);
		document.getElementById(buttonEditId).addEventListener("click", editUser);
		document.getElementById(buttonDelId).addEventListener("click", deleteUser);
	}
	}
	
	
	
	

function loadAddUser() {
	$("#div_center").load("html/add_user.html", function() {
		$("#button_add_user").on("click", addUser);
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
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0">Edit</button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0">Delete</button></td>');

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

	var buttonDelId = "del_" + disk.name;
	var buttonEditId = "edit_" + disk.name;
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0">Edit</button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0">Delete</button></td>');

	tr.append(tdName).append(tdType).append(tdCapacity).append(tdOrganization).append(tdButtons);
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
			}
			else {
				$( "#selectVM" ).prop( "disabled", true );
				$('#selectVM').append("<option value='"+ "" +"'>Not available</option>");
			}
            for( var i = 0; i<len; i++){
                var vm = vms[i].split(".")[0];
                $('#selectVM').append("<option value='"+vm+"'>"+vm+"</option>");
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
	obj["virtualMachine"] = $("#selectVM").val();
	obj["organization"] = $('#selectOrganization').val();

	
	$.ajax({
		async: false,
		type: 'POST',
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
	$.ajax({
		async : false,
		url : 'rest/disks/delete',
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

function loadEditDisk() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	$("#div_center").load("html/add_disk.html", function() {
		
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
		$("#add_disk").on("click", editDisk());
		
	});
}

function fillEditFieldsDisk(disk) {
	$("#disk_name").val(disk.name);
	$("#add_disk").html("update")

	
}

function editDisk() {

	
}

function searchDisks() {
	var obj = {};
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





