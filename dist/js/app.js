function loadGoogleMapsScript(){function a(){navigator.onLine?createErrorMessage("We're having trouble reaching Google maps. Maybe a firewall is blocking it.","www.maps.googleapis.com"):createErrorMessage("You seem to be offline. Check your internet connection and reload the page.")}var b="AIzaSyDOIIq9bea-J40LPlMFFbyMMPCWSiRac9I";getJSONP("https://maps.googleapis.com/maps/api/js?v=3.exp&key1="+b,initialize,a)}function initialize(){var a={center:{lat:27.495,lng:-109.969},zoom:16,panControl:!1,streetViewControl:!1,zoomControl:!1,mapTypeControl:!1,styles:[{elementType:"labels.icon",stylers:[{visibility:"off"}]}]};pin={path:"m5.7173 24.562c-6.148-10.931-6.5821-15.691-1.8615-20.412 4.3413-4.3413 10.181-4.3413 14.522 0 4.7683 4.7683 4.3293 9.6487-1.8444 20.501-2.7042 4.7537-5.1417 8.6382-5.4167 8.6322s-2.7048-3.9309-5.3995-8.722zm9.1995-9.4112c1.5469-1.5469 1.5469-6.0531 0-7.6s-6.0531-1.5469-7.6 0-1.5469 6.0531 0 7.6 6.0531 1.5469 7.6 0z",fillOpacity:1,strokeWeight:1,strokeColor:"#fff",scale:1.25,origin:new google.maps.Point(0,0),anchor:new google.maps.Point(10,33),setColor:function(a){var b=Object.create(pin);return b.fillColor=a,b}},type={food:{marker:pin.setColor("#dd4229")},entertainment:{marker:pin.setColor("#3aa0ef")},outdoors:{marker:pin.setColor("#20be8c")},recreation:{marker:pin.setColor("#f352a5")}};var b=document.getElementById("map-canvas");map=new google.maps.Map(b,a),infowindow=new google.maps.InfoWindow,initialLocations=[new Location("Lockers","Sports restaurant and bar located in Arena Itson",27.493913,-109.974022,type.food,{foursquareId:"5254ea73498ebbc7b795c436"}),new Location("Parque Casa Blanca","Casa Blanca's park",27.488502,-109.980858,type.outdoors,{foursquareId:"4fa9d9f9e4b04de174340ffc"}),new Location("Extensión de la Cultura","University's culture building",27.491421,-109.972339,type.recreation,{foursquareId:"4cc5c26738aaa09367b51a62"}),new Location("Piscina Olímpica ITSON","Olympic pool",27.49351,-109.973391,type.outdoors,{foursquareId:"4dd3c51f1f6e5374d6e0ebce"}),new Location("Cancha de Tenis","Tenis court",27.492445,-109.972635,type.outdoors,{foursquareId:"4e556fb6aeb75a7448e0cdb6"}),new Location("Kiawa","University's restaurant",27.49356,-109.972613,type.food,{foursquareId:"4c8178dfd4e23704f0485e88"}),new Location("Doña Magui","Homemade food",27.490329,-109.972748,type.food,{foursquareId:"5064bc59e4b053bfe4b7885f"}),new Location("Comedor ITSON","University's restaurant",27.491831,-109.970547,type.food,{foursquareId:"4cb87c3ef50e224bd00ae7fb"}),new Location("Cafeteria ITSON","University's restaurant",27.492045,-109.969547,type.food,{foursquareId:"4eb340be0aaf1abede5d0706"}),new Location("Gusto Frio Mr. Brown","Ice cream shop",27.492788,-109.961114,type.food,{foursquareId:"4ce5cad3678aa093ca97d8ea"}),new Location("Laguna del Nainari","Lagoon known as Ciudad Obregon's bride",27.497699,-109.969851,type.outdoors,{wikipediaId:"2254604",foursquareId:"4cf561ec71538cfa6bdcae2e"}),new Location("Casa de la cultura de Cajeme","Municipal culture house",27.498726,-109.967483,type.recreation,{foursquareId:"4cd2f8a383e0721e0b1b5a97"}),new Location("Parque infantil Ostimuri","City's largest park",27.493909,-109.966797,type.outdoors,{foursquareId:"4cc46dc701fb236a19d1abba"}),new Location("Tomas Oroz Gaytan Stadium","Baseball stadium",27.492747,-109.954472,type.recreation,{wikipediaId:"4771088",foursquareId:"4c1485fda9c220a1f3c6579d"})],viewModel=new ViewModel,ko.applyBindings(viewModel)}var map,infowindow,initialLocations,viewModel,detailsViewModel,pin,type;window.onload=loadGoogleMapsScript;var Location=function(a,b,c,d,e,f){var g=this;g.title=ko.observable(a),g.description=ko.observable(b),g.latitude=ko.observable(c),g.longitude=ko.observable(d),g.kind=ko.observable(e),g.icon=ko.observable(e.icon),g.wikipediaId=ko.observable(f.wikipediaId),g.foursquareId=ko.observable(f.foursquareId),g.info=ko.observable(),g.foursquareInfo=ko.observable(),g.marker=new google.maps.Marker({position:new google.maps.LatLng(g.latitude(),g.longitude()),map:map,icon:e.marker,animation:google.maps.Animation.DROP,title:g.title()}),google.maps.event.addListener(g.marker,"click",function(){parent.viewModel.openInfoWindow(g)})},ViewModel=function(){var a=this;a.query=ko.observable(""),a.queryResultsShown=ko.observable(!1),a.locations=ko.observableArray(initialLocations),a.currentLocation=ko.observable(a.locations()[0]),a.filter=ko.observable(""),a.filterShown=ko.observable(!1),a.showDetails=ko.observable(!1),a.activeDetails=ko.observable("info"),a.showInfo=ko.observable(!1),a.showComments=ko.observable(!1),a.showPhoto=ko.observable(!1),a.descriptionDOM=ko.observable(),a.commentsDOM=ko.observable(),a.photosDOM=ko.observable(),a.showResults=function(){a.queryResultsShown(!0)},a.setCurrentLocation=function(b){return(b=a.getLocation(b.title()))?(b!=a.currentLocation()?a.currentLocation().marker.setAnimation(null):a.currentLocation(),b.marker.setAnimation(google.maps.Animation.BOUNCE),map.panTo(b.marker.getPosition()),a.currentLocation(b)):void 0},a.getLocation=function(b){for(var c in a.locations())if(a.locations()[c].title()===b)return a.locations()[c]},a.showAllLocations=function(){a.showLocationsByKind("")},a.showFoodLocations=function(){a.showLocationsByKind(type.food)},a.showRecreationLocations=function(){a.showLocationsByKind(type.recreation)},a.showOutdoorsLocations=function(){a.showLocationsByKind(type.outdoors)},a.showLocationsByKind=function(b){a.filter(b),a.filterShown(!1)},a.isFilterAll=ko.pureComputed(function(){return a.isFilterActive("")},a),a.isFilterFood=ko.pureComputed(function(){return a.isFilterActive(type.food)},a),a.isFilterRecreation=ko.pureComputed(function(){return a.isFilterActive(type.recreation)},a),a.isFilterOutdoors=ko.pureComputed(function(){return a.isFilterActive(type.outdoors)},a),a.isFilterActive=function(b){return a.filter()===b?"active":""},a.hideDetails=ko.pureComputed(function(){return a.showDetails()&&a.showAnyDetail()?"":"hidden"},a),a.setActiveInfo=function(){return a.setActiveDetails("info")},a.setActiveComments=function(){return a.setActiveDetails("comments")},a.setActivePhotos=function(){return a.setActiveDetails("photos")},a.setActiveDetails=function(b){a.activeDetails(b)},a.defaultActive=ko.computed(function(){a.showInfo()?a.setActiveInfo():a.showComments()?a.setActiveComments():a.showPhoto()?a.setActivePhotos():a.activeDetails("")}),a.isActiveInfo=ko.pureComputed(function(){return a.areDetailsActive("info")},a),a.isActiveComments=ko.pureComputed(function(){return a.areDetailsActive("comments")},a),a.isActivePhotos=ko.pureComputed(function(){return a.areDetailsActive("photos")},a),a.areDetailsActive=function(b){return a.activeDetails()===b?"active":""},a.showAnyDetail=ko.pureComputed(function(){return a.showPhoto()||a.showComments()||a.showInfo()}),a.openInfoWindow=function(b){var c='<div tabindex="1" href="#"><h2 class="info-title">'+b.title()+'</h2><p class="info-description">'+b.description()+"</p></div>";infowindow.setContent(c),infowindow.open(map,b.marker),a.setCurrentLocation(b),a.loadDetails(b),a.queryResultsShown(!1),a.showDetails(!0)},a.filterLocations=ko.computed(function(){return ko.utils.arrayFilter(a.locations(),function(b){return!valueMatches(a.query(),b.title())||a.filter()!=b.kind()&&a.filter()?(b.marker.setMap(null),!1):(b.marker.setMap(map),!0)})}),a.selectMarker=function(){a.locations().length&&(a.openInfoWindow(a.filterLocations()[0]),a.query(""))},a.loadDetails=function(b){a.loadInfo(b),a.loadComments(b),a.loadPhotos(b)},a.loadInfo=function(b){function c(c){a.showInfo(!0),b.info(c);var d=c.query.pages[b.wikipediaId()].extract,e='<a target="_blank" class="source icon-wikipedia" href="https://en.wikipedia.org/wiki?curid='+b.wikipediaId()+'"> Courtesy of Wikipedia</a>';a.descriptionDOM(d+e)}function d(){a.showInfo(!1)}if(b.info())c(b.info());else if(b.wikipediaId()){var e="http://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=250&format=json&pageids="+b.wikipediaId();getJSONP(e,c,d)}else d()},a.loadComments=function(b){function c(a){b.foursquareInfo(a);var c=a.response.groups[0].items;if(c){for(var f=0,g=c.length;g>f;f++)if(c[f].venue.id===b.foursquareId())return d(c[f])}else e()}function d(c){var d=c.tips;if(d){a.showComments(!0);var f='<p>"'+d[0].text+'"</p>',g='<a target="_blank" class="source icon-foursquare" href="https://foursquare.com/v/'+b.foursquareId()+'"> Read more on Foursquare</a>';a.commentsDOM(f+g)}else e()}function e(){a.showComments(!1)}if(b.foursquareInfo())c(b.foursquareInfo());else if(b.foursquareId()){var f="https://api.foursquare.com/v2/venues/explore?near=Ciudad Obregon&venuePhotos=1&query="+b.title()+"&intent=match&client_id=EPFA1HIBXSJXCJM4V3CSQZ3WA2D4ZZ0E3TJ5BP0QXGYODOBZ&client_secret=05JENVJTNP2SHJCYBZM1KI3XTH4ZXI3OWBQWA1PC3NCVUADD&v=20150504";getJSON(f,c,e)}else e()},a.loadPhotos=function(b){function c(a){b.foursquareInfo(a);var c=a.response.groups[0].items;if(c){for(var f=0,g=c.length;g>f;f++)if(c[f].venue.id===b.foursquareId())return d(c[f])}else e()}function d(c){try{var d=c.venue.photos.groups[0].items[0],f=d.id,g=d.prefix,h=d.suffix,i="200x200",j=g+i+h,k="https://foursquare.com/v/"+b.foursquareId()+"?openPhotoId="+f,l='<a target="_blank" href="'+k+'"><img class="source" alt="" src="'+j+'"></a>',m='<br><a target="_blank" class="source icon-foursquare" href="'+k+'"> See more on Foursquare</a>';a.photosDOM(l+m),a.showPhoto(!0)}catch(n){e()}}function e(){a.showPhoto(!1)}if(b.foursquareInfo())c(b.foursquareInfo());else if(b.foursquareId()){var f="https://api.foursquare.com/v2/venues/explore?near=Ciudad Obregon&venuePhotos=1&query="+b.title()+"&intent=match&client_id=EPFA1HIBXSJXCJM4V3CSQZ3WA2D4ZZ0E3TJ5BP0QXGYODOBZ&client_secret=05JENVJTNP2SHJCYBZM1KI3XTH4ZXI3OWBQWA1PC3NCVUADD&v=20150504";getJSON(f,c,e)}else e()},google.maps.event.addListener(parent.infowindow,"domready",function(){var b=a.getLocation(parent.infowindow.getAnchor().title);b&&a.setCurrentLocation(b)}),google.maps.event.addListener(parent.infowindow,"closeclick",function(){a.currentLocation().marker.setAnimation(null),a.showDetails(!1)})};