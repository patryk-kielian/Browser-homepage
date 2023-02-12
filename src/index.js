"use strict";

document.querySelector("#copyright-year").innerText = new Date().getFullYear();

const hourElement = document.querySelector("#hour");
const dateElement = document.querySelector("#date");

const interval = 1000; // ms
let expected = Date.now() + interval;
setTimeout(timeUpdate, interval);
function timeUpdate() {
  console.log("clock working");
  let drift = Date.now() - expected; // the drift (positive for overshooting)
  if (drift > interval) {
    // something really bad happened. Maybe the browser (tab) was inactive?
    // possibly special handling to avoid futile "catch up" run
  }

  let date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();

  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  hh = hh < 10 ? "0" + hh : hh;
  mm = mm < 10 ? "0" + mm : mm;
  ss = ss < 10 ? "0" + ss : ss;
  month += 1;
  month = month < 10 ? "0" + month : month;

  hourElement.innerHTML = `${hh}:${mm}<span id="seconds">:${ss}</span>`;
  dateElement.innerHTML = `${day}.${month}.${year}`;

  expected += interval;
  setTimeout(timeUpdate, Math.max(0, interval - drift)); // take into account drift
}
timeUpdate();
