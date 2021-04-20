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

// this creates a header element with current city and date
var getCurrentCityAndDate = function (cityName, currentDateUnix) {
  // create the city & date header
  // this is a div that contains the city and current date, and an image of current weather
  var currentDate = moment.unix(currentDateUnix).format("(MM/DD/YYYY)");
  console.log("current date -> " + currentDate);

  return $(
    "<h3 id='current-conditions-header'>" +
      cityName +
      " " +
      currentDate +
      "</h3>"
  );
};

// this creates an image element with current weather icon
var getCurrentWeatherIcon = function (currentIcon) {
  console.log("current icon -> " + currentIcon);
  // weather icon will be off the form
  // http://openweathermap.org/img/wn/10d@2x.png where "10d" is the icon code
  var currentIconUrl =
    "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png";

  return $(
    "<img id='current-conditions-icon' src='" + currentIconUrl + "'></img>"
  );
};

// this creates a div with the current city and date header + the current weather icon
var getCurrentDayHeader = function (cityName, currentDateUnix, currentIcon) {
  // create a div that will contain a header element and a weather icon element
  var currentDayHeader = $("<div id='current-conditions-headline'></div>");

  currentDayHeader.append(getCurrentCityAndDate(cityName, currentDateUnix));
  currentDayHeader.append(getCurrentWeatherIcon(currentIcon));

  return currentDayHeader;
};

// this creates a div with current temperature
var getCurrentTemp = function (currentTemp) {
  // format the current temp
  // drop the decimal point, only keep to left of decimal point

  var currentComponents = currentTemp.toString().split(".");
  var finalTemp =
    "Temp: " + currentComponents[0] + " " + String.fromCharCode(176) + "F";

  return $("<div id='current-conditions-temp'>" + finalTemp + "</div>");
};

// this creates a div with current wind
var getCurrentWind = function (currentWind) {
  var finalWind = "Wind: " + currentWind.toString() + " MPH";
  console.log("final wind -> " + finalWind);

  return $("<div id='current-conditions-wind'>" + finalWind + "</div>");
};

// this creates a div with current humidity
var getCurrentHumidity = function (currentHumidity) {
  var finalHumidity = "Humidity: " + currentHumidity + "%";

  return $("<div id='current-conditions-humidity'>" + finalHumidity + "</div>");
};

// this returns a span class for uvi index
var getUviSpanClassName = function (currentUvi) {
  // this will return a class name for the uvi index, based on current value
  // values from http://nou-tt.blogspot.com/2016/02/what-uv-index-is-all-about.html

  var uvSpanClass = "uv-severity-low";

  if (currentUvi < 3) {
    // uvi 0 to 3 is LOW
    uvSpanClass = "uv-severity-low";
  } else if (currentUvi < 6) {
    // uvi 3 to 6 is moderate
    uvSpanClass = "uv-severity-moderate";
  } else if (currentUvi < 8) {
    // uvi 6 to 8 is high
    uvSpanClass = "uv-severity-high";
  } else if (currentUvi < 11) {
    // uvi 8 to 11 is very high
    uvSpanClass = "uv-severity-veryhigh";
  } else {
    // anything over 11 is extreme
    uvSpanClass = "uv-severity-extreme";
  }

  return uvSpanClass;
};
// this creates a div with current UV index
var getCurrentUvi = function (currentUvi) {
  // this will return an element with a span class that set the background color

  var uvClassname = getUviSpanClassName(currentUvi);

  finalUvi =
    "UV Index: " +
    "<span class='" +
    uvClassname +
    "'>   " +
    currentUvi.toString() +
    "   </span>";
  console.log("final uvi -> " + finalUvi);

  return $("<div id='current-conditions-uvi'>" + finalUvi + "</div>");
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

  border.append(getCurrentDayHeader(cityName, data.dt, data.weather[0].icon));
  border.append(getCurrentTemp(data.temp));
  border.append(getCurrentWind(data.wind_speed));
  border.append(getCurrentHumidity(data.humidity));
  border.append(getCurrentUvi(data.uvi));

  // now add the whole thing to the current conditions
  currentConditions.append(border);
};

