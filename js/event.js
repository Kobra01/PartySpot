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
            showFooter(response.event);
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
    if (last_position != null && last_position != 'undefined') {
        distance.innerText = 'etwa ' + calcDistance(event.latitude, event.longitude) + 'km entfernt';
    }
    text.innerText = event.description;

    card.appendChild(date);
    card.appendChild(headline);
    card.appendChild(time);
    card.appendChild(location_header);
    card.appendChild(loc_name);
    if (last_position != null && last_position != 'undefined') {
        card.appendChild(distance);
    }
    card.appendChild(text);

    content.insertBefore(card, loader);
    content.removeChild(loader);
}

function showFooter(event) {
    // Whatsapp Share
    var wa = document.createElement('a');
    var wa_icon = document.createElement('img');
    var wa_text = document.createElement('p');
    wa.classList.add('btn');
    wa_text.classList.add('info');
    wa_text.classList.add('with-icon');

    wa_icon.src = 'img/whatsapp-glyph-black.svg';
    wa_icon.alt = 'WhatsApp Logo';
    wa_text.innerText = 'WhatsApp';

    var date_obj = new Date(event.date);

    var message_text = 'Am ' + date_obj.getDate() + '.' + (date_obj.getMonth() + 1) + '. *' + event.name + '* -- ' + url;
    wa.href = 'https://wa.me/?text=' + encodeURI(message_text);

    wa.appendChild(wa_icon);
    wa.appendChild(wa_text);
    footer.appendChild(wa);


    // Share general
    var share = document.createElement('button');
    var share_icon = document.createElement('img');
    var share_text = document.createElement('p');
    share.classList.add('btn');
    share_text.classList.add('info');
    share_text.classList.add('with-icon');

    share_icon.src = 'img/ic_share_48px.svg';
    share_icon.alt = 'Share Icon';
    share_text.innerText = 'Teilen';

    share.appendChild(share_icon);
    share.appendChild(share_text);
    footer.appendChild(share);

    var date_obj = new Date(event.date);

    const shareData = {
        title: 'Party-Spot.de',
        text: 'Am ' + date_obj.getDate() + '.' + (date_obj.getMonth() + 1) + '. ' + event.name,
        url: url,
    }

    share.addEventListener('click', async () => {
        try {
          await navigator.share(shareData)
        } catch(err) {
          console.log('Error: ' + err);
        }
        console.log('Shared successfully');
    });
}



if (last_position != null && last_position != 'undefined') {
    console.log('Position found: ' + JSON.stringify(last_position));
} else {
    console.log('keine position');
}

if (id) {
   fetchEvent(); 
}