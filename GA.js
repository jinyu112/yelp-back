

// GA.js

var BUDGET = 78;
var allData = {
  Event1: ["golf", "swimming", "jogging", "stroll", "laughing", "none"],
  Event1Cost: [10, 5, 0, 0, 0, 0],
  Event1Rating: [1, 1, 1, 1, 1, 1],
  Breakfast: ["Tiffany's", "McDonalds", "BK", "iHop", "KeKes", "none"],
  BreakfastCost: [10, 5, 5, 8, 12, 0],
  BreakfastRating: [4.4, 3.5, 3.3, 3.9, 4.1, 0],
  Event2: ["Movie", "Park", "Zoo", "Gym", "Art walk", "none"],
  Event2Cost: [12, 0, 35, 10, 0, 0],
  Event2Rating: [1, 1, 1, 1, 1, 1],
  Lunch: ["MD", "Chiptole", "Taco Bell", "Cafe", "Subway", "none"],
  LunchCost: [7, 9, 7, 14, 7, 0],
  LunchRating: [3.3, 4.0, 3.5, 4.1, 3.8, 0],
  Event3: ["Hang Out", "Walk", "Netflix", "Hike", "Sailing", "none"],
  Event3Cost: [1, 1, 10, 5, 18, 0],
  Event3Rating: [1, 1, 1, 1, 2, 1],
  Dinner: ["Fancy1", "Fancy2", "Fancy3", "Fancy4", "Fancy5", "none"],
  DinnerCost: [18, 20, 15, 25, 35, 20, 0],
  DinnerRating: [4.3, 4.4, 4.2, 4.0, 4.9, 4.6, 1],
  Event4: ["Dancing", "Bar", "Club", "Painting", "Gallery", "none"],
  Event4Cost: [5, 25, 30, 23, 10, 0],
  Event4Rating: [1, 2, 2.1, 1.9, 1, 1]
}

