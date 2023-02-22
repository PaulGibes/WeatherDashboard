// //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// https: b18b2ada8a7cf01d1a6c89d2666509ec;
var searchHistory = $("#searchHistory");
var cityHistory = JSON.parse(localStorage.getItem("cities")) || [];
localStorage.setItem("cities", JSON.stringify(cityHistory));
var requestUrl =
  "https://api.openweathermap.org/data/2.5/weather?q=denver&appid=b18b2ada8a7cf01d1a6c89d2666509ec";

var seeHistory = function () {
  searchHistory.empty();
  cityHistory = JSON.parse(localStorage.getItem("cities"));
  console.log(cityHistory);
  for (let i = 0; i < cityHistory.length; i++) {
    $("#searchHistory").append(
      '<button class="buttonStyle" type="button">' +
        cityHistory[i] +
        "</button>"
    );
  }
};

fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {});

$("#searchForm").submit(function (event) {
  var userInput = inputEl.value;
  cityHistory.unshift(userInput);
  localStorage.setItem("cities", JSON.stringify(cityHistory));
  seeHistory();

  event.preventDefault();
});

seeHistory();
