import clock from "clock";
import document from "document";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { preferences } from "user-settings";
import { battery } from "power";
import * as util from "../common/utils";

// Update the clock every second
clock.granularity = "seconds";

let clockHours = document.getElementById("clockHours");
let clockMins = document.getElementById("clockMins");
let clockSec = document.getElementById("clockSec");
let date = document.getElementById("date");
let heartRate = document.getElementById("heartRate");
const batteryLabel = document.getElementById("batteryLabel");

const days = {0: 'SUN', 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI', 6: 'SAT'};

const months = {0: 'JAN', 1: 'FEB', 2: 'MAR', 3: 'APR', 4: 'MAY', 5: 'JUN', 6: 'JUL',
                7: 'AUG', 8: 'SEP', 9: 'OCT', 10: 'NOV', 11: 'DEC'};

var heartRateMonitor = new HeartRateSensor();

//Update the heartrate monitor
heartRateMonitor.onreading = function() {
  heartRate.text = heartRateMonitor.heartRate;
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = new Date();
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  let sec = util.zeroPad(today.getSeconds());
  clockHours.text = `${hours}:`;
  clockMins.text = `${mins}`;
  clockSec.text = `${sec}`;
}

//Update the <text> element when the date changes
function updateDate() {
  let today = new Date();
  date.text = `${days[today.getDay()]} ${months[today.getMonth()]} ${today.getDate()}`;
}

//Start heart sensor monitor
function updateHeartRateSensor() {
  heartRateMonitor.start();
}

//Stop heart sensor monitor
function stopHearRateSensor() {
  heartRateMonitor.stop();
}

display.addEventListener('change', function() {
  if (this.on) {
    updateDate();
    updateHeartRateSensor();
    
  } else {
    stopHearRateSensor();
  }
});

// Measure the battery level and assign it to batteryValue
let batteryValue = battery.chargeLevel; 

//Center battery level inside Battery.png
if (batteryValue === "100"){
  batteryLabel.text = `${batteryValue}%`;
}
else if(batteryValue <= "99" && batteryValue >= "10"){
  batteryLabel.text = `${"  "}${batteryValue}%`;
}
else{
  batteryLabel.text = `${"   "}${batteryValue}%`;
}

updateDate();
updateHeartRateSensor();
