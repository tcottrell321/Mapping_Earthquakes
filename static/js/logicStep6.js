// Add console.log to check to see if our code is working.
console.log("working");


//MAP #1 ===============================================================================
// Create the tile layer that will be the background of one of our 3 maps.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_Key
});


//MAP #2 ==========================================================================
// Create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_Key
});
//MAP #3 ===============================================================================
// Create the light view tile layer that will bea 3rd option for our map.
let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_Key
});
//=============================================================================
// Create a base layer that holds 3 maps.
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets,
  "Light": light
};
//=============================================================================
// Create the earthquake overlay layer for our maps.
let earthquakes = new L.LayerGroup();
// Create the techtonic plates overlay overlay layer for our maps.
let techTonic = new L.LayerGroup();

// We define an object that contains the overlays.
// This overlay can be toggled off and on by the user for any map.
let overlays = {
    Earthquakes: earthquakes,
    Techtonic_Plates: techTonic
};
//=============================================================================
// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [39.5, -98.5],
zoom: 3,
	layers: [streets]
})

//==============================================================================
//Add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);
//================================================================================
// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

//=====================================================================
// Create a GeoJSON layer with the retrieved data.
L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
			console.log(data);
			return L.circleMarker(latlng);
		},
		// We set the style for each circleMarker using our styleInfo function.
		style: styleInfo,
		 // We create a popup for each circleMarker to display the magnitude and
    	//  location of the earthquake after the marker has been created and styled.
    	onEachFeature: function(feature, layer) {
		layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
	  }
    }).addTo(earthquakes);
    
    //Then we add the earthquake layer to our map.
    earthquakes.addTo(map);
});
//================================================================================
// Create a legend control object.
let legend = L.control({
    position: "bottomright"    
  });

// Then add all the details for the legend.
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    const magnitudes = [0, 1, 2, 3, 4, 5]
    const colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00","#ea822c","#ea2c2c"];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
        div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
             magnitudes[i] + (magnitudes[i + 1] ? "–" + magnitudes[i + 1] + "<br>" : "+");
     }
     return div;
  };
legend.addTo(map)
//=======================================================================
// This function returns the style data for each of the earthquakes we plot on
// the map. The magnitude data is passed into 2 functions: 1) the getColor and 
// 2) the getRadius. 
function styleInfo(feature) {
	return {
	  opacity: 1,
	  fillOpacity: 1,
	  fillColor: getColor(feature.properties.mag),
	  // This function determines the color of the circle based on the magnitude of the earthquake.
      radius: getRadius(feature.properties.mag),
      stroke: true,
	  weight: 0.5
	};
  }
//Sets Colors for styleInfo ===================================================
function getColor(magnitude) {
	if (magnitude > 5) {
	  return "#ea2c2c";
	}
	if (magnitude > 4) {
	  return "#ea822c";
	}
	if (magnitude > 3) {
	  return "#ee9c00";
	}
	if (magnitude > 2) {
	  return "#eecc00";
	}
	if (magnitude > 1) {
	  return "#d4ee00";
	}
	return "#98ee00";
  }
//======================================================================================
// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
	if (magnitude === 0) {
	  return 1;
	}
	return magnitude * 4;
  }

//======================================================================================
// Grabbing our techtonic plate data from git hub in raw GeoJSON data format
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(data) {
    console.log(data);
// Creating a GeoJSON layer with the retrieved data.
    L.geoJson(data, {
        color: "#3388ff", 
        weight: 4
    }  
    ).addTo(techTonic);
});
    techTonic.addTo(map);
    
//properties available for mapbox/streets-v11, outdoors-vll, light-v10, dark-v10, satellite-v9,
//satellite-streets-v11, navigation-preview-day-v4, navigation-preview-night-v4, 
//navigation-guidance-day-v4, navigation-guidance-night-v4