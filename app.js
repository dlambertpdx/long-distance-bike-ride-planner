/*global document google */
const STORE = { origin: '', destination: '' };
const setTotal = total => document.getElementById('total').innerHTML = `${total} miles`;

let directionsService;
let directionDisplay;

function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map,
    panel: document.getElementById('right-panel'),
  });

  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: { lat: 45.5231, lng: -122.6765 }, // Portland, OR
    disableDefaultUI: true,
  });

  // AUTOCOMLETE
  new autocompleteDirectionsHandler(map);


  directionsDisplay.setMap(map);
  render();

  //   document.getElementById('mode').addEventListener('change', function () {
  //     calculateAndDisplayRoute(directionsService, directionsDisplay);
  //   });

  directionsDisplay.addListener('directions_changed', () => {
    setTotal(computeTotalDistance(directionsDisplay.getDirections()));
  });
}
// refactor autocomplete
function autocompleteDirectionsHandler() {
  const originInput = document.getElementById('start-input');
  const destinationInput = document.getElementById('end-input');
  const originAutocomplete = new google.maps.places.Autocomplete(originInput, { placeIdOnly: true });
  originAutocomplete.addListener('place_changed', () => {
    const originPlace = originAutocomplete.getPlace();
    STORE.origin = originPlace.name;
    render();
  });
  const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, { placeIdOnly: true });
  destinationAutocomplete.addListener('place_changed', () => {
    const destinationPlace = destinationAutocomplete.getPlace();
    STORE.destination = destinationPlace.name;
    render();
  });
}

function render() {
  if (STORE.origin && STORE.destination) {
    calculateAndDisplayRoute(
      directionsService.route.bind(directionsService),
      directionsDisplay.setDirections.bind(directionsDisplay),
      STORE.origin, STORE.destination,
    );
  } else {

  }
}


function calculateAndDisplayRoute(route, setDirections, origin, destination) {
  route({
    origin,
    destination,
    // add waypoint functionality later
    // waypoints: [{ location: 'Tryon Creek, Portland, OR' }, { location: 'Woodstock, Portland, OR' }],
    travelMode: 'BICYCLING',

  }, (response, status) => {
    if (status == 'OK') {
      setDirections(response);
    } else {
      window.alert(`Directions request failed due to ${status}`);
    }
  });
}

function computeTotalDistance(result) {
  let total = 0;
  const myroute = result.routes[0];
  for (let i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = parseFloat(total / 1609).toFixed(1);
  return total;
}

$(formSubmit);