// categories: breakfast, lunch, dinner, event
function doGA() {

  // Initialize constants for GA
  var maxIter = 10;                              // max iterations
  var itinerarySize = 7;                          // number of things to do in the day
  var elitek = 1;                                 // number of elite iteneraries passed onto the next generation
  var popSize = 6 + elitek;                      // population size for each generation
  var crossRate = 100 ;//randomIntFromInterval(5, 8);    // crossover rate
  var mutateRate = 1000; //randomIntFromInterval(10, 20);  // mutation rate
  var numEvent1 = allData.Event1.length;
  var numBreakfast = allData.Breakfast.length;
  var numEvent2 = allData.Event2.length;
  var numLunch = allData.Lunch.length;
  var numEvent3 = allData.Event3.length;
  var numDinner = allData.Dinner.length;
  var numEvent4 = allData.Event4.length;
  var numItemsArray = new Array(itinerarySize);
  numItemsArray = [numEvent1, numBreakfast, numEvent2, numLunch, numEvent3, numDinner, numEvent4];
  var tempItinerary = new Array(itinerarySize);
  var childItinerary = new Array(itinerarySize);
  var crossedItineraryArray;
  var itineraryPopulation = new Array(popSize);   // population array (array of arrays)
  var newItineraryPop = new Array(popSize);
  var allItineraryRatings = new Array(popSize);
  var allItineraryRatingsSum = 0;
  var irand;
  var bestItinerary = new Array(itinerarySize);
  var iBestItinerary;
  var bestItineraryObj;
  var bestRating;
  var bestCost;

  // Create first population to initialize GA
  itineraryPopulation = initializePopulation(popSize, itinerarySize, numItemsArray);
  console.log(itineraryPopulation);

  // Find the "fittest" itinerary and return some itinerary stats
  bestItineraryObj = findBestItinerary(itineraryPopulation, allData);
  iBestItinerary = bestItineraryObj.bestItineraryOut;
  bestRating = bestItineraryObj.bestItineraryRatingOut;
  bestCost = bestItineraryObj.bestItineraryCostOut;
  allItineraryRatings = bestItineraryObj.allItineraryRatingsOut;
  allItineraryRatingsSum = bestItineraryObj.allItineraryValSumOut;

  for (var i = 0; i < maxIter; i++) {
    // Construct new population of itineraries
    popCnt = 0;

    // Populate with the elite itineraries first
    for (var j = 0; j < elitek; j++) {
      newItineraryPop[j] = [iBestItinerary[0],
      iBestItinerary[1],
      iBestItinerary[2],
      iBestItinerary[3],
      iBestItinerary[4],
      iBestItinerary[5],
      iBestItinerary[6]];
      popCnt = popCnt + 1;
    }

    // Breed/select other itineraries
    while (popCnt < popSize) {

      // Pick two itineraries
      var iItineraryPick1 = 0;
      var iItineraryPick2 = 0;

      // Use roulette selection or randomized
      var pick = randomIntFromInterval(1, 2);
      if (pick == 1) {
        iItineraryPick1 = rouletteSelect(allItineraryRatings, allItineraryRatingsSum);
        iItineraryPick2 = rouletteSelect(allItineraryRatings, allItineraryRatingsSum);
      }
      else {
        iItineraryPick1 = randomIntFromInterval(0, popSize - 1);
        iItineraryPick2 = pickRandomItineraryItemExcluding(popSize,iItineraryPick1);
      }

      var tempItinerary1 = itineraryPopulation[iItineraryPick1];
      var tempItinerary2 = itineraryPopulation[iItineraryPick2];

      // Crossover the two itineraries if randomly chosen to do so
      irand = randomIntFromInterval(1, 10);
      if (irand < crossRate) {
        crossedItineraryArray = crossover(tempItinerary1, tempItinerary2);
        tempItinerary1 = [crossedItineraryArray[0][0], crossedItineraryArray[0][1], crossedItineraryArray[0][2], crossedItineraryArray[0][3],
        crossedItineraryArray[0][4], crossedItineraryArray[0][5], crossedItineraryArray[0][6]];
        tempItinerary2 = [crossedItineraryArray[1][0], crossedItineraryArray[1][1], crossedItineraryArray[1][2], crossedItineraryArray[1][3],
        crossedItineraryArray[1][4], crossedItineraryArray[1][5], crossedItineraryArray[1][6]];
      }

      // Mutate the two itineraries if randomly chosen to do so
      irand = randomIntFromInterval(1, 100);
      if (irand < mutateRate) {
        tempItinerary1 = mutate(tempItinerary1, numItemsArray);
      }

      irand = randomIntFromInterval(1, 100);
      if (irand < mutateRate) {
        tempItinerary2 = mutate(tempItinerary2, numItemsArray);
      }

      // Append newly bred itineraries to current population
      newItineraryPop[popCnt] = [tempItinerary1[0], tempItinerary1[1], tempItinerary1[2], tempItinerary1[3],
      tempItinerary1[4], tempItinerary1[5], tempItinerary1[6]];
      newItineraryPop[popCnt + 1] = [tempItinerary2[0], tempItinerary2[1], tempItinerary2[2], tempItinerary2[3],
      tempItinerary2[4], tempItinerary2[5], tempItinerary2[6]];
      popCnt = popCnt + 2;      
    } // end while loop

    

    itineraryPopulation = newItineraryPop.slice(0);
    bestItineraryObj = findBestItinerary(itineraryPopulation, allData);
    iBestItinerary = bestItineraryObj.bestItineraryOut;
    bestRating = bestItineraryObj.bestItineraryRatingOut;
    console.log("best rating at " + i + "th iteration: " + bestRating);
    console.log("best cost at " + i + "th iteration: " + bestCost);
    bestCost = bestItineraryObj.bestItineraryCostOut;
    allItineraryRatings = bestItineraryObj.allItineraryRatingsOut;
    allItineraryRatingsSum = bestItineraryObj.allItineraryValSumOut;
    console.log(allItineraryRatings)

  } // end maxIter loop


  console.log(iBestItinerary);
  console.log("best rating: " + bestRating);
  console.log("best cost: " + bestCost);
  console.log()
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
function initializePopulation(popSize_in, itinerarySize_in, numItemsArray_in) {
  // Initialization
  var itineraryPop = new Array(popSize_in);
  var itinerary = new Array(itinerarySize_in);

  for (var i = 0; i < popSize_in; i++) {
    // Randomly pick an itinerary item from each category
    iEvent1 = randomIntFromInterval(0, numItemsArray_in[0] - 1);
    iBreakfast = randomIntFromInterval(0, numItemsArray_in[1] - 1);
    iEvent2 = randomIntFromInterval(0, numItemsArray_in[2] - 1);
    iLunch = randomIntFromInterval(0, numItemsArray_in[3] - 1);
    iEvent3 = randomIntFromInterval(0, numItemsArray_in[4] - 1);
    iDinner = randomIntFromInterval(0, numItemsArray_in[5] - 1);
    iEvent4 = randomIntFromInterval(0, numItemsArray_in[6] - 1);

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

// Determine the "fittest" itinerary
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

    // Get the cost of eah itinerary
    itineraryCost = getTotalCost(itineraryPop_in[i], allData_in);
    itineraryCost = Math.round(itineraryCost);

    // Set the rating of the itinerary to zero if it exceeds the budget
    if (itineraryCost > budget) {
      itineraryRating = 0;
    }
    // Otherwise, calculate the total rating of the itinerary
    else {
      itineraryRating = getTotalRating(itineraryPop_in[i], allData_in);
    }

    // Save all the total ratings for later use
    allItineraryRatings[i] = itineraryRating;

    // Save the entire population's total rating
    allItineraryValSum = allItineraryValSum + itineraryRating;

    // Find max rated itinerary
    if (itineraryRating > maxItineraryRating) {
      maxItineraryRating = itineraryRating;
      maxItineraryCost = itineraryCost;
      bestItinerary = itineraryPop_in[i];
    }
  }

  // Garbage collection
  if (maxItineraryRating == 0) {
    bestItinerary = itineraryPop_in[0];
  }

  // Return results 
  return {
    bestItineraryOut: // array of indices
      [bestItinerary[0],
      bestItinerary[1],
      bestItinerary[2],
      bestItinerary[3],
      bestItinerary[4],
      bestItinerary[5],
      bestItinerary[6]],
    bestItineraryRatingOut: maxItineraryRating,
    bestItineraryCostOut: maxItineraryCost,
    allItineraryRatingsOut: allItineraryRatings,
    allItineraryValSumOut: allItineraryValSum
  };
}


function getTotalCost(itinerary_in, allData_in) {
  var totalCost = 0;
  var itineraryItemCost = 0;
  var len = itinerary_in.length;

  for (var i = 0; i < len; i++) {
    if (i == 0) {
      itineraryItemCost = allData_in.Event1Cost[itinerary_in[i]];
    }
    else if (i == 1) {
      itineraryItemCost = allData_in.BreakfastCost[itinerary_in[i]];
    }
    else if (i == 2) {
      itineraryItemCost = allData_in.Event2Cost[itinerary_in[i]];
    }
    else if (i == 3) {
      itineraryItemCost = allData_in.LunchCost[itinerary_in[i]];
    }
    else if (i == 4) {
      itineraryItemCost = allData_in.Event3Cost[itinerary_in[i]];
    }
    else if (i == 5) {
      itineraryItemCost = allData_in.DinnerCost[itinerary_in[i]];
    }
    else {
      itineraryItemCost = allData_in.Event4Cost[itinerary_in[i]];
    }
    //console.log(itineraryItemCost)
    totalCost = totalCost + itineraryItemCost;
  }

  //console.log("totalCost: " + totalCost);
  return totalCost;
}

function getTotalRating(itinerary_in, allData_in) {
  var totalRating = 0;
  var itineraryItemRating = 0;
  var len = itinerary_in.length;

  for (var i = 0; i < len; i++) {
    if (i == 0) {
      itineraryItemRating = allData_in.Event1Rating[itinerary_in[i]];
    }
    else if (i == 1) {
      itineraryItemRating = allData_in.BreakfastRating[itinerary_in[i]];
    }
    else if (i == 2) {
      itineraryItemRating = allData_in.Event2Rating[itinerary_in[i]];
    }
    else if (i == 3) {
      itineraryItemRating = allData_in.LunchRating[itinerary_in[i]];
    }
    else if (i == 4) {
      itineraryItemRating = allData_in.Event3Rating[itinerary_in[i]];
    }
    else if (i == 5) {
      itineraryItemRating = allData_in.DinnerRating[itinerary_in[i]];
    }
    else {
      itineraryItemRating = allData_in.Event4Rating[itinerary_in[i]];
    }
    totalRating = totalRating + itineraryItemRating;
  }
  //console.log("totalRating: " + totalRating);
  totalRating = Math.round(totalRating);
  return totalRating;
}

// Roulette selection function: higher probability to select the "more fit" itineraries
function rouletteSelect(allItineraryRatings_in, allItineraryRatingsSum_in) {
  var popLen = allItineraryRatings_in.length;
  var value = Math.random() * allItineraryRatingsSum_in;
  var iRet = randomIntFromInterval(0, popLen - 1);
  for (var i = 0; i < popLen; i++) {
    value = value - allItineraryRatings_in[i];
    if (value <= 0) {
      iRet = i;
      break;
    }
  }
  return iRet;
}

// Crossover two itinerary items so that they swap characteristics 
function crossover(itinerary1_in, itinerary2_in) {
  var irand = randomIntFromInterval(1, 4); //random number between 1 and 4 inclusive
  var itinerary1Org = itinerary1_in.slice(0);
  var itinerary2Org = itinerary2_in.slice(0);

  // Randomly select a set of items to swap 
  if (irand == 1) {
    // Swap early items
    itinerary1_in[0] = itinerary2_in[0];
    itinerary1_in[1] = itinerary2_in[1];
    itinerary2_in[0] = itinerary1Org[0];
    itinerary2_in[1] = itinerary1Org[1];
  }
  else if (irand == 2) {
    // Swap afternoon items
    itinerary1_in[2] = itinerary2_in[2];
    itinerary1_in[3] = itinerary2_in[3];
    itinerary2_in[2] = itinerary1Org[2];
    itinerary2_in[3] = itinerary1Org[3];
  }
  else if (irand == 3) {
    // Swap early night items
    itinerary1_in[4] = itinerary2_in[4];
    itinerary1_in[5] = itinerary2_in[5];
    itinerary2_in[4] = itinerary1Org[4];
    itinerary2_in[5] = itinerary1Org[5];
  }
  else {
    // Swap last item
    itinerary1_in[6] = itinerary2_in[6];
    itinerary2_in[6] = itinerary1Org[6];
  }

  // Collect result for output
  var itineraryOut = new Array(2);
  itineraryOut[0] = [itinerary1_in[0], itinerary1_in[1], itinerary1_in[2], itinerary1_in[3],
  itinerary1_in[4], itinerary1_in[5], itinerary1_in[6]];
  itineraryOut[1] = [itinerary2_in[0], itinerary2_in[1], itinerary2_in[2], itinerary2_in[3],
  itinerary2_in[4], itinerary2_in[5], itinerary2_in[6]];

  return itineraryOut;
}


function mutate(itinerary_in, numItemsArray_in) {
  var irand = randomIntFromInterval(0, 10); // If 0-6 chosen, individual items will be mutated
                                            // If 7-10 chosen, pairs of items will be mutated
  var iItemMutate = 0;
  var mutatedItinerary = itinerary_in.slice(0);
  // Mutate individual items
  if (irand <= 6) {
    iItemMutate = pickRandomItineraryItemExcluding(numItemsArray_in[irand], itinerary_in[irand]);
    mutatedItinerary[irand] = iItemMutate;
  }
  // Mutate pairs of items 
  else {
    var istart;
    var iend;
    if (irand == 7) {
      // Mutate morning items
      istart = 0;
    }
    else if (irand == 8) {
      // Mutate afternoon items
      istart = 2;
    }
    else if (irand == 9) {
      // Mutate early night items
      istart = 4;
    }
    else {
      // Mutate event4 item
      istart = 6;
    }

    iend = istart + 2;
    if (irand == 10) 
    {
      iend = istart + 1;
    }
    
    for (var i = istart; i < iend; i++) 
    {
      iItemMutate = pickRandomItineraryItemExcluding(numItemsArray_in[i], itinerary_in[i]);
      mutatedItinerary[i] = iItemMutate;
    }    
  }

return mutatedItinerary;
}