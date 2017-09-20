var map;
var client_id = "2XHARWW4WN135VUG3M3TUDG2ZQZ1RBZYCWL1CU3UEW22EL4V";
var client_secret = "VXDP4AHILKOG331ZRCGGJLSTUZITP0NDFYVMK2BZGKV1NOQG";
var fsq_venue_endpoint = "https://api.foursquare.com/v2/venues/search?client_id="+client_id+"&client_secret="+ client_secret+"&v=20170916";
// Initalize map and create model
initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -22.8226801, lng: -47.0850446},
    zoom: 15
  });

  ko.applyBindings(new MarkersViewModel());
};
