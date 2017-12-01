

// GA.js

var BUDGET = 55;
var allData = {
  Event1: ["golf", "swimming", "jogging", "stroll", "laughing", "none"],
  Event1Cost: [10, 5, 0, 0, 0, 0],
  Event1Rating: [1, 1, 1, 1, 1, 1 ],
  Breakfast: ["Tiffany's", "McDonalds", "BK", "iHop", "KeKes", "none"],
  BreakfastCost: [10, 5, 5, 8, 12 , 0],
  BreakfastRating: [4.4, 3.5, 3.3, 3.9, 4.1 ,0],
  Event2: ["Movie", "Park", "Zoo", "Gym", "Art walk", "none"],
  Event2Cost: [12, 0, 35, 10, 0, 0],
  Event2Rating: [1, 1, 1, 1, 1, 1],
  Lunch: ["MD", "Chiptole", "Taco Bell", "Cafe", "Subway", "none"],
  LunchCost: [7, 9, 7, 14, 7,0],
  LunchRating: [3.3, 4.0, 3.5, 4.1, 3.8, 0],
  Event3: ["Hang Out", "Walk", "Netflix", "Hike", "Sailing", "none"],
  Event3Cost: [1, 1, 10, 5, 18,0],
  Event3Rating: [1, 1, 1, 1, 2 ,1],
  Dinner: ["Fancy1", "Fancy2", "Fancy3", "Fancy4", "Fancy5", "none"],
  DinnerCost: [18, 20, 15, 25, 35, 20,0],
  DinnerRating: [4.3, 4.4, 4.2, 4.0, 4.9, 4.6,1],
  Event4: ["Dancing", "Bar", "Club", "Painting", "Gallery", "none"],
  Event4Cost: [5, 25, 30, 23, 10,0],
  Event4Rating: [1, 2, 2.1, 1.9, 1,1]
}

// categories: breakfast, lunch, dinner, event
function doGA() {

  // Initialize constants for GA
  var maxIter = 100;                              // max iterations
  var itinerarySize = 7;                          // number of things to do in the day
  var elitek = 1;                                 // number of elite iteneraries passed onto the next generation
  var popSize = 20 + elitek;                      // population size for each generation
  var crossRate = randomIntFromInterval(5, 8);     // crossover rate
  var mutateRate = randomIntFromInterval(5, 20);   // mutation rate
  var tempItinerary = new Array(itinerarySize);
  var itineraryPopulation = new Array(popSize);   // population array (array of arrays)
  var irand;
  var bestItinerary = new Array(itinerarySize);
  var iBestItinerary;
	var bestItineraryObj;
  var bestRating;
  var bestCost;


  itineraryPopulation = initializePopulation(popSize, itinerarySize, allData);
  console.log(itineraryPopulation);

  bestItineraryObj = findBestItinerary(itineraryPopulation , allData);	
  iBestItinerary = bestItineraryObj.bestItineraryOut;
  bestRating = bestItineraryObj.bestItineraryRatingOut;
  bestCost = bestItineraryObj.bestItineraryCostOut;

  
  console.log(iBestItinerary);
  console.log("best rating: " + bestRating);
  console.log("best cost: " + bestCost);
  console.log(iBestItinerary[0]);
  bestItinerary[0] = allData.Event1[iBestItinerary[0]];
  bestItinerary[1] = allData.Breakfast[iBestItinerary[1]];
  bestItinerary[2] = allData.Event2[iBestItinerary[2]];
  bestItinerary[3] = allData.Lunch[iBestItinerary[3]];
  bestItinerary[4] = allData.Event3[iBestItinerary[4]];
  bestItinerary[5] = allData.Dinner[iBestItinerary[5]];
  bestItinerary[6] = allData.Event4[iBestItinerary[6]];

  console.log(bestItinerary);
  

}

// Generate a random number from min to max inclusive
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Initialize population (step one of GA)
function initializePopulation(popSize_in, itinerarySize_in, allData_in) {
  // Initialization
  var itineraryPop = new Array(popSize_in);
  var itinerary = new Array(itinerarySize_in);

  for (var i = 0; i < popSize_in; i++) {
    // Randomly pick an itinerary item from each category
    iEvent1 = pickRandomItineraryItemExcluding(allData_in.Event1.length, -1);
    iBreakfast = pickRandomItineraryItemExcluding(allData_in.Breakfast.length, -1);
    iEvent2 = pickRandomItineraryItemExcluding(allData_in.Event2.length, -1);
    iLunch = pickRandomItineraryItemExcluding(allData_in.Lunch.length, -1);
    iEvent3 = pickRandomItineraryItemExcluding(allData_in.Event3.length, -1);
    iDinner = pickRandomItineraryItemExcluding(allData_in.Dinner.length, -1);
    iEvent4 = pickRandomItineraryItemExcluding(allData_in.Event4.length, -1);

    // Create the randomized itineraries and generate the population of itineraries
    itinerary = [iEvent1, iBreakfast, iEvent2, iLunch, iEvent3, iDinner, iEvent4];
    itineraryPop[i] = itinerary;
  }
  return itineraryPop;
}

