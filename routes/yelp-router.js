'use strict';

const express     = require('express');
const yelpRouter  = express.Router();
const yelp        = require('yelp-fusion');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
let token;
let client;

yelp.accessToken(clientId, clientSecret)
    .then(response => {
        token = response.jsonBody.access_token;
        client = yelp.client(token);
    })
    .catch(e => {
        console.log(e);
    });

//Search for business
yelpRouter.post('/', (req, res, next) => {
    var total;
    client.search({
        term: req.body.term,
        location: req.body.location,
        limit: 50,
    }).then(response => {
        total = response.jsonBody.total;
        getBusinesses(total);
    }).catch(e => {
        console.log(e);
    });

    function getBusinesses(total) {
        var businesses = [];

        var count = 0;

        var numOfBiz = Math.floor(total/50);

        for(var i = 0; i < total; i+=50) {
            client.search({
                term: req.body.term,
                location: req.body.location,
                limit: 50,
                offset: i,
            }).then(response => {
                response.jsonBody.businesses.forEach(business => {
                    switch(business.price) {
                        case '$':
                            business.price = 1;
                            break;
                        case '$$':
                            business.price = 2;
                            break;
                        case '$$$':
                            business.price = 3;
                            break;
                        case '$$$$':
                            business.price = 4;
                            break;
                        default:
                            business.price = 2;
                    }
                    var item = {
                        name: business.name,
                        cost: business.price,
                        rating: business.rating
                    }
                    businesses.push(item);
                });
                count++;

                if(count == Math.floor(total/50) ) {
                    generateEventArrays();
                }
            }).catch(e => {
                console.log(e);
            });
        }

        function generateEventArrays() {

            if(businesses.length > 0) {

                var numberOfItems = Math.floor(businesses.length/7);
                var itineraries = [];

                var count = 0;

                for(var i = 0; i <= businesses.length; i++) {
                    var events = businesses.splice(0, numberOfItems);
                    console.log(businesses);
                    var key =  'event' + count;
                    var eventObj = {};
                    eventObj[key] = events;
                    itineraries.push(eventObj);
                    count ++;


                    if(count == 7) {
                        //run jimmy's function
                        return;
                    }
                }

            } else {
                res.send('No Businesses found');
            }
        }
    }



});



module.exports = yelpRouter;
