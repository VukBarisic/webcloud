function validateNumber(evt) {
	var charCode = (evt.which) ? evt.which : evt.keyCode
	return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

document.getElementById('gpu').onkeydown = function(e) {
	if (!((e.keyCode > 95 && e.keyCode < 106)
			|| (e.keyCode > 48 && e.keyCode < 58) || e.keyCode == 8)) {
		return false;
	}
}

document.getElementById('numOfCores').onkeydown = function(e) {
	if (!((e.keyCode > 95 && e.keyCode < 106)
			|| (e.keyCode > 48 && e.keyCode < 58) || e.keyCode == 8)) {
		return false;
	}
}