// Pick a random index and have the ability to exclude ONE index in an array of length numCategoryItems
function pickRandomItineraryItemExcluding(numCategoryItems, iExcludeItem) { // Note numCategoryItems is the length of the vector
  // iExcludeItem is the INDEX of the vector
  iItineraryItem = randomIntFromInterval(0, numCategoryItems - 1); // from 0 to length of array minus 1
  if (iItineraryItem == iExcludeItem) {
    if (iItineraryItem == 0) {
      iItineraryItem++;
    }
    else if (iItineraryItem == (numCategoryItems - 1)) {
      iItineraryItem--;
    }
    else {
      iItineraryItem++;
    }
  }
  return iItineraryItem;
}

// Check if value is present in array
function isInArray(value, array) {
  var valueStr = value.toString();
  var arrayStr = array.toString();
  return arrayStr.indexOf(valueStr) > -1;
}


function findBestItinerary(itineraryPop_in, allData_in) {
  var budget = BUDGET;
  var maxItineraryRating = 0;
  var itineraryRating = 0;
  var popLen = itineraryPop_in.length;
  var maxItineraryCost = 0;
  var itineraryCost = 0;
  var bestItinerary;
  var allItineraryRatings = new Array(popLen);
  var allItineraryValSum = 0;
  for (var i = 0; i < popLen; i++) {

    itineraryCost = getTotalCost(itineraryPop_in[i], allData_in);
    itineraryCost = Math.round(itineraryCost);
    if (itineraryCost > budget) {
      itineraryRating = 0;
    }
    else {
      itineraryRating = getTotalRating(itineraryPop_in[i], allData_in);
    }

    allItineraryRatings[i] = itineraryRating;
    allItineraryValSum = allItineraryValSum + itineraryRating;
    if (itineraryRating > maxItineraryRating) {
      maxItineraryRating = itineraryRating;
      maxItineraryCost = itineraryCost;
      bestItinerary = itineraryPop_in[i];
    }
  }

  if (maxItineraryRating == 0) {
    bestItinerary = itineraryPop_in[0];
  }
  return {
    bestItineraryOut: 
      [bestItinerary[0],
      bestItinerary[1],
      bestItinerary[2], 
      bestItinerary[3], 
      bestItinerary[4], 
      bestItinerary[5], 
      bestItinerary[6]],
      bestItineraryRatingOut: maxItineraryRating,
      bestItineraryCostOut: maxItineraryCost,
  };
}


function getTotalCost(itinerary_in , allData_in) 
{
  var totalCost = 0;
  var itineraryItemCost = 0;
	var len = itinerary_in.length;
	
	for ( var i = 0; i < len; i++) {
    if (i == 0) 
    {
      itineraryItemCost = allData_in.Event1Cost[itinerary_in[i]];
    }
    else if (i == 1)
    {
      itineraryItemCost = allData_in.BreakfastCost[itinerary_in[i]];
    }
    else if (i == 2)
    {
      itineraryItemCost = allData_in.Event2Cost[itinerary_in[i]];
    }
    else if (i == 3)
    {
      itineraryItemCost = allData_in.LunchCost[itinerary_in[i]];
    }
    else if (i == 4)
    {
      itineraryItemCost = allData_in.Event3Cost[itinerary_in[i]];
    }
    else if (i == 5)
    {
      itineraryItemCost = allData_in.DinnerCost[itinerary_in[i]];
    }
    else 
    {
      itineraryItemCost = allData_in.Event4Cost[itinerary_in[i]];
    }
    //console.log(itineraryItemCost)
    totalCost = totalCost + itineraryItemCost;
	}

  console.log("totalCost: " + totalCost);
	return totalCost;
}

function getTotalRating(itinerary_in , allData_in) 
{
  var totalRating = 0;
  var itineraryItemRating = 0;
	var len = itinerary_in.length;
	
	for ( var i = 0; i < len; i++) {
    if (i == 0) 
    {
      itineraryItemRating = allData_in.Event1Rating[itinerary_in[i]];
    }
    else if (i == 1)
    {
      itineraryItemRating = allData_in.BreakfastRating[itinerary_in[i]];
    }
    else if (i == 2)
    {
      itineraryItemRating = allData_in.Event2Rating[itinerary_in[i]];
    }
    else if (i == 3)
    {
      itineraryItemRating = allData_in.LunchRating[itinerary_in[i]];
    }
    else if (i == 4)
    {
      itineraryItemRating = allData_in.Event3Rating[itinerary_in[i]];
    }
    else if (i == 5)
    {
      itineraryItemRating = allData_in.DinnerRating[itinerary_in[i]];
    }
    else 
    {
      itineraryItemRating = allData_in.Event4Rating[itinerary_in[i]];
    }
    totalRating = totalRating + itineraryItemRating;
	}
  console.log("totalRating: " + totalRating);
	return totalRating;
}