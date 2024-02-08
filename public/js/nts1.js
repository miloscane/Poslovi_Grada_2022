function NtsLogin(){
	this.login = login;
	this.app_id = "nts-rest-api";
}

function login(loginUrl, user, password, callback) {
	var base64Credentials = btoa(user + ":" + password);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', loginUrl, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.setRequestHeader("Authorization", "Basic " + base64Credentials);
	xhr.setRequestHeader('nts-application', this.app_id);
	xhr.addEventListener('load', function(response) {
		console.log(response);
		if (response) {
			if (callback)
				callback("OK")
		} else {
			if (callback)
				callback("ERROR");
		}
	});
	xhr.send("{}");
}