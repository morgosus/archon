import document from "document";
import clock from "clock";
import {FitFont} from "./fitfont";
import {zeroPad} from "./utils";
import { preferences } from "user-settings";
import { display } from "display";
import { memory } from "system";
import * as sensors from "./sensors";
import { locale } from "user-settings";
import { battery } from "power";

import { goals } from "user-activity";
import { primaryGoal } from "user-activity";
import { today } from "user-activity";
import { week } from "user-activity";
import { weekGoals } from "user-activity";
import * as messaging from "messaging";

const clockLabel = new FitFont({id:'time', font:'Monofonto_45'});
const consol = new FitFont({id:'console', font:'Monofonto_16'});
const flashlight = document.getElementById('flashlight');
const home = document.getElementById('home');

const b1 = document.getElementById("b1");
const b2 = document.getElementById("b2");
const b3 = document.getElementById("b3");
const b4 = document.getElementById("b4");
const b5 = document.getElementById("b5");

consol.text = "> Greetings ▮"

let i = 0;
let hour = 0;

clock.granularity = "seconds";


clock.ontick = (evt) => {
  let today = evt.date;
  hour = zeroPad(today.getHours());

  let hours;
  let mins;

  if(preferences.clockDisplay === "24h") {
    hours = zeroPad(today.getHours());
    mins = zeroPad(today.getMinutes());
    clockLabel.text = `${hours}:${mins}`;
  }


  //TODO: Don't do all of these every tick
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dateLabel = new FitFont({id:'date', font:'Monofonto_16'});

  let dayNumber = today.getDay();
  let dayOfWeek = daysOfWeek[dayNumber];
  let dayOfMonth = zeroPad(today.getDate());
  let month = zeroPad(today.getMonth()+1);
  let year = today.getFullYear();

  dateLabel.text = `${dayOfWeek} ${year}-${month}-${dayOfMonth}`;

  tick();
}

function tick() {
  let text = consol.text;

  if(i === 0) {
    consol.text =  text.replace("▮", "​"); //U+200b
    i = 1;
  } else {
    consol.text = text.replace("​", "▮");
    i = 0;
  }

  batteryShow();

  //console.log(`JS memory: ${memory.js.used} / ${memory.js.total}, peak: ${memory.js.peak}.`);
}

let taps = 0;
const bg = document.getElementById("bg");

bg.addEventListener("click", (evt) => {
  if(taps < 2)
    taps++;
  else
    taps = 0;

  console.log("Before tap: taps: " + taps + " br: " + display.brightnessOverride);

  switch(taps) {
    case 0:
      home.style.display = "inline";
      flashlight.style.display = "none";
      display.brightnessOverride = undefined;
      taps++;
      break;
    case 1:
      home.style.display = "none";
      flashlight.style.display = "inline";
      display.brightnessOverride = "max";
      taps++;
      break;
    case 2:
      display.brightnessOverride = undefined;
      taps = 0;
      break;
  }

  console.log("After tap: taps: " + taps + " br: " + display.brightnessOverride);
});

