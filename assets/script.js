var apiKey = 'c0001fbafb63917b62e73b0c9b643410';
var citySearchBtn = document.querySelector('#searchbtn');
var cityInput = document.getElementById('cityinput');
var cityNameEl = document.querySelector('#resultcity-text');
var currentDateEl = document.querySelector('#current-date');
var currentTempEl = document.querySelector('#current-temp');
var currentHumidityEl = document.querySelector('#current-humid')
var currentWindEl = document.querySelector('#current-wind');
var currentIconEl = document.querySelector('#current-icon');
var forecastContainer = document.querySelector("#forecast-container");
var forecastCards = document.querySelectorAll(".card");
var searhContainer = document.querySelector('#search-container');




function getCityParams() {
    var searchParamsArr = document.location.search.split('&');
    var cityParam = searchParamsArr[0].split('=').pop();
    console.log(searchParamsArr);
    var locQueryUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityParam + ',US' + '&appid=' + apiKey;
    console.log(locQueryUrl);
    if(!cityParam) {
        console.log('Please enter a city');
        return;
    }
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
            var currentIconURL = 'http://openweathermap.org/img/wn/' + currentIcon + '@2x.png';
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

            for (i = 7; i < data.list.length; i = i + 8) {
                var resultCard = document.createElement('div');
                resultCard.classList.add('card', 'm-1');
                resultCard.style.width = '10rem';

                var resultBody = document.createElement('div');
                resultBody.classList.add('card-body');
                resultCard.append(resultBody);

                var forecastIconEl = document.createElement('p');
                var forecastIcon = data.list[i].weather[0].icon;
                var forecastIconURL = 'http://openweathermap.org/img/wn/' + forecastIcon + '.png';
                forecastIconEl.innerHTML = '<img src="' + forecastIconURL + '"></img>';

                var forecastDateEl = document.createElement('p');
                forecastDateEl.innerHTML = data.list[i].dt_txt;
                var forecastTempEl = document.createElement('p');
                forecastTempEl.innerHTML = 'Temp: ' + data.list[i].main.temp + '°F';
                var forecastHumidEl = document.createElement('p');
                forecastHumidEl.innerHTML = 'Humidity: ' + data.list[i].main.humidity + '%';
                var forecastWindEl = document.createElement('p');
                forecastWindEl.innerHTML = 'Wind Speed: ' + data.list[i].wind.speed + 'mph';
                resultBody.append(forecastDateEl, forecastIconEl, forecastTempEl, forecastHumidEl, forecastWindEl);
                forecastContainer.append(resultCard);

            }

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

function renderSearches() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    cities = storedCities
    if (!cities) {
        console.log('no saved inputs yet')
    } else {
    for (i = 0; i < cities.length; i++) {
        var city = cities[i];
        var buttonEl = document.createElement('button');
        buttonEl.classList.add('btnEl', 'btn', 'btn-info', 'm-2');
        buttonEl.innerHTML = city;
        searhContainer.append(buttonEl);
        prevSearchSubmit(buttonEl)
    }
    } 
}


function prevSearchSubmit(buttonEl) {
        buttonEl.addEventListener('click', function (event) {
            event.preventDefault();
            prevQueryString = './index.html?q=' + buttonEl.innerHTML + '&apikey=' + apiKey;
            location.assign(prevQueryString);
            console.log(prevQueryString)
        })

}




citySearchBtn.addEventListener('click', searchSubmit);
citySearchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    var cityText = cityInput.value;
    if (cityText === "") {
        return;
    }
    cities.push(cityText);
    cityInput.value = "";
    localStorage.setItem("cities", JSON.stringify(cities));

})


getCityParams();
renderSearches();
