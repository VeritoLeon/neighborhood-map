var Map = function() {};

var ViewModel = function() {};

function initialize() {
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
	var map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);
}

try {
	google.maps.event.addDomListener(window, 'load', initialize);
} catch (e) {
  console.log('Google map wasn\'t loaded');
}
