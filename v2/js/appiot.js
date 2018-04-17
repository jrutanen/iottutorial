//Variables that are needed to create correct rest calls
var iotApiKey = "INSERT YOUR IOT API-KEY HERE";
var deviceNetworkId = "INSERT-YOUR-DEVICE-NETWORK-ID-HERE";
var deviceId = "INSERT-YOUR-DEVICE-ID-HERE";
var apiBase = "https://iotabusinesslab-api.sensbysigma.com"
//Variables to store the smart object ids
var sObjIdLocation;
var sObjIdTemperature;
var sObjIdAccelerometer;

// ******************* REST Calls ******************* //
/**
 * This function will get smart object ids for location,
 * temperature and accelerometer and save the ids into variables
 * that can be used later when data is fetched.
 *
 * If the function can't get the data will show alert with
 * error info.
 */
function getSmartObjectIds() {
  superagent
    //rest call to fetch the device data
    .get(apiBase +'/api/v3/devices/' + deviceId)
    //update header of the request 
    .set('Authorization', 'Bearer ' + iotApiKey)
    .set('X-DeviceNetwork', deviceNetworkId)
    .set('Accept', 'application/json')
    //actions after the response is received from the server 
    .then(function(res) {
      // Loop through the smart objects for the device to find id
      // for Location, Temperature and Accelerometer smart objects
      for (var item = 0; item < res.body.SmartObjects.length; item++){
        // look for the entry with a matching `Name` value
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
    //actions if http status received from the server is not OK 
    .catch(function(err) {
      alert('Error! ' + err);
    });
}

/**
 * This function will get the latest position reading from the
 * Location smart object
 *
 * If the function can't get the data will show alert with
 * error info.
 */
function getLatestLocationValue() {
  superagent
     //rest call to fetch the values from location smart object
    .get(apiBase +'/api/v3/smartobjects/'+ sObjIdLocation + '/resources/values')
    //update header of the request 
    .set('Authorization', 'Bearer ' + iotApiKey)
    .set('X-DeviceNetwork', deviceNetworkId)
    .set('Accept', 'application/json')
    //actions after the response is received from the server 
    .then(function(res) {
      var lat = null;
      var lon = null;
      // Loop through the Resources to get values for Latitude and Longitude
      for (var item = 0; item < res.body.Resources.length; item++){
        if (res.body.Resources[item].Name == 'Latitude'){
            lat = res.body.Resources[item].LatestMeasurement.sv;
        }
        if (res.body.Resources[item].Name == 'Longitude'){
            lon = res.body.Resources[item].LatestMeasurement.sv;
        }
      }
      //update global variable that is used is used position of the map marker.
      //variable is defined in the index.html file
      devicePosition = {lat: lat, lng: lon};
      return 'OK'
    })
    //actions if http status received from the server is not OK 
    .catch(function(err) {
      alert('Error!' + err);
    });
}
