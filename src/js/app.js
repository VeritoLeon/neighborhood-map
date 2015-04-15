var pin = {
	// Get this from pin-red-10-small.svg
	path: 'm5.7173 24.562c-6.148-10.931-6.5821-15.691-1.8615-20.412 4.3413-4.3413 10.181-4.3413 14.522 0 4.7683 4.7683 4.3293 9.6487-1.8444 20.501-2.7042 4.7537-5.1417 8.6382-5.4167 8.6322s-2.7048-3.9309-5.3995-8.722zm9.1995-9.4112c1.5469-1.5469 1.5469-6.0531 0-7.6s-6.0531-1.5469-7.6 0-1.5469 6.0531 0 7.6 6.0531 1.5469 7.6 0z',
	fillOpacity: 1,
	strokeWeight: 1,
	strokeColor: '#fff',
	scale: 1.25,
	origin: new google.maps.Point(0,0),
	anchor: new google.maps.Point(10, 33),
	getInColor: function(color) {
		var newPin = Object.create(this);
		newPin.fillColor = color;
		return newPin;
	}
};

var iconography = {
	'food': {
		path: 'M 12.706506,-4.5017285 A 15.519705,15.511235 0 0 0 -2.8130255,11.00999 15.519705,15.511235 0 0 0 12.706506,26.521709 15.519705,15.511235 0 0 0 28.226036,11.00999 15.519705,15.511235 0 0 0 12.706506,-4.5017285 Z m 9.880859,4.49999997 0.910156,0.265625 -1.527344,5.22851563 1.46875,0 -1.939453,15.1542969 -6.490234,0 -1.908204,-15.1542969 7.929688,0 1.556641,-5.49414063 z M 3.6713495,12.099833 l 5.375,0 c 2.2319095,0.117131 3.2698315,0.861602 3.1132815,2.232422 l -11.63085959,0 c -0.13684,-1.37082 0.91064809,-2.115292 3.14257809,-2.232422 z m -2.67187499,3.291016 10.66210849,0 c 0.274271,1e-5 0.507405,0.09727 0.703125,0.292969 0.195651,0.19571 0.294912,0.421221 0.294923,0.675781 -1.1e-5,0.29401 -0.09923,0.53291 -0.294923,0.71875 -0.19572,0.18587 -0.428854,0.279297 -0.703125,0.279297 l -10.66210849,0 c -0.27369,0 -0.5090781,-0.09345 -0.7050781,-0.279297 -0.196,-0.18584 -0.29493190244,-0.42474 -0.29492190244,-0.71875 -1e-5,-0.25456 0.0989119024,-0.480071 0.29492190244,-0.675781 0.196,-0.19566 0.4313881,-0.292959 0.7050781,-0.292969 z m -0.4707031,3.054688 11.63085959,0 c 0.15655,1.37023 -0.881372,2.103172 -3.1132815,2.201172 l -5.375,0 c -2.23193,-0.098 -3.27941809,-0.830942 -3.14257809,-2.201172 z',
		fillOpacity: 1,
		strokeWeight: 0,
		scale: 1.25,
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(15, 15),
		getInColor: function(color) {
			var newPin = Object.create(this);
			newPin.fillColor = color;
			return newPin;
		}
	}
	,'entertainment': {
		'marker': pin.getInColor('#3aa0ef')
		,'icon': 'img/food.svg'
	}
	,'nature': {
		'marker': pin.getInColor('#20be8c')
		,'icon': 'img/food.svg'
	}
	, 'recreation': {
		'marker': pin.getInColor('#f352a5')
		,'icon': 'img/food.svg'
	}
};

var type = {
	'food': {
		'icon': iconography.food.getInColor('#dd4229')
		,'marker': pin.getInColor('#dd4229')
	}
	,'entertainment': {
		'marker': pin.getInColor('#3aa0ef')
		,'icon': 'img/food.svg'
	}
	,'nature': {
		'marker': pin.getInColor('#20be8c')
		,'icon': 'img/food.svg'
	}
	, 'recreation': {
		'marker': pin.getInColor('#f352a5')
		,'icon': 'img/food.svg'
	}
};

var Location = function(title, description, latitude, longitude, kind) {
	var self = this;
	self.title = ko.observable(title);
	self.description = ko.observable(description);
	self.latitude = ko.observable(latitude);
	self.longitude = ko.observable(longitude);
	self.icon  = new google.maps.Marker({ 
		position: new google.maps.LatLng(self.latitude(), self.longitude()), 
		map: map ,
		icon: kind.icon,
		title: self.title()
	});
	self.marker = new google.maps.Marker({ 
		position: new google.maps.LatLng(self.latitude(), self.longitude()), 
		map: map ,
		icon: kind.marker,
		animation: google.maps.Animation.DROP,
		title: self.title()
	});
};

