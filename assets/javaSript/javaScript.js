var apiKey= "0a049cb78e7e615e6af6861a230a5dd9";
var getCityForecast = function(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
    fetch(apiUrl).then(function(response) {
        console.log("London");
    });
};

getCityForecast();