// GA.js

var allData; // array of 4D arrays. each array contains cost of restaurant/event/etc.,
             //                                         type (i.e. restaurant or event or meetup, etc.),
             //                                         id of restaurant/event/etc.,
             //                                         rating of restaurant/event/etc.

// types: breakfast, lunch, dinner, event
function doGA() {
  
  // Initialize constants for GA
  var maxIter = 100;                              // max iterations
  var itinerarySize = 7;                          // number of things to do in the day
  var elitek = 2;                                 // number of elite iteneraries passed onto the next generation
  var popSize = 50 + elitek;                      // population size for each generation
  var crossRate = randomIntFromInterval(5,8);     // crossover rate
  var mutateRate = randomIntFromInterval(5,20);   // mutation rate
  var tempItinerary = new Array(itinerarySize);
  var itineraryPopulation = new Array(popSize);   // population array
  var irand;
  var iEvent1 = 0;                                
	var iBreakfast = 0;
	var iEvent2 = 0;
	var iLunch = 0;
	var iEvent3 = 0;
	var iDinner = 0;
	var iEvent4 = 0;
	
  itineraryPopulation = initializePopulation(popSize , itinerarySize);

}

// Generate a random number from min to max inclusive
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Initialize population (step one of GA)
function initializePopulation(popSize_in, itinerarySize_in) {
  for (var i = 0; i < popSize; i++) {

  }
  return 0;
}

// Randomly select an itinerary item from a specific category (i.e. category is breakfast, 
//                                                             array of breakfast itinerary items  = {mcdonalds, keke's, einstein bagels}
//                                                             array of itinerary items' ids       = {123, 41, 2}
//                                                             indices of the breakfast item array = {0, 1, 2})
// Say genGeneAndSelectionArray selects mcdonalds, the output will be {123, 0}
function genGeneAndSelectionArray(categoryData) { 
	var len = categoryData.length;
	var i = randomIntFromInterval(0,len-1);
	var iPlayerSelected = playerArray[i];
	playerArray.splice(i, 1);
	
	return {
	playerArrayOut: playerArray,
	iPlayerSelectedOut: iPlayerSelected
	};
}
