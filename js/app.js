var map, infowindow, initialLocations, viewModel, detailsViewModel, pin, type;

// the loadGoogleMapsScript function is the first thing we want to execute
// as soon as the window is ready.
window.onload = loadGoogleMapsScript;

/**
 * Adds the google maps API script to the DOM and loads it.
 * If sucessful, it callbacks the initialize function.
 */
 function loadGoogleMapsScript() {
    function onErrorCallback(event) {
        if (navigator.onLine) {
            createErrorMessage('We\'re having trouble reaching Google maps. Maybe a firewall is blocking it.', 'www.maps.googleapis.com');
        } else {
            createErrorMessage('You seem to be offline. Check your internet connection and reload the page.');
        }
    }
    var apiKey = 'AIzaSyDOIIq9bea-J40LPlMFFbyMMPCWSiRac9I';
    getJSONP('https://maps.googleapis.com/maps/api/js?v=3.exp&key=' + apiKey, initialize, onErrorCallback);
}

/**
 * Initializes objects, makes elements needed by the app visible
 * and creates map, map components and view model.
 */
 function initialize() {
    /**
     * Will specify how we want to customize our map
     * @type google.maps.MapOptions (https://developers.google.com/maps/documentation/javascript/reference#MapOptions)
     */
     var mapOptions = {
        center: { lat: 27.4950000, lng: -109.969000},
        zoom: 16,
        panControl: false,
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
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
     * @type google.maps.Symbol (https://developers.google.com/maps/documentation/javascript/reference#Symbol)
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
            'marker': pin.setColor('#dd4229')
        }
        ,'entertainment': {
            'marker': pin.setColor('#3aa0ef')
        }
        ,'outdoors': {
            'marker': pin.setColor('#20be8c')
        }
        , 'recreation': {
            'marker': pin.setColor('#f352a5')
        }
    };

    // Here we restyle our application to accomodate to how it'll look
    // once we add the map
    var mapCanvas = document.getElementById('map-canvas');
    // We create a map in the given DOM element, with the given settings.
    // We also create the element that will display our locations information.
    map = new google.maps.Map(mapCanvas, mapOptions);
    infowindow = new google.maps.InfoWindow();

    // All the locations that will be put in the map
    initialLocations  = [
    new Location('Lockers', 'Sports restaurant and bar located in Arena Itson', 27.493913, -109.974022, type.food, {'foursquareId': '5254ea73498ebbc7b795c436'})
    ,new Location('Parque Casa Blanca', 'Casa Blanca\'s park', 27.488502, -109.980858, type.outdoors, {'foursquareId': '4fa9d9f9e4b04de174340ffc'})
    ,new Location('Extensión de la Cultura', 'University\'s culture building', 27.491421, -109.972339, type.recreation, {'foursquareId': '4cc5c26738aaa09367b51a62'})
    ,new Location('Piscina Olímpica ITSON', 'Olympic pool', 27.493510, -109.973391, type.outdoors, {'foursquareId': '4dd3c51f1f6e5374d6e0ebce'})
    ,new Location('Cancha de Tenis', 'Tenis court', 27.492445, -109.972635, type.outdoors, {'foursquareId': '4e556fb6aeb75a7448e0cdb6'})
    ,new Location('Kiawa', 'University\'s restaurant', 27.493560, -109.972613, type.food, {'foursquareId': '4c8178dfd4e23704f0485e88'})
    ,new Location('Doña Magui', 'Homemade food', 27.490329, -109.972748, type.food, {'foursquareId': '5064bc59e4b053bfe4b7885f'})
    ,new Location('Comedor ITSON', 'University\'s restaurant', 27.491831, -109.970547, type.food, {'foursquareId': '4cb87c3ef50e224bd00ae7fb'})
    ,new Location('Cafeteria ITSON', 'University\'s restaurant', 27.492045, -109.969547, type.food, {'foursquareId': '4eb340be0aaf1abede5d0706'})
    ,new Location('Gusto Frio Mr. Brown', 'Ice cream shop', 27.492788, -109.961114, type.food, {'foursquareId': '4ce5cad3678aa093ca97d8ea'})
    ,new Location('Laguna del Nainari', 'Lagoon known as Ciudad Obregon\'s bride', 27.497699, -109.969851, type.outdoors, {'wikipediaId': '2254604', 'foursquareId': '4cf561ec71538cfa6bdcae2e'})
    ,new Location('Casa de la cultura de Cajeme', 'Municipal culture house', 27.498726, -109.967483, type.recreation, {'foursquareId': '4cd2f8a383e0721e0b1b5a97'})
    ,new Location('Parque infantil Ostimuri', 'City\'s largest park', 27.493909, -109.966797, type.outdoors, {'foursquareId': '4cc46dc701fb236a19d1abba'})
    ,new Location('Tomas Oroz Gaytan Stadium', 'Baseball stadium', 27.492747, -109.954472, type.recreation, {'wikipediaId': '4771088', 'foursquareId': '4c1485fda9c220a1f3c6579d'})
    ];

    // And we bind to our view model
    viewModel = new ViewModel();
    ko.applyBindings(viewModel);
}

