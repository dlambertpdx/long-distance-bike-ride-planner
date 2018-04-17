const globalData = [
    { duration: { text: '1min', value: 55 }, end_location: {lat: 45.3216, lng: -122.2589}}, 
    { duration: { text: '2min', value: 118 }, end_location: { lat: 45.3355, lng: -122.2689 }}, 
    { duration: { text: '10 min', value: 550 }, end_location: { lat: 45.3987, lng: -122.2855 }}];

function getStops(data) {
const steps = data.map(v => { 
    return v.duration.value 
});
console.log(steps)
const stopsIndexes = [];
let acc = 0;
for(let i = 0; i < steps.length; i += 1){
     
    acc = acc + steps[i]
    if(acc > 150){
        stopsIndexes.push(i)
        acc = 0
    }
}
return stopsIndexes.map(index => data[index]) 
}

function getCoordinates(steps) {
const coordinates = steps.map(v => {
    return v.end_location; // returns coordinate objects
});
return coordinates; // returns array of coordinates
}

const stops = getStops(globalData)
const coords = getCoordinates(stops)