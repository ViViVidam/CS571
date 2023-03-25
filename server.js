const express = require("express");
const cors = require('cors');
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
const querystring = require('querystring');
//const fs = require('fs');
let API_KEY = '3d6TMT9FEQ-Y93jPJTrPTFQXO1leS088w9e33d5xi40AX6_hQO8ht5Abu8Xv4ZqOngZ-mxx99mdjmLzj9LMIZkqYAkjkEDE4kGoWW2B-1KkUUM8O0sxQOoUn4EM5Y3Yx';
let API_HOST = 'api.yelp.com';
let SEARCH_PATH = '/v3/businesses/search';
let BUSINESS_PATH1 = '/v3/businesses/';
let CATEGORY_PATH = '/v3/categories';
let AUTO_PATH = '/v3/autocomplete';
let HEADERS = {
  'Authorization': 'Bearer ' + API_KEY,
};

app.use(bodyParser.json());
app.use(express.static(process.cwd()+"/busi-search/dist/busi-search"))

app.get('/', (req,res)=> {
  res.sendFile(process.cwd()+"/busi-search/dist/busi-search/index.html");
});
app.get('/search', (req,res)=> {
  res.sendFile(process.cwd()+"/busi-search/dist/busi-search/index.html")
});

app.use(cors({
  origin: '*'
}))

app.get('/getTable', (req, res) => {
  let keyword = req.query.key;
  let distance = req.query.dist;
  let category = req.query.cat;
  let location = req.query.loc;
  var lat = 0;
  var lng = 0;
  //console.log(process.cwd());

  // console.log(distance);
  distance = parseFloat(distance);
  let radius = Math.floor(distance * 1609.344);

  // console.log(distance);
  // console.log(keyword);
  //console.log(req.query);
  //console.log(req.query.autoLoc);
  if (req.query.autoLoc=='true') {
    lat = parseFloat(req.query.lat);
    lng = parseFloat(req.query.lng);
    let params = {
      term: keyword,
      latitude: lat,
      longitude: lng,
      categories: category,
      radius: radius,
      limit: 10
    }

    console.log(params);


    var url = 'https://' + API_HOST + SEARCH_PATH;
    // console.log(HEADERS);
    axios.get(url, {
        params: params,
        headers: HEADERS
      })
      .then((response) => {
        response.data.businesses;
        // console.log(response.data.businesses[0].categories);
        // console.log(response.data.businesses[0].location.display_address);
        // console.log(response.data);
        // console.log(response);
        res.send(response.data.businesses);
      })
  }
  else {
    let loc_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=AIzaSyD7ilHRCDRDmrIHCYgHnOf13I-ciHbsBV0';
    // console.log(loc_url);
    axios.get(loc_url)
      .then((response) => {lat = response.data.results[0].geometry.location.lat;
      lng = response.data.results[0].geometry.location.lng;console.log(123);
      let params = {
        term: keyword,
        latitude: lat,
        longitude: lng,
        categories: category,
        radius: radius,
        limit: 10
      }

      console.log(params);


      var url = 'https://' + API_HOST + SEARCH_PATH;
      // console.log(HEADERS);
      axios.get(url, {
          params: params,
          headers: HEADERS
        })
        .then((response) => {
          response.data.businesses;
          // console.log(response.data.businesses[0].categories);
          // console.log(response.data.businesses[0].location.display_address);
          // console.log(response.data);
          // console.log(response);
          res.send(response.data.businesses);
        })
    })

  }
})

app.get("/autoComplete", function(req, res) {
  let keyword = req.query.key;
  var auto_url = 'https://' + API_HOST + AUTO_PATH + '?text=' + keyword;
  // console.log(keyword);

  axios.get(auto_url, {
      headers: HEADERS
    })
    .then((response) => {

      // console.log(response.data.businesses[0].categories);
      // console.log(response.data.businesses[0].location.display_address);
      //console.log(response.data.businesses);
      // console.log(response.data);
      response.data.categories.map((item) => {delete item.alias; item['text'] = item.title; delete item.title;});
      //console.log(response.data.terms.concat(response.data.categories));
      res.send(response.data.terms.concat(response.data.categories));
    })


});

app.get("/card", function(req, res) {
  let id = req.query.id;
  var card_url = 'https://' + API_HOST + BUSINESS_PATH1 + id;
  axios.get(card_url, {
      headers: HEADERS
    })
    .then((response) => {

      // console.log(response.data.businesses[0].categories);
      // console.log(response.data.businesses[0].location.display_address);
      //console.log(response.data.businesses);

      // console.log(response.data.photos);
      res.send(response.data.photos);
    })
    .catch(function(error) {
      console.log(error);
    });

});

app.get("/review", function(req, res) {
  let id = req.query.id;
  var review_url = 'https://' + API_HOST + BUSINESS_PATH1 + id + '/reviews';
  // console.log(review_url);
  axios.get(review_url, {
      headers: HEADERS
    })
    .then((response) => {

      response.data.reviews.map((item) => {
        delete item.id;
        delete item.url;
        item.user = item.user.name;
      })

      // console.log(response.data.businesses[0].categories);
      // console.log(response.data.businesses[0].location.display_address);
      //console.log(response.data.businesses);

      // console.log(mapped_review);
      // console.log(response.data.reviews);

      //console.log(response.data.reviews[0].user);
      res.send(response.data.reviews);
    })
    .catch(function(error) {
      console.log(error);
    });

});

const port = parseInt(process.env.PORT) ||8080;
app.listen(port, function() {
  console.log("server is running");
});
