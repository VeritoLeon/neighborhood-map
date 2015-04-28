var map, infowindow, initialLocations, viewModel, detailsViewModel, pin, type;

// the loadScript function is the first thing we want to execute
// as soon as the window is ready.
window.onload = loadScript;

/**
 * Adds the google maps API script to the DOM and loads it.
 * If sucessful, it callbacks the initialize function.
 */
function loadScript() {
	var script = document.createElement('script'),
	callbackFunctionName = 'initialize';
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
		'&signed_in=false&callback=' + callbackFunctionName;
	script.onerror = function(event) {
		if (navigator.onLine) {
			createErrorMessage('We\'re having trouble reaching Google maps. Maybe a firewall is blocking them.', 'www.maps.googleapis.com');
		} else {
			createErrorMessage('You seem to be offline. Check your internet connection and reload the page.');
		}
	}
	
	document.body.appendChild(script);
}

/**
 * Initializes objects, makes elements needed by the app visible
 * and creates map, map components and view model.
 */
function initialize() {
	/**
	 * Will specify how we want to customize our map
	 * @type google.maps.MapOptions
	 */
	var mapOptions = {
		center: { lat: 27.4950000, lng: -109.969000},
		zoom: 16,
		panControl: false,
		streetViewControl: false,
		zoomControl: false,
		styles: [
			// Hides the default clickable location icons on the map.
			{
				elementType: 'labels.icon',
				stylers: [
					{ visibility: 'off' }
				]
			}
		]
	};
	
	/**
	 * This sets is the appearance of our markers to a custom pin
	 * @type google.maps.Symbol
	 */
	pin = {
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

	/**
	 * This will tell us what kind of location we're dealing with
	 * and give us the assets of that group
	 * @type Object
	 */
	type = {
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

	// Here we restyle our application to accomodate to how it'll look
	// once we add the map
	var mapCanvas = document.getElementById('map-canvas');
	var topbar = document.getElementById('topbar');
	topbar.removeClassName('hidden');
	var placeslist = document.getElementsByClassName('placeslist')[0];
	placeslist.removeClassName('hidden');

	// We create a map in the given DOM element, with the given settings.
	// We also create the element that will display our locations information.
	map = new google.maps.Map(mapCanvas, mapOptions);
	infowindow = new google.maps.InfoWindow();

	// All the locations that will be put in the map
	initialLocations  = [
		new Location('Lockers', 'Sports restaurant and bar (Trying the "Michael Phelps" pizza is a must)', 27.493913, -109.974022, type.food)
		,new Location('Kiawa', 'University\'s restaurant', 27.493560, -109.972613, type.food)
		,new Location('Doña Magui', 'Homemade food', 27.490329, -109.972748, type.food)
		,new Location('Comedor ITSON', 'University\'s restaurant', 27.491831, -109.970547, type.food)
		,new Location('Cafeteria ITSON', 'University\'s restaurant', 27.492045, -109.969547, type.food)
		// ,new Location('Gusto Frio Mr. Brown', 'Ice cream shop', 27.492788, -109.961114, type.food)
		,new Location('Laguna del Nainari', '', 27.497699, -109.969851, type.nature)
		,new Location('Parque infantil Ostimuri', '', 27.493909, -109.966797, type.recreation)
		,new Location('Tomas Oroz Gaytan Stadium', 'Baseball stadium', 27.492747, -109.954472, type.recreation)
	];

	// And we bind to our view model
	viewModel = new ViewModel();
	ko.applyBindings(viewModel);
	// This triggers the 'search' function each time 'query' changes
	viewModel.query.subscribe(viewModel.search);
}

/**
 * Represents a place we want to show in our map
 * @param String title       Name of the location
 * @param String description Short description
 * @param number latitude    Latitude is specified in degrees within the range [-90, 90]
 * @param number longitude   Longitude is specified in degrees within the range [-180, 180]
 * @param type   kind        Location's category. Set in the form type.[category]
 */
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

	// When the location's marker is clicked, trigger openInfoWindow
	google.maps.event.addListener(self.marker,'click', function() {
		parent.viewModel.openInfoWindow(self);
	});
};

/**
 * Controls the behavior and logic of our view
 */
var ViewModel = function() {
	var self = this;
	self.query = ko.observable(''); // text input in the search box
	self.queryResultsShown = ko.observable(false), // whether the locations list should be displayed
	self.locations = ko.observableArray(initialLocations.slice()); // filtered locations
	self.currentLocation = ko.observable(self.locations()[0]);
	self.filter = ko.observable(''); // what filter is active
	self.showDetails = ko.observable(false); // whether the current location's details should be displayed
	self.activeDetails = ko.observable('info'); // active details tab (in small screens)
	
	/**
	 * Toogles queryResultsShown
	 */
	self.showResults = function() {
		self.queryResultsShown(true);
	};

	/**
	 * Sets the given location as the current location
	 * @param Location obj currentLocation
	 */
	self.setCurrentLocation = function(obj) {
		if (obj = self.getLocation(obj.title())) {
			obj != self.currentLocation()? self.currentLocation().marker.setAnimation(null) : self.currentLocation();
			
			obj.marker.setAnimation(google.maps.Animation.BOUNCE);
			map.panTo(obj.marker.getPosition());
			return self.currentLocation(obj); 
		}
	};

	/**
	 * Returns the location with the given title
	 * @param  String title   location's title
	 * @return Location       location matching the title
	 */
	self.getLocation = function(title) {
		for (var loc in self.locations()) {
			if (self.locations()[loc].title() === title) {
				return self.locations()[loc]; 
			}
		}
	};

	// These functions display only the locations on the list and map
	// that match the filter
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

	self.showLocationsByKind = function(kind) {
		self.filter(kind);
		self.search(self.query());
	};


	// These computed variables add the 'active' class to each filter if active
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

	// Adds the 'hidden' class if showDetails is changed
	self.hideDetails = ko.pureComputed(function() {
		return self.showDetails() ? '' : 'hidden';
	}, self);

	// These functions recognize details tabs as active
	self.setActiveInfo = function() {
		return self.setActiveDetails('info');
	};

	self.setActiveComments = function() {
		return self.setActiveDetails('comments');
	};

	self.setActiveTweets = function() {
		return self.setActiveDetails('tweets');
	};

	self.setActivePhotos = function() {
		return self.setActiveDetails('photos');
	};

	self.setActiveDetails = function(detailsTitle) {
		self.activeDetails(detailsTitle);
	};

	// These computed variables add the 'active' class to each tab if active
	self.isActiveInfo = ko.pureComputed(function() {
		return self.areDetailsActive('info');
	}, self);

	self.isActiveComments = ko.pureComputed(function() {
		return self.areDetailsActive('comments');
	}, self);

	self.isActiveTweets = ko.pureComputed(function() {
		return self.areDetailsActive('tweets');
	}, self);

	self.isActivePhotos = ko.pureComputed(function() {
		return self.areDetailsActive('photos');
	}, self);
	self.areDetailsActive = function(expected) {
		return self.activeDetails() === expected ? 'active' : '';
	};


	/**
	 * Opens the info window in the given location's marker
	 * and sets it as the current location.
	 * @param  Location location
	 */
	self.openInfoWindow = function(location) {
		var content = '<div tabindex="1" href="#"><h2 class="info-title">' + location.title() + '</h2>'
					+ '<p class="info-description">' + location.description() + '</p></div>';
		infowindow.setContent(content);
		infowindow.open(map, location.marker);
		self.setCurrentLocation(location);
		var listSwitcher = document.getElementById('placeslist-switcher');
		listSwitcher.checked = false;
		self.queryResultsShown(false);
		self.showDetails(true);
	};

	/**
	 * Filters the locations to the ones whose title contains the value
	 * @param  String value Text to find in the title
	 */
	self.search = function(value) {
		self.hideAllMarkers();
		self.locations.removeAll();
		var locs = [];
		for (var x in parent.initialLocations) {
			var currentLocation = parent.initialLocations[x];
			if (valueMatches(value, currentLocation.title()) &&
				(currentLocation.kind() === self.filter() || !self.filter())) {
				self.showMarker(currentLocation);
				locs.push(currentLocation);
			}
		}
		self.locations(locs);
	};

	/**
	 * Selects the first location of the locations array
	 */
	self.selectMarker = function() {
		if (self.locations().length) {
			self.openInfoWindow(self.locations()[0]);
			self.query('');
		}
	};

	/**
	 * Hides all the markers from the map
	 */
	self.hideAllMarkers = function() {
		var locs = self.locations();
		for (var x in self.locations()) {
			locs[x].marker.setMap(null);
		}
	};

	/**
	 * Adds the location's marker to the map
	 * @param  Location location
	 */
	self.showMarker = function(location) {
		location.marker.setMap(map);
	};

	// Sets the info window's marker as the current location when opened
	google.maps.event.addListener(parent.infowindow, 'domready', function(e) {
		var location = self.getLocation(parent.infowindow.getAnchor().title);
		if (location) {
			self.setCurrentLocation(location);
		}
	});

	// Stops the maker's bouncing when the information window is closed
	google.maps.event.addListener(parent.infowindow, 'closeclick', function(e) {
		self.currentLocation().marker.setAnimation(null);
		self.showDetails(false);
	});
};

//
//  HELPERS
//  

/**
 * Creates a sticky warning message
 * @param  String message   What the error message is going to say
 * @param  String serverUrl Url to check if it is down
 */
function createErrorMessage(message, serverUrl) {
	var newDiv = document.createElement('div'); 
	var newContent = document.createTextNode(message + ' '); 
	var downForEveryone = document.createElement('a'); 
	downForEveryone.setAttribute('href', 'http://www.isup.me/' + serverUrl);
	var linkText = document.createTextNode('Maybe their servers are down?'); 
	newDiv.appendChild(newContent);
	if (serverUrl) {
		downForEveryone.appendChild(linkText);
	}
	newDiv.appendChild(downForEveryone);
	newDiv.className = 'alert-box warning';
	newDiv.setAttribute('data-alert', '');
	// add the newly created element and its content into the DOM 
	var messagesDiv = document.getElementById('messages'); 
	messagesDiv.appendChild(newDiv);
}

/**
 * Escapes the gives string to be treated as a literal string
 * (got from Lea Verou's awesomplete)
 * @param  String s
 * @return String   literal string
 */
function regExpEscape(s) {
	return s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Checks if inputItem is contained in testItem
 * @param  String inputItem  the string to test
 * @param  String testItem   string to test against
 * @return Boolean           if one is contained in the other
 */
function valueMatches(inputItem, testItem) {
	var CASE_INSENSITIVE_MATCHING = 'i';
	return RegExp(regExpEscape(inputItem.trim()), CASE_INSENSITIVE_MATCHING).test(testItem);
}

/**
 * Remove a class from an element
 * @param  String name class's name
 */
Element.prototype.removeClassName = function(name) {
	if (this.hasClassName(name)) {
		var c = this.className;
		this.className = c.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
	}
};

/**
 * Returns whether the element has the given class
 * @param  String  name class's name
 * @return Boolean      true if the element has that class
 */
Element.prototype.hasClassName = function(name) {
	return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(this.className);
};