'use strict';

const express = require('express');
const yelpRouter = express.Router();
const yelp = require('yelp-fusion');
const genAlgo = require('../GA.js');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
let client = yelp.client(process.env.API_KEY);

//Meetup
var meetup = require('../node_modules/meetup-api/lib/meetup')({
    key: process.env.MEETUP_KEY
});

//Search for business
yelpRouter.post('/', (req, res, next) => {
    var yelpItemsGlobal;
    var meetupItemsGlobal;
    // 1. fulfilled promise returned from getYelpDataLength is the total businesses returned from the query
    getYelpDataLength(req.body.term, req.body.location).then(function (yelpTotal) {
        // 2. fulfilled promise returned from getYelpData is an array of object arrays
        return getYelpData(yelpTotal, req.body.term, req.body.location);
    }, function (err) {
        return err;
    }).catch(function (e) {
        console.log(e)
    }).then(function (yelpItems) {
        //console.log(yelpItems)
        yelpItemsGlobal = yelpItems;
        // 3. fulfilled promise returned from getYelpData is an array of object arrays
        return getMeetupData(req.body.location);
    }, function (err) {
        return err;
    }).catch(function (e) {
        console.log(e)
    }).then(function (meetupEvents) {
        //console.log(meetupEvents);
        var itineraries = formatAllData(yelpItemsGlobal,meetupEvents);
        // console.log(itineraries[0].Event1)
        // console.log('--------------')
        // console.log(itineraries[1].Breakfast)
        // console.log('--------------')
        // console.log(itineraries[2].Event2)
        if (!isEmpty(itineraries)) {
            res.send(genAlgo.doGA(itineraries));
        }
    },function (err) {
        return err;
    }).catch(function (e) {
        console.log(e)
    });

    

});

// Procresses the lat/long string and returns an array of two floats
function procressLocationString(locStr) {
    var splitLocStr = locStr.split(',');
    var lat = parseFloat(splitLocStr[0]);
    var long = parseFloat(splitLocStr[1]);
    var latLonArray = [lat, long];
    return latLonArray;
}


// ------------- Meetup API Stuff

// Get  data from Meetup 
function getMeetupData(location_in) {
    return new Promise(function (resolve, reject) {
        try {
            var latLongArray = procressLocationString(location_in);
            var meetupEvents = [];
            var count = 0;
            meetup.getUpcomingEvents({
                lat: latLongArray[0],
                lon: latLongArray[1],
                radius: 'smart',
                end_date_range: '2017-12-30T00:00:00', //need to change!!!!
                page: 50,
            }, function (error, events) {
                if (error) {
                    console.log(error);
                    reject(-1);
                } else {
                    var numOfEvents = events.events.length;
                    console.log(numOfEvents)
                    for (var i = 0; i < numOfEvents; i++) {
                        var item = {
                            name: events.events[i].group.name+ ": " + events.events[i].name,
                            cost: (i % 5)*1.2 + 3, //need to change!!!!
                            rating: (i % 5) + 1 //need to change!!!!
                        }
                        meetupEvents.push(item);
                        count++;
                    }
    
                    resolve(meetupEvents);
                }
            });
        }
        catch (e) {
            console.log('error in getMeetupData')
            reject(-1);
        }
    });
}



// ------------- Yelp API Stuff

// Get initial data length from Yelp
function getYelpDataLength(term_in, location_in) {
    return new Promise(function (resolve, reject) {
        client.search({
            term: term_in,
            location: location_in,
            limit: 50,
        }).then(response => {
            var total = response.jsonBody.total;
            resolve(total);
        }).catch(e => {
            console.log(e);
            reject(-1);
        });
    });
}

// Get data from Yelp and format it
function getYelpData(total_in, term_in, location_in) {
    return new Promise(function (resolve, reject) {
        var total = total_in;
        var count = 0;
        var businesses = [];
        var itineraries = [];
        var numOfBiz = Math.floor(total / 50);

        for (var i = 0; i < total; i += 50) {
            client.search({
                term: term_in,
                location: location_in,
                limit: 50,
                offset: i,
            }).then(response => {
                response.jsonBody.businesses.forEach(business => {
                    switch (business.price) {
                        case '$':
                            business.price = 10;
                            break;
                        case '$$':
                            business.price = 20;
                            break;
                        case '$$$':
                            business.price = 46;
                            break;
                        case '$$$$':
                            business.price = 65;
                            break;
                        default:
                            business.price = 20;
                    }
                    var item = {
                        name: business.name,
                        cost: business.price,
                        rating: business.rating
                    }
                    businesses.push(item);
                });
                count++;

                if (count == numOfBiz) {
                    resolve(businesses);
                    
                }

            }).catch(e => {
                console.log(e);
                reject(-1);
            });
        }
    });
}

// Format all data
function formatAllData(yelpItems, meetupItems) {
    try {
        var numYelpItems = yelpItems.length;
        var numMeetupItems = meetupItems.length;
        console.log("numYelpItems: " + numYelpItems)
        console.log("numMeetupItems: " + numMeetupItems)
        var itemIntervalYelp = Math.floor(numYelpItems / 3);
        var itemIntervalMeetup = Math.floor(numMeetupItems / 4);
        var itineraries = [];
        if (numYelpItems > 3 && numMeetupItems > 4) {
            var items;
            var key;            
            for (var i = 0; i <= 7; i++) {
                if (i == 0) {
                    key = 'Event1';
                    items = meetupItems.slice(0,itemIntervalMeetup);
                    var itemObj = {};
                    itemObj[key] = items;
                    itineraries.push(itemObj);
                } else if (i == 2) {
                    key = 'Event2';
                    items = meetupItems.slice(itemIntervalMeetup,itemIntervalMeetup * 2);
                    var itemObj = {};
                    itemObj[key] = items;
                    itineraries.push(itemObj);
                } else if (i == 4) {
                    key = 'Event3';
                    items = meetupItems.slice(itemIntervalMeetup * 2,itemIntervalMeetup * 3);
                    var itemObj = {};
                    itemObj[key] = items;
                    itineraries.push(itemObj);
                } else if (i == 6) {
                    key = 'Event4';
                    items = meetupItems.slice(itemIntervalMeetup * 3, numMeetupItems);
                    var itemObj = {};
                    itemObj[key] = items;
                    itineraries.push(itemObj);
                } else if (i == 1) {
                    key = 'Breakfast';
                    items = yelpItems.slice(0,itemIntervalYelp);
                    var itemObj = {};
                    itemObj[key] = items;
                    itineraries.push(itemObj);
                } else if (i == 3) {
                    key = 'Lunch';
                    items = yelpItems.slice(itemIntervalYelp,itemIntervalYelp * 2);
                    var itemObj = {};
                    itemObj[key] = items;
                    itineraries.push(itemObj);
                } else {
                    key = 'Dinner';
                    items = yelpItems.slice(itemIntervalYelp * 2, numYelpItems);
                    var itemObj = {};
                    itemObj[key] = items;
                    itineraries.push(itemObj);
                }
            }
            return itineraries;
        } else {
            console.log("Not enough items")
            return itineraries;
        }
    }
    catch (e) {
        console.log('error in formatAllData')
        console.log(e)
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = yelpRouter;
