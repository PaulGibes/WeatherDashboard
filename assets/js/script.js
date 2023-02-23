// Variable Declaration
var searchHistory = $("#searchHistory");
var cityHistory = JSON.parse(localStorage.getItem("cities")) || [];
localStorage.setItem("cities", JSON.stringify(cityHistory));
var todaysDate = dayjs().format("dddd, MMMM D YYYY");
var today = dayjs().format("ddd");

// function to make buttons from history
var seeHistory = function () {
  // have to empty the list of buttons before creating a new list from data in local storage
  searchHistory.empty();
  cityHistory = JSON.parse(localStorage.getItem("cities"));
  for (let i = 0; i < cityHistory.length; i++) {
    $("#searchHistory").append(
      '<button id="cityId" class="buttonStyle" type="button">' +
        cityHistory[i] +
        "</button>"
    );
  }

  // if there is a button to clear, add a clear button
  if (cityHistory.length > 0) {
    $("#searchHistory").append(
      '<button id="clearHistoryButton" class="clearButtonStyle" type="button">ClearHistory</button>'
    );
  }
};

// function to capitalize the user input
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// function to get the current weather
function getCurrentWeather(cityName) {
  // string concatenation to create the api url
  var requestUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=b18b2ada8a7cf01d1a6c89d2666509ec&units=imperial";

  // empty the todaysWeather container so two cities data doesn't get stacked on top of eachother
  $("#todaysWeather").empty();

  fetch(requestUrl)
    // request from the api and turn its returned string value to a json object
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // if it is a valid city name
      if (data.cod === 200) {
        console.log(data);
        //variable declaration from the data we pulled
        var temp = data.main.temp;
        var tempApparent = data.main.feels_like;
        var tempMin = data.main.temp_min;
        var tempMax = data.main.temp_max;
        var tempRange = tempMin + "°F - " + tempMax + "°F";
        var windSpeed = data.wind.speed;
        var humidity = data.main.humidity;
        var weather = data.weather[0].description;
        var weatherIcon = data.weather[0].icon;

        seeHistory();

        // create list items with data
        $("#searchedCity").text(cityName);
        $("#searchedCity").append(
          `<img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png"/>`
        );

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

        // weather animal
        if (weather.includes("thunderstorm")) {
          $(".weatherAnimal").attr(
            "src",
            "https://technical.ly/wp-content/uploads/2020/11/catlightning.gif"
          );
        } else if (weather.includes("rain") || weather.includes("drizzle")) {
          $(".weatherAnimal").attr(
            "src",
            "https://media.tenor.com/AmmW05QDA50AAAAM/rain-dreary.gif"
          );
        } else if (weather.includes("snow")) {
          $(".weatherAnimal").attr(
            "src",
            "https://media.tenor.com/CcP4jLLCUsMAAAAM/cat-kitty.gif"
          );
        } else if (weather.includes("clear")) {
          $(".weatherAnimal").attr(
            "src",
            "https://media.tenor.com/HpXBnJvuA80AAAAC/bask-in-the-sun-cat.gif"
          );
        } else if (weather.includes("clouds")) {
          $(".weatherAnimal").attr(
            "src",
            "https://media.tenor.com/hoEWP9LL0lkAAAAM/cat-smoke.gif"
          );
        } else {
          $(".weatherAnimal").attr(
            "src",
            "https://static.wikia.nocookie.net/battle-cats/images/b/bf/Catornadoattack.gif/revision/latest?cb=20210810125957"
          );
        }
      } else {
        // if there was an invalid city name state so and clear the containers
        $("#searchedCity").text("Invalid City Name");
        for (let i = 0; i < 5; i++) {
          $("#info" + [i]).empty();
          $("#icon" + [i]).removeClass();
        }
      }
    });
}
// function to get the forecasted weather
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
        $("#info" + [i]).empty();
        $("#icon" + [i]).removeClass();

        var temp = data.list[i].main.temp;
        var tempApparent = data.list[i].main.feels_like;
        var tempMin = data.list[i].main.temp_min;
        var tempMax = data.list[i].main.temp_max;
        var tempRange = tempMin + "°F - " + tempMax + "°F";
        var windSpeed = data.list[i].wind.speed;
        var humidity = data.list[i].main.humidity;
        var weather = data.list[i].weather[0].description;
        var weatherIcon = data.list[i].weather[0].icon;

        $("#info" + [i]).append(
          "<li class='card-text'>Temp: " + temp + "°F</li>"
        );
        $("#info" + [i]).append(
          "<li class='card-text'>Range: " + tempRange + "</li>"
        );
        $("#info" + [i]).append(
          "<li class='card-text'>Wind: " + windSpeed + " MPH</li>"
        );
        $("#info" + [i]).append(
          "<li class='card-text'>Humidity: " + humidity + "%</li>"
        );

        $("#icon" + [i]).attr(
          "src",
          `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
        );
      }
    });
}

// event listener to clear history. Dynamically created elements won't have the click event bound to them so do this
$("#searchHistory").on("click", "#clearHistoryButton", function () {
  localStorage.clear();
  searchHistory.empty();
  cityHistory = [];
});

// allows user to click on a button from their history
$("#searchHistory").on("click", "#cityId", function () {
  var cityName = event.target.innerText;
  $("#currentWeather").css("display", "block");
  $("#forecastWeather").css("display", "block");
  getCurrentWeather(cityName);
  getForecastWeather(cityName);
});

// on submit of the form, capture the users input
$("#searchForm").submit(function (event) {
  var userInput = inputEl.value;
  userInput = capitalize(userInput);

  $("#currentWeather").css("display", "block");
  $("#forecastWeather").css("display", "block");

  // if it is not in the array of locally saved data add it, and either way run the functions to get the weather.
  // if it is not in the array, it will return -1, and the ! makes it look for the opposite
  if (!($.inArray(userInput, cityHistory) > -1)) {
    cityHistory.unshift(userInput);
    localStorage.setItem("cities", JSON.stringify(cityHistory));
    getCurrentWeather(userInput);
    getForecastWeather(userInput);
  } else {
    getCurrentWeather(userInput);
    getForecastWeather(userInput);
  }

  // stops form submission from refreshing the page
  event.preventDefault();
});

// call history on page load/refresh
seeHistory();

// displays current date
$("#todaysDate").text(todaysDate);

// for the next 5 days, add what day of the week it will be.
for (let i = 0; i < 5; i++) {
  $("#d" + i).text(dayjs().add(i, "day").format("ddd"));
}
