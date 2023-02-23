// //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// https: b18b2ada8a7cf01d1a6c89d2666509ec;
var searchHistory = $("#searchHistory");
var cityHistory = JSON.parse(localStorage.getItem("cities")) || [];
localStorage.setItem("cities", JSON.stringify(cityHistory));
// var clearHistoryButton = document.querySelector("#clearHistoryButton");
var requestUrl =
  "https://api.openweathermap.org/data/2.5/weather?q=denver&appid=b18b2ada8a7cf01d1a6c89d2666509ec";

// function clearHistory() {
//   localStorage.clear(cities);
// }

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

fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {});

// dynamically created elements won't have the click event bound to them
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

// clearHistoryButton.addEventListener("click", clearHistory);
