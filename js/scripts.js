function initialize(){var a={center:{lat:27.495,lng:-109.969},zoom:15,panControl:!1,streetViewControl:!1,zoomControl:!1,overviewMapControl:!1,mapTypeControlOptions:{style:google.maps.MapTypeControlStyle.HORIZONTAL_BAR,mapTypeIds:[google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.TERRAIN]}};map=new google.maps.Map(document.getElementById("map-canvas"),a),infowindow=new google.maps.InfoWindow,ko.applyBindings(new ViewModel)}var Location=function(a,b,c,d,e){var f=this;f.title=ko.observable(a),f.content='<h2 class="info-title">'+a+'</h2><p class="info-description">'+b+"</p>",f.latitude=ko.observable(c),f.longitude=ko.observable(d),f.icon=ko.observable(e),f.marker=new google.maps.Marker({position:new google.maps.LatLng(f.latitude(),f.longitude()),map:map,icon:f.icon()}),f.infoWindow=function(){infowindow.setContent(f.content),infowindow.open(map,f.marker),$("#placeslist-switcher").attr("checked",!1)},google.maps.event.addListener(f.marker,"click",f.infoWindow)},ViewModel=function(){var a=this;a.locations=ko.observableArray([new Location("Kiawa","University's restaurant",27.49356,-109.972613,"img/cafetaria.png"),new Location("Lockers",'Sports restaurant and bar (Trying the "Michael Phelps" pizza is a must)',27.493921,-109.974107,"img/pizzaria.png"),new Location("Comedor ITSON","University's restaurant",27.491831,-109.970547,"img/cafetaria.png"),new Location("Cafeteria ITSON","University's restaurant",27.492045,-109.969547,"img/cafetaria.png"),new Location("Doña Magui","Homemade food",27.49033,-109.97275,"img/restaurant.png")]),a.openInfoWindow=function(a){a.infoWindow()}},map,infowindow;try{google.maps.event.addDomListener(window,"load",initialize)}catch(e){console.log("Google map wasn't loaded")}