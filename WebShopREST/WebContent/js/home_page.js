
var loggedUser = null;
var oldName = "";
var searchResults = [];
var filterResults = [];

document.addEventListener("DOMContentLoaded", function(){
	loadHomePage();
	});

function loadHomePage() {
	loggedUser = getLoggedUser();
	if (loggedUser == null) {
		$("#index_nav").hide();
		loadLoginPage();
	} else {
		$("#index_nav").show();
		var x = document.getElementById("loggedUserDrop");
		x.innerHTML = loggedUser.email;
		$("#logout").off().on("click", logout);
		$("#myProfile").off().on("click", loadMyProfile);
		byUserType();

	}

}

function byUserType() {
	if (loggedUser.role == 'superadmin') {
		$("#myOrganization").hide();
		$("#monthlyReport").hide();
		$("#vmCategories").show();
		$("#organizations").show();
		$("#vmCategories").show();
		$("#users").show();
		getVirtualMachines();
		$("#home").off().on("click", getVirtualMachines);
		$("#organizations").off().on("click", getOrganizations);
		$("#users").off().on("click", getUsers);
		$("#disks").off().on("click", getDisks);
		$("#vmCategories").off().on("click", getCategories);
	}
	else if (loggedUser.role == 'admin') {
		$("#vmCategories").hide();
		$("#organizations").hide();
		$("#myOrganization").show();
		$("#monthlyReport").show();
		getVirtualMachinesByOrganization();
		$("#home").off().on("click", getVirtualMachinesByOrganization);
		$("#monthlyReport").off().on("click", loadMonthlyReport);
		$("#myOrganization").off().on("click", loadEditOrganization);
		$("#users").off().on("click", getUsersByOrganization);
		$("#disks").off().on("click", getDisksByOrganization);
	}
	else {
		$("#myOrganization").hide();
		$("#organizations").hide();
		$("#users").hide();
		$("#vmCategories").hide();
		$("#monthlyReport").hide();
		getVirtualMachinesByOrganization();
		$("#disks").off().on("click", getDisksByOrganization);
		$("#home").off().on("click", getVirtualMachinesByOrganization);

	}
}

function loadMonthlyReport(){
	$("#div_center").load("html/monthreport.html", function() {
		$('#monthPicker').datepicker({
			minViewMode:'months',
			autoclose: true,
			endDate: new Date(),
			orientation: "top",
	});
		$("#calculatePrice").on("click", calculatePrice);

		
	});

}

function calculatePrice(){
	var obj = {};
	obj["selectedMonth"] = "01/" + $("#monthPicker").val() + " 00:00:00";
	obj["organization"] = loggedUser.organization;

	
	$.post({
		url : "rest/organizations/calculatePrice",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(price) {
			$("#div_center").append("<p>The price for " + $("#monthPicker").val() + " is " + price + "$.</p>");
		},
		error: function(errorThrown ){
			toastr.error(errorThrown.responseText);
		}
	});
}

function loadMyProfile() {
	$("#div_center").load("html/editMyProfile.html", function() {
		$("#updateMyProfile").on("click", editMyProfile);
		fillMyProfileFields();
	});
}

function fillMyProfileFields() {
	$("#validationFirst").hide();
	$("#validationLast").hide();
	$("#validationEmail").hide();
	$("#validationOrg").hide();
	$("#validationPassRep").hide();
	$("#firstName").val(loggedUser.firstName);
	$("#lastName").val(loggedUser.lastName);
	$("#email").val(loggedUser.email);
	if (loggedUser.organization == "" ) {
		$("#orgform").remove();
	}
	else {
		$("#organization").val(loggedUser.organization);
		$("#organization").prop( "disabled", true );
	}
}

function editMyProfile() {

	var obj = {};
	obj["email"] = $("#email").val();
	obj["firstName"] = $('#firstName').val();
	obj["lastName"] = $("#lastName").val();
	obj["password"] = $('#password').val();
	obj["confirm_password"] = $('#confirm_password').val();
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
		$("#lastName").css("border-color","#ced4da");
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
	if ($('#organization').val() == "") {
		 $("#validationOrg").show();
		 $("#organization").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationOrg").hide();
		$("#organization").css("border-color","#ced4da");

	}
	if (obj["password"] != obj["confirm_password"]) {
		$("#validationPassRep").show();
		$("#confirm_password").css("border-color","red");
		$("#password").css("border-color","red");
        return false;
    }
	else{
		$("#validationPassRep").hide();
		$("#password").css("border-color","#ced4da");
		$("#confirm_password").css("border-color","#ced4da");
	}
	
	if (!validate) {
		toastr.error("All fields must be filled!");
		return false;
	}

	$.post({
		url : "rest/users/updateMyProfile",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(user) {
				loggedUser = user;
				toastr.success("You've successfully updated your profile!");
        		getUsers(); 
		},
		error: function(errorThrown ){
			toastr.error(errorThrown.responseText);
		}
	});
	
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
		$.post({
			url : "rest/users/login",
			contentType : 'application/json',
			dataType : 'json',
			data : JSON.stringify(obj),
			success : function(user) {
					toastr.success('Welcome ' + user.email);
					loadHomePage()
			
			},
			error : function(errorThrown) {
				toastr.error(errorThrown.responseText);
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
			toastr.error(errorThrown.responseText);
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
			toastr.error(errorThrown.responseText);
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
			toastr.error(errorThrown.responseText);
		}
	});
}

