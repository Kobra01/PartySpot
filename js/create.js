const url = 'api/create_event.php';

const content = document.querySelector('#wrapper');
const output = document.querySelector('#output');
const form = document.querySelector('#form');
const name = document.querySelector('#name');
const description = document.querySelector('#description');
const city = document.querySelector('#city');
const location_text = document.querySelector('#location');
const latitude = document.querySelector('#latitude');
const longitude = document.querySelector('#longitude');
const date = document.querySelector('#date');
const time = document.querySelector('#time');
const code = document.querySelector('#code');
const load = document.createElement('DIV');

form.addEventListener('submit', onSubmit);
load.classList.add('card');
load.classList.add('spinner');


function onSubmit(e) {
    e.preventDefault();
    console.log('submitted');

    output.innerText = 'Bitte warten';

    if (
        name.value === '' ||
        description.value === '' ||
        city.value === '' ||
        location_text.value === '' ||
        latitude.value === '' ||
        longitude.value === '' ||
        date.value === '' ||
        time.value === '' ||
        code.value === ''
    ) {
        console.log('fields are missing');

        output.innerHTML = 'Bitte alle Felder ausfüllen!';

        setTimeout(() => {
            output.innerHTML = '';
        }, 3000);
        return;
    }

    const data = {
        name: name.value,
        description: description.value,
        city: city.value,
        location: location_text.value,
        lat: latitude.value,
        long: longitude.value,
        date: date.value,
        time: time.value,
        code: code.value
    };

    fetch(url, {
        method: 'POST', // or 'PUT'
        mode: 'cors',
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    .then(response => {
        console.log('Success:', JSON.stringify(response));

        if (response.error) {
            output.innerHTML = response.message;

            setTimeout(() => {
                output.innerHTML = '';
            }, 10000);
        } else {
            output.innerHTML = response.message;

            setTimeout(() => {
                output.innerHTML = '';
            }, 15000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        output.innerHTML = 'Fehler';

        setTimeout(() => {
            output.innerHTML = '';
        }, 7000);
    });

    name.value = '';
    description.value = '';
    city.value = '';
    location_text.value = '';
    latitude.value = '';
    longitude.value = '';
    date.value = '';
    time.value = '';
    code.value = '';
}
