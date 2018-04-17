//Variables that are needed to create correct rest calls
var deviceNetworkId = "INSERT-YOUR-DEVICE-NETWORK-ID-HERE";
var deviceId = "INSERT-YOUR-DEVICE-ID-HERE";
var sObjIdLocation;
var sObjIdTemperature;
var sObjIdAccelerometer;
var iotApiKey = "INSERT YOUR IOT API-KEY HERE";
var apiBase = "https://iotabusinesslab-api.sensbysigma.com"
var currentLocation;

// ******************* REST Calls ******************* //
//This function will get smart object ids for location,
//temperature and accelerometer
function updateSmartObjectIds() {
  superagent
    .get(apiBase +'/api/v3/devices/' + deviceId)
    .set('Authorization', 'Bearer ' + iotApiKey)
    .set('X-DeviceNetwork', deviceNetworkId)
    .set('Accept', 'application/json')
    .then(function(res) {
      for (var item = 0; item < res.body.SmartObjects.length; item++){
        // look for the entry with a matching `name` value
        if (res.body.SmartObjects[item].Name == 'Location'){
            sObjIdLocation = res.body.SmartObjects[item].Id;
        }
        if (res.body.SmartObjects[item].Name == 'Temperature'){
            sObjIdTemperature = res.body.SmartObjects[item].Id;
        }
        if (res.body.SmartObjects[item].Name == 'Accelerometer'){
            sObjIdAccelerometer = res.body.SmartObjects[item].Id;
        }
      }
      return 'OK'
    })
    .catch(function(err) {
      alert('Error! ' + err);
    });
}

//This function will get value for the latest location
function getLatestLocationValue() {
  superagent
    .get(apiBase +'/api/v3/smartobjects/'+ sObjIdLocation + '/resources/values')
    .set('Authorization', 'Bearer ' + iotApiKey)
    .set('X-DeviceNetwork', deviceNetworkId)
    .set('Accept', 'application/json')
    .then(function(res) {
      var lat = null;
      var lon = null;
      var location = null;
      for (var item = 0; item < res.body.Resources.length; item++){
        // look for the entry with a matching `name` value
        if (res.body.Resources[item].Name == 'Latitude'){
            lat = res.body.Resources[item].LatestMeasurement.sv;
        }
        if (res.body.Resources[item].Name == 'Longitude'){
            lon = res.body.Resources[item].LatestMeasurement.sv;
        }
      }
      devicePosition = {lat: lat, lng: lon};
      return 'OK'
    })
    .catch(function(err) {
      alert('Error!' + err);
    });
}
