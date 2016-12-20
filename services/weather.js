"use strict"

var promise = require('bluebird');
var rp = require('request-promise');
var config = require('config');
var moment = require('moment');
var _ = require('underscore');

var WeatherService = {};

WeatherService.FetchTemperature = function(date) {
  var date = moment(date).format("YYYY-MM-DD");
  var url = config.baseurl+config.cityid+"&APPID="+config.apikey;
  return rp(url)
    .then(function(response) {
        var response = JSON.parse(response);
        var list = response['list'];
        list = _.filter(list,function(item){
          return item.dt_txt.split(" ")[0] == date
        });

        var minmax = WeatherService.FindMinMax(list);
        var list = WeatherService.SortedTempature(list);
        return {
          "temp": minmax,
          "tempList": list
        }
    })
    .catch(function(err){
        console.log("openweathermap api error",err);
    })
};

WeatherService.FindMinMax = function(list) {
    var response =  {};
    var maxTemp = _.max(list,function(item){
      return item.main.temp_max;
    });
    var minTemp = _.min(list,function(item){
      return item.main.temp_min;
    });
    response['max_time'] = moment.unix(maxTemp.dt).format("MMMM Do YYYY, h:mm:ss a");
    response['max'] = maxTemp.main.temp_max;
    response['min_time'] = moment.unix(minTemp.dt).format("MMMM Do YYYY, h:mm:ss a");
    response['min'] = minTemp.main.temp_min;
    return response;
};

WeatherService.SortedTempature = function(list){
  var sortedList = _.sortBy(list,'main.temp_max');
  var arr = new Array(sortedList.length);
  arr[0] = new Array(2);
  arr[0][0] = "temperature";
  arr[0][1] = "time";
  for(var i=0;i<sortedList.length;i++){
    arr[i+1] = new Array(2);
    arr[i+1][0] = sortedList[i].main.temp_max;
    arr[i+1][1] = sortedList[i].dt;
  }
  return arr;
};

module.exports = WeatherService;
