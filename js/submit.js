const url = 'api/submit_event.php';

const content = document.querySelector('#wrapper');
const output = document.querySelector('#output');
const form = document.querySelector('#form');
const name = document.querySelector('#name');
const location_text = document.querySelector('#location');
const city = document.querySelector('#city');
const date = document.querySelector('#date');
const time = document.querySelector('#time');
const description = document.querySelector('#description');
const creator = document.querySelector('#creator_name');
const contact = document.querySelector('#contact');

form.addEventListener('submit', onSubmit);


function onSubmit(e) {
    e.preventDefault();
    console.log('submitted');

    output.innerText = 'Bitte warten';

    if (
        name.value === '' ||
        location_text.value === '' ||
        city.value === '' ||
        date.value === '' ||
        time.value === '' ||
        description.value === '' ||
        creator.value === '' ||
        contact.value === ''
    ) {
        console.log('fields are missing');

        output.innerHTML = 'Bitte alle Felder ausfüllen!';

        setTimeout(() => {
            output.innerHTML = '';
        }, 3000);
        return;
    }

    var nl = '<br>';
    var email_text = 'Ein neues Event für Party-Spot.de wurde eingereicht.' + nl +
                    'Bitte schnellstmöglich prüfen und eintragen!' + nl +
                    nl +
                    name.value + nl +
                    'Ort: ' + location_text.value + nl +
                    'Stadt: ' + city.value + nl +
                    'Datum: ' + date.value + nl +
                    'Zeit: ' + time.value + nl +
                    'Beschreibung: ' + nl + description.value + nl +
                    'Eingereicht von: ' + creator.value + nl +
                    'Kontakt: ' + contact.value + nl;

    const data = {
        content: encodeURI(email_text)
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
    location_text.value = '';
    city.value = '';
    date.value = '';
    time.value = '';
    description.value = '';
    creator.value = '';
    contact.value = '';
}