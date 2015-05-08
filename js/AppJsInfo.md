# About app.js

### Conventions used in this file
* [links]() - Indicate files or external references

* **Bold** - Indicates function

* _Italic_ - Indicates variable names

## How does app.js work?
The neighborhood map application is done with the Knockout framework, so I suggest you [read the documentation](knockoutjs.com/documentation/introduction.html) if you're not familiar with it.

The file [app.js](app.js) is the main working brain behind this neighborhood map. There was a consious effort to not use jquery (for didactic purposes) so there are some helper functions to ease development a little bit at [helpers.js](helpers.js). Feel free to use and/or add to them as you please.

As soon as app.js loads, **loadGoogleMapsScript** will get the objects we need to manipulate our map with the [Google Maps Api](https://developers.google.com/maps/documentation/javascript/tutorial) ready. If successfull, **initialize** will be called.

### Initialize
Inside **initialize**, the main things you might want to modify are:
* _mapOptions_: Customize the map according to the [MapOptions reference](https://developers.google.com/maps/documentation/javascript/reference#MapOptions)
* _pin_: Sets the appearance of the map's markers. Learn more at the [Symbol reference](https://developers.google.com/maps/documentation/javascript/reference#Symbol)
* _type_: These are the available categories of the map locations. Use this one to customize groups.
* _initialLocations_: Here you indicate all the locations that will be displayed in the map. Check [the Location section](#location) to learn more about the parameters.

### Location
For each Location object you will need to specify (in this order):
* title - The name of the location
* description - The information that will appear with its associated infowindow
* latitude - Latitude specified in degrees within the range [-90, 90]
* longitude - Longitude specified in degrees within the range [-180, 180]
* kind - These are the categories specified in the _type_ object, e.g. "type.nature"
* third party API's id - The ids associated with the location on third party apps. Right now only wikipedia and foursquare are called.

### ViewModel
This is where the map's and locations' list interactivity happens. I'll describe it in general.
* _self.locations_ contains all the locations in _initialLocations_
* _self.currentLocation_ contains the last selected location. Upon loading, the first value will be the first location in _self.locations_
* _self.filter_ holds the name of the filter that is active (or none if the "All" filter is selected)
* _self.query_ holds the text input in the search field
* _self.filterLocations_ contains all the locations whose _kind_ matches the one set in _self.filter_ and _title_ contains _self.query_. It displays the markers on the map and the name of the locations on the list in real time.
* **self.openInfoWindow** is triggered when a location is selected. It opens the infoWindow on the location's marker and loads its details if they are loaded.
* _self.loadDetails_ retrieves each of the details associated with the location (each detail makes a third party API call) and loads them in the DOM if successfull
* _self.defaultActive_ loads the tab (for small screens) that should be active depending on what details were loaded for the Location

And that's more or less how it works c:
