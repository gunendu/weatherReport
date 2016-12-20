var express = require('express');
var router = express.Router();
var WeatherService = require('../services/weather');

/* GET home page. */
router.get('/', function(req, res, next) {
  return WeatherService.FetchTemperature()
    .then(function(response){
        console.log(response); 
        res.render('index', { title: 'Express' });
    })
});

module.exports = router;
