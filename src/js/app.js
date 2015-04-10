var type = {
	'food': {
		'icon': 'img/food.svg'
		,'marker': 'img/pin-red-10-small.svg'
	}
};

var Location = function(title, description, latitude, longitude, kind) {
	var self = this;
	self.title = ko.observable(title);
	self.content = '<div tabindex="1" href="#"><h2 class="info-title">' + title + '</h2>'
					+ '<p class="info-description">' + description + '</p></div>';
	self.description = ko.observable(description);
	self.latitude = ko.observable(latitude);
	self.longitude = ko.observable(longitude);
	self.icon = ko.observable(kind.icon);
	// self.iconMarker = new google.maps.Marker({ 
	// 	position: new google.maps.LatLng(self.latitude(), self.longitude()), 
	// 	map: map ,
	// 	icon: kind.icon,
	// 	animation: google.maps.Animation.DROP,
	// 	title: self.title()
	// });
	self.marker = new google.maps.Marker({ 
		position: new google.maps.LatLng(self.latitude(), self.longitude()), 
		map: map ,
		icon: kind.marker,
		animation: google.maps.Animation.DROP,
		title: self.title()
	});

	self.infoWindow = function() {
			infowindow.setContent(self.content);
		  	infowindow.open(map, self.marker);
	};

	self.toggleBounce = function() {
		if (self.marker.getAnimation() != null) {
			self.marker.setAnimation(null);
		} else {
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	};

	google.maps.event.addListener(self.marker, 'click', self.infoWindow);

};

var ViewModel = function() {
	var self = this;

	self.locations = ko.observableArray(
		[
			new Location('Lockers', 'Sports restaurant and bar (Trying the "Michael Phelps" pizza is a must)', 27.493921, -109.974107, type.food)
			,new Location('Kiawa', 'University\'s restaurant', 27.493560, -109.972613, type.food)
			,new Location('Doña Magui', 'Homemade food', 27.490330, -109.972750, type.food)
			,new Location('Comedor ITSON', 'University\'s restaurant', 27.491831, -109.970547, type.food)
			,new Location('Cafeteria ITSON', 'University\'s restaurant', 27.492045, -109.969547, type.food)
		]
	);

	self.currentLocation = ko.observable(self.locations()[0]);

	self.setCurrentLocation = function(obj) {
		if(obj = self.getLocation(obj.title())) {
			obj != self.currentLocation()? self.currentLocation().marker.setAnimation(null) : self.currentLocation();
			
			obj.marker.setAnimation(google.maps.Animation.BOUNCE);
			return self.currentLocation(obj); 
		}
	}

	self.getLocation = function(title) {
		for(var loc in self.locations()) {
			if(self.locations()[loc].title() === title) {
				return self.locations()[loc]; 
			}
		}
	}

	self.openInfoWindow = function(location) {
		var content = '<div tabindex="1" href="#"><h2 class="info-title">' + location.title() + '</h2>'
					+ '<p class="info-description">' + location.description() + '</p></div>';
		infowindow.setContent(content);
	  	infowindow.open(map, location.marker);
		self.setCurrentLocation(location);
		$('#placeslist-switcher').attr('checked', false);
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
	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);
	infowindow = new google.maps.InfoWindow();
	


	$('#map-canvas').removeClass('center');
	$('.placeslist.fixed').removeClass('hidden');
	$('#topbar').removeClass('hidden');

	
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
