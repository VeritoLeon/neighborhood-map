var Location = function(title, description, latitude, longitude, icon) {
	var self = this;
	self.title = ko.observable(title);
	self.content = '<h2 class="info-title">' + title + '</h2>'
					+ '<p class="info-description">' + description + '</p>';
	self.latitude = ko.observable(latitude);
	self.longitude = ko.observable(longitude);
	self.icon = ko.observable(icon);
	self.marker = new google.maps.Marker({ 
		position: new google.maps.LatLng(self.latitude(), self.longitude()), 
		map: map ,
		icon: self.icon()
	});
	self.infoWindow = function() {
			infowindow.setContent(self.content);
		  	infowindow.open(map, self.marker);
		  	$('#placeslist-switcher').attr('checked', false);
	}
	google.maps.event.addListener(self.marker, 'click', self.infoWindow);
};

var ViewModel = function() {
	var self = this;
	self.locations = ko.observableArray(
		[
			new Location('Kiawa', 'University\'s restaurant', 27.493560, -109.972613, 'img/cafetaria.png')
			,new Location('Lockers', 'Sports restaurant and bar (Trying the "Michael Phelps" pizza is a must)', 27.493921, -109.974107, 'img/pizzaria.png')
			,new Location('Comedor ITSON', 'University\'s restaurant', 27.491831, -109.970547, 'img/cafetaria.png')
			,new Location('Cafeteria ITSON', 'University\'s restaurant', 27.492045, -109.969547, 'img/cafetaria.png')
			,new Location('Doña Magui', 'Homemade food', 27.490330, -109.972750, 'img/restaurant.png')
		]
	);

	self.openInfoWindow = function(obj) {
		obj.infoWindow();
	};
};

var map, infowindow;
function initialize() {
	$('#map-canvas').removeClass('center');
	var mapOptions = {
		center: { lat: 27.4950000, lng: -109.969000},
		zoom: 15,
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

	ko.applyBindings(new ViewModel());

	$('.placeslist.fixed').removeClass('hidden');
}

try {
	google.maps.event.addDomListener(window, 'load', initialize);
} catch (e) {
  console.log('Google map wasn\'t loaded');
}
