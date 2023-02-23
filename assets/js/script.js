// //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// https: b18b2ada8a7cf01d1a6c89d2666509ec;
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

function getApi(cityName) {
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
  if (!($.inArray(userInput, cityHistory) > -1)) {
    cityHistory.unshift(userInput);
    localStorage.setItem("cities", JSON.stringify(cityHistory));
    seeHistory();
    getApi(userInput);
  } else {
    getApi(userInput);
  }

  event.preventDefault();
});

seeHistory();

$("#todaysDate").text(todaysDate);

for (let i = 0; i < 5; i++) {
  $("#d" + i).text(dayjs().add(i, "day").format("ddd"));
}
