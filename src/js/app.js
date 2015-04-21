var pin = {
	// Get this from pin-red-10-small.svg
	path: 'm5.7173 24.562c-6.148-10.931-6.5821-15.691-1.8615-20.412 4.3413-4.3413 10.181-4.3413 14.522 0 4.7683 4.7683 4.3293 9.6487-1.8444 20.501-2.7042 4.7537-5.1417 8.6382-5.4167 8.6322s-2.7048-3.9309-5.3995-8.722zm9.1995-9.4112c1.5469-1.5469 1.5469-6.0531 0-7.6s-6.0531-1.5469-7.6 0-1.5469 6.0531 0 7.6 6.0531 1.5469 7.6 0z',
	fillOpacity: 1,
	strokeWeight: 1,
	strokeColor: '#fff',
	scale: 1.25,
	origin: new google.maps.Point(0,0),
	anchor: new google.maps.Point(10, 33),
	setColor: function(color) {
		var newPin = Object.create(pin);
		newPin.fillColor = color;
		return newPin;
	}
};

var type = {
	'food': {
		'icon': 'img/food.svg'
		,'marker': pin.setColor('#dd4229')
	}
	,'entertainment': {
		'marker': pin.setColor('#3aa0ef')
	}
	,'nature': {
		'marker': pin.setColor('#20be8c')
	}
	, 'recreation': {
		'marker': pin.setColor('#f352a5')
	}
};

var Location = function(title, description, latitude, longitude, kind) {
	var self = this;
	self.title = ko.observable(title);
	self.description = ko.observable(description);
	self.latitude = ko.observable(latitude);
	self.longitude = ko.observable(longitude);
	self.kind = ko.observable(kind);
	self.icon = ko.observable(kind.icon);
	self.marker = new google.maps.Marker({ 
		position: new google.maps.LatLng(self.latitude(), self.longitude()), 
		map: map,
		icon: kind.marker,
		animation: google.maps.Animation.DROP,
		title: self.title()
	});
	google.maps.event.addListener(self.marker,'click', function() {
		parent.viewModel.openInfoWindow(self);
	});
};

