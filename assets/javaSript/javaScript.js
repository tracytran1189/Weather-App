//fetch data from weather API
var apiKey = "0a049cb78e7e615e6af6861a230a5dd9";
var getCityForecast = function (cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    return fetch(apiUrl).then(function (response) {
        return response.json().then(data => {
            var { lat, lon } = data.coord;
            return getOneCallApi(lat, lon).then(oneCallResponse => {
                return {
                    currentWeatherReponse: data,
                    oneCallResponse
                }
            });
        });
    });
};

var searchHistory = localStorage.getItem('search-history');

// if no search history, set as empty list
if (!searchHistory) {
    searchHistory = [];
    localStorage.setItem('search-history', JSON.stringify(searchHistory));
} else {
    searchHistory = JSON.parse(searchHistory);
}

var getOneCallApi = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    return fetch(apiUrl).then(function (response) {
        return response.json().then(data => data);
    });
}

//add onClick for search button
var searchButton = document.getElementById('search-button');
var cityInput = document.getElementById('city');

searchButton.onclick = (event) => {
    event.preventDefault();
    var cityName = cityInput.value;

    console.log('search', cityName);
    showWeatherData(cityName);
};

//show searched list
var searchedContainer = document.getElementById('searched-container');
showSearchHistory();

function showSearchHistory() {

    // remove child elements if they exist
    while (searchedContainer.firstChild) {
        searchedContainer.removeChild(searchedContainer.firstChild);
    }

    for (var i=0; i<searchHistory.length; i++) {
        var searchItem = document.createElement('div');
        var searchItemButton = document.createElement('button');
        searchItemButton.className="city-button btn-outline-secondary mt-2 w-100"
        searchItemButton.textContent = searchHistory[i];
        searchItemButton.onclick = function(event) {
            var cityName = event.target.innerText;
            showWeatherData(cityName);
        }
    
        searchItem.append(searchItemButton);
        searchedContainer.append(searchItem);
    }
}

function showWeatherData(cityName) {
    getCityForecast(cityName).then(data => {
        console.log('city data', data);
    
        var currentWeather = data.oneCallResponse.current;
        var cityName = data.currentWeatherReponse.name;
        setCurrentWeather(currentWeather, cityName);
        setFutureForecast(data.oneCallResponse.daily);
    
        addToSearchHistory(cityName);
        showSearchHistory();
    });
}

//get data for current weather
function setCurrentWeather(currentWeather, cityName) {

    var cityNameEl = document.getElementById('city-name');
    cityNameEl.textContent = `${cityName} (${(new Date()).toLocaleDateString()})`
    var currentIconSpan = document.createElement('span');
    var currentIcon = document.createElement('img');
    currentIcon.src = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`
    currentIconSpan.append(currentIcon);
    cityNameEl.append(currentIconSpan);

    var tempValue = document.querySelector('#city-temp .value');
    tempValue.textContent = `${currentWeather.temp}°F`;

    var windValue = document.querySelector('#city-wind .value');
    windValue.textContent = `${currentWeather.wind_speed} mph`

    var humidityValue = document.querySelector('#city-humidity .value');
    humidityValue.textContent = `${currentWeather.humidity}%`

    var uvValue = document.querySelector('#city-uv .value');
    uvValue.textContent = `${currentWeather.uvi}`

    showUvCode();
}

//show color code for UV index
var showUvCode = function () {

    var uvValue = document.querySelector('#city-uv .value');

    if (uvValue.textContent <= 2) {
        uvValue.className = 'value favorable px-2'
    } else if (uvValue.textContent > 2 && uvValue.textContent <= 8) {
        uvValue.className = 'value moderate px-2'
    } else {
        uvValue.className = 'value severe px-2'
    };
}

//get data for 5 days forecast
function setFutureForecast(dailyForecasts) {

    var futureForecastContainer = document.getElementById('5-days-row');
    // remove child elements if they exist
    while (futureForecastContainer.firstChild) {
        futureForecastContainer.removeChild(futureForecastContainer.firstChild);
    }

    for (var i = 1; i < 6; i++) {
        addFutureForecast(dailyForecasts[i], i);
    }
}
function addFutureForecast(forecast, dayIndex) {
    var futureForecastContainer = document.getElementById('5-days-row');
    var foreCastEl = document.createElement('div');
    foreCastEl.id = `future-forecast-${dayIndex} `;
    foreCastEl.className = 'future-forecast col m-2';

    var dateEl = document.createElement('div');
    dateEl.textContent = (new Date(forecast.dt * 1000)).toLocaleDateString();
    foreCastEl.append(dateEl);

    var weatherIconCode = forecast.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
    var iconEl = document.createElement('img');
    iconEl.src = iconUrl;
    foreCastEl.append(iconEl);

    var tempEl = document.createElement('div');
    tempEl.textContent = ("Temp: " + forecast.temp.day + "°F");
    foreCastEl.append(tempEl);

    var windEl = document.createElement('div');
    windEl.textContent = ("Wind: " + forecast.wind_speed + "mph");
    foreCastEl.append(windEl);

    var humidityEl = document.createElement('div');
    humidityEl.textContent = ("Humidity: " + forecast.humidity + "%");
    foreCastEl.append(humidityEl);

    futureForecastContainer.append(foreCastEl);
}

function addToSearchHistory(cityName) {

    var duplicateIndex = searchHistory.findIndex(x => cityName.toUpperCase() === x.toUpperCase());
    if (duplicateIndex !== -1) {
        searchHistory.splice(duplicateIndex, 1);
    }

    searchHistory.unshift(cityName);

    if (searchHistory.length > 5) {
        searchHistory.pop();
    }

    localStorage.setItem('search-history', JSON.stringify(searchHistory));
}