/**
 * Represents a place we want to show in our map
 * @param String title       Name of the location
 * @param String description Short description
 * @param number latitude    Latitude is specified in degrees within the range [-90, 90]
 * @param number longitude   Longitude is specified in degrees within the range [-180, 180]
 * @param type   kind        Location's category. Set in the form type.[category]
 * @param Object thirdParty  The Id's associated to the location (for the call to third party APIs)
 */
 var Location = function(title, description, latitude, longitude, kind, thirdParty) {
    var self = this;
    self.title = ko.observable(title);
    self.description = ko.observable(description);
    self.latitude = ko.observable(latitude);
    self.longitude = ko.observable(longitude);
    self.kind = ko.observable(kind);
    self.icon = ko.observable(kind.icon);
    self.wikipediaId = ko.observable(thirdParty.wikipediaId);
    self.foursquareId = ko.observable(thirdParty.foursquareId);
    self.info = ko.observable();
    self.foursquareInfo = ko.observable();
    /**
     * @type google.maps.Marker (https://developers.google.com/maps/documentation/javascript/reference#Marker)
     */
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
    self.locations = ko.observableArray(initialLocations);
    self.currentLocation = ko.observable(self.locations()[0]);
    self.filter = ko.observable(''); // what filter is active
    self.filterShown = ko.observable(false); // whether the filters list should be displayed
    self.showDetails = ko.observable(false); // whether the current location's details should be displayed
    self.activeDetails = ko.observable('info'); // active details tab (in small screens)
    self.showInfo = ko.observable(false);
    self.showComments = ko.observable(false);
    self.showPhoto = ko.observable(false);
    self.descriptionDOM = ko.observable();
    self.commentsDOM = ko.observable();
    self.photosDOM = ko.observable();

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
        self.showLocationsByKind(type.outdoors);
    };

    self.showLocationsByKind = function(kind) {
        self.filter(kind);
        self.filterShown(false);
    };


    // These add the 'active' class to each filter if active
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
        return self.isFilterActive(type.outdoors);
    }, self);

    self.isFilterActive = function(expectedFilter) {
        return self.filter() === expectedFilter ? 'active' : '';
    };

    // Adds the 'hidden' class if showDetails is changed
    self.hideDetails = ko.pureComputed(function() {
        return self.showDetails() && self.showAnyDetail() ? '' : 'hidden';
    }, self);

    // These functions recognize details tabs as active
    self.setActiveInfo = function() {
        return self.setActiveDetails('info');
    };

    self.setActiveComments = function() {
        return self.setActiveDetails('comments');
    };

    self.setActivePhotos = function() {
        return self.setActiveDetails('photos');
    };

    self.setActiveDetails = function(detailsTitle) {
        self.activeDetails(detailsTitle);
    };

    /**
     * Sets an active section whenever their "show[Detail]" observable updates
     */
     self.defaultActive = ko.computed(function() {
        if (self.showInfo()) {
            self.setActiveInfo();
        } else if (self.showComments()) {
            self.setActiveComments();
        } else if (self.showPhoto()) {
            self.setActivePhotos();
        } else {
            self.activeDetails('');
        }
    });

    // These add the 'active' class to each tab if active
    self.isActiveInfo = ko.pureComputed(function() {
        return self.areDetailsActive('info');
    }, self);

    self.isActiveComments = ko.pureComputed(function() {
        return self.areDetailsActive('comments');
    }, self);

    self.isActivePhotos = ko.pureComputed(function() {
        return self.areDetailsActive('photos');
    }, self);

    self.areDetailsActive = function(expected) {
        return self.activeDetails() === expected ? 'active' : '';
    };
    
    self.showAnyDetail = ko.pureComputed(function() { // are any of the details sections shown?
        return self.showPhoto() || self.showComments() || self.showInfo();
    });

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
        self.loadDetails(location);
        self.queryResultsShown(false);
        self.showDetails(true);
    };

    /**
     * Filters the locations to the ones who match the filter
     * and whose title matches the query
     */
     self.filterLocations = ko.computed(function() {
        return ko.utils.arrayFilter(self.locations(), function (location) {
            if (valueMatches(self.query(), location.title()) &&
                (self.filter() == location.kind() || !self.filter())) {
                location.marker.setMap(map);
            return true;
        } else {
            location.marker.setMap(null);
            return false;
        }
    });
    });

    /**
     * Selects the first location of the locations array
     */
     self.selectMarker = function() {
        if (self.locations().length) {
            self.openInfoWindow(self.filterLocations()[0]);
            self.query('');
        }
    };

    /**
     * Loads all the detail sections
     * @param  Location location
     */
     self.loadDetails = function(location) {
        self.loadInfo(location);
        self.loadComments(location);
        self.loadPhotos(location);
    };

    /**
     * Loads the location's information if successful
     * @param  Location location
     */
     self.loadInfo = function(location) {
        if (location.info()) {
            setWikipediaDescription(location.info());
        } else if (location.wikipediaId()) {
            var url = 'http://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=250&format=json&pageids=' + location.wikipediaId();
            getJSONP(url, setWikipediaDescription, onErrorCallback);
        } else {
            onErrorCallback();
        }

        function setWikipediaDescription(data) {
            self.showInfo(true);
            location.info(data);
            var innerHtml = data.query.pages[location.wikipediaId()].extract,
            sourceHtml = '<a target="_blank" class="source icon-wikipedia" href="https://en.wikipedia.org/wiki?curid=' + location.wikipediaId() + '"> Courtesy of Wikipedia</a>';
            self.descriptionDOM(innerHtml + sourceHtml);
        }

        function onErrorCallback() {
            self.showInfo(false);
        }
    };

    /**
     * Loads a comment associated with the location if successful
     * @param  Location location
     */
     self.loadComments = function(location) {
        if (location.foursquareInfo()) {
            setFoursquareTips(location.foursquareInfo());
        } else if (location.foursquareId()) {
            var url = 'https://api.foursquare.com/v2/venues/explore?near=Ciudad Obregon&venuePhotos=1&query=' + location.title() + '&intent=match&client_id=EPFA1HIBXSJXCJM4V3CSQZ3WA2D4ZZ0E3TJ5BP0QXGYODOBZ&client_secret=05JENVJTNP2SHJCYBZM1KI3XTH4ZXI3OWBQWA1PC3NCVUADD&v=20150504';
            getJSON(url, setFoursquareTips, onErrorCallback);
        } else {
            onErrorCallback();
        }

        function setFoursquareTips(data) {
            location.foursquareInfo(data);
            var queryResults = data.response.groups[0].items;
            if (queryResults) {
                // (Then, iterate over the result to match the location ID)
                for (var i = 0, length = queryResults.length; i < length; i++) {
                    if (queryResults[i].venue.id === location.foursquareId()) {
                        return setTipFromVenueInfo(queryResults[i]);
                    }
                }
            } else {
                onErrorCallback();
            }
        }

        function setTipFromVenueInfo(data) {
            var tip = data.tips;
            if(tip) {
                self.showComments(true);
                var innerHtml = '<p>"' + tip[0].text + '"</p>',
                sourceHtml = '<a target="_blank" class="source icon-foursquare" href="https://foursquare.com/v/' + location.foursquareId() + '"> Read more on Foursquare</a>';
                self.commentsDOM(innerHtml + sourceHtml);
            } else {
                onErrorCallback();
            }
        }

        function onErrorCallback() {
            self.showComments(false);
        }
    };

    self.loadPhotos = function(location) {
        if (location.foursquareInfo()) {
            setFoursquarePhoto(location.foursquareInfo());
        } else if (location.foursquareId()) {
            var url = 'https://api.foursquare.com/v2/venues/explore?near=Ciudad Obregon&venuePhotos=1&query=' + location.title() + '&intent=match&client_id=EPFA1HIBXSJXCJM4V3CSQZ3WA2D4ZZ0E3TJ5BP0QXGYODOBZ&client_secret=05JENVJTNP2SHJCYBZM1KI3XTH4ZXI3OWBQWA1PC3NCVUADD&v=20150504';
            getJSON(url, setFoursquarePhoto, onErrorCallback);
        } else {
            onErrorCallback();
        }

        function setFoursquarePhoto(data) {
            location.foursquareInfo(data);
            var queryResults = data.response.groups[0].items;
            if (queryResults) {
                // (Then, iterate over the result to match the location ID)
                for (var i = 0, length = queryResults.length; i < length; i++) {
                    if (queryResults[i].venue.id === location.foursquareId()) {
                        return setPhotoFromVenueInfo(queryResults[i]);
                    }
                }
            } else {
                onErrorCallback();
            }
        }

        function setPhotoFromVenueInfo(data) {
            try {
                var venuePhoto = data.venue.photos.groups[0].items[0],
                photoId = venuePhoto.id,
                prefix = venuePhoto.prefix,
                suffix = venuePhoto.suffix,
                size = "200x200",
                src = prefix + size + suffix,
                sourceUrl = 'https://foursquare.com/v/' + location.foursquareId() + '?openPhotoId=' + photoId,
                innerHtml = '<a target="_blank" href="' + sourceUrl + '"><img class="source" alt="" src="' + src +'"></a>',
                sourceHtml = '<br><a target="_blank" class="source icon-foursquare" href="' + sourceUrl + '"> See more on Foursquare</a>';
                self.photosDOM(innerHtml + sourceHtml);
                self.showPhoto(true);
            } catch (e) {
                onErrorCallback();
            }
        }

         function onErrorCallback() {
            self.showPhoto(false);
        }
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