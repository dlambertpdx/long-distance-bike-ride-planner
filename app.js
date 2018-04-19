/* global document google */
const STORE = { origin: '', destination: '' };
const setTotal = (total) => { document.getElementById('total').innerHTML = `${total} miles`; };
let directionsService;
let directionsDisplay;
let map;
let placesService;
let infowindow;

function getStops(data) {
  const steps = data.map(v => v.duration.value);
  const stopsIndexes = [];
  let acc = 0;
  for (let i = 0; i < steps.length; i += 1) {
    acc += steps[i];
    if (acc > 60 * 60) {
      stopsIndexes.push(i);
      acc = 0;
    }
  }
  return stopsIndexes.map(index => data[index]);
}

function getCoordinates(steps) {
  const coordinates = steps.map(v =>
    v.end_location);
  return coordinates; // returns array of coordinates
}

function computeTotalDistance(result) {
  let total = 0;
  const myroute = result.routes[0];
  for (let i = 0; i < myroute.legs.length; i += 1) {
    total += myroute.legs[i].distance.value;
  }
  total = parseFloat(total / 1609).toFixed(1);
  return total;
}

function createPlaceMarker(place) {
  const placeLoc = place.geometry.location; // eslint-disable-line no-unused-vars
  const image = 'https://i.imgur.com/Deyw0mB.png';
  // const image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
    icon: image,
  });

  google.maps.event.addListener(marker, 'click', () => {
    infowindow.setContent(place.name);
    infowindow.open(map, marker);
  });
}

function handlePlaceResults(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i += 1) {
      createPlaceMarker(results[i]);
    }
  }
}
function createStopMarket(coordinate) {
  return new google.maps.Marker({
    position: coordinate,
    map,
  });
}

function calculateAndDisplayRoute(route, setDirections, placesSearch, origin, destination) {
  route({
    origin,
    destination,
    travelMode: 'BICYCLING',

  }, (response, status) => {
    if (status === 'OK') {
      setDirections(response);
      const stops = getStops(response.routes[0].legs[0].steps);
      const coords = getCoordinates(stops);
      coords.forEach((v) => {
        createStopMarket(v);
        placesSearch({ location: v, radius: 8000, keyword: 'bike shop' }, handlePlaceResults);
      });
    }
  });
}

function render() {
  if (STORE.origin && STORE.destination) {
    calculateAndDisplayRoute(
      directionsService.route.bind(directionsService),
      directionsDisplay.setDirections.bind(directionsDisplay),
      placesService.nearbySearch.bind(placesService),
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

function initMap() { // eslint-disable-line no-unused-vars
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: { lat: 45.5231, lng: -122.6765 }, // Portland, OR
    disableDefaultUI: true,
  });

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: false,
    map,
    panel: document.getElementById('right-panel'),
  });

  autocompleteDirectionsHandler(map);

  placesService = new google.maps.places.PlacesService(map);
  infowindow = new google.maps.InfoWindow();

  render();

  directionsDisplay.setMap(map);

  directionsDisplay.addListener('directions_changed', () => {
    setTotal(computeTotalDistance(directionsDisplay.getDirections()));
  });
}
