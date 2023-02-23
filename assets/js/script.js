var searchHistory = $("#searchHistory");
var cityHistory = JSON.parse(localStorage.getItem("cities")) || [];
localStorage.setItem("cities", JSON.stringify(cityHistory));
var todaysDate = dayjs().format("dddd, MMMM D YYYY");
var today = dayjs().format("ddd");
var week = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

var seeHistory = function () {
  searchHistory.empty();
  cityHistory = JSON.parse(localStorage.getItem("cities"));
  for (let i = 0; i < cityHistory.length; i++) {
    $("#searchHistory").append(
      '<button class="buttonStyle" type="button">' +
        cityHistory[i] +
        "</button>"
    );
  }

  if (cityHistory.length > 0) {
    $("#searchHistory").append(
      '<button id="clearHistoryButton" class="clearButtonStyle" type="button">ClearHistory</button>'
    );
  }
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCurrentWeather(cityName) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=b18b2ada8a7cf01d1a6c89d2666509ec&units=imperial";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var temp = data.main.temp;
      var tempApparent = data.main.feels_like;
      var tempMin = data.main.temp_min;
      var tempMax = data.main.temp_max;
      var tempRange = tempMin + "°F - " + tempMax + "°F";
      var windSpeed = data.wind.speed;
      var humidity = data.main.humidity;
      var weather = data.weather[0].description;

      $("#searchedCity").text(cityName);
      $("#todaysWeather").append(
        "<li class='card-text'>Temperature: " + temp + "°F</li>"
      );
      $("#todaysWeather").append(
        "<li class='card-text'>Apparent Temperature: " +
          tempApparent +
          "°F</li>"
      );
      $("#todaysWeather").append(
        "<li class='card-text'>Temperature Range: " + tempRange + "</li>"
      );
      $("#todaysWeather").append(
        "<li class='card-text'>Wind Speed: " + windSpeed + " MPH</li>"
      );
      $("#todaysWeather").append(
        "<li class='card-text'>Humidity: " + humidity + "%</li>"
      );
      $("#todaysWeather").append(
        "<li class='card-text'>Weather: " + weather + "</li>"
      );
    });
}

function getForecastWeather(cityName) {
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&cnt=5&appid=b18b2ada8a7cf01d1a6c89d2666509ec&units=imperial";

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for (let i = 0; i < data.list.length; i++) {
        var temp = data.list[i].main.temp;
        var tempApparent = data.list[i].main.feels_like;
        var tempMin = data.list[i].main.temp_min;
        var tempMax = data.list[i].main.temp_max;
        var tempRange = tempMin + "°F - " + tempMax + "°F";
        var windSpeed = data.list[i].wind.speed;
        var humidity = data.list[i].main.humidity;
        var weather = data.list[i].weather[0].description;

        //   $("#todaysWeather").append(
        //     "<li class='card-text'>Temperature: " + temp + "°F</li>"
        //   );
        //   $("#todaysWeather").append(
        //     "<li class='card-text'>Apparent Temperature: " +
        //       tempApparent +
        //       "°F</li>"
        //   );
        //   $("#todaysWeather").append(
        //     "<li class='card-text'>Temperature Range: " + tempRange + "</li>"
        //   );
        //   $("#todaysWeather").append(
        //     "<li class='card-text'>Wind Speed: " + windSpeed + " MPH</li>"
        //   );
        //   $("#todaysWeather").append(
        //     "<li class='card-text'>Humidity: " + humidity + "%</li>"
        //   );
        //   $("#todaysWeather").append(
        //     "<li class='card-text'>Weather: " + weather + "</li>"
        //   );
      }
    });
}

// dynamically created elements won't have the click event bound to them so do this
$("#searchHistory").on("click", "#clearHistoryButton", function () {
  localStorage.clear();
  searchHistory.empty();
  cityHistory = [];
});

$("#searchForm").submit(function (event) {
  var userInput = inputEl.value;
  console.log(userInput);
  userInput = capitalize(userInput);
  $("#currentWeather").css("display", "block");
  $("#forecastWeather").css("display", "block");

  if (!($.inArray(userInput, cityHistory) > -1)) {
    cityHistory.unshift(userInput);
    localStorage.setItem("cities", JSON.stringify(cityHistory));
    seeHistory();
    getCurrentWeather(userInput);
    getForecastWeather(userInput);
  } else {
    getCurrentWeather(userInput);
    getForecastWeather(userInput);
  }

  event.preventDefault();
});

seeHistory();

$("#todaysDate").text(todaysDate);

for (let i = 0; i < 5; i++) {
  $("#d" + i).text(dayjs().add(i, "day").format("ddd"));
}

// lalala.on("click","city-btn",function(event){
//   var value = event.target.innerText;
//   currentWeather(value);
// });
