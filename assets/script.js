var apiKey = 'c0001fbafb63917b62e73b0c9b643410';
var citySearchBtn = document.querySelector('#searchbtn');
var cityInput = document.getElementById('cityinput');
var cityNameEl = document.querySelector('#resultcity-text');
var currentDateEl = document.querySelector('#current-date');
var currentTempEl = document.querySelector('#current-temp');
var currentHumidityEl = document.querySelector('#current-humid')
var currentWindEl = document.querySelector('#current-wind');
var currentIconEl = document.querySelector('#current-icon');
// var currentUVEl = document.querySelector('#current-uv');


function getCityParams() {
    var searchParamsArr = document.location.search.split('&');
    var cityParam = searchParamsArr[0].split('=').pop();
    console.log(searchParamsArr);
    var locQueryUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityParam + ',US' + '&appid=' + apiKey;
    console.log(locQueryUrl);
    fetch(locQueryUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }

            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var cityLat = data[0].lat;
            var cityLon = data[0].lon;
            var cityName = data[0].name;
            cityNameEl.textContent = cityName;
            currentWeather(cityLat, cityLon);
        })
}

function currentWeather(cityLat, cityLon) {
    var currentQueryURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + cityLat + '&lon=' + cityLon + '&appid=' + apiKey + '&units=imperial';
    fetch(currentQueryURL)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var currentIcon = data.weather[0].icon
            var currentIconURL = 'http://openweathermap.org/img/wn/' + currentIcon + '.png';
            var currentTemp = data.main.temp;
            var currentHumid = data.main.humidity;
            var currentWind = data.wind.speed;
            var currentDate = data.dt;
            var currentDateConvert = Intl.DateTimeFormat('en-US').format(currentDate * 1000);
            currentDateEl.textContent = currentDateConvert;
            currentIconEl.innerHTML = '<img src="' + currentIconURL + '"></img>';
            currentTempEl.textContent = currentTemp;
            currentHumidityEl.textContent = currentHumid;
            currentWindEl.textContent = currentWind;
            weatherForecast(cityLat, cityLon);
        })
}

function weatherForecast(cityLat, cityLon) {
    var forecastQueryUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&appid=' + apiKey + '&units=imperial';
    fetch(forecastQueryUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data)

        })
}



function searchSubmit(event) {
    event.preventDefault();

    if (!cityInput.value) {
        console.error('You need a search input value!');
        return;
    }

    var queryString = './index.html?q=' + cityInput.value + '&apikey=' + apiKey;
    location.assign(queryString);
    console.log(queryString);

}

citySearchBtn.addEventListener('click', searchSubmit);


getCityParams();