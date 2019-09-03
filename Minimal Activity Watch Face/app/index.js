//General imports
import document from "document";
import {preferences} from "user-settings";
import * as util from "../common/utils";
//Clock import
import clock from "clock";
//Activity imports
import {me as appbit} from "appbit";
import {today} from "user-activity";
//Battery import
import { battery } from "power";
//Heart rate imports
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";


// Get a handle on the <text> elements
const clockHour = document.getElementById("clockHour");
const clockMin = document.getElementById("clockMin");
const clockSec = document.getElementById("clockSec");
const date = document.getElementById("date");
const days = {0: 'SUN', 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI', 6: 'SAT'};
const months = {0: 'JAN', 1: 'FEB', 2: 'MAR', 3: 'APR', 4: 'MAY', 5: 'JUN', 6: 'JUL',
                7: 'AUG', 8: 'SEP', 9: 'OCT', 10: 'NOV', 11: 'DEC'};
const heartRate = document.getElementById("heartRate");
const steps = document.getElementById("steps");
const distance = document.getElementById("distance");
const elevation = document.getElementById("elevation");
const calories = document.getElementById("calories");
const activeMin = document.getElementById("activeMin");
const batteryLevel = document.getElementById("batteryLevel");

//Get a handle on the <image> elements from the index.gui file
var Heart = document.getElementById("Heart");
var Battery = document.getElementById("Battery");
var Steps = document.getElementById("Steps");
var Calories = document.getElementById("Calories");
var Distance = document.getElementById("Distance");
var Elevation = document.getElementById("Elevation");
var ActiveMinutes = document.getElementById("ActiveMinutes");

// Update the clock every second
clock.granularity = "seconds";

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
    hours = util.zeroPad(hours);
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  let sec = util.zeroPad(today.getSeconds());
  
  clockHour.text = `${hours}:`;
  clockMin.text = `${mins}`;
  clockSec.text = `${sec}`;
  
  //Function call to keep steps updated at all times
  updateSteps();
}

//Update date daily
function updateDate() {
  let today = new Date();
  date.text = `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`;
}

//Function call
updateDate();


//Update heart rate depending on if watch is on or off body
if (BodyPresenceSensor) {
  const body = new BodyPresenceSensor();
  const hrm = new HeartRateSensor({ frequency: 1 });
  body.addEventListener("reading", () => {
    //If the user is not wearing the watch display no heart rate
    if (!body.present) {
      hrm.stop();
      heartRate.text = "--";
    //If the user is wearing the watch display heart rate
    } else {
      if (HeartRateSensor) {
        hrm.addEventListener("reading", () => {
        heartRate.text = hrm.heartRate;
        });
        hrm.start();
      }
    }
  });
  body.start();
}

//Image display for heart rate
Heart.style.display = "inline";


//Initialize battery level and image to show
batteryLevel.text = `${battery.chargeLevel}%`;
Battery.style.display = "inline";

//Change battery level as battery charge level changes
battery.onchange = (charger, evt) => {
  batteryLevel.text = `${battery.chargeLevel}%`;
}


//If user grants permission each below activity information will be retrieved
function updateSteps(){
  if (appbit.permissions.granted("access_activity")) {
    steps.text = today.adjusted.steps;
  }
  else {
  steps.text = "No data";
  }
}

function updateDistance(){
  if (appbit.permissions.granted("access_activity")) {
    distance.text = today.adjusted.distance;
  }
  else {
  distance.text = "No data";
  }
}

function updateElevation(){
  if (appbit.permissions.granted("access_activity")) {
    elevation.text = today.adjusted.elevationGain;
  }
  else {
  elevation.text = "No data";
  }
}

function updateCalories(){
  if (appbit.permissions.granted("access_activity")) {
    calories.text = today.adjusted.calories;
  }
  else {
  calories.text = "No data";
  }
}

function updateActiveMinutes(){
  if (appbit.permissions.granted("access_activity")) {
    activeMin.text = today.adjusted.activeMinutes;
  }
  else {
  activeMin.text = "No data";
  }
}



//Initializes visibility of images and text
steps.style.visibility = "visible";
Steps.style.display = "inline";
distance.style.visibility = "hidden";
elevation.style.visibility = "hidden";
calories.style.visibility = "hidden";
activeMin.style.visibility = "hidden";

//Visibility of text and images for activities,
//dependent on screen click
let swap = document.getElementById("swap");

swap.onclick = function(e) {
  if(steps.style.visibility === "visible"){
    steps.style.visibility = "hidden";
    distance.style.visibility = "visible";
    Steps.style.display = "none";
    Distance.style.display = "inline";
    updateDistance();
  }
  else if(distance.style.visibility === "visible"){
    distance.style.visibility = "hidden";
    elevation.style.visibility = "visible";
    Distance.style.display = "none";
    Elevation.style.display = "inline";
    updateElevation();
  }
  else if(elevation.style.visibility === "visible"){
    elevation.style.visibility = "hidden";
    calories.style.visibility = "visible";
    Elevation.style.display = "none";
    Calories.style.display = "inline";
    updateCalories();
  }
  else if(calories.style.visibility === "visible"){
    calories.style.visibility = "hidden";
    activeMin.style.visibility = "visible";
    Calories.style.display = "none";
    ActiveMinutes.style.display = "inline";
    updateActiveMinutes();
  }
  else{
    steps.style.visibility = "visible";
    activeMin.style.visibility = "hidden";
    ActiveMinutes.style.display = "none";
    Steps.style.display = "inline";
  }
}