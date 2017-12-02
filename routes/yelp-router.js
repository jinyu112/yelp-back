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
    client.search({
        term: req.body.term,
        location: req.body.location
    }).then(response => {
        res.send(response.jsonBody.businesses);
    }).catch(e => {
        console.log(e);
    });
});


module.exports = yelpRouter;
