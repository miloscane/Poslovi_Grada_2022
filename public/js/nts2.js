function NTSApi(url){
	
	this.baseUrl = url+"/ntsapi";
	this.allvehicles = allvehicles;
	this.vehiclesstate = vehiclesstate; 
	this.history = history; 
	this.stops = stops; 
	this.iodata = iodata; 
	this.sensordata = sensordata; 
	this.vehiclesensors = vehiclesensors;
	
}

function allvehicles(callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', this.baseUrl+"/allvehicles", true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.setRequestHeader('Access-Control-Allow-Credentials', true);
	xhr.setRequestHeader('Access-Control-Allow-Origin', this.baseUrl);
	xhr.withCredentials = true;
	xhr.setRequestHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	xhr.addEventListener('load', function() {
		console.log(this.response);
		var responseObject = this.response;
		if (responseObject) {
			if (callback)
				callback(responseObject);
		} else {
			if (callback) 
				callback("ERROR");
		}
	});
	xhr.send("{}");
}
function vehicle(integrationcode, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', this.baseUrl+"/vehicle?integrationcode="+integrationcode, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.addEventListener('load', function() {
		console.log(this.response);
		var responseObject = this.response;
		if (responseObject) {
			if (callback)
				callback(responseObject);
		} else {
			if (callback) 
				callback("ERROR");
		}
	});
	xhr.send("{}");
}
function allvehiclestate(callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', this.baseUrl+"/allvehiclestate", true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.addEventListener('load', function() {
		console.log(this.response);
		var responseObject = this.response;
		if (responseObject) {
			if (callback)
				callback(responseObject);
		} else {
			if (callback) 
				callback("ERROR");
		}
	});
	xhr.send("{}");
}
function vehiclesstate(vehicleid, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', this.baseUrl+"/vehiclestate?vehicle="+vehicleid, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.addEventListener('load', function() {
		console.log(this.response);
		var responseObject = this.response;
		if (responseObject) {
			if (callback)
				callback(responseObject);
		} else {
			if (callback)
				callback("ERROR");
		}
	});
	xhr.send("{}");
}


function history(vehicleid, from, to, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', this.baseUrl+"/vehiclestate?vehicle="+vehicleid+"&from="+from+"&to="+to, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.addEventListener('load', function() {
		console.log(this.response);
		var responseObject = this.response;
		if (responseObject) {
			if (callback)
				callback(responseObject);
		} else {
			if (callback)
				callback("ERROR");
		}
	});
	xhr.send("{}");
}

function stops(vehicleid, from, to, callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', this.baseUrl+"/stops?vehicle="+vehicleid+"&from="+from+"&to="+to, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.addEventListener('load', function() {
		console.log(this.response);
		var responseObject = this.response;
		if (responseObject) {
			if (callback)
				callback(responseObject);
		} else {
			if (callback)
				callback("ERROR");
		}
	});
	xhr.send("{}");
}	
 
	function iodata(vehicleid, from, to, callback){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.baseUrl+"/iodata?vehicle="+vehicleid+"&from="+from+"&to="+to, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.addEventListener('load', function() {
			console.log(this.response);
			var responseObject = this.response;
			if (responseObject) {
				if (callback)
					callback(responseObject);
			} else {
				if (callback)
					callback("ERROR");
			}
		});
		xhr.send("{}");
	}
	function sensordata(vehicleid, from, to, callback){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.baseUrl+"/sensordata?vehicle="+vehicleid+"&from="+from+"&to="+to, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.addEventListener('load', function() {
			console.log(this.response);
			var responseObject = this.response;
			if (responseObject) {
				if (callback)
					callback(responseObject);
			} else {
				if (callback)
					callback("ERROR");
			}
		});
		xhr.send("{}");
	}

	function vehiclesensors(vehicleid, callback){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.baseUrl+"/vehiclesensors?vehicle="+vehicleid, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.addEventListener('load', function() {
			console.log(this.response);
			var responseObject = this.response;
			if (responseObject) {
				if (callback)
					callback(responseObject);
			} else {
				if (callback)
					callback("ERROR");
			}
		});
		xhr.send("{}");
	}
	function tachodata(vehicleid, from, to, callback){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.baseUrl+"/tachodata?vehicle="+vehicleid+"&from="+from+"&to="+to, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.addEventListener('load', function() {
			console.log(this.response);
			var responseObject = this.response;
			if (responseObject) {
				if (callback)
					callback(responseObject);
			} else {
				if (callback)
					callback("ERROR");
			}
		});
		xhr.send("{}");
	}
	function drivers(active, callback){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.baseUrl+"/drivers?active="+active, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.addEventListener('load', function() {
			console.log(this.response);
			var responseObject = this.response;
			if (responseObject) {
				if (callback)
					callback(responseObject);
			} else {
				if (callback)
					callback("ERROR");
			}
		});
		xhr.send("{}");
	}
	function driver(integrationCode, callback){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.baseUrl+"/driver?integrationcode="+integrationCode, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.addEventListener('load', function() {
			console.log(this.response);
			var responseObject = this.response;
			if (responseObject) {
				if (callback)
					callback(responseObject);
			} else {
				if (callback)
					callback("ERROR");
			}
		});
		xhr.send("{}");
	}