var ViewModel = function() {
	initialLocations  = [
		new Location('Lockers', 'Sports restaurant and bar (Trying the "Michael Phelps" pizza is a must)', 27.493913, -109.974022, type.food)
		,new Location('Kiawa', 'University\'s restaurant', 27.493560, -109.972613, type.food)
		,new Location('Doña Magui', 'Homemade food', 27.490330, -109.972750, type.food)
		,new Location('Comedor ITSON', 'University\'s restaurant', 27.491831, -109.970547, type.food)
		,new Location('Cafeteria ITSON', 'University\'s restaurant', 27.492045, -109.969547, type.food)
		// ,new Location('Gusto Frio Mr. Brown', 'Ice cream shop', 27.492788, -109.961114, type.food)
		,new Location('Laguna del Nainari', '', 27.497699, -109.969851, type.nature)
		,new Location('Parque infantil Ostimuri', '', 27.493909, -109.966797, type.recreation)
		,new Location('Tomas Oroz Gaytan Stadium', 'Baseball stadium', 27.492747, -109.954472, type.recreation)
	];

	var self = this;
	self.query = ko.observable('');
	self.queryResultsShown = ko.observable(false),
	self.locations = ko.observableArray(initialLocations.slice());
	self.currentLocation = ko.observable(self.locations()[0]);
	self.currentAnchor = ko.observable(parent.infowindow.getAnchor());
	self.filter = ko.observable('');
	
	self.showResults = function() {
		self.queryResultsShown(true);
	};


	self.setCurrentLocation = function(obj) {
		if(obj = self.getLocation(obj.title())) {
			obj != self.currentLocation()? self.currentLocation().marker.setAnimation(null) : self.currentLocation();
			
			obj.marker.setAnimation(google.maps.Animation.BOUNCE);
			map.panTo(obj.marker.getPosition());
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

	self.showLocationsByKind = function(kind) {
		self.filter(kind);
		self.search(self.query());
	};

	self.showAllLocations = function() {
		self.showLocationsByKind('');
	};

	self.showFoodLocations = function() {
		self.showLocationsByKind(type.food);
	};

	self.showRecreationLocations = function() {
		self.showLocationsByKind(type.recreation);
	};

	self.showOutdoorsLocations = function() {
		self.showLocationsByKind(type.nature);
	};

	self.isFilterAll = ko.pureComputed(function() {
		return self.isFilterActive('');
	}, self);

	self.isFilterFood = ko.pureComputed(function() {
        return self.isFilterActive(type.food);
    }, self);

	self.isFilterRecreation = ko.pureComputed(function() {
		return self.isFilterActive(type.recreation);
	}, self);

	self.isFilterOutdoors = ko.pureComputed(function() {
		return self.isFilterActive(type.nature);
	}, self);

	self.isFilterActive = function(expectedFilter) {
		return self.filter() === expectedFilter ? 'active' : '';
	};

	self.openInfoWindow = function(location) {
		var content = '<div tabindex="1" href="#"><h2 class="info-title">' + location.title() + '</h2>'
					+ '<p class="info-description">' + location.description() + '</p></div>';
		infowindow.setContent(content);
		infowindow.open(map, location.marker);
		self.setCurrentLocation(location);
		var listSwitcher = document.getElementById('placeslist-switcher');
		listSwitcher.checked = false;
		self.queryResultsShown(false);
	};

	self.search = function(value) {
		self.hideAllMarkers();
		self.locations.removeAll();
		var locs = [];
		for(var x in parent.initialLocations) {
			var currentLocation = parent.initialLocations[x];
			if(valueMatches(value, currentLocation.title()) &&
				(currentLocation.kind() === self.filter() || !self.filter())) {
				self.showMarker(currentLocation);
				locs.push(currentLocation);
			}
		}
		self.locations(locs);
	};

	self.selectMarker = function() {
		if(self.locations().length) {
			self.openInfoWindow(self.locations()[0]);
			self.query('');
		}
	};

	self.hideAllMarkers = function() {
		var locs = self.locations();
		for(var x in self.locations()) {
			locs[x].marker.setMap(null);
		}
	};

	self.showMarker = function(location) {
		location.marker.setMap(map);
	};

	google.maps.event.addListener(parent.infowindow, 'domready', function(e) {
		var location = self.getLocation(parent.infowindow.getAnchor().title);
		if(location) {
			self.setCurrentLocation(location);
		}
	});

	google.maps.event.addListener(parent.infowindow, 'closeclick', function(e) {
		self.currentLocation().marker.setAnimation(null);
	});
};

var map, infowindow, initialLocations, viewModel;

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
		},
		styles: [
			{
				"elementType": "labels.icon",
				"stylers": [
					{ "visibility": "off" }
				]
			}
		]
	};
	

	var mapCanvas = document.getElementById('map-canvas');
	mapCanvas.removeClassName('center');
	var topbar = document.getElementById('topbar');
	topbar.removeClassName('hidden');
	var placeslist = document.getElementsByClassName('placeslist')[0];
	placeslist.removeClassName('hidden');
	map = new google.maps.Map(mapCanvas, mapOptions);
	infowindow = new google.maps.InfoWindow();
	viewModel = new ViewModel();
	ko.applyBindings(viewModel);
	viewModel.query.subscribe(viewModel.search);
}


try {
	google.maps.event.addDomListener(window, 'load', initialize);
} catch (e) {
	createErrorMessage('Oops. Google maps couldn\'t be reached. Verify your internet connection.', 'maps.google.com');
}

createErrorMessage = function(message, serverUrl) {
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
};

// Helper got from Lea Verou's awesomplete
regExpEscape = function (s) {
	return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
};

valueMatches = function (inputItem, testItem) {
	var CASE_INSENSITIVE_MATCHING = 'i';
	return RegExp(regExpEscape(inputItem.trim()), CASE_INSENSITIVE_MATCHING).test(testItem);
};

Element.prototype.removeClassName = function(name) {
	if (this.hasClassName(name)) {
		var c = this.className;
		this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
	}
};

Element.prototype.hasClassName = function(name) {
	return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
};