function showOrganizations(organizations) {
	$("#search-input").show();
	$("#search-button").show();
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
	let tr = $('<tr class="text-center"></tr>');
	let tdLogo = $('<td style="width:70%" class="w-25"><img style="width:100%;" class="img-responsive" src= imgs/' + organization.logo  + ' alt="Loading.."></td>');
	let tdBroj = $('<td>' + organization.description + '</td>');
	let tdIme = $('<td>' + organization.name + '</td>');
	var buttonDelId = "del_" + organization.name;
	var buttonEditId = "edit_" + organization.name;
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0"><i class="fa fa-edit"></i></button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-times" aria-hidden="true"></i></button></td>');

	tr.append(tdLogo).append(tdBroj).append(tdIme).append(tdButtons);
	$('#organizationsTable tbody').append(tr);
	document.getElementById(buttonEditId).addEventListener("click", loadEditOrganization);
	document.getElementById(buttonDelId).addEventListener("click", deleteOrganization);
}

function loadAddOrganization() {
	$("#div_center").load("html/add_organization.html", function() {
		$("#button_add_org").on("click", addOrganization);
		$("#validationName").hide();
		$("#validationDesc").hide();
		$("#validationFile").hide();
	});
}

function addOrganization() {
		
	var obj = {};
	obj["name"] = $("#org_name").val();
	obj["description"] = $('#org_desc').val();
	var file = $("#org_image")[0].files[0];
	let validate = true;

	if (obj["name"] == "") {
		 $("#validationName").show();
		 $("#org_name").css("border-color","red");
		 validate = false;
	}
	else{
		$("#validationName").hide();
		$("#org_name").css("border-color","#ced4da");
	}
	if (obj["description"] == "") {
		 $("#validationDesc").show();
		 $("#org_desc").css("border","1px solid red");
		 validate = false;
	}
	else {
		$("#validationDesc").hide();
		$("#org_desc").addClass('redBorder');
	}
	if (file == undefined) {
		 $("#validationFile").show();
		 $("#uploadlabel").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationFile").hide();
		$("#uploadlabel").css("border-color","#ced4da");
	}

	if (!validate) {
		toastr.error("All fields must be filled!");
		return false;
	}
	
	$.post({
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
				$.post({
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
						toastr.error(errorThrown.responseText);
					}
				}); 
			}
		},
		error: function(errorThrown ){
			toastr.error(errorThrown.responseText);
		}
	});
	
}

function deleteOrganization() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	$.post({
		url : 'rest/organizations/delete',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(organizations) {
			showOrganizations(organizations);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
		}
	});
}

function loadEditOrganization() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	if (loggedUser.role == "superadmin") {
		obj["name"] = name;
		oldName = name;
	}
	else {
		obj["name"] = loggedUser.organization;
		oldName = loggedUser.organization;
	}
	
	
	$("#div_center").load("html/editOrganization.html", function() {
		
		$.post({
			url : 'rest/organizations/getByName',
			contentType : 'application/json',
			dataType : 'json',
			data : JSON.stringify(obj),
			success : function(organization) {
				fillEditFieldsOrg(organization);
			},
			error : function(errorThrown) {
				toastr.error(errorThrown.responseText);
			}
	
	});
		$("#button_edit_org").off().on("click", editOrganization);
		
	});
}

function fillEditFieldsOrg(organization) {
	$("#org_name").val(organization.name);
	$("#org_desc").val(organization.description);
	$("#img-upload").attr("src", "imgs/" + organization.logo);
	$("#validationName").hide();
	$("#validationDesc").hide();
	$("#validationFile").hide();

}

