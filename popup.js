// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

function getPopupState() {
  return {
    replaceFString: replaceFindStringField.value,
    replaceRString: replaceReplaceStringField.value,
    
    stickerRadioSelected: stickerRadio.checked,
    stickerValue: stickerSelect.value,
    paintRadioSelected: spraypaintRadio.checked,
    paintColor: spraypaintColorSelect.value,

    font: fontSelect.value,

    backgroundColor: backgroundColorSelect.value

  }
}

function setPopupState(e) {
  console.log("event: ", e);
  var popupState = getPopupState();
  chrome.runtime.sendMessage({ popupState: popupState });
}

console.log("popup js running");


chrome.runtime.sendMessage("getPopupState", function (response) {
  console.log("message response:", response)
  replaceFindStringField.value = response.popupState.replaceFString
  replaceReplaceStringField.value = response.popupState.replaceRString
  
  stickerRadio.checked = response.popupState.stickerRadioSelected
  stickerSelect.value = response.popupState.stickerValue
  spraypaintRadio.checked = response.popupState.paintRadioSelected
  spraypaintColorSelect.value = response.popupState.paintColor

  fontSelect.value = response.popupState.font 

  backgroundColorSelect.value = response.popupState.backgroundColor
});

// Replace
var replaceFindStringField = document.querySelector("#replace-fstring");
var replaceReplaceStringField = document.querySelector("#replace-rstring");
var replaceApplyButton = document.querySelector("#replace-apply");
replaceApplyButton.addEventListener("input", setPopupState);

// Mouse edits
var spraypaintRadio = document.querySelector("#spraypaint-radio");
var spraypaintColorSelect = document.querySelector("#spraypaint-color-select");
spraypaintRadio.addEventListener("click", setPopupState);
spraypaintColorSelect.addEventListener("input", setPopupState);
console.log(spraypaintRadio)

var stickerRadio = document.querySelector("#sticker-radio");
var stickerSelect = document.querySelector("#sticker-select");
stickerRadio.addEventListener("click", setPopupState);
stickerSelect.addEventListener("input", setPopupState);

// Font change
var fontSelect = document.querySelector("#font-select");
fontSelect.addEventListener("input", setPopupState);

//Bachground change
var backgroundColorSelect = document.querySelector("#background-color-select")
backgroundColorSelect.addEventListener("input", setPopupState);

