"use strict"

var promise = require('bluebird');
var rp = require('request-promise');
var config = require('config');
var moment = require('moment');
var _ = require('underscore');

var WeatherService = {};

WeatherService.FetchTemperature = function() {
  var url = baseurl+config.cityid+"&APPID="+config.apikey;
  console.log(url);
  return rp(url)
    .then(function(response) {
        var date = "2016-12-20";
        var response = JSON.parse(response);
        var list = response['list'];
        list = _.filter(list,function(item){
          return item.dt_txt.split(" ")[0] == date
        });

        var minmax = WeatherService.FindMinMax(list);
        var list = WeatherService.SortedTempature(list);
        return {
          "a": minmax,
          "b": list
        }
    })
    .catch(function(err){
        console.log("err",err);
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
  return _.sortBy(list,'main.temp_max');
};

module.exports = WeatherService;
