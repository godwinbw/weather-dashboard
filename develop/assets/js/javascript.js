// uv ranges
// from website -> http://nou-tt.blogspot.com/2016/02/what-uv-index-is-all-about.html
//
// 1 to 2 -> low
// 3 to 5 -> moderate
// 6 to 7 -> high
// 8 to 10 -> very high
// 11+ -> extreme

// function to convert user-entered search time to title case (all words have first letter capitalized)
var getTitleCase = function (str) {};

// when search button is clicked
var searchClicked = function (event) {
  event.preventDefault();

  // get the search city
  var searchCity = document.getElementById("search-city").value;
  console.log("search button clicked, city -> " + searchCity);

  /// get the lat & lon of the user entered city
  var cityDataUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchCity +
    "&appid=1282b8d2f151eb14ccddbfba4ac891f0";
  fetch(cityDataUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // we got a good response
        console.log(data);
        // get the lat & the lon for this city, we will need it to call the detailed weather data
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        console.log("lat -> " + lat + ", lon -> " + lon);

        var oneCallUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&units=imperial&appid=1282b8d2f151eb14ccddbfba4ac891f0";
        fetch(oneCallUrl).then(function (oneCallResponse) {
          if (oneCallResponse.ok) {
            oneCallResponse.json().then(function (data) {
              console.log(data);

              // since we got all the data we need, we will do 3 things:
              // 1. add the city to our search history
              // 2. make a current conditions div and populate with data
              // 3. make a 5 day forecast div and populate with data
            });
          } else {
            // had trouble getting detailed data
            console.log(
              "oncall failed, response text -> " + oneCallResponse.statusText
            );
          }
        });
      });
    } else {
      // we had an issue getting the data
      console.log("response not ok, response.status -> " + response.statusText);
      alert("Could not get weather for city '" + searchCity + "'. Try again");
      // clear out the text in search city and disable search button
      $("#search-city").val("");
      $("#search-button").prop("disabled", true);
    }
  });
};

////
////  This section runs when script is loaded
////

// when document loads, disable search button
$(document).ready(function () {
  //console.log("document finished loading!");

  // disable search button until text is entered into the text box
  $("#search-button").prop("disabled", true);
});

// search button will stay disabled, until there is data in the search box
$("#search-city").keyup(function () {
  var searchCity = $("#search-city").val().trim();
  //console.log(
  //  "search-city has been changed -> " +
  //    searchCity +
  //    " length -> " +
  //    searchCity.length
  //);

  if (searchCity.length > 0) {
    //if we have text, then search button is enabled
    $("#search-button").prop("disabled", false);
  } else {
    $("#search-button").prop("disabled", true);
  }
});

// search button is clicked
$("#search-button").on("click", searchClicked);
