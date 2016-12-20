var express = require('express');
var router = express.Router();
var WeatherService = require('../services/weather');

/* GET home page. */
router.get('/', function(req, res, next) {
    return res.render('index', { title: 'Express' });
});

router.post('/weatherreport',function(req,res,next){
  var date = req.param('date');
  return WeatherService.FetchTemperature(date)
    .then(function(response){
        return res.status(200).send({
          "result": response
        })
    })
    .catch(function(err){
        console.log("error is",err);
    })
});

module.exports = router;