function editOrganization() {
	var obj = {};
	let fileUploaded = true;
	var file;
	obj["oldName"] = oldName;
	obj["name"] = $("#org_name").val();
	obj["description"] = $("#org_desc").val();
	if ($("#org_image")[0].files.length == 0) {
	    fileUploaded = false;
	    obj["logo"] = "";
	}
	else {
		file = $("#org_image")[0].files[0];
		obj["logo"] = obj["name"];
	}
	let validate = true;

	if (obj["name"] == "") {
		 $("#validationName").show();
		 $("#org_name").css("border-color","red");
		 validate = false;
	}
	else{
		$("#validationName").hide();
		$("#org_name").css("border-color","#ced4da");
	}
	if (obj["description"] == "") {
		 $("#validationDesc").show();
		 $("#org_desc").css("border","1px solid red");
		 validate = false;
	}
	else {
		$("#validationDesc").hide();
		$("#org_desc").addClass("border","#ced4da");
	}

	if (!validate) {
		toastr.error("All fields must be filled!");
		return false;
	}
	
	$.post({
		url : "rest/organizations/update",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(data) {
			if(data == "existError")
			{
				toastr.error("Organization name already exists!");
			}
			else if (data == "success" && fileUploaded)
			{
				$.post({
					
					url : "rest/organizations/uploadImage",
			        contentType : "multipart/form-data",
			        dataType: 'json',
			        data : file,
			        processData : false,
			        success: function(response)
			        {
			        	if(response == "success")
			        	{
			        		toastr.success("You've successfully updated organization!");
			        		getOrganizations();
			        	}
			        },
					error: function(errorThrown){
						toastr.error(errorThrown.responseText);
					}
				}); 
			}
			else if (data == "success") {
				toastr.success("You've successfully updated organization!");
        		getOrganizations();
			}
		},
		error: function(errorThrown ){
			toastr.error(errorThrown.responseText);
		}
	});
	
}

function searchOrganizations() {
	var obj = {};
	obj["name"] = $("#search-input").val();
	if (obj["name"] == "") {
		toastr.error("Search input can't be empty");
		return false;
	}
	$.post({
		url : 'rest/organizations/search',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(organizations) {
			showOrganizations(organizations);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
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
			toastr.error(errorThrown.responseText);
		}
	});
}

function showVirtualMachines(virtualMachines){
	$("#search-input").show();
	$("#search-button").show();
	if (virtualMachines.length > 0) {
		$("#div_center").load("html/virtualmachines.html", function() {
			if (loggedUser.role == "user") {
				$("#add_vm").hide();
			}
			else {
				$("#add_vm").on("click", loadAddVm);
			}
			for (let vm of virtualMachines) {
				addVirtualMachineTr(vm);
			}
		});	
	}
	else {
		$("#div_center").load("html/no_vms.html", function() {
		if (loggedUser.role == "user") {
			$("#add_vm").hide();
		}
		else {
			$("#add_vm").on("click", loadAddVm);
		}
		});
	}
	
	$("#search-button").off().on("click", searchVirtualMachines);
	$("#filter_vm").off().on("click", filterVM);
}

function addVirtualMachineTr(virtualMachine){
	let tr = $('<tr class="text-center"></tr>');
	let tdName = $('<td>' + virtualMachine.name.split(".")[0]  + '</td>');
	let tdCores = $('<td>' + virtualMachine.vMcategory.numberOfCores + '</td>');
	let tdRam = $('<td>' + virtualMachine.vMcategory.ram + '</td>');
	let tdGpuCores = $('<td>' + virtualMachine.vMcategory.numOfGpuCores + '</td>');
	let organization = $('<td>' + virtualMachine.organization + '</td>');
	var buttonDelId = "del_" + virtualMachine.name;
	var buttonEditId = "edit_" + virtualMachine.name;
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0"><i class="fa fa-edit"></i></button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-times" aria-hidden="true"></i></button></td>');
	
	tr.append(tdName).append(tdCores).append(tdRam).append(tdGpuCores).append(organization).append(tdButtons);
	$('#vmTable tbody').append(tr);
	if (loggedUser.role == "user") {
		$("#"+ buttonDelId).hide();
	}
	document.getElementById(buttonEditId).addEventListener("click", loadEditVm);
	document.getElementById(buttonDelId).addEventListener("click", deleteVm);

}

function loadAddVm() {
	
	$("#div_center").load("html/add_vm.html", function() {
		$("#validationName").hide();
		$("#validationCat").hide();
		$("#validationOrg").hide();
		$("#add_vm").on("click", addVirtualMachine);
		var options = [];
		if (loggedUser.role == 'superadmin') {
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
		}
		else {
			$("#organizationDiv").hide();
			$('#selectCategory').css("width", 354);
		}
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
	obj["name"] = $(this).val();
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
			toastr.error(errorThrown.responseText);
		}
	});
});

function addVirtualMachine() {
	
	var obj = {};
	obj["name"] = $("#vmname").val();
	if (loggedUser.role == "superadmin") {
		obj["organization"] = $("#selectOrganization").val();
	}
	else {
		obj["organization"] = loggedUser.organization;
	}
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
	if (loggedUser.role == "superadmin" && obj["organization"] == "") {
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

	$.post({
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
				if (loggedUser.role == 'admin') {
					getVirtualMachinesByOrganization();
				}
				else {
					getVirtualMachines();
				} 
			}
			},
		error: function(errorThrown ){
				toastr.error(errorThrown.responseText);
			}
		});
			
}

