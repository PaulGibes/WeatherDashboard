// Variable Declaration
var searchHistory = $("#searchHistory");
var cityHistory = JSON.parse(localStorage.getItem("cities")) || [];
// Line 5 somehow it makes everything work. Do not remove!
localStorage.setItem("cities", JSON.stringify(cityHistory));
var todaysDate = dayjs().format("dddd, MMMM D YYYY");
var today = dayjs().format("ddd");

// function to make buttons from local storage
var seeHistory = function () {
  // have to empty the list of buttons before creating a new list from data in local storage
  searchHistory.empty();
  //cityHistory will pull apart the string of cities in local storage and turn it into an array
  cityHistory = JSON.parse(localStorage.getItem("cities"));
  // for loop to create buttons of the array cities
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

  // empty the todaysWeather container so two cities data doesn't get stacked on top of each other
  $("#todaysWeather").empty();

  // request data from the api at the url, then...
  fetch(requestUrl)
    // ...then pass in the data and turn its returned string value to a json object, then...
    .then(function (response) {
      return response.json();
    })
    // ...then pass in returned json object, store it as var data, and execute the following code.
    .then(function (data) {
      // if it is a valid city name
      if (data.cod === 200) {
        // if it is not in the array, it will return -1, and the ! makes it look for the opposite
        // saves the user input to city history
        if (!($.inArray(cityName, cityHistory) > -1)) {
          cityHistory.unshift(cityName);
          localStorage.setItem("cities", JSON.stringify(cityHistory));
        }

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
  // &cnt=5 sets the amount of days we will get forecast data from
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
      $("#cardContainer").empty();
      // checks to see is any data is pulled so there is no console error if not a city name is input
      if (data.list) {
        // loop every day's data with an increasing variable i
        for (let i = 0; i < data.list.length; i++) {
          var temp = data.list[i].main.temp;
          var tempApparent = data.list[i].main.feels_like;
          var tempMin = data.list[i].main.temp_min;
          var tempMax = data.list[i].main.temp_max;
          var tempRange = tempMin + "°F - " + tempMax + "°F";
          var windSpeed = data.list[i].wind.speed;
          var humidity = data.list[i].main.humidity;
          var weather = data.list[i].weather[0].description;
          var weatherIcon = data.list[i].weather[0].icon;
          var dayOfTheWeek = dayjs().add(i, "day").format("ddd");
          // dynamically create a variable that will be the card using template literal notation. Another way to write '+"'" + "+ ""'+ ' '""+"" ++ +
          var cardHTML = `
          <div class="col">
          <div class="card h-100">
          <div class="card-body">
          <div class="card-header">
          <h5 class="card-title"> ${dayOfTheWeek}</h5>
          <img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png" />
          </div>
          <ul class="card-text">
          <li class='card-text'>Temp: ${temp}°F</li>
          <li class='card-text'>Range: ${tempRange}</li>
          <li class='card-text'>Wind: ${windSpeed} MPH</li>
          <li class='card-text'>Humidity: ${humidity}%</li>
          </ul>
          </div>
          </div>
          </div>`;

          // add the card that was just made for each loop
          $("#cardContainer").append(cardHTML);
        }
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

// event listener for form submission
$("#searchForm").submit(function (event) {
  // stops form submission from refreshing the page
  event.preventDefault();

  // captures user input and capitalizes it
  var userInput = $("#inputEl").val();
  userInput = capitalize(userInput);

  // display hidden elements
  $("#currentWeather").css("display", "block");
  $("#forecastWeather").css("display", "block");

  // call functions, passing the val of user input
  getCurrentWeather(userInput);
  getForecastWeather(userInput);
});

// call history from local storage on page load/refresh
seeHistory();

// displays current date
$("#todaysDate").text(todaysDate);
