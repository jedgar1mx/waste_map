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
        document.querySelector('.info-container > .street-name').innerHTML = 'Lng: '+e.lngLat.lng+ ', Lat: '+e.lngLat.lat;
        document.querySelector('.info-container > .provider').innerHTML = '<strong>Provider:</strong> ' + capitalizeFirstLetter(feature.properties.contractor);
        document.querySelector('.info-container > .garbage').innerHTML = '<strong>Garbage:</strong> ' + capitalizeFirstLetter(feature.properties.garbage);
        document.querySelector('.info-container > .recycle').innerHTML = '<strong>Recycle:</strong> ' + capitalizeFirstLetter(feature.properties.recycling) + '-' + capitalizeFirstLetter(feature.properties.section);
        document.querySelector('.info-container > .bulk').innerHTML = '<strong>Bulk:</strong> ' + capitalizeFirstLetter(feature.properties.bulk) + '-' + capitalizeFirstLetter(feature.properties.section);
        (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
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
      document.querySelector('.info-container > .street-name').innerHTML = 'Lng: '+e.lngLat.lng+ ', Lat: '+e.lngLat.lat;
      document.querySelector('.info-container > .provider').innerHTML = '<span>Provider:</span> ' + capitalizeFirstLetter(feature.properties.contractor);
      document.querySelector('.info-container > .garbage').innerHTML = '<span>Garbage:</span> ' + capitalizeFirstLetter(feature.properties.garbage);
      document.querySelector('.info-container > .recycle').innerHTML = '<span>Recycle:</span> ' + capitalizeFirstLetter(feature.properties.recycling) + '-' + capitalizeFirstLetter(feature.properties.section);
      document.querySelector('.info-container > .bulk').innerHTML = '<span>Bulk:</span> ' + capitalizeFirstLetter(feature.properties.bulk) + '-' + capitalizeFirstLetter(feature.properties.section);
      (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
    }
  });
})(window);
