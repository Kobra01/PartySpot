var url = new URL(window.location.href);
var fetch_gps_url = "api/get_events_by_pos.php";
var fetch_city_url = "api/get_events_by_city.php"
var distance_const = 111120;

var city = url.searchParams.get("city");
var last_position = 'unknown';


const content = document.querySelector('#content');
const loader = document.querySelector('#loader-card');


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

function eventsByGPS() {
    
    function fetchByGPS(position) {
        last_position = position;

        const data = {
            user_lat: position.coords.latitude,
            user_long: position.coords.longitude
        };

        fetch(fetch_gps_url, {
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
                sessionStorage.setItem('events', JSON.stringify(response.events));
                showEvents(response.events);
            }
        })
        
    }

    function showGPSError(error) {
        alert("Ein Fehler ist aufgetreten. Standort nicht gefunden.");
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.log("Benutzer lehnte Standortabfrage ab.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Standortdaten sind nicht verfügbar.");
                break;
            case error.TIMEOUT:
                console.log("Die Standortabfrage dauerte zu lange (Time-out).");
                break;
            case error.UNKNOWN_ERROR:
                console.log("unbekannter Fehler.");
                break;
        }
    }


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchByGPS, showGPSError);
    } else { 
        alert('Ihr Browser unterstützt keine Geolocation.');
    }
}

function eventsByCity() {
    
}

function showEvents(events) {
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        var card = document.createElement('a');
        var headline = document.createElement('h1');
        var location_node = document.createElement('div');
        var distance = document.createElement('h4');
        var loc_name = document.createElement('h3');
        var date = document.createElement('h2');
        var time = document.createElement('i');
        var text = document.createElement('p');
        card.classList.add('card');
        headline.classList.add('headline');
        location_node.classList.add('location');
        distance.classList.add('distance');
        loc_name.classList.add('name');
        date.classList.add('date');
        time.classList.add('time');
        text.classList.add('text');

        var date_obj = new Date(event.date);

        card.href = 'event.html';
        headline.innerText = event.name;
        if (last_position != 'unknown') {
            distance.innerText = calcDistance(event.latitude, event.longitude) + 'km';
        }
        loc_name.innerText = event.location;
        date.innerText = date_obj.getDate() + '.' + (date_obj.getMonth() + 1) + '. ';
        time.innerText = event.time.substr(0, 5) + ' Uhr';
        text.innerText = event.description;

        location_node.appendChild(distance);
        location_node.appendChild(loc_name);
        date.appendChild(time);

        card.appendChild(headline);
        card.appendChild(location_node);
        card.appendChild(date);
        card.appendChild(text);

        content.insertBefore(card, loader);
    }
    content.removeChild(loader);
}


if (!city) {
    // gps option chosen
    console.log("GPS");
    eventsByGPS();
} else {}