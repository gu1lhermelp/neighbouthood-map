'use strict;';

function Marker(location)  {
  var self = this;

  this.location = location;
  this.selected = ko.observable(false);

  this.marker = new google.maps.Marker({
    position: this.location.location,
    title: this.location.title,
    animation: google.maps.Animation.DROP,
  });
}

// Model
function MarkersViewModel() {
  var self = this;

  // Binded with text input box
  self.filterInput = ko.observable("");
  self.hideMenu = ko.observable(true);

  self.locations = [
    {title: 'Estação Barão', location: {lat: -22.8284886, lng: -47.0795748}},
    {title: 'Dona Pina', location: {lat: -22.8271702, lng: -47.0803843}},
    {title: 'Kabana Beach Bar', location: {lat: -22.830891, lng: -47.0761143}},
    {title: 'Bar do Zé', location: {lat: -22.8266955, lng: -47.0796171}},
    {title: 'Bar da Coxinha', location: {lat: -22.8262463, lng: -47.0837528}}
  ];

  // Build observable array composed of Markers objects
  var infoWindow = new google.maps.InfoWindow();
  self.markers = ko.observableArray();
  for (var i = 0; i < self.locations.length; i++) {
    self.markers.push(new Marker(self.locations[i]));
  }

  self.markers().forEach(function(marker) {
    var this_marker = marker;
    marker.marker.addListener('click', function() {
      self.markerClicked(this_marker);
    });
  });

  // Computed variable to filter markers based on filter input
  self.filteredList = ko.computed(function() {
    var list = [];
    for (var i = 0; i < self.markers().length; i++) {
      // Get location title and compares to markers
      var location = self.markers()[i].location.title;
      // Show only markers that contain the filter input string
      if (location.toLowerCase().includes(self.filterInput().toLowerCase())) {
        list.push(self.markers()[i]);
        self.markers()[i].marker.setMap(map);
      } else {
        self.markers()[i].marker.setMap(null);
      }
    }
    return list;
  });

  self.listItemClicked = function() {
    self.markerClicked(this);
  };

  /* This function gets marker location, request info via foursquauqe API and
  ** show the info window.
  */
  self.markerClicked = function(marker) {
    // Clear selected status
    for (var i = 0; i < self.markers().length; i++) {
      self.markers()[i].selected(false);
      self.markers()[i].marker.setAnimation(null);
    }
    // Highlight marker
    marker.selected(true);
    // Get lat and lng
    var lat = marker.location.location.lat;
    var lng = marker.location.location.lng;
    var text;
    // JSON Request to Foursquare API
    var jqxhr = $.get(fsq_venue_endpoint + "&ll=" + lat +"," + lng, function(response) {
      var name = response.response.venues[0].name;
      var address = response.response.venues[0].location.address;
      text = name;
      if (address != undefined) {
        text += "<br/>" + address;
      }
    });
    // Set callbacks to show info window when JSON request finishes
    jqxhr.done(function() {
      self.populateInfoWindow(marker, text);
    });
    jqxhr.fail(function() {
      self.populateInfoWindow(marker, "Failed to get info on location.");
    });
  };

  // Populate an infowindow
  self.populateInfoWindow = function(marker, text) {
    if (infoWindow.marker != marker.marker) {
      infoWindow.marker = marker.marker;
      infoWindow.setContent('<div>' + text + '</div>');
      infoWindow.open(map, marker.marker);
      infoWindow.addListener('closeclick', function() {
        //infoWindow.setMarker(null);
        for (var i = 0; i < self.markers().length; i++) {
            self.markers()[i].selected(false);
            self.markers()[i].marker.setAnimation(null);
        }
      });
    }
    marker.marker.setAnimation(google.maps.Animation.BOUNCE);
  };

  // Show all markers
  self.showListings = function() {
    for (var i = 0;i < self.markers().length; i++) {
      self.markers()[i].marker.setMap(map);
    }
  };

  // Hide all markers
  self.hideListings = function() {
    for (var i = 0;i < self.markers().length; i++) {
      self.markers()[i].marker.setMap(null);
    }
  };

  self.toggleMenu = function() {
    self.hideMenu(!self.hideMenu());
  };

}
