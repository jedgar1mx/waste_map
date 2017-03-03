var mapSectionClickModule = (function(informationCard){
  map.on('click', function (e) {
    console.log(e);
    var features = map.queryRenderedFeatures(e.point, { layers: ['advance-fill'] });
    if (!features.length) {
      features = map.queryRenderedFeatures(e.point, { layers: ['gfl-fill'] });
      console.log(features);
      if (features.length) {
        let tempPoint = {
          coordinates: [e.lngLat.lng, e.lngLat.lat],
          type: "Point"
        };
        console.log(tempPoint);
        map.getSource('single-point').setData(tempPoint);
        let feature = features[0];
        console.log(feature);
        map.flyTo({
            center: [e.lngLat.lng, e.lngLat.lat],
            zoom: 14,
            bearing: 0,

            // These options control the flight curve, making it move
            // slowly and zoom out almost completely before starting
            // to pan.
            speed: 2, // make the flying slow
            curve: 1, // change the speed at which it zooms out

            // This can be any easing function: it takes a number between
            // 0 and 1 and returns another number between 0 and 1.
            easing: function (t) {
                return t;
            }
        });
        $.getJSON('https://api.mapbox.com/geocoding/v5/mapbox.places/'+e.lngLat.lng+'%2C'+e.lngLat.lat+'.json?access_token=pk.eyJ1Ijoic2x1c2Fyc2tpZGRldHJvaXRtaSIsImEiOiJjaXZsNXlwcXQwYnY5MnlsYml4NTJ2Mno4In0.8wKUnlMPIlxq-eWH0d10-Q', function( data ) {
          console.log(data.features[0].place_name);
          document.querySelector('.info-container > .street-name').innerHTML = data.features[0].place_name.split(',')[0];
        });
        $.getJSON('http://gis.detroitmi.gov/arcgis/rest/services/Services/services/MapServer/0/query?where=&text=&objectIds=&time=&geometry='+e.lngLat.lng+'%2C+'+e.lngLat.lat+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data ) {
          console.log(data);
          document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> ' + capitalizeFirstLetter(data.features[0].attributes.contractor);
          document.querySelector('.info-container > .garbage').innerHTML = '<span>Garbage:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day);
          document.querySelector('.info-container > .recycle').innerHTML = '<span>Recycle:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + '-' + capitalizeFirstLetter(data.features[0].attributes.week);
          document.querySelector('.info-container > .bulk').innerHTML = '<span>Bulk:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day) + '-' + capitalizeFirstLetter(data.features[0].attributes.week);
          document.querySelector('.info-container > input[name="route-id"]').value = data.features[0].attributes.FID;
          document.querySelector('.info-container > input[name="lng"]').value = e.lngLat.lng;
          document.querySelector('.info-container > input[name="lat"]').value = e.lngLat.lat;
          (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
        });
      }else{
        console.log('No data on point');
      }
      return;
    }else{
      let tempPoint = {
        coordinates: [e.lngLat.lng, e.lngLat.lat],
        type: "Point"
      };
      console.log(tempPoint);
      map.getSource('single-point').setData(tempPoint);
      let feature = features[0];
      console.log(feature);
      map.flyTo({
          center: [e.lngLat.lng, e.lngLat.lat],
          zoom: 14,
          bearing: 0,
          speed: 2,
          curve: 1,
          easing: function (t) {
              return t;
          }
      });
      $.getJSON('https://api.mapbox.com/geocoding/v5/mapbox.places/'+e.lngLat.lng+'%2C'+e.lngLat.lat+'.json?access_token=pk.eyJ1Ijoic2x1c2Fyc2tpZGRldHJvaXRtaSIsImEiOiJjaXZsNXlwcXQwYnY5MnlsYml4NTJ2Mno4In0.8wKUnlMPIlxq-eWH0d10-Q', function( data ) {
        console.log(data.features[0].place_name);
        document.querySelector('.info-container > .street-name').innerHTML = data.features[0].place_name.split(',')[0];
      });
      $.getJSON('http://gis.detroitmi.gov/arcgis/rest/services/Services/services/MapServer/0/query?where=&text=&objectIds=&time=&geometry='+e.lngLat.lng+'%2C+'+e.lngLat.lat+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data ) {
        console.log(data);
        document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> ' + capitalizeFirstLetter(data.features[0].attributes.contractor);
        document.querySelector('.info-container > .garbage').innerHTML = '<span>Garbage:</span> ' + capitalizeFirstLetter(data.features[0].attributes.day);
        document.querySelector('.info-container > .recycle').innerHTML = '<span>Recycle:</span> ' + capitalizeFirstLetter(data.features[1].attributes.day) + '-' + capitalizeFirstLetter(data.features[1].attributes.week);
        document.querySelector('.info-container > .bulk').innerHTML = '<span>Bulk:</span> ' + capitalizeFirstLetter(data.features[2].attributes.day) + '-' + capitalizeFirstLetter(data.features[2].attributes.week);
        document.querySelector('.info-container > input[name="lng"]').value = e.lngLat.lng;
        document.querySelector('.info-container > input[name="lat"]').value = e.lngLat.lat;
        (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
      });
    }
  });
})(window);
