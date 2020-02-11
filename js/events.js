var url = new URL(window.location.href);
var listDiv = document.getElementById('list');
var fetch_gps_url = "https://www.party-spot.de/api/get_events_by_pos.php";

var city = url.searchParams.get("city");

var events;


function eventsByGPS() {
    
    function fetchByGPS(position) {

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


if (!city) {
    // gps option chosen
    console.log("GPS");
    eventsByGPS();
} else {}