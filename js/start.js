
const overlay = document.querySelector('#overlay');
const city_select = document.querySelector('#city-select');



function cityChanging() {
    overlay.style.display = "block";
    city_select.style.display = "block";
}

function closeOverlay() {
    city_select.style.display = "none";
    overlay.style.display = "none";
}