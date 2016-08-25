"use strict";

let keys = require("./keys"),
    weatherKey = keys();

let firebase = require("./fbconfig");


function getWeather(zipCode) {
  return new Promise(function(resolve,reject){
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&APPID=${weatherKey.weatherKey}`,
      method: 'GET'
    }).done(function(data){
      resolve(data);
    }).fail(function(error){
      reject(error);
    })
  })
}

function get5DayWeather(lat,lon) {
  return new Promise(function(resolve,reject){
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=${weatherKey.weatherKey}`,
      method: 'GET'
    }).done(function(data){
      resolve(data);
    }).fail(function(error){
      reject(error);
    })
  })
}

function saveWeather(data) {
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('users/' + userId).set(data)
}


function getSavedWeather() {
  var userId = firebase.auth().currentUser.uid;
  return firebase.database().ref('/users/' + userId)
    .once('value')
    .then(function(snapshot) {
    var data = snapshot.val();
    return data;
  })
}

module.exports = {getWeather,saveWeather,getSavedWeather,get5DayWeather};
