"use strict";

let auth = require('./auth'),
    ajax = require('./ajax');

let userID, weatherData;

// LOGIN BUTTON

$('#loginGoogle').click(loginWithGoogle);

function loginWithGoogle() {
  auth()
    .then(function(data){
      userID = data.user.uid;
      $('#loginGoogle').attr('disabled','disabled');
    });
}

// GET WEATHER BY ZIP CODE

$('#zipCode').keypress(zipSubmit);

function zipSubmit(evt) {
  if (evt.keyCode === 13){
    zipValidate();
  }
}

function getZip() {
  return parseInt($('#zipCode').val())
}

function zipValidate(){
  $('#zipError').html('');
  let zipRegExp = /\d{5}/,
      zipInput = $('#zipCode').val();
  if (zipRegExp.test(zipInput)) {
    ajax.getWeather(zipInput)
      .then(function(data){
        weatherData = data;
        weatherData.uid = userID;
        weatherData.main.tempF = (weatherData.main.temp * (9/5)) - 459.67;
        buildForecast(weatherData);
      });
  } else {
    $('#zipError').html('Zip code must be 5 digits');
  }
}

// Get SAVED WEATHER

$('#getSaved').click(function(){

  ajax.getSavedWeather()
    .then(function(data){
      buildForecast(data);
    });
})

// PRINT TO DOM

let currentTemplate;

$.get('./src/templates/current.hbs', function(data){
    currentTemplate = Handlebars.compile(data);
});

function buildForecast(data) {
  console.log("building forecast with ", data)
  let html = currentTemplate(data);
  $('#displayColumn').html(html);
  $('#saveButton').click(function(){
    ajax.saveWeather(weatherData);
  });
  $('#get5DayButton').click(function() {
    ajax.get5DayWeather(weatherData.coord.lat,weatherData.coord.lon)
      .then(function(data){
        console.log(data);
        buildForecast(data);
      });
  })
}