// this gets date for 5 day forecast div
var getSingleDayDate = function (dailyDateUnix) {
  var currentDate = moment.unix(dailyDateUnix).format("MM/DD/YYYY");

  return $("<h4 class='daily-detail-date'>" + currentDate + "</h4>");
};

// this gets weather icon for 5 day forecast div
var getSingleDayWeatherIcon = function (dailyIcon) {
  var currentIconUrl =
    "http://openweathermap.org/img/wn/" + dailyIcon + "@2x.png";

  return $(
    "<img class='daily-detail-weather-icon' src='" + currentIconUrl + "'></img>"
  );
};

// this gets temp for 5 day forecast div
var getSingleDayTemp = function (dailyTemp) {
  var currentComponents = dailyTemp.toString().split(".");
  var finalTemp =
    "Temp: " + currentComponents[0] + " " + String.fromCharCode(176) + "F";

  return $("<div class='daily-detail-temp'>" + finalTemp + "</div>");
};

// this gets wind for 5 day forecast div
var getSingleDayWind = function (dailyWind) {
  var finalWind = "Wind: " + dailyWind.toString() + " MPH";
  return $("<div class='daily-detail-wind'>" + finalWind + "</div>");
};

// this gets humidity for 5 day forecast div
var getSingleDayHumidity = function (dailyHumidity) {
  var finalHumidity = "Humidity: " + dailyHumidity + "%";
  return $("<div class='daily-detail-humidity'>" + finalHumidity + "</div>");
};

// this gets 5 day forecast detail div
var getSingleDayDiv = function (dailyDetail) {
  //console.log("--------");
  //console.log("unix date -> " + dailyDetail.dt);
  //console.log("weather icon -> " + dailyDetail.weather[0].icon);
  //console.log("temp -> " + dailyDetail.temp.max);
  //console.log("wind -> " + dailyDetail.wind_speed);
  //console.log("humidity -> " + dailyDetail.humidity);
  //console.log("--------");

  var singleDay = $("<div class='daily-detail'></div>");

  singleDay.append(getSingleDayDate(dailyDetail.dt));
  singleDay.append(getSingleDayWeatherIcon(dailyDetail.weather[0].icon));
  singleDay.append(getSingleDayTemp(dailyDetail.temp.max));
  singleDay.append(getSingleDayWind(dailyDetail.wind_speed));
  singleDay.append(getSingleDayHumidity(dailyDetail.humidity));

  return singleDay;
};

// this creates the detail div for a single day of five day forecast
var getSingleDayDetail = function (singleDay) {
  var dailyDiv = $("<div class='pure-u-1 pure-u-sm-1-5'></div>");
  dailyDiv.append(getSingleDayDiv(singleDay));
  return dailyDiv;
};

// this creates a five day forecast div and adds it to the five-day-container
var createFiveDayForecast = function (data) {
  console.log("createFiveDayForecast START...");
  console.log(data);

  //clear out the five-day-container
  var fiveDayForecast = $("#five-day-container");
  fiveDayForecast.empty();

  // create a div that is a single colum for this row
  var fiveDayColumn = $("<div class='pure-u-1' id='five-day-column'></div>");

  // create a row for the title
  fiveDayColumn.append(
    $(
      "<div class='pure-g' id='five-day-title'><h3 class='pure-u-1'>5-Day Forecast:</h3></div"
    )
  );

  // create a row for the five day forecast
  var fiveDayDetail = $("<div class='pure-g' id='five-day-detail'></div>");

  // now add the five days to this div
  for (var i = 1; i < 6; i++) {
    fiveDayDetail.append(getSingleDayDetail(data[i]));
  }

  // now append this div
  fiveDayColumn.append(fiveDayDetail);

  //now append this column to the master div
  fiveDayForecast.append(fiveDayColumn);
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
