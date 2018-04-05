/* global document google */
const STORE = { origin: '', destination: '' };
const setTotal = total => document.getElementById('total').innerHTML = `${total} miles`;

let directionsService;
let directionsDisplay;

function computeTotalDistance(result) {
  let total = 0;
  const myroute = result.routes[0];
  for (let i = 0; i < myroute.legs.length; i += 1) {
    total += myroute.legs[i].distance.value;
  }
  total = parseFloat(total / 1609).toFixed(1);
  return total;
}

function calculateAndDisplayRoute(route, setDirections, origin, destination) {
  route({
    origin,
    destination,
    travelMode: 'BICYCLING',

  }, (response, status) => {
    if (status === 'OK') {
      setDirections(response);
    }
  });
}

function render() {
  if (STORE.origin && STORE.destination) {
    calculateAndDisplayRoute(
      directionsService.route.bind(directionsService),
      directionsDisplay.setDirections.bind(directionsDisplay),
      STORE.origin, STORE.destination,
    );
  }
}

function autocompleteDirectionsHandler() {
  const originInput = document.getElementById('start-input');
  const destinationInput = document.getElementById('end-input');
  const originAutocomplete = new
  google.maps.places.Autocomplete(originInput, { placeIdOnly: true });
  originAutocomplete.addListener('place_changed', () => {
    const originPlace = originAutocomplete.getPlace();
    STORE.origin = originPlace.name;
    render();
  });

  const destinationAutocomplete = new
  google.maps.places.Autocomplete(destinationInput, { placeIdOnly: true });
  destinationAutocomplete.addListener('place_changed', () => {
    const destinationPlace = destinationAutocomplete.getPlace();
    STORE.destination = destinationPlace.name;
    render();
  });
}

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: { lat: 45.5231, lng: -122.6765 }, // Portland, OR
    disableDefaultUI: true,
  });

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map,
    panel: document.getElementById('right-panel'),
  });

  // AUTOCOMLETE
  autocompleteDirectionsHandler(map);


  directionsDisplay.setMap(map);
  render();

  directionsDisplay.addListener('directions_changed', () => {
    setTotal(computeTotalDistance(directionsDisplay.getDirections()));
  });
}
