var apiKey= "0a049cb78e7e615e6af6861a230a5dd9";
var getCityForecast = function(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";
    return fetch(apiUrl).then(function(response) {
        return response.json().then(data => data);
    });
};

var searchButton = document.getElementById('search-button');
var cityInput = document.getElementById('city');

searchButton.onclick = (event) => {
    event.preventDefault();

    var cityName = cityInput.value;

    console.log('search', cityName);
    getCityForecast(cityName).then(data => {
        console.log('city data', data);
    });
};