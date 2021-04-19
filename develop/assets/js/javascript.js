// when search button is clicked
var searchClicked = function (event) {
  event.preventDefault();

  // get the search city
  var searchCity = document.getElementById("search-city").value;
  console.log("search button clicked, city -> " + searchCity);
};

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
