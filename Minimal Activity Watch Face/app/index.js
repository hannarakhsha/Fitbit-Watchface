//General imports
import document from "document";
import {preferences} from "user-settings";
import * as util from "../common/utils";
//Display import
import {display} from "display";
//Clock import
import clock from "clock";
//Activity imports
import {me as appbit} from "appbit";
import {today} from "user-activity";
//Battery import
import {battery} from "power";
//Heart rate imports
import {HeartRateSensor} from "heart-rate";
import {BodyPresenceSensor} from "body-presence";


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
let swapRight = document.getElementById("swapRight");
let swapLeft = document.getElementById("swapLeft");

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
function updateClock(){
  clock.ontick = (evt) => {
    let today = evt.date;
    let hours = today.getHours();
    if (preferences.clockDisplay === "12h"){
      // 12h format
      hours = hours % 12 || 12;
      hours = util.zeroPad(hours);
    }
    else{
      // 24h format
      hours = util.zeroPad(hours);
    }
    let mins = util.zeroPad(today.getMinutes());
    let sec = util.zeroPad(today.getSeconds());

    clockHour.text = `${hours}:`;
    clockMin.text = `${mins}`;
    clockSec.text = `${sec}`;

    date.text = `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`;
  }
}

//Update heart rate depending on if watch is on or off body
if (BodyPresenceSensor){
  const body = new BodyPresenceSensor();
  const hrm = new HeartRateSensor({ frequency: 1 });
  body.addEventListener("reading", () => {
    //If the user is not wearing the watch display no heart rate
    if (!body.present){
      hrm.stop();
      heartRate.text = "--";
      //If the user is wearing the watch display heart rate
    }
    else{
      if (HeartRateSensor){
        hrm.addEventListener("reading", () => {
          heartRate.text = hrm.heartRate;
          });
        hrm.start();
      }
    }
    });
  body.start();
}


//Initialize battery level and create function to update battery
//as the battery level changes
batteryLevel.text = `${battery.chargeLevel}%`;

function updateBattery(){
  battery.onchange = (charger, evt) => {
    batteryLevel.text = `${battery.chargeLevel}%`;
  }
}


//If user grants permission activity information will be retrieved
function updateActivities(){
  if (appbit.permissions.granted("access_activity")){
    steps.text = today.adjusted.steps;
    distance.text = today.adjusted.distance;
    elevation.text = today.adjusted.elevationGain;
    calories.text = today.adjusted.calories;
    activeMin.text = today.adjusted.activeMinutes;
  }
  else{
    steps.text = "No data";
    distance.text = "No data";
    elevation.text = "No data";
    calories.text = "No data";
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

//Visibility of text and images for activities, dependent on screen click
//Click through back and forth between activities
swapRight.onclick = function(e){
  if(steps.style.visibility === "visible"){
    steps.style.visibility = "hidden";
    Steps.style.display = "none";
    distance.style.visibility = "visible";
    Distance.style.display = "inline";
  }
  else if(distance.style.visibility === "visible"){
    distance.style.visibility = "hidden";
    Distance.style.display = "none";
    elevation.style.visibility = "visible";
    Elevation.style.display = "inline";
  }
  else if(elevation.style.visibility === "visible"){
    elevation.style.visibility = "hidden";
    Elevation.style.display = "none";
    calories.style.visibility = "visible";
    Calories.style.display = "inline";
  }
  else if(calories.style.visibility === "visible"){
    calories.style.visibility = "hidden";
    Calories.style.display = "none";
    activeMin.style.visibility = "visible";
    ActiveMinutes.style.display = "inline";
  }
  else{
    activeMin.style.visibility = "hidden";
    ActiveMinutes.style.display = "none";
    steps.style.visibility = "visible";
    Steps.style.display = "inline";
  }
}

swapLeft.onclick = function(e){
  if(steps.style.visibility === "visible"){
    steps.style.visibility = "hidden";
    Steps.style.display = "none";
    activeMin.style.visibility = "visible";
    ActiveMinutes.style.display = "inline";
  }
  else if(activeMin.style.visibility === "visible"){
    activeMin.style.visibility = "hidden";
    ActiveMinutes.style.display = "none";
    calories.style.visibility = "visible";
    Calories.style.display = "inline";
  }
  else if(calories.style.visibility === "visible"){
    calories.style.visibility = "hidden";
    Calories.style.display = "none";
    elevation.style.visibility = "visible";
    Elevation.style.display = "inline";
  }
  else if(elevation.style.visibility === "visible"){
    elevation.style.visibility = "hidden";
    Elevation.style.display = "none";
    distance.style.visibility = "visible";
    Distance.style.display = "inline";
  }
  else{
    distance.style.visibility = "hidden";
    Distance.style.display = "none";
    steps.style.visibility = "visible";
    Steps.style.display = "inline";
  }
}


//Update and display activity only if display is on or switched on
if(display.on){
  updateClock();
  updateActivities();
  updateBattery();
  display.onchange = (evt) => {
    updateClock();
    updateActivities();
    updateBattery();
  }
}
else{
  display.onchange = (evt) => {
  updateClock();
  updateActivities();
  updateBattery();
  }
}