function loadEditVm() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	oldName = name;
	$("#div_center").load("html/edit_vm.html", function() {
		
		$.post({
			url : 'rest/vms/getByName',
			contentType : 'application/json',
			dataType : 'json',
			data : JSON.stringify(obj),
			success : function(vm) {
				fillEditFieldsVm(vm);
			},
			error : function(errorThrown) {
				toastr.error(errorThrown.responseText);
			}
	
	});
		$("#edit_vm").on("click", editVm);
		
	});
}

function fillEditFieldsVm(vm) {
	$("#validationName").hide();
	$("#validationCat").hide();
	$("#validationOrg").hide();
	$("#vmname").val(vm.name.split(".")[0]);
	$("#selectCategory").val(vm.category);
	$("#organization").val(vm.organization)
	$("#edit_vm").html("Update vm")
	if (vm.activities.length != 0 && vm.activities[vm.activities.length-1].dateTurnedOff == null) {
		$("#vmOffOn").prop('checked', true);
	}
	var obj = {};
	let index = 0;
	$.get({
		url : 'rest/vmcategories/getAllNames',
		dataType : 'json',
		success : function(categoryNames) {
			var len = categoryNames.length;
			$("#selectCategory").empty();
            for( var i = 0; i<len; i++){
                var cat = categoryNames[i];
                if (vm.vMcategory.name == cat) {
                	index = i;
                }
                $('#selectCategory').append("<option value='" + cat + "'>" + cat + "</option>");
            }
           $("#selectCategory").prop("selectedIndex", index).change();        	
		}
	});
}

function editVm(){
	var obj = {};
	obj["oldName"] = oldName;
	obj["name"] = $("#vmname").val() ;
	obj["category"] = $('#selectCategory').val();
	
	let validate = true;
	
	if (obj["name"] == "") {
		 $("#validationName").show();
		 $("#vmname").css("border-color","red");
		 validate = false;
	}
	else{
		obj["name"] = obj["name"] + "." + $("#organization").val();
		$("#validationName").hide();
		$("#vmname").css("border-color","#ced4da");
	}
	if (!validate) {
		toastr.error("All fields must be filled!");
		return false;
	}

	$.post({
		url : "rest/vms/update",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(data) {
			if(data == "existError")
			{
				toastr.error("Vm name already exists!");
			}
			else (data == "success")
			{
				toastr.success("You've successfully updated virtual machine!");
				if (loggedUser.role == 'admin') {
					getVirtualMachinesByOrganization();
				}
				else {
					getVirtualMachines();
				}  
			}
		},
		error: function(errorThrown ){
			toastr.error(errorThrown.responseText);
		}
	});
}

