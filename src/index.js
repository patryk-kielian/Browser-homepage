"use strict";

import { API_NINJAS, API_NEWS } from "./config";

document.querySelector("#copyright-year").innerText = new Date().getFullYear();

// DOM elements

const hourElement = document.querySelector("#hour");
const dateElement = document.querySelector("#date");
const allScrollables = document.querySelectorAll(".scrollable");

const textAreaFacts = document.querySelector("#random-fact");
const textAreaQuotes = document.querySelector("#quote-of-the-day");
const textAreaOnThisDay = document.querySelector("#on-this-day-in");
const blogArea = document.querySelector(".blog-area");

const gearIcon = document.querySelector("#gear span");
const settingsContainer = document.querySelector("#settings");
const settingsBackgrounds = document.querySelector("#settings-backgrounds");
const ytPlayer = document.querySelector(".ytplayer");
const settingBrightness = document.querySelector("#settings-brightness");

// variables

const backgrounds = [
  {
    name: "ol Donyo Lodge Wildlife Live Stream",
    url: "https://www.youtube.com/embed/-HxJYZI9AMk?controls=0&autoplay=1&mute=1",
  },
  {
    name: "Tokyo Walk 24/7",
    url: "https://www.youtube.com/embed/cH7VBI4QQzA?controls=0&autoplay=1&mute=1",
  },
  {
    name: "Earth Views: Earth From Space Seen From The ISS",
    url: "https://www.youtube.com/embed/Y1qQZbTF8iQ?controls=0&autoplay=1&mute=1",
  },
  {
    name: "Cab ride from some of the most scenic railways in the world",
    url: "https://www.youtube.com/embed/lx5vVGxusnc?controls=0&autoplay=1&mute=1",
  },
  {
    name: "Benidorm webcam - Live Stream from Levante Beach Spain",
    url: "https://www.youtube.com/embed/xEwg0l5oDDY?controls=0&autoplay=1&mute=1",
  },
  {
    name: "El Gaucho | Sukhumvit Road | Bangkok | Thailand",
    url: "https://www.youtube.com/embed/zzJjopSjIMc?controls=0&autoplay=1&mute=1",
  },
];

// scroll behaviour
allScrollables.forEach((container) => {
  container.addEventListener("wheel", (event) => {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    container.scrollTop += delta * 40;
  });
});

// clock

const interval = 1000; // ms
let expected = Date.now() + interval;
setTimeout(timeUpdate, interval);
function timeUpdate() {
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

// background settings

gearIcon.addEventListener("click", () => {
  settingsContainer.classList.toggle("hidden");
  gearIcon.classList.toggle("dark");
});

document.addEventListener("click", (event) => {
  if (!settingsContainer.contains(event.target) && event.target !== gearIcon) {
    settingsContainer.classList.add("hidden");
    gearIcon.classList.remove("dark");
  }
});

for (let i = 0; i < backgrounds.length; i++) {
  if (i > 0) {
    settingsBackgrounds.insertAdjacentHTML(
      "beforeend",
      `<input type="radio" id="bg-${i}" name="setting" value="${i}">
    <label for="bg-${i}">${backgrounds[i].name}</label><br>`
    );
  }
  const input = document.querySelector(`#bg-${i}`);
  input.addEventListener("click", function (event) {
    ytPlayer.src = backgrounds[i].url;
  });
}

// light&dark toggle

let toggle = true;

const switchColors = function () {
  let colors = [
    {
      black: "#fff",
      white: "#000",
      white50: "#00000080",
      black50: "#ffffff80",
    },
    {
      black: "#000",
      white: "#fff",
      white50: "#ffffff80",
      black50: "#00000080",
    },
  ];
  let c = colors[Number(toggle)];
  document.documentElement.style.setProperty("--black", c.black);
  document.documentElement.style.setProperty("--white", c.white);
  document.documentElement.style.setProperty("--white50", c.white50);
  document.documentElement.style.setProperty("--black50", c.black50);
  toggle = !toggle;
};

settingBrightness.addEventListener("click", switchColors);

// APIs

// facts API

async function getFacts() {
  const limit = 10;
  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/facts?limit=${limit}`,
      {
        headers: { "X-Api-Key": API_NINJAS },
      }
    );
    const data = await response.json();
    for (let i = 0; i < limit; i++) {
      textAreaFacts.insertAdjacentHTML("beforeend", `<li>${data[i].fact}</li>`);
    }
  } catch (error) {
    console.error(error);
  }
}
getFacts();

// quotes API

async function getQuotes() {
  const limit = 6;
  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/quotes?limit=${limit}`,
      {
        headers: { "X-Api-Key": API_NINJAS },
      }
    );
    const data = await response.json();
    data.forEach((element) =>
      textAreaQuotes.insertAdjacentHTML(
        "beforeend",
        `<li>${element.quote}<span class="author">${element.author}</span></li>`
      )
    );
  } catch (error) {
    console.error(error);
  }
}
getQuotes();

// on this day API

async function getOnThisDay() {
  try {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = `https://today.zenquotes.io/api`;

    const response = await fetch(proxyUrl + targetUrl);
    const data = await response.json();

    console.log(data);

    const eventIndices = new Set();
    while (eventIndices.size < 10) {
      eventIndices.add(Math.floor(Math.random() * data.data.Events.length));
    }

    console.log([eventIndices]);

    eventIndices.forEach((index) =>
      textAreaOnThisDay.insertAdjacentHTML(
        "afterbegin",
        `<li>${data.data.Events[index].text}</li>`
      )
    );
  } catch (error) {
    console.error(error);
  }
}

getOnThisDay();

// news API

async function getNews(
  method,
  count,
  paramCountry = "",
  paramCategory = "",
  paramSources = "",
  paramDomains = ""
) {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/${method}?` +
        new URLSearchParams({
          apiKey: API_NEWS,
          country: paramCountry,
          category: paramCategory,
          sources: paramSources,
          domains: paramDomains,
        })
    );
    const data = await response.json();
    console.log(data);
    articles = data.articles;
    for (let i = 0; i < count; i++) {
      blogArea.insertAdjacentHTML(
        "beforeend",
        `<a class="post" href="${articles[i].url}">
          <img
            class="post-img"
            src="${articles[i].urlToImage}"      alt="Thumbnail for article: ${
          articles[i].title
        }"
          />
          <div class="post-text-container">
            <p class="post-title">
            ${articles[i].title.substring(0, 90)}
            </p>
            <p class="post-website">${articles[i].source.name}</p>
          </div>
        </a>`
      );
    }
  } catch (error) {
    console.error(error);
  }
}

getNews("everything", 8, "", "", "", "medium.com")
  .then(() => getNews("top-headlines", 10, "us", "", "", ""))
  .then(() => getNews("top-headlines", 10, "pl", "", "", ""));
