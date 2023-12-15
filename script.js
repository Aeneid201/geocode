"use strict";

// DOM
let geocoder;
const magic = document.querySelector(".magic");
const addressesTextarea = document.querySelector(".addresses");
const myResultsTextarea = document.querySelector(".myResults");
const reset = document.querySelector(".geocoding .reset");
const latlongsTextarea = document.querySelector(".latlongs");
const myAddressesTextarea = document.querySelector(".myAddresses");
const switchButton = document.querySelector(".switch");
const geocodingSection = document.querySelector(".geocoding");
const reverseGeocodingSection = document.querySelector(".reverseGeocoding");
const reverse = document.querySelector(".reverse");
const resetCoord = document.querySelector(".reverseGeocoding .reset");

// toggle geocoding and reverse geocoding sections
switchButton.addEventListener("click", function (e) {
  e.preventDefault();

  if (geocodingSection.classList.contains("d-none")) {
    geocodingSection.classList.remove("d-none");
    reverseGeocodingSection.classList.add("d-none");
  } else {
    geocodingSection.classList.add("d-none");
    reverseGeocodingSection.classList.remove("d-none");
  }
});

function init() {
  geocoder = new google.maps.Geocoder();
}

reset.addEventListener("click", function (e) {
  e.preventDefault();
  addressesTextarea.value = "";
  myResultsTextarea.value = "";
});

resetCoord.addEventListener("click", function (e) {
  e.preventDefault();
  myAddressesTextarea.value = "";
  latlongsTextarea.value = "";
});

// geocode addresses
magic.addEventListener("click", function (e) {
  e.preventDefault();

  myResultsTextarea.value = "";

  let addresses = addressesTextarea.value;
  let arr = splitInput(addresses);

  arr.forEach((address) => {
    geocode({ address: address });
  });
});

// reverse geocode
reverse.addEventListener("click", function (e) {
  e.preventDefault();

  myAddressesTextarea.value = "";

  let coords = latlongsTextarea.value;
  let arr = splitInput(coords);

  arr.forEach((coord) => {
    geocodeLatLng(coord);
  });
});

function geocodeLatLng(input) {
  const latlngStr = input.split(",", 2);
  const latlng = {
    lat: parseFloat(latlngStr[0]),
    lng: parseFloat(latlngStr[1]),
  };

  geocoder
    .geocode({ location: latlng })
    .then((response) => {
      if (response.results[0]) {
        let formattedAddress = response.results[0].formatted_address;
        myAddressesTextarea.value += formattedAddress + "\n";
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}

function geocode(request) {
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;
      let location = results[0].geometry.location;
      const longitude = location.lng();
      const latitude = location.lat();
      let coords = `${latitude},${longitude}`;
      myResultsTextarea.value += coords + "\n";
      return results;
    })
    .catch((e) => {
      //alert("Geocode was not successful for the following reason: " + e);
      console.log("Geocode was not successful for the following reason: " + e);
      console.log(request);
    });
}

function splitInput(str) {
  let result = str.split(/\r?\n/);
  return result;
}

window.init = init;
