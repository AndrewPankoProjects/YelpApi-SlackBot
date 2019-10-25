/*
  "StAuth10065: I Andrew Panko, 000394436 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
*/

var Bot = require('slackbots');
var express = require('express');
var app = express();

var sqlite3= require("sqlite3").verbose();
var file = "api.db";
var db= new sqlite3.Database(file);

let yelpAPI = require('yelp-api');

// Create a new yelpAPI object with your API key
let apiKey = 'n0iMt79SYrL1-ti41BTipGxqGKcOTfOI-3iXiseyBQrI6BvY6yyaQCMnEq0ZrwY_f4q2V2iOEOGygwUWai6ETyT1W4y6y_g8CdLHMGtsuWrKjfQJnRk4ATp82XOfXXYx';
let yelp = new yelpAPI(apiKey);

// create a bot
var settings = { token: 'xoxb-784339361345-778495471826-BAP6aBBmWtl1p9ctmQj4aR99', name: 'yelphelp'};
var bot = new Bot(settings);

bot.on('message',function(data){
  if (data.type == "message")
  {

    var message = data.text;
    //Nearby Command
    if (message.includes('Nearby')){
      var res = message.split("Nearby ");
      //console.log(res[0]);
      //console.log(res[1]);

        if (res[0] == ""){
          // Set any parameters, if applicable (see API documentation for allowed params)
          let params = [{limit: '5', radius: '10000', location: res[1]}];

          yelp.query('businesses/search', params)
          .then(data2 => {
            let json = JSON.parse(data2);
            //console.log(data2);
            // Success
            for (var i = 0; i < 5; i++){
              bot.postMessageToChannel('general',
              'Restaurants found: ' + json.businesses[i].name + ' ,' + json.businesses[i].location.display_address);
            }

            if (data2 == undefined){
              bot.postMessageToChannel('general',
              'No close by events can be found.');
            }
          })
          .catch(err => {
            // Failure

            console.log(err);
          });
        }
    }
    //Events Command
    if (message.includes('Events')){
      var res = message.split(" ");

      if (res[1].includes("E")){
        var long = res[1].replace("E", "");
        long = parseFloat(long);
      }
      else if (res[1].includes("W")){
        var long = res[1].replace("W", "");
        long = parseFloat(long);
        long = long * -1;
      }
      if (res[2].includes("N")){
        var lat = res[2].replace("N", "");
        lat = parseFloat(lat);
      }
      else if (res[2].includes("S")){
        var lat = res[2].replace("S", "");
        lat = parseFloat(lat);
        lat = lat * -1;
      }

      let params = [{ limit: '5', radius: '10000', longitude: long, latitude: lat}];

      // Call the endpoint
      yelp.query('events', params)
      .then(data2 => {
        //console.log(data2);
        // Success
        let json = JSON.parse(data2);

        for (var i = 0; i < 5; i++){
          bot.postMessageToChannel('general',
          'Events found: ' + json.events[i].name + ' ,' + json.events[i].location.display_address + ' ,' + json.events[i].description);
        }

        if (data2 == undefined){
          bot.postMessageToChannel('general',
          'No close by events can be found.');
        }
      })
      .catch(err => {
        //
      });
    }

    if (message.includes('Top')){
      var res = message.split("Top ");
      res = message.split(" ");
      //console.log(res);

      var limit = parseInt(res[1]);

      var location = "";
      var location = res.join();

      location = location.replace("Top "+ limit, "");
    //  console.log(location);
        if (res[0] == "Top"){
          // Set any parameters, if applicable (see API documentation for allowed params)
          let params = [{limit: limit, radius: '10000', location: location, sort_by: 'rating'}];

          yelp.query('businesses/search', params)
          .then(data2 => {
            let json = JSON.parse(data2);
            //console.log(data2);
            // Success
            for (var i = 0; i < limit; i++){
              bot.postMessageToChannel('general',
              'Restaurants found: ' + json.businesses[i].name + ' ,' + json.businesses[i].location.display_address);
            }

            if (data2 == undefined){
              bot.postMessageToChannel('general',
              'No close by events can be found.');
            }
          })
          .catch(err => {
            // Failure

            console.log(err);
          });
        }
    }

    if (message.includes('Closest')){
      var res = message.split("Closest ");
      res = message.split(" ");
      //console.log(res);

      var limit = parseInt(res[1]);

      var location = "";
      var location = res.join();
      location = location.replace("Closest "+ limit, "");
      //console.log(location);

      if (res[0] == "Closest"){
        // Set any parameters, if applicable (see API documentation for allowed params)
        let params = [{limit: limit, location: location, sort_by: 'distance'}];

        yelp.query('businesses/search', params)
        .then(data2 => {
          let json = JSON.parse(data2);
          //console.log(data2);
          // Success
          for (var i = 0; i < limit; i++){
            bot.postMessageToChannel('general',
            'Restaurants found: ' + json.businesses[i].name + ' ,' + json.businesses[i].location.display_address);
          }

          if (data2 == undefined){
            bot.postMessageToChannel('general',
            'No nearby restaurants can be found');
          }
        })
        .catch(err => {
          // Failure
          console.log(err);
        });
      }
  }

  if (message.includes('FindMe')){
    var res = message.split(" ");

    //console.log(res);

    var category = res[1];

    var location = "";
    var location = res.join();
    location = location.replace("FindMe "+ category, "");

    //console.log(res[0]);
    //console.log(location);

    if (res[0] == "FindMe"){
      // Set any parameters, if applicable (see API documentation for allowed params)
      let params = [{radius: '20000', location: location, categories: category}];

      yelp.query('businesses/search', params)
      .then(data2 => {
        let json = JSON.parse(data2);
        //console.log(data2);
        // Success
        for (var i = 0; i < 5; i++){
          bot.postMessageToChannel('general',
          'Restaurants found: ' + json.businesses[i].name + ' ,' + json.businesses[i].location.display_address+ ' , Rating: ' + json.businesses[i].rating);
        }

        if (data2 == undefined){
          bot.postMessageToChannel('general',
          'No '+category+' restaurant can be found.');
        }
      })
      .catch(err => {
        // Failure
        console.log(err);
      });
    }
  }

  if (message.includes('SearchByPhone')){

    var res = message.split("SearchByPhone ");
    //console.log(res);
    var phone = "+" + res[1];
    //console.log(phone);
  //  console.log(res[0]);
    if (res[0] == ""){

      let params = [{ phone: phone }];

      // Call the endpoint
      yelp.query('businesses/search/phone', params)
      .then(data => {
        // Success
        console.log(data);
        let json = JSON.parse(data);

        for (var i = 0; i < 20; i++){
          bot.postMessageToChannel('general',
          'Restaurants found: ' + json.businesses[i].name + ' ,' + json.businesses[i].location.display_address);
        }

        if (data.total == 0){
          bot.postMessageToChannel('general',
          'No restaurant with phone number '+phone+' can be found');
        }
      })
      .catch(err => {
        // Failur
        bot.postMessageToChannel('general',
        'No restaurant with phone number '+phone+' can be found');
        console.log(err);
      });
    }
  }

  if (message.includes('Reviews')){
    var res = message.split(/[0-9]/)[0];


    var request = res.split(" ")[0];
    var place = res.replace("Reviews ", "");
    var res1 = message.split(place)[1];
    var location = res1;
    var businessid = "";

    //console.log(res1);
    //console.log(place);
    //console.log(location);

    if (request == "Reviews"){
      // Set any parameters, if applicable (see API documentation for allowed params)
      let params = [{limit: 1, location: location, sort_by: 'distance', term: place}];

      yelp.query('businesses/search', params)
      .then(data2 => {
        let json = JSON.parse(data2);
        //console.log(json);
        // Success
        //businessid = json.businesses[0].id;
        reviewQuery(json);

      //  console.log(businessid);
      })
      .catch(err => {
        // Failure
        console.log(err);
      });
    }
  }
    if (message.includes("Status")){
      var res = message.split(" ");
      var res1 = message.split(res[1]);
      //Status Complete I love programming 2019-10-19

      var res2 = message.split(/[0-9]/)[0];
      var res3 = message.split(/[0-9]/)[0];

      var timestamp = message.replace(res3, "");
      //console.log(timestamp);
      var usermessage = res2.replace("Status ","");
      var usermessage = usermessage.split(res[1]);

      var data = [];
      data.push(res[1]); //status
      data.push(usermessage[1]); //message
      data.push(timestamp);

      //console.log(data);
      //Insert Status request
      StatusMessage(data);


    }
  }
});

