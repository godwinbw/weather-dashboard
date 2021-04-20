// uv ranges
// from website -> http://nou-tt.blogspot.com/2016/02/what-uv-index-is-all-about.html
//
// 1 to 2 -> low
// 3 to 5 -> moderate
// 6 to 7 -> high
// 8 to 10 -> very high
// 11+ -> extreme

// variable to hold our search history
var searchHistory = [];

// load our search history from local storage to search history array
var getSearchHistoryFromLocalStorage = function () {
  console.log("getSearchHistoryFromLocalStorage START...");
  searchHistory = JSON.parse(localStorage.getItem("search-history"));

  if (!searchHistory) {
    searchHistory = [];
  }
};

// save contents of searchHistory array to local storage
var saveSearchHistoryToLocalStorage = function () {
  console.log("saveSearchHistoryToLocalStorage");
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
};

// renders the search history buttons
var renderSearchHistoryButtons = function () {
  console.log("renderSearchHistoryButtons START...");

  //remove all content from search-history div
  $("#search-history").empty();

  // create a button for each search history item
  searchHistory.forEach(function (searchItem) {
    // createa a button element, and append it to the search-history div
    var btn = $(
      "<button class='pure-button search-history-button' searchTerm='" +
        searchItem +
        "'>" +
        searchItem +
        "</button>"
    );
    $("#search-history").append(btn);
  });
};

// add a city to our search history. will not add if it is already in the list
var addItemToSearchHistory = function (item) {
  console.log("addItemToSearchHistory START...");

  // assume this item is not in the search history
  var itemFound = false;

  if (searchHistory) {
    searchHistory.forEach(function (searchItem) {
      if (searchItem === item) {
        itemFound = true;
        console.log("    ....found " + item + " in search history alrready");
      }
    });
  }

  if (!itemFound) {
    // add to our search history
    searchHistory.push(item);
    // now save our search history to local storage
    saveSearchHistoryToLocalStorage();

    //now render our search history buttons
    renderSearchHistoryButtons();
  }
};

// this creates a current conditions div and adds it to the current-conditions-container
var createCurrentConditions = function (cityName, data) {
  console.log("createCurrentConditions START...");
  console.log(data);
  // data will be in the format of the 'current' data in one call api response
  // https://openweathermap.org/api/one-call-api

  // clear out current-conditions-container
  var currentConditions = $("#current-conditions-container");
  currentConditions.empty();

  // create the new container
  var border = $("<div id='current-conditions-border'></div>");

  // create the city & date header
  // this is a div that contains the city and current date, and an image of current weather
  var currentDate = moment.unix(data.dt).format("(MM/DD/YYYY)");
  console.log("current date -> " + currentDate);

  var header = $(
    "<h3 id='current-conditions-header'>" +
      cityName +
      " " +
      currentDate +
      "</h3>"
  );
  border.append(header);

  // now add the whole thing to the current conditions
  currentConditions.append(border);
};

// this creates a five day forecast div and adds it to the five-day-container
var createFiveDayForecast = function (data) {
  console.log("createFiveDayForecast START...");
  console.log(data);
};

// this is the function that gets the current & 5 day forecast for a city
var getWeatherForCity = function (searchCity) {
  /// get the lat & lon of the user entered city
  console.log("getWeatherForCity START...");

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
        var cityFound = data.name;
        console.log("city found -> " + cityFound);
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

              addItemToSearchHistory(cityFound);
              createCurrentConditions(cityFound, data.current);
              createFiveDayForecast(data.daily);
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

// when search button is clicked
var searchClicked = function (event) {
  event.preventDefault();

  // get the search city
  var searchCity = document.getElementById("search-city").value;
  console.log("search button clicked, city -> " + searchCity);

  getWeatherForCity(searchCity);
};

// when search history button is clicked
var searchHistoryClicked = function (event) {
  console.log("searchHistoryClicked!");
  //get the search city
  var searchCity = $(event.target).attr("searchterm");
  console.log("searchHistoryClicked, searchCity -> " + searchCity);

  getWeatherForCity(searchCity);
};

////
////  This section runs when script is loaded
////

// when document loads, disable search button
$(document).ready(function () {
  //console.log("document finished loading!");

  // disable search button until text is entered into the text box
  $("#search-button").prop("disabled", true);

  // load our search history
  getSearchHistoryFromLocalStorage();

  // render search history buttons
  renderSearchHistoryButtons();
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

// search history button is clicked
$(document).on("click", ".search-history-button", searchHistoryClicked);
