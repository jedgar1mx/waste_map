mapboxgl.accessToken = 'pk.eyJ1Ijoic2x1c2Fyc2tpZGRldHJvaXRtaSIsImEiOiJjaXZsNXlwcXQwYnY5MnlsYml4NTJ2Mno4In0.8wKUnlMPIlxq-eWH0d10-Q';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/slusarskiddetroitmi/ciymfavyb00072sqe0bu9rwht', //stylesheet location
  center: [-83.1, 42.4], // starting position
  zoom: 10 // starting zoom
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
      $.getJSON( 'http://gis.detroitmi.gov/arcgis/rest/services/Services/WastePickup/MapServer/0/query?where=&text=&objectIds=&time=&geometry=' + ev.result.geometry.coordinates[0] + '+' + ev.result.geometry.coordinates[1] + '&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson', function( data ) {
        console.log(data);
        map.getSource('single-point').setData(ev.result.geometry);
        let popup = new mapboxgl.Popup({closeOnClick: false})
        .setLngLat(ev.result.geometry.coordinates)
        .setHTML('<h1>'+ document.querySelector('.mapboxgl-ctrl-geocoder.mapboxgl-ctrl > input').value.split(',')[0] +'</h1><h1><span style="color:#FA2E31">Garbage:</span> '+ data.features[0].attributes.garbage +'</h1>')
        .addTo(map);
      });
  });
});
