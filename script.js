"use strict";
let map;
let marker;
let geocoder;
let responseDiv;
let response;

const api_key = config.API_KEY;
const body = document.querySelector("body");

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: -34.397, lng: 150.644 },
    mapTypeControl: false,
  });
  geocoder = new google.maps.Geocoder();

  const inputText = document.createElement("input");

  inputText.type = "text";
  inputText.placeholder = "Enter a location";

  const submitButton = document.createElement("input");

  submitButton.type = "button";
  submitButton.value = "Geocode";
  submitButton.classList.add("button", "button-primary");

  const clearButton = document.createElement("input");

  clearButton.type = "button";
  clearButton.value = "Clear";
  clearButton.classList.add("button", "button-secondary");
  response = document.createElement("pre");
  response.id = "response";
  response.innerText = "";
  responseDiv = document.createElement("div");
  responseDiv.id = "response-container";
  responseDiv.appendChild(response);

  const instructionsElement = document.createElement("p");

  instructionsElement.id = "instructions";
  instructionsElement.innerHTML =
    "<strong>Instructions</strong>: Enter an address in the textbox to geocode or click on the map to reverse geocode.";
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);
  marker = new google.maps.Marker({
    map,
  });
  map.addListener("click", (e) => {
    geocode({ location: e.latLng });
  });
  submitButton.addEventListener("click", () =>
    geocode({ address: inputText.value })
  );
  clearButton.addEventListener("click", () => {
    clear();
  });
  clear();
}

function clear() {
  marker.setMap(null);
  responseDiv.style.display = "none";
}

const magic = document.querySelector(".magic");
const addressesTextarea = document.querySelector(".addresses");
const myResultsTextarea = document.querySelector(".myResults");
const reset = document.querySelector(".reset");

reset.addEventListener("click", function (e) {
  e.preventDefault();

  addressesTextarea.value = "";
  myResultsTextarea.value = "";
});

magic.addEventListener("click", function (e) {
  e.preventDefault();

  let addresses = addressesTextarea.value;
  let arr = splitAddresses(addresses);

  arr.forEach((address) => {
    geocode({ address: address });
  });
});

function geocode(request) {
  clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      //   map.setCenter(results[0].geometry.location);
      //   marker.setPosition(results[0].geometry.location);
      //   marker.setMap(map);
      //   responseDiv.style.display = "block";
      //   response.innerText = JSON.stringify(result, null, 2);
      let location = results[0].geometry.location;
      const longitude = location.lng();
      const latitude = location.lat();
      let coords = `${latitude},${longitude}`;
      myResultsTextarea.value += "\n" + coords;
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}

function splitAddresses(str) {
  let result = str.split(/\r?\n/);
  return result;
}

window.initMap = initMap;
