function initMap() {
  var directionsService = new google.maps.DirectionsService;
   var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map:map,
    panel: document.getElementById('right-panel')
  });
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 45.5231, lng: -122.6765} //Portland, OR
  });

  directionsDisplay.setMap(map);
  calculateAndDisplayRoute(directionsService, directionsDisplay);
  document.getElementById('mode').addEventListener('change', function () {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });

  directionsDisplay.addListener('directions_changed', function () {
    computeTotalDistance(directionsDisplay.getDirections());
  });

}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  var selectedMode = document.getElementById('mode').value;
  directionsService.route({
    origin: {lat: 45.5162, lng: -122.6834}, //Portland Art Museum
    destination: {lat: 45.5180, lng: -122.5948}, //Mount Tabor, Portland 
    waypoints: [{ location:'Tryon Creek, Portland, OR'}, { location: 'Woodstock, Portland, OR'}],
    travelMode: google.maps.TravelMode[selectedMode] 
  }, function(response, status) { 
      if (status == 'OK') { 
        directionsDisplay.setDirections(response); 
      } else { 
        window.alert('Directions request failed due to ' + status); 
      } 
    }); 
  }

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = parseFloat(total / 1609).toFixed(1);
  document.getElementById('total').innerHTML = total + ' miles';
}
