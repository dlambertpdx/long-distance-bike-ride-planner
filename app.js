
//This is not working for some reason
const setTotal = total => document.getElementById('total').innerHTML = total + ' miles';

let directionsService;
let directionDisplay;

function initMap() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map,
    panel: document.getElementById('right-panel')
  });
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: { lat: 45.5231, lng: -122.6765 },  //Portland, OR
    disableDefaultUI: true
  });

  directionsDisplay.setMap(map);
  calculateAndDisplayRoute(directionsService, directionsDisplay);
//   document.getElementById('mode').addEventListener('change', function () {
//     calculateAndDisplayRoute(directionsService, directionsDisplay);
//   });

  directionsDisplay.addListener('directions_changed', function () {
    
    setTotal(computeTotalDistance(directionsDisplay.getDirections()));
  });

}

function formSubmit() {
  $('#location-form').submit((e) => {
    e.preventDefault();
    const startInput = $(e.currentTarget).find('#start-input').val();
    const endInput = $(e.currentTarget).find('#end-input').val();
    calculateAndDisplayRoute(directionsService, directionsDisplay, startInput, endInput);
  });
}


function calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination) {
  // var selectedMode = document.getElementById('mode').value;
  directionsService.route({
    origin: origin,
    destination: destination,
    // waypoints: [{ location: 'Tryon Creek, Portland, OR' }, { location: 'Woodstock, Portland, OR' }],
    travelMode: 'BICYCLING'
  }, function (response, status) {
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
  return total;
}

$(formSubmit);