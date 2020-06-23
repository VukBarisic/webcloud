$(document).ready(function() {
	$('#forma').submit(function(event) {
		event.preventDefault();
		var obj = {};
		var obj = {};
		obj["username"] = $('#lusername').val();
		obj["password"] = $('#lpassword').val();
		$.ajax({
		    url: 'rest/users/login',
		    type: 'POST',
		    contentType: 'application/json',
		    dataType: 'json',
		    data: JSON.stringify(obj),
		    success: function(data){
				$('#success').text('Novi proizvod uspešno kreiran.');
				$("#success").show().delay(3000).fadeOut();
			},
			error: function(message) {
				$('#error').text("ssssss");
				$("#error").show().delay(3000).fadeOut();
			}
		});
	});
});
