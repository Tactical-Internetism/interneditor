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
    fontFamily: fontSelect.value,

    font: fontSelect.value,
  };
}

function setPopupState(e, stateChange) {
  console.log("event: ", e);
  var popupState = getPopupState();
  chrome.runtime.sendMessage({
    popupState: popupState,
    stateChange: stateChange,
  });
}

console.log("popup js running");

chrome.runtime.sendMessage("getPopupState", function (response) {
  console.log("message response:", response);
  replaceFindStringField.value = response.popupState.replaceFString;
  replaceReplaceStringField.value = response.popupState.replaceRString;

  stickerRadio.checked = response.popupState.stickerRadioSelected;
  stickerSelect.value = response.popupState.stickerValue;
  spraypaintRadio.checked = response.popupState.paintRadioSelected;
  spraypaintColorSelect.value = response.popupState.paintColor;

  fontSelect.value = response.popupState.fontFamily;
});

// Replace
var replaceFindStringField = document.querySelector("#replace-fstring");
var replaceReplaceStringField = document.querySelector("#replace-rstring");
var replaceApplyButton = document.querySelector("#replace-apply");
replaceApplyButton.addEventListener("click", (e) => {
  console.log("asdf");
  setPopupState(e, "replace string");
});

// Mouse edits
var spraypaintRadio = document.querySelector("#spraypaint-radio");
var spraypaintColorSelect = document.querySelector("#spraypaint-color-select");
spraypaintRadio.addEventListener("click", setPopupState);
spraypaintColorSelect.addEventListener("input", setPopupState);
console.log(spraypaintRadio);

var stickerRadio = document.querySelector("#sticker-radio");
var stickerSelect = document.querySelector("#sticker-select");
stickerRadio.addEventListener("click", setPopupState);
stickerSelect.addEventListener("input", setPopupState);

// Font change
var fontSelect = document.querySelector("#font-select");
fontSelect.addEventListener("input", (e) => {
  setPopupState(e, "font");
});
