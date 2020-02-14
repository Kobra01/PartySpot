var url = new URL(window.location.href);
var fetch_url = "api/get_event_details.php";
var distance_const = 111120;

var id = url.searchParams.get("id");
var last_position = JSON.parse(sessionStorage.getItem('last_position'));

const content = document.querySelector('#content');
const loader = document.querySelector('#loader-card');
const footer = document.querySelector('#footer');


function calcDistance(latitude, longitude) {
    
    var latInMeter = distance_const;
    var longInMeter = distance_const * Math.cos(last_position.coords.latitude * Math.PI / 180);

    var distanceLat = Math.abs(latitude - last_position.coords.latitude);
    var distanceLong = Math.abs(longitude - last_position.coords.longitude);

    var distanceLatInMeter = distanceLat * latInMeter;
    var distanceLongInMeter = distanceLong * longInMeter;

    var distance = Math.sqrt(Math.pow(distanceLatInMeter, 2) + Math.pow(distanceLongInMeter, 2));

    return Math.round((distance / 1000));
}

function fetchEvent() {
    const data = {
        id: id
    };

    fetch(fetch_url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // data can be `string` or {object}
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(response => {
        console.log('Success:', JSON.stringify(response));
        if (response.error) {

        } else {
            // showEvent(response.event);
        }
    })
}





if (id) {
   fetchEvent(); 
}

if (last_position) {
    console.log('Position found: ' + JSON.stringify(last_position));
} else {
    console.log('keine position');
}