function deleteVm(){
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	$.post({
		url : 'rest/vms/delete',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(vms) {
			if (loggedUser.role == 'admin') {
				getVirtualMachinesByOrganization();
			}
			else {
				getVirtualMachines();
			} 
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
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
	$.post({
		url : 'rest/vms/search',
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
			toastr.error(errorThrown.responseText);
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
	
	// validation
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
	// end of validation
	
	$.post({
		url : 'rest/vms/filter',
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
			toastr.error(errorThrown.responseText);
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
			toastr.error(errorThrown.responseText);
		}
	});
}

function showUsers(users) {
	$("#search-input").hide();
	$("#search-button").hide();
	if (users.length > 0) {
		$("#div_center").load("html/users.html", function() {
			$("#usersTable td:nth-child(3), th:nth-child(4)").hide(); 
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
	let tr = $('<tr class="text-center"></tr>');
	let tdEmail = $('<td>' + user.email  + '</td>');
	let tdFirstName = $('<td>' + user.firstName + '</td>');
	let tdLastName = $('<td>' + user.lastName  + '</td>');
	let tdOrg = "";
	if (loggedUser.role == "superadmin") {
		if (user.organization == "") {
			tdOrg = $('<td>no organization</td>');
		}
		else {
			tdOrg = $('<td>' + user.organization +'</td>');
		}
	}
	if (loggedUser.email == user.email) {
		tdButtons = $('<td>loggedUser</td>');
		tr.append(tdEmail).append(tdFirstName).append(tdLastName).append(tdOrg).append(tdButtons);
		$('#usersTable tbody').append(tr);
	}
	else if (user.role == "superadmin") {
		tdButtons = $('<td>superadmin</td>');
		tr.append(tdEmail).append(tdFirstName).append(tdLastName).append(tdOrg).append(tdButtons);
		$('#usersTable tbody').append(tr);
	}
	else{
		var buttonDelId = "deluser_" + user.email;
		var buttonEditId = "edituser_" + user.email;
		let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0"><i class="fa fa-edit"></i></button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-times" aria-hidden="true"></i></button></td>');
		tr.append(tdEmail).append(tdFirstName).append(tdLastName).append(tdOrg).append(tdButtons);
		$('#usersTable tbody').append(tr);
		document.getElementById(buttonEditId).addEventListener("click", loadEditUser);
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
		if (loggedUser.role == "superadmin") {
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
		}
		else {
			$("#organizationDiv").hide();
		}
	});
}

function addUser() {
		
	var obj = {};
	obj["email"] = $("#email").val();
	obj["firstName"] = $('#firstName').val();
	obj["lastName"] = $("#lastName").val();
	if (loggedUser.role == 'admin') {
		obj["organization"] = loggedUser.organization;
	}
	else {
		obj["organization"] = $('#selectOrganization').val();
	}
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
		$("#lastName").css("border-color","#ced4da");
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
		$('input[name="userType"]').css("border-color","#ced4da");
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
	
	if (!validateEmail(obj["email"])) {
		 $("#validationEmail").show();
		 $("#email").css("border-color","red");
		 toastr.error("You have to enter valid email!");
		 return false;
	}
	
	$.post({
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
				if (loggedUser.role == 'admin') {
					getUsersByOrganization();
				}
				else {
					getUsers();
				}
			}
		},
		error: function(errorThrown ){
			toastr.error(errorThrown.responseText);
		}
	});
}

function deleteUser() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var email = splitted[1];
	var obj = {};
	obj["email"] = email;
	$.post({
		url : 'rest/users/delete',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(users) {
			if (loggedUser.role == 'admin') {
				getUsersByOrganization();
			}
			else {
				getUsers();
			}
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
		}
	});
}

function loadEditUser() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var email = splitted[1];
	var obj = {};
	oldName = email;
	obj["email"] = email;
	$("#div_center").load("html/editUser.html", function() {
	$("#organizationDiv").hide();
		$.post({
			url : 'rest/users/getByEmail',
			contentType : 'application/json',
			dataType : 'json',
			data : JSON.stringify(obj),
			success : function(user) {
				fillUserEditFields(user);
			},
			error : function(errorThrown) {
				toastr.error(errorThrown.responseText);
			}
	
	});
		$("#editUser").on("click", editUser);
		
		
	});
}

function fillUserEditFields(user) {
	$("#validationFirst").hide();
	$("#validationLast").hide();
	$("#validationEmail").hide();
	$("#validationOrg").hide();
	$("#firstName").val(user.firstName);
	$("#lastName").val(user.lastName);
	$("#email").val(user.email);
	if (loggedUser.role == 'superadmin') {
		$("#organization").val(user.organization);
		$("#organization").prop( "disabled", true );	}
	else {
		$("#orgform").hide();
	}

}

function editUser() {
	var obj = {};
	obj["oldEmail"] = oldName;
	obj["email"] = $("#email").val();
	obj["firstName"] = $('#firstName').val();
	obj["lastName"] = $("#lastName").val();
	obj["password"] = $('#password').val();
	obj["confirm_password"] = $('#confirm_password').val();
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
		$("#lastName").css("border-color","#ced4da");
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
	if (!validate) {
		toastr.error("All fields must be filled!");
		return false;
	}

	$.post({
		url : "rest/users/updateUser",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(user) {
				toastr.success("You've successfully updated user!");
				if (loggedUser.role == 'admin') {
					getUsersByOrganization();
				}
				else {
					showUsers(users);
				} 
		},
		error: function(errorThrown ){
			toastr.error(errorThrown.responseText);
		}
	});
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
			toastr.error(errorThrown.responseText);
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
			toastr.error(errorThrown.responseText);
		}
	});
}

function showCategories(categories) {
	$("#search-input").hide();
	$("#search-button").hide();
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
	let tr = $('<tr class="text-center"></tr>');
	let tdName = $('<td>' + category.name  + '</td>');
	let tdCores = $('<td>' + category.numberOfCores + '</td>');
	let tdRam = $('<td>' + category.ram + 'GB</td>');
	let tdGpuCores = $('<td>' + category.numOfGpuCores + '</td>');
	var buttonDelId = "del_" + category.name;
	var buttonEditId = "edit_" + category.name;
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0"><i class="fa fa-edit"></i></button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-times" aria-hidden="true"></i></button></td>');

	tr.append(tdName).append(tdCores).append(tdRam).append(tdGpuCores).append(tdButtons);
	$('#vmcategory_table tbody').append(tr);
	document.getElementById(buttonEditId).addEventListener("click", loadEditCategory);
	document.getElementById(buttonDelId).addEventListener("click", deleteCategory);
}

function loadAddVmCategory() {
	$("#div_center").load("html/add_category.html", function() {
		$("#add_vmcategory").on("click", addCategory);
		$("#validationName").hide();
		$("#validationCores").hide();
		$("#validationRam").hide();
		$("#validationGpu").hide();
	});
}



