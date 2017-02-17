mapboxgl.accessToken = 'pk.eyJ1Ijoic2x1c2Fyc2tpZGRldHJvaXRtaSIsImEiOiJjaXZsNXlwcXQwYnY5MnlsYml4NTJ2Mno4In0.8wKUnlMPIlxq-eWH0d10-Q';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/slusarskiddetroitmi/ciymfavyb00072sqe0bu9rwht', //stylesheet location
  center: [-83.1, 42.36], // starting position
  zoom: 11 // starting zoom
});




map.on('load', function(window) {
  // use waste districts
  map.addSource('waste', {
    type: 'geojson',
    data: 'https://gis.detroitmi.gov/arcgis/rest/services/Services/WastePickup/FeatureServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=5&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson'
  });

    map.addLayer({
    "id": "advance-fill",
    "type": "fill",
    "source": "waste",
        'minzoom': 9,
        'maxzoom': 20,
    "layout": {
    },
    "text-field" : "{garbage}",
    "paint": {
      "fill-color": "#0c9bff",
      "fill-opacity": 0.6,
    },
    "filter": ["==", "contractor", "advanced-disposal"]
  });
   map.addLayer({
    "id": "advance-borders",
    "type": "line",
    "source": "waste",
        'minzoom': 9,
        'maxzoom': 20,
    "layout": {},
    "paint": {
      "line-color": "white",
      "line-width": 1
    },
    "filter": ["==", "contractor", "advanced-disposal"]
  });
      map.addLayer({
    "id": "gfl-fill",
    "type": "fill",
    "source": "waste",
        'minzoom': 9,
        'maxzoom': 20,
    "layout": {},
    "paint": {
      "fill-color": "#29ff74",
      "fill-opacity": 0.6,
    },
    "filter": ["==", "contractor", "GFL Environmental"]
  });
   map.addLayer({
    "id": "gfl-borders",
    "type": "line",
    "source": "waste",
        'minzoom': 9,
        'maxzoom': 20,
    "layout": {},
    "paint": {
      "line-color": "white",
      "line-width": 1
    },
    "filter": ["==", "contractor", "GFL Environmental"]
  });
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
  });
  map.addControl(geocoder);
  map.addSource('single-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "circle",
        "paint": {
            "circle-radius": 10,
            "circle-color": "#007cbf"
        }
    });
  geocoder.on('result', function(ev) {
      console.log(ev.result.geometry);
      // let wasteData = $.getJSON('http://gis.detroitmi.gov/arcgis/rest/services/Services/WastePickup/MapServer/0/query?where=&text=&objectIds=&time=&geometry='+ev.result.geometry.coordinates[0]+'+'+ev.result.geometry.coordinates[1]+'&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json');
      let tempAddr = document.querySelector('.mapboxgl-ctrl-geocoder.mapboxgl-ctrl > input').value.split(',')[0];
      tempAddr = tempAddr.split(' ');
      let newTempAddr = '';
      let size = tempAddr.length;
      tempAddr.forEach(function(item, index) {
        newTempAddr += item;
        ((index < size) && (index + 1) !== size) ? newTempAddr += '+': 0;
      });
      console.log(newTempAddr);
      $.getJSON('http://gis.detroitmi.gov/arcgis/rest/services/DoIT/AddressPointGeocoder/GeocodeServer/findAddressCandidates?Street='+ newTempAddr +'&ZIP=&Single+Line+Input=&category=&outFields=&maxLocations=&outSR=&searchExtent=&location=&distance=&magicKey=&f=json', function( data ) {
        let addressCoordinates = data.candidates[0].location;
        console.log(addressCoordinates.x);
        console.log(addressCoordinates.y);
        $.getJSON('http://gis.detroitmi.gov/arcgis/rest/services/Services/WastePickup/FeatureServer/0/query?where=&objectIds=&time=&geometry='+addressCoordinates.x+'%2C+'+addressCoordinates.y+'&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelWithin&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&gdbVersion=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=&resultOffset=&resultRecordCount=&f=json' , function( data ) {
          console.log(data);
          console.log(ev.result.geometry);
          map.getSource('single-point').setData(ev.result.geometry);
          document.querySelector('.info-container > .street-name').innerHTML = document.querySelector('.mapboxgl-ctrl-geocoder.mapboxgl-ctrl > input').value.split(',')[0];
          document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> ' + capitalizeFirstLetter(data.features[0].attributes.contractor);
          document.querySelector('.info-container > .garbage').innerHTML = '<span>Garbage:</span> ' + capitalizeFirstLetter(data.features[0].attributes.garbage);
          document.querySelector('.info-container > .recycle').innerHTML = '<span>Recycle:</span> ' + capitalizeFirstLetter(data.features[0].attributes.recycling) + '-' + capitalizeFirstLetter(data.features[0].attributes.section);
          document.querySelector('.info-container > .bulk').innerHTML = '<span>Bulk:</span> ' + capitalizeFirstLetter(data.features[0].attributes.bulk) + '-' + capitalizeFirstLetter(data.features[0].attributes.section);
          (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
        });
      });
  });
});
var closeInfo = function closeInfo() {
  (document.querySelector('#info').className === 'active') ? document.querySelector('#info').className = '' : document.querySelector('#info').className = 'active';
};
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
document.getElementById('close-emergency-modal-btn').addEventListener('click', closeInfo);
