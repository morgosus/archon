import document from "document";
import clock from "clock";
import {FitFont} from "./fitfont";
import {zeroPad} from "./utils";
import { preferences } from "user-settings";
import { display } from "display";

const clockLabel = new FitFont({id:'time', font:'Monofonto_45'});
const consol = new FitFont({id:'console', font:'Monofonto_16'});
const flashlight = document.getElementById('flashlight');
const home = document.getElementById('home');

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
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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