async function reviewQuery(actualRestaurant) {
//console.log(actualRestaurant.businesses[0].id);
let businessId = actualRestaurant.businesses[0].id;
  try {
    var results = await yelp.query(`businesses/${businessId}/reviews`)
        .then(data => {
            // Success
            //console.log('data', data);

            var reviews = JSON.parse(data);
            var reviewsArray = reviews["reviews"];
            var responseBody = []

            // The Review api can only display a maximium of 3 reviews.
            reviewsArray.forEach(element => {
                responseBody.push("Review found: Text: " + element.text + "\nuser: " + element.user.name + "\nRating: " + element.rating + "\nUrl of the Full review: " + element.url);
            });

            for (let index = 0; index < responseBody.length; index++) {
                bot.postMessageToChannel('general', responseBody[index]);
            }
        })
        .catch(err => {
            // Failure
            console.log(err);
        });
  }
  catch (e) {

  }
}

async function StatusMessage(data) {
//  let query = "INSERT INTO User(status, message, timestamp) Values (?, ?, ?)";
  db.serialize(function () {
      //var stmt = db.prepare(query);
      var sql ='INSERT INTO user (status, message, timestamp) VALUES (?,?,?)'
      var params =[data[0], data[1], data[2]];

      db.run(sql, params, function (err, result) {
          if (err){
              res.status(400).json({"error": err.message})
              return;
          }
      });
    //  stmt.finalize();
  });
}

db.serialize(function(){
    console.log('Connected to the SQLite database.');
    db.run("DROP TABLE IF EXISTS User;");
  	db.run("CREATE TABLE User (status text, message text, timestamp text);");
    var stmt = db.prepare("INSERT INTO User VALUES(?,?,?)");
});
