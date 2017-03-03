(function(){
  var firstLoadCalendar = true;
  var today = moment().format();
  var events = [];
  var year = moment().year();
  var createEventObject = function createEventObject(data) {
    let  tempEventObject = {
      'trash': {
        "dayOfWeek": data.features[0].attributes.day,
        "schedule": "weekly",
        "AorB": null,
        "startDate": null,
        "endDate": null
      },
      "recycling": {
        "dayOfWeek": null,
        "schedule": "biweekly",
        "AorB": null,
        "startDate": null,
        "endDate": null
      },
      "bulk": {
        "dayOfWeek": null,
        "schedule": "biweekly",
        "AorB": null,
        "startDate": null,
        "endDate": null
      }
    };
    if(data.features.length > 1){
      tempEventObject.recycling.dayOfWeek = data.features[1].attributes.day;
      tempEventObject.recycling.AorB = data.features[1].attributes.week;
      tempEventObject.bulk.dayOfWeek = data.features[2].attributes.day;
      tempEventObject.bulk.AorB = data.features[2].attributes.week;
    }else{
      tempEventObject.recycling.dayOfWeek = data.features[0].attributes.day;
      tempEventObject.recycling.AorB = data.features[0].attributes.week;
      tempEventObject.bulk.dayOfWeek = data.features[0].attributes.day;
      tempEventObject.bulk.AorB = data.features[0].attributes.week;
    }
    return tempEventObject;
  };
  function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
  }

  function weeksInYear(year) {
    var month = 11, day = 31, week;
    // Find week that 31 Dec is in. If is first week, reduce date until
    // get previous week.
    do {
      d = new Date(year, month, day--);
      week = getWeekNumber(d)[1];
    } while (week == 1);
    return week;
  }
  var addEventToList = function addeEventToList(year,weeks,eventType,eventInfo) {
    // Add garbage pickup day every week
    console.log(year);
    console.log(weeks);
    console.log(eventInfo);
    for (var i = 1; i < weeks; i++) {
      let title = eventType + ' pick up';
      let eventObj = {
        title : title,
        start : ''
      };
      switch (eventType) {
        case 'Garbage':
            eventObj.rendering = 'background';
              eventObj.start = moment().year(year).week(i).day(eventInfo.dayOfWeek).format("YYYY-MM-DD");
          break;

        case 'Recycle':
            eventObj.color = '#068A24';
              eventObj.start = moment().year(year).week(i).day(eventInfo.dayOfWeek).format("YYYY-MM-DD");
          break;

        case 'Yard waste':
            eventObj.color = '#DF5800';
              eventObj.start = moment().year(year).week(i).day(eventInfo.dayOfWeek).format("YYYY-MM-DD");
          break;

        case 'Bulk':
            eventObj.color = '#114BC7';
              eventObj.start = moment().year(year).week(i).day(eventInfo.dayOfWeek).format("YYYY-MM-DD");
          break;
        default:

      }
      console.log(eventObj);
      if(eventInfo.schedule === 'weekly'){
        events.push(eventObj);
      }else{
        if(eventInfo.startDate !== null){
          if(moment(eventObj.start).isBetween(eventInfo.startDate, eventInfo.endDate)){
            if((year % 2) !== 0){
              if(eventInfo.AorB === 'a'){
                ((i % 2) === 0) ? events.push(eventObj): 0;
              }else{
                ((i % 2) !== 0) ? events.push(eventObj): 0;
              }
            }else{
              if(eventInfo.AorB === 'a'){
                ((i % 2) !== 0) ? events.push(eventObj): 0;
              }else{
                ((i % 2) === 0) ? events.push(eventObj): 0;
              }
            }
          }
        }else{
          if((year % 2) !== 0){
            if(eventInfo.AorB === 'a'){
              ((i % 2) === 0) ? events.push(eventObj): 0;
            }else{
              ((i % 2) !== 0) ? events.push(eventObj): 0;
            }
          }else{
            if(eventInfo.AorB === 'a'){
              ((i % 2) !== 0) ? events.push(eventObj): 0;
            }else{
              ((i % 2) === 0) ? events.push(eventObj): 0;
            }
          }
        }
      }
    }
    console.log(events);
  };

  var loadEmergencyEventInfo = function loadEmergencyEventInfo(emergencyObjArr) {
    let tempHtml = '<h3>NOTICE</h3><article id="close-emergency-modal-btn-2"><img src="assets/img/error.png" alt="close"></img></article>';
    emergencyObjArr.forEach(function(item){
      tempHtml += '<p><strong>Normal Date:</strong> ' + moment(item.normalDay).format("dddd, MMMM Do YYYY") + '</p><p><strong>Reschedule Date:</strong> ' + moment(item.rescheduledDay).format("dddd, MMMM Do YYYY") + '</p><p>' + item.serviceType + ' services will be delay due to ' + item.reason + ' ' + item.note + '</p>';
    });
    document.querySelector('.emergency-container').innerHTML = tempHtml;
    document.getElementById('emergency-modal').className = 'active';
    document.getElementById('close-emergency-modal-btn-2').addEventListener('click', closeDisplayEmergencyEvent);
  };
  var displayEmergencyEvent = function displayEmergencyEvent(emergencyObjArr) {
    if(emergencyObjArr.length){
      loadEmergencyEventInfo(emergencyObjArr);
    }
  };
  var closeDisplayEmergencyEvent = function closeDisplayEmergencyEvent() {
    document.getElementById('emergency-modal').className = '';
  };
  var startCalendar = function startCalendar(sendData) {
    console.log(sendData);
    let listOfEvents = createEventObject(sendData);
    console.log(listOfEvents);
    console.log(year);
    addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Garbage',listOfEvents.trash);
    addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Recycle',listOfEvents.recycling);
    addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Bulk',listOfEvents.bulk);
    //addEventToList((year-1),(weeksInYear((year-1)) + weeksInYear(year) + weeksInYear((year+1))),'Yard waste',listOfEvents.yardWaste);
    console.log(events);
    $.ajax({
        url : 'http://codstaging.detroitmi.gov:8000/api/waste_schedule/changes/',
        type : 'GET',
        data : {
            'RouteID' : 10
        },
        dataType:'json',
        success : function(response) {
          console.log(response);
          displayEmergencyEvent(response);
          if(firstLoadCalendar){
            $('#calendar').fullCalendar({
              header: {
                left: 'prev,next',
                center: 'title',
                right: ''
              },
              defaultDate: today,
              navLinks: false, // can click day/week names to navigate views
              // businessHours: true, // display business hours
              editable: true,
              events: events
            });
            firstLoadCalendar = false;
          }else{
            $('#calendar').fullCalendar( 'addEventSource', events );
          }
        },
        error : function(request,error){
          console.log("Request: "+JSON.stringify(request));
        }
    });
  };

  var startCalendarServices = function startCalendarServices() {
    let tempAddr = document.querySelector('.street-name').innerHTML.split(' ');
    let newTempAddr = '';
    let size = tempAddr.length;
    tempAddr.forEach(function(item, index) {
      newTempAddr += item;
      ((index < size) && (index + 1) !== size) ? newTempAddr += '+': 0;
    });
    console.log(newTempAddr);
    let lng = document.querySelector('.info-container > input[name="lng"]').value;
    let lat = document.querySelector('.info-container > input[name="lat"]').value;
    console.log('lng:' + lng + ', lat:' + lat);
    $.getJSON('http://gis.detroitmi.gov/arcgis/rest/services/Services/services/MapServer/0/query?where=&objectIds=&time=&geometry='+lng+'%2C+'+lat+'&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelWithin&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson' , function( data , window) {
      console.log(data);
      startCalendar(data);
    });
  };
  var closeCalendar = function closeCalendar() {
    if(document.querySelector('#box-calendar').className === 'active'){
      document.querySelector('#box-calendar').className = '';
      events.length = 0;
      $('#calendar').fullCalendar('removeEvents');
      (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
    }else{
      document.querySelector('#box-calendar').className = 'active';
    }
  };
  var loadCalendarNow = function loadCalendarNow() {
    startCalendarServices();
    (document.querySelector('#info').className === 'active') ? document.querySelector('#info').className = '' : 0;
    closeCalendar();
  };
  document.getElementById('back-to-infor-btn').addEventListener('click', closeCalendar);
  document.querySelector('.calendar > article').addEventListener('click', loadCalendarNow);
})(window);
