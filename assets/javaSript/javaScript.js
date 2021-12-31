var apiKey= "0a049cb78e7e615e6af6861a230a5dd9";
var getCityForecast = function(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    return fetch(apiUrl).then(function(response) {
        return response.json().then(data => {
            var {lat, lon} = data.coord;
            return getOneCallApi(lat, lon).then(oneCallResponse => {
                return {
                    currentWeatherReponse: data,
                    oneCallResponse
                }
            });
        });
    });
};

var getOneCallApi = function(lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    return fetch(apiUrl).then(function(response) {
        return response.json().then(data => data);
    });
}

var searchButton = document.getElementById('search-button');
var cityInput = document.getElementById('city');

searchButton.onclick = (event) => {
    event.preventDefault();
    var cityName = cityInput.value;

    console.log('search', cityName);
    getCityForecast(cityName).then(data => {
        console.log('city data', data);

        var currentWeather = data.oneCallResponse.current;
        var cityName = data.currentWeatherReponse.name;
        setCurrentWeather(currentWeather, cityName);
        setFutureForecast(data.oneCallResponse.daily);
        localStorage.setItem(cityName,data);
       
    });
};

function setCurrentWeather(currentWeather, cityName) {

    var cityNameEl = document.getElementById('city-name');
    cityNameEl.textContent = `${cityName} (${(new Date()).toLocaleDateString()})`

    var tempValue = document.querySelector('#city-temp .value');
    tempValue.textContent = `${currentWeather.temp}°F`;

    var windValue = document.querySelector('#city-wind .value');
    windValue.textContent = `${currentWeather.wind_speed} mph`

    var humidityValue = document.querySelector('#city-humidity .value');
    humidityValue.textContent = `${currentWeather.humidity}%`

    var uvValue = document.querySelector('#city-uv .value');
    uvValue.textContent = `${currentWeather.uvi}`
}

function setFutureForecast(dailyForecasts) {
    for (var i=1; i<6; i++) {
       
        addFutureForecast(dailyForecasts[i], i);
        
    }
}
function addFutureForecast(forecast, dayIndex) {
    var futureForecastContainer = document.getElementById('5-days-row');
    var foreCastEl = document.createElement('div');
    foreCastEl.id = `future-forecast-${dayIndex} `;
    foreCastEl.className = 'future-forecast col border m-2';

    var dateEl = document.createElement('div');
    dateEl.textContent = (new Date(forecast.dt * 1000)).toLocaleDateString();
    foreCastEl.append(dateEl);

    // //add weather condition images
var clear =document.createElement('img');
clear.src="http://openweathermap.org/img/wn/01d@2x.png";
var clouds =document.createElement('img');
clouds.src="http://openweathermap.org/img/wn/02d@2x.png";
var snow =document.createElement('img');
snow.src="http://openweathermap.org/img/wn/13d@2x.png";
var rain =document.createElement('img');
rain.src="http://openweathermap.org/img/wn/10d@2x.png";
var drizzle =document.createElement('img');
drizzle.src="http://openweathermap.org/img/wn/04d@2x.png";
var thunderstorm =document.createElement('img');
thunderstorm.src="http://openweathermap.org/img/wn/11d@2x.png";
var atmoshere =document.createElement('img');
atmoshere.src="http://openweathermap.org/img/wn/50d@2x.png";
    if(forecast.weather.main ==="Clear" ) {
        foreCastEl.append(clear);
    } 
    if(forecast.weather.main ==="Clouds") {
        foreCastEl.append(clouds);
    }
    if(forecast.weather.main ==="Snow") {
        foreCastEl.append(snow);
    }
    if(forecast.weather.main ==="Rain") {
        foreCastEl.append(rain);
    }
    if(forecast.weather.main ==="Drizzle") {
        foreCastEl.append(drizzle);
    }
    if(forecast.weather.main ==="Thunderstorm") {
        foreCastEl.append(thunderstorm);
    }
    else {
        foreCastEl.append(atmoshere);  
}

    var tempEl = document.createElement('div');
    tempEl.textContent = ("Temp: " + forecast.temp.day +"°F");
    foreCastEl.append(tempEl);

    var windEl = document.createElement('div');
    windEl.textContent = ("Wind: " + forecast.wind_speed + "mph");
    foreCastEl.append(windEl);

    var humidityEl = document.createElement('div');
    humidityEl.textContent = ("Humidity: " + forecast.humidity + "%");
    foreCastEl.append(humidityEl);

    futureForecastContainer.append(foreCastEl);
}


