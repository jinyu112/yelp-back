const express = require('express');
const yelpRouter  = express.Router();

yelpRouter.get('/', (req, res,next) => {
    res.send('hi');
});


module.exports = yelpRouter;
