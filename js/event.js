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
            showEvent(response.event);
        }
    })
}

function showEvent(event) {
    var card = document.createElement('div');
    var date = document.createElement('h2');
    var headline = document.createElement('h1');
    var time = document.createElement('h2');
    var location_header = document.createElement('h3');
    var loc_name = document.createElement('h3');
    var distance = document.createElement('h4');
    var text = document.createElement('p');
    card.classList.add('card');
    date.classList.add('date');
    headline.classList.add('headline');
    time.classList.add('time');
    location_header.classList.add('location-header');
    loc_name.classList.add('name');
    distance.classList.add('distance');
    text.classList.add('text');

    var date_obj = new Date(event.date);


    date.innerText = 'Am ' + date_obj.getDate() + '.' + (date_obj.getMonth() + 1) + '.';
    headline.innerText = event.name;
    time.innerText = 'um ' + event.time.substr(0, 5) + ' Uhr';
    location_header.innerText = 'Ort:';
    loc_name.innerText = event.location;
    if (last_position.coords) {
        distance.innerText = calcDistance(event.latitude, event.longitude) + 'km';
    }
    text.innerText = event.description;

    card.appendChild(date);
    card.appendChild(headline);
    card.appendChild(time);
    card.appendChild(location_header);
    card.appendChild(loc_name);
    if (last_position.coords) {
        card.appendChild(distance);
    }
    card.appendChild(text);

    content.insertBefore(card, loader);
    content.removeChild(loader);
}



if (id) {
   fetchEvent(); 
}

if (last_position.coords) {
    console.log('Position found: ' + JSON.stringify(last_position));
} else {
    console.log('keine position');
}