function batteryShow() {
  let charge = battery.chargeLevel;
  let mod = (charge % 20) * 0.65;
  let rmd = 13 - mod;

  if (mod == 0 && charge != 0) {
    mod = 13;
    rmd = 0;
  }

  //console.log('Charge: ' + charge + ' Modulo 20: ' + mod + ' Remainder: ' + rmd);

  if (charge <= 20) { /* Charge under 20 */
    b1.style.opacity = 1;
    b2.style.opacity = 0;
    b3.style.opacity = 0;
    b4.style.opacity = 0;
    b5.style.opacity = 0;

    b1.height = mod;

    b1.y = 1 + rmd;
  } else if (charge <= 40) {
    b1.style.opacity = 1;
    b2.style.opacity = 1;
    b3.style.opacity = 0;
    b4.style.opacity = 0;
    b5.style.opacity = 0;

    b1.height = 13;
    b2.height = mod;

    b1.y = 1;
    b2.y = 1 + rmd;
  } else if (charge <= 60) {
    b1.style.opacity = 1;
    b2.style.opacity = 1;
    b3.style.opacity = 1;
    b4.style.opacity = 0;
    b5.style.opacity = 0;

    b1.height = 13;
    b2.height = 13;
    b3.height = 1 + mod;

    b1.y = 1;
    b2.y = 1;
    b3.y = 1 + rmd;
  } else if (charge <= 80) {
    b1.style.opacity = 1;
    b2.style.opacity = 1;
    b3.style.opacity = 1;
    b4.style.opacity = 1;
    b5.style.opacity = 0;

    b1.height = 13;
    b2.height = 13;
    b3.height = 13;
    b4.height = 1 + mod;

    b1.y = 1;
    b2.y = 1;
    b3.y = 1;
    b4.y = 1 + rmd;
  } else { /* Charge between 80 and 100 */
    b1.style.opacity = 1;
    b2.style.opacity = 1;
    b3.style.opacity = 1;
    b4.style.opacity = 1;
    b5.style.opacity = 1;

    b1.height = 13;
    b2.height = 13;
    b3.height = 13;
    b4.height = 13;
    b5.height = 1 + mod;

    b1.y = 1;
    b2.y = 1;
    b3.y = 1;
    b4.y = 1;
    b5.y = 1 + rmd;
  }

  return;
}

const daily = document.getElementById('daily');
const weekly = document.getElementById('weekly');

function levelShow() {
  let dailyProgress;
  let weeklyProgress;

  if(primaryGoal == "activeZoneMinutes") {
    dailyProgress = today.adjusted["activeZoneMinutes"].total / goals["activeZoneMinutes"].total;
    //console.log("Daily goal: " + today.adjusted["activeZoneMinutes"].total + " / " + goals["activeZoneMinutes"].total);
  } else {
    dailyProgress = today.adjusted[primaryGoal] / goals[primaryGoal];
    //console.log("Daily goal: " + today.adjusted[primaryGoal] + " / " + goals[primaryGoal]);
  }
  weeklyProgress = week.adjusted.activeZoneMinutes / weekGoals.activeZoneMinutes;
  //console.log("Weekly goal: " + week.adjusted.activeZoneMinutes + " / " + weekGoals.activeZoneMinutes);

  if(dailyProgress > 1)
    dailyProgress = 1;
  if(weeklyProgress > 1)
    weeklyProgress = 1;

  daily.width = dailyProgress*244;
  weekly.width = weeklyProgress*244;
}
levelShow();


//
//console.log('RState ' + messaging.peerSocket.readyState);
//console.log('OPEN ' + messaging.peerSocket.OPEN);
//console.log('CLOSED ' + messaging.peerSocket.CLOSED);
//
//if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
//  messaging.peerSocket.send("Hello");
//}

const sync = new FitFont({id:'sync', font:'Monofonto_16', halign: 'middle'});
sync.text = 'Sync'
const connect = new FitFont({id:'connect', font:'Monofonto_16', halign: 'middle'});
connect.text = 'Unknown'
messaging.peerSocket.onmessage = evt => {
  //console.log('Message received: ' + JSON.stringify(evt));

  if (evt.data.key === 'snc') { //Last Sync
    let lastSync = evt.data.newValue;
    let splitSync = lastSync.split(" ");
    sync.text = splitSync[4];
  }
};

connect.text = messaging.ReadyState.OPEN;

messaging.peerSocket.onclose = evt => {
  //console.log('Message received: ' + JSON.stringify(evt));
  connect.text = messaging.ReadyState.OPEN;
};
messaging.peerSocket.onopen = evt => {
  //console.log('Message received: ' + JSON.stringify(evt));
  connect.text = messaging.ReadyState.OPEN;
};