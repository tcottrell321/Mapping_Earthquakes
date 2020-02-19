// Add console.log to check to see if our code is working.
console.log("working");

// Create the map object with a center and zoom level 4 on 0-18. 
// Create the map object with a center and zoom level.
let map = L.map("mapid", {
    center: [
      40.7, -94.5
    ],
    zoom: 4
  });

  //Add circle marker using the circleMarker function with some parameters
  L.circleMarker([34.0522, -118.2437], {
    radius:300,
    color: 'black',
    fillColor: '#ffffa1'
  }).addTo(map);
  
// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_Key
});
// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);

//properties available for mapbox/streets-v11, outdoors-vll, light-v10, dark-v10, satellite-v9,
//satellite-streets-v11, navigation-preview-day-v4, navigation-preview-night-v4, 
//navigation-guidance-day-v4, navigation-guidance-night-v4