function addCategory() {
		
	var obj = {};
	obj["name"] = $("#cat_name").val();
	obj["numOfCores"] = $('#numOfCores').val();
	obj["ram"] = $("#ram").val();
	obj["numOfGpuCores"] = $('#gpu').val();	
	
	let validate = true;
	
	if (obj["name"] == "") {
		 $("#validationName").show();
		 $("#cat_name").css("border-color","red");
		 validate = false;
	}
	else{
		$("#validationName").hide();
		$("#cat_name").css("border-color","#ced4da");
	}
	if (obj["numOfCores"] == "") {
		 $("#validationCores").show();
		 $("#numOfCores").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationCores").hide();
		$("#numOfCores").css("border-color","#ced4da");
	}
	if (obj["ram"] == "") {
		 $("#validationRam").show();
		 $("#ram").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationRam").hide();
		$("#ram").css("border-color","#ced4da");
	}
	if (obj["numOfGpuCores"] == "") {
		 $("#validationGpu").show();
		 $("#gpu").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationGpu").hide();
		$("#gpu").css("border-color","#ced4da");
	}

	if (!validate) {
		toastr.error("All fields must be filled!");
		return false;
	}
	if ($('#numOfCores').val() == 0) {
		toastr.error("Number of cores has to be bigger than 0!");
		return false;
	}
	if ($('#ram').val() == 0) {
		toastr.error("Ram has to be bigger than 0!");
		return false;
	}
	
	if ($('#gpu').val() == 0) {
		toastr.error("GPU has to be bigger than 0!");
		return false;
	}

	$.post({
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
			toastr.error(errorThrown.responseText);
		}
	});
}

function deleteCategory() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	obj["name"] = name;
	$.post({
		url : 'rest/vmcategories/delete',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(categories) {
			showCategories(categories);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
		}
	});
}

function loadEditCategory() {
	var button_id = this.id;
	var splitted = button_id.split('_');
	var name = splitted[1];
	var obj = {};
	oldName = name;
	obj["name"] = name;
	$("#div_center").load("html/add_category.html", function() {
		
		$.post({
			url : 'rest/vmcategories/getByName',
			contentType : 'application/json',
			dataType : 'json',
			data : JSON.stringify(obj),
			success : function(category) {
				fillEditFieldsCategory(category);
			},
			error : function(errorThrown) {
				toastr.error(errorThrown.responseText);
			}
	});
		
	$("#add_vmcategory").on("click", editCategory);	
	});
}

function fillEditFieldsCategory(category) {
	$("#cat_name").val(category.name);
	$("#numOfCores").val(category.numberOfCores);
	$("#ram").val(category.ram);
	$("#gpu").val(category.numOfGpuCores);
	$("#add_vmcategory").html("update")
	$("#validationName").hide();
	$("#validationCores").hide();
	$("#validationRam").hide();
	$("#validationGpu").hide();
}

function editCategory() {
	var obj = {};
	obj["oldName"] = oldName;
	obj["name"] = $("#cat_name").val();
	obj["ram"] = $("#ram").val();
	obj["gpu"] = $("#gpu").val();
	obj["cores"] = $("#numOfCores").val();
	
	let validate = true;
	
	if (obj["name"] == "") {
		 $("#validationName").show();
		 $("#cat_name").css("border-color","red");
		 validate = false;
	}
	else{
		$("#validationName").hide();
		$("#cat_name").css("border-color","#ced4da");
	}
	if (obj["cores"] == "") {
		 $("#validationCores").show();
		 $("#numOfCores").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationCores").hide();
		$("#numOfCores").css("border-color","#ced4da");
	}
	if (obj["ram"] == "") {
		 $("#validationRam").show();
		 $("#ram").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationRam").hide();
		$("#ram").css("border-color","#ced4da");
	}
	if (obj["gpu"] == "") {
		 $("#validationGpu").show();
		 $("#gpu").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationGpu").hide();
		$("#gpu").css("border-color","#ced4da");
	}

	if (!validate) {
		toastr.error("All fields must be filled!");
		return false;
	}
	if ($('#numOfCores').val() == 0) {
		toastr.error("Number of cores has to be bigger than 0!");
		return false;
	}
	if ($('#ram').val() == 0) {
		toastr.error("Ram has to be bigger than 0!");
		return false;
	}
	
	if ($('#gpu').val() == 0) {
		toastr.error("GPU has to be bigger than 0!");
		return false;
	}
	
	$.post({
		url : "rest/vmcategories/update",
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(data) {
			if(data == "existError")
			{
				toastr.error("Category name already exists!");
			}
			else (data == "success")
			{
				toastr.success("Update was successful!");
        		getCategories(); 
			}
		},
		error: function(errorThrown ){
			toastr.error(errorThrown.responseText);
		}
	});
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
			toastr.error(errorThrown.responseText);
		}
	});
}