var ViewModel = function() {
	var self = this;

	self.locations = ko.observableArray(
		[
			new Location('Lockers', 'Sports restaurant and bar (Trying the "Michael Phelps" pizza is a must)', 27.493913, -109.974022, type.food)
			,new Location('Kiawa', 'University\'s restaurant', 27.493560, -109.972613, type.food)
			,new Location('Doña Magui', 'Homemade food', 27.490330, -109.972750, type.food)
			,new Location('Comedor ITSON', 'University\'s restaurant', 27.491831, -109.970547, type.food)
			,new Location('Cafeteria ITSON', 'University\'s restaurant', 27.492045, -109.969547, type.food)
			// ,new Location('Gusto Frio Mr. Brown', 'Ice cream shop', 27.492788, -109.961114, type.food)
			,new Location('Laguna del Nainari', '', 27.497699, -109.969851, type.nature)
			,new Location('Parque infantil', '', 27.493909, -109.966797, type.recreation)
			,new Location('Tomás Oroz Gaytán Stadium', 'Baseball stadium', 27.492747, -109.954472, type.recreation)
		]
	);
	
	for(var loc in self.locations()) {
		google.maps.event.addListener(self.locations()[loc].icon,'click', (function(_loc) {
			return function() {
				self.openInfoWindow(self.locations()[_loc]);
			};
		})(loc));
	};

	self.currentLocation = ko.observable(self.locations()[0]);

	self.setCurrentLocation = function(obj) {
		if(obj = self.getLocation(obj.title())) {
			obj != self.currentLocation()? self.currentLocation().marker.setAnimation(null) : self.currentLocation();
			
			obj.marker.setAnimation(google.maps.Animation.BOUNCE);
			return self.currentLocation(obj); 
		}
	};

	self.getLocation = function(title) {
		for(var loc in self.locations()) {
			if(self.locations()[loc].title() === title) {
				return self.locations()[loc]; 
			}
		}
	};

	self.openInfoWindow = function(location) {
		var content = '<div tabindex="1" href="#"><h2 class="info-title">' + location.title() + '</h2>'
					+ '<p class="info-description">' + location.description() + '</p></div>';
		infowindow.setContent(content);
		infowindow.open(map, location.marker);
		self.setCurrentLocation(location);
		var listSwitcher = document.getElementById('placeslist-switcher');
		listSwitcher.checked = false;
	};

	var currentAnchor = ko.observable(parent.infowindow.getAnchor());

	google.maps.event.addListener(parent.infowindow, 'domready', function(e) {
		var location = self.getLocation(parent.infowindow.getAnchor().title);
		if(location) {
			self.setCurrentLocation(location);
			map.panTo(self.currentLocation().marker.getPosition());
		}
	});

	google.maps.event.addListener(parent.infowindow, 'closeclick', function(e) {
		self.currentLocation().marker.setAnimation(null);
	});
};

var map, infowindow;

function initialize() {
	var mapOptions = {
		center: { lat: 27.4950000, lng: -109.969000},
		zoom: 16,
		panControl: false,
		streetViewControl: false,
		zoomControl: false,
		overviewMapControl: false,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
			mapTypeIds: [
				google.maps.MapTypeId.ROADMAP,
				google.maps.MapTypeId.TERRAIN
				]
			}
	};
	

	var mapCanvas = document.getElementById('map-canvas');
	mapCanvas.removeClassName('center');
	var topbar = document.getElementById('topbar');
	topbar.removeClassName('hidden');
	var placeslist = document.getElementsByClassName('placeslist')[0];
	placeslist.removeClassName('hidden');
	map = new google.maps.Map(mapCanvas, mapOptions);
	infowindow = new google.maps.InfoWindow();
	
	ko.applyBindings(new ViewModel());
	
}

try {
	google.maps.event.addDomListener(window, 'load', initialize);
} catch (e) {
	createErrorMessage('Oops. Google maps couldn\'t be reached. Verify your internet connection.', 'maps.google.com');
}

function createErrorMessage(message, serverUrl) {
	var newDiv = document.createElement('div'); 
	var newContent = document.createTextNode(message + ' '); 
	var downForEveryone = document.createElement('a'); 
	downForEveryone.setAttribute('href', 'http://www.isup.me/' + serverUrl);
	var linkText = document.createTextNode('Maybe the servers are down?'); 
	newDiv.appendChild(newContent);
	downForEveryone.appendChild(linkText);
	newDiv.appendChild(downForEveryone);
	newDiv.className = 'alert-box warning';
	// add the newly created element and its content into the DOM 
	var messagesDiv = document.getElementById('messages'); 
	messagesDiv.appendChild(newDiv);
}

Element.prototype.removeClassName = function(name) {
	if (this.hasClassName(name)) {
		var c = this.className;
		this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
	}
};

Element.prototype.hasClassName = function(name) {
	return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};