function getDisks() {
	searchResults = [];
	filterResults = [];
	$.get({
		url : 'rest/disks/getAll',
		dataType : 'json',
		success : function(disks) {
			showDisks(disks);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
		}
	});
}

function showDisks(disks) {
	$("#search-input").show();
	$("#search-button").show();
	if (disks.length > 0) {
		$("#div_center").load("html/disks.html", function() {
			if (loggedUser.role == "user") {
				$("#load_add_disk").hide();
			}
			else {
				$("#load_add_disk").on("click", loadAddDisk);
			}
			for (let disk of disks) {
				addDiskTr(disk);
			}
		});	
	}
	else {
		$("#div_center").load("html/no_disks.html", function () {
			if (loggedUser.role == "user") {
				$("#load_add_disk").hide();
			}
			else {
				$("#load_add_disk").on("click", loadAddDisk);
			}
		});
	}
	$("#search-button").off().on("click", searchDisks);
	$("#filter_disks").on("click", filterDisks);
	$("#load_add_disk").on("click", loadAddDisk);
}

function addDiskTr(disk){
	let tr = $('<tr class="text-center"></tr>');
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
	let tdButtons = $('<td><button type="button" id = "' + buttonEditId + '" data-toggle="modal" class="btn btn-warning btn-rounded btn-sm my-0"><i class="fa fa-edit"></i></button><button type="button" id = "' + buttonDelId + '" class="btn btn-danger btn-rounded btn-sm my-0"><i class="fa fa-times" aria-hidden="true"></i></button></td>');

	tr.append(tdName).append(tdType).append(tdCapacity).append(tdOrganization).append(tdVM).append(tdButtons);
	$('#disks_table tbody').append(tr);
	document.getElementById(buttonEditId).addEventListener("click", loadEditDisk);
	document.getElementById(buttonDelId).addEventListener("click", deleteDisk);
}

function loadAddDisk() {
	$("#div_center").load("html/add_disk.html", function() {
		$("organizationDiv").hide();
		$("#validationName").hide();
		$("#validationOrg").hide();
		$("#validationVM").hide();
		$("#validationCapacity").hide();
		$("#validationType").hide();
		$("#button_add_disk").off().on("click", addDisk);
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
			toastr.error(errorThrown.responseText);
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
	
	let validate = true;
	if ($("#name").val() == "") {
		 $("#validationName").show();
		 $("#name").css("border-color","red");
		 validate = false;
	}
	else{
		$("#validationName").hide();
		$("#name").css("border-color","#ced4da");
	}
	if ($("#selectOrganization").val() == "") {
		 $("#validationOrg").show();
		 $("#selectOrganization").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationOrg").hide();
		$("#selectOrganization").css("border-color","#ced4da");
	}
	if ($("#selectVM").val() == "") {
		 $("#validationVM").show();
		 $("#selectVM").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationVM").hide();
		$("#selectVM").css("border-color","#ced4da");
	}
	if ( $('input[name="diskType"]:checked').val() == undefined) {
		 $("#validationType").show();
		 $('input[name="diskType"]').css("border-color", "red");
		 validate = false;
	}
	else {
		$("#validationType").hide();
		$('input[name="diskType"]').css("border-color","#ced4da");
	}
	if ($('#capacity').val() == "") {
		 $("#validationCapacity").show();
		 $("#capacity").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationCapacity").hide();
		$("#capacity").css("border-color","#ced4da");

	}
	
	if (!validate) {
		toastr.error("All fields must be filled!");
		return false;
	}
	
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
			else if (data == "success")
			{
				toastr.success("You've successfully added disk!");
				if (loggedUser.role == 'superadmin') {
					getDisks();
				}
				else {
					getDisksByOrganization();
				}
			}
		},
		error: function(errorThrown ){
			toastr.error(errorThrown.responseText);
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
			toastr.success("You've successfully deleted disk!");
			if (loggedUser.role == 'superadmin') {
				getDisks();
			}
			else {
				getDisksByOrganization();
			}
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
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
				toastr.error(errorThrown.responseText);
			}
	
	});
		$("#button_edit_disk").on("click", editDisk);
		
	});
}

function fillEditFieldsDisk(disk) {
	$("#validationName").hide();
	$("#validationOrg").hide();
	$("#validationVM").hide();
	$("#validationCapacity").hide();
	$("#validationType").hide();
	$("#name").val(disk.name);
	$("#capacity").val(disk.capacity);
	$("input[name=diskType][value="+ disk.diskType+ "]").prop("checked",true);
	$("#organization").val(disk.organization);
	$("#organization").prop( "disabled", true);
	$("#button_edit_disk").html("Update disk")
	var obj = {};
	obj["organization"] = disk.organization;
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
			toastr.error(errorThrown.responseText);
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

	if ($("#selectVM").val() != "") {
		obj["virtualMachine"] = $("#selectVM").val() + "." + $('#selectOrganization').val();
	}
	obj["organization"] = $('#selectOrganization').val();
	
	let validate = true;
	if ($("#name").val() == "") {
		 $("#validationName").show();
		 $("#name").css("border-color","red");
		 validate = false;
	}
	else{
		$("#validationName").hide();
		$("#name").css("border-color","#ced4da");
	}
	if ($("#selectVM").val() == "") {
		 $("#validationVM").show();
		 $("#selectVM").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationVM").hide();
		$("#selectVM").css("border-color","#ced4da");
	}
	if ($('#capacity').val() == "") {
		 $("#validationCapacity").show();
		 $("#capacity").css("border-color","red");
		 validate = false;
	}
	else {
		$("#validationCapacity").hide();
		$("#capacity").css("border-color","#ced4da");

	}
	if ($('#capacity').val() == 0) {
		toastr.error("Capacity has to be bigger than 0gb!");
		return false;
	}
	
	if (!validate) {
		toastr.error("All fields must be filled!");
		return false;
	}

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
				toastr.success("You've successfully added disk!");
				if (loggedUser.role == 'superadmin') {
					getDisks();
				}
				else {
					getDisksByOrganization();
				}
			}
		},
		error: function(errorThrown ){
			toastr.error(errorThrown.responseText);
		}
	});
}

function searchDisks() {
	var obj = {};
	obj["name"] = $("#search-input").val();
	if (obj["name"] == "") {
		toastr.error("Search input can't be empty");
		return false;
	}
	$.ajax({
		url : 'rest/disks/search',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(disks) {
			searchResults = disks;
			if (filterResults.length > 0) {
				showDisks(filterSearchIntersection(searchResults, filterResults));
			}
			else {
				showDisks(disks);
			}
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
		}
	});
}

function filterDisks(){
	var obj = {};
	obj["capacityFrom"] = $("#capacityFrom").val();
	obj["capacityTo"] = $("#capacityTo").val();
	
	// validation
	if ((obj["capacityFrom"] == "" && obj["capacityTo"] != "") || (obj["capacityFrom"] != "" && obj["capacityTo"] == "") )  {
		toastr.error("Both fields must be filled!");
		return false;
	}
	if ((obj["capacityFrom"] == "" && obj["capacityTo"] == "")) {
		toastr.error("All fields are empty!");
		return false;
	}
	if (parseInt(obj["capacityFrom"]) >= parseInt(obj["capacityTo"])) {
		toastr.error("Right field number has to be bigger than left");
		return false;
	}
	
	$.ajax({
		url : 'rest/disks/filter',
		type : 'POST',
		contentType : 'application/json',
		dataType : 'json',
		data : JSON.stringify(obj),
		success : function(disks) {
			filterResults = disks;
			if (searchResults.length > 0) {
				showDisks(filterSearchIntersection(searchResults, filterResults));
			}
			else {
				showDisks(disks);
			}
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
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

$(document).on("change", "#vmOffOn", function(){	
	
	if (!this.checked) {
        var sure = confirm("Are you sure you want to turn off virtual machine?");
        this.checked = !sure;
    }
	else {
        var sure = confirm("Are you sure you want to turn on virtual machine?");
        this.checked = sure;

    }
	if (sure) {
		obj = {};
		obj["name"] = $("#vmname").val() + "." + $("#organization").val();
		obj["time"] = new Date().getTime();		
		obj["turnedOn"] = this.checked;
		$.post({
			url : "rest/vms/offOn",
			contentType : 'application/json',
			dataType : 'json',
			data : JSON.stringify(obj),
			success : function(data) {
				if(data == "success")
				{
					if (this.checked) {
						toastr.success("You've successfully turned virtual machine on!");
					}
					else {
						toastr.success("You've successfully turned virtual machine off!");
					}
				}
			},
			error: function(errorThrown ){
				toastr.error(errorThrown.responseText);
			}
		});
	}
});

////////////////////////////////////////// admin

function getVirtualMachinesByOrganization() {
	searchResults = [];
	filterResults = [];
	$.get({
		url : 'rest/vms/getByOrganization',
		dataType : 'json',
		success : function(vms) {
			showVirtualMachines(vms);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
		}
	});
}

function getUsersByOrganization() {
	$.get({
		url : 'rest/users/getByOrganization',
		dataType : 'json',
		success : function(users) {
			showUsers(users);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
		}
	});
}

function getDisksByOrganization() {
	searchResults = [];
	filterResults = [];
	$.get({
		url : 'rest/disks/getByOrganization',
		dataType : 'json',
		success : function(disks) {
			showDisks(disks);
		},
		error : function(errorThrown) {
			toastr.error(errorThrown.responseText);
		}
	});
}


////////////////////////////////////

$('#search-input').keypress(function (e) {                                       
         e.preventDefault();
});

function validateEmail(email) 
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}