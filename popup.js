// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

function getPopupState() {
  return {
    isEditing: editPageCheckbox.checked,
    addSticker: stickerCheckbox.checked,
    stickerValue: stickerSelect.value,
    addPaint: sprayPaintCheckbox.checked,
    paintColor: sprayPaintColorSelect.value,
    fontFamily: fontSelect.value,
  };
}

function editPageCheckboxClicked(e) {
  /* If the checkbox to edit the page is clicked, calls the function to begin editing
    the current page. Otherwise, sets the currPage to null to stop editing the page.
    */
  console.log("editPageCheckboxClicked: ", e.target.checked);
  var popupState = getPopupState();
  chrome.runtime.sendMessage({ popupState: popupState });
}

function stickerCheckboxClicked(e) {
  console.log("stickerCheckboxClicked: ", e.target.checked);
  sprayPaintCheckbox.checked = false;
  var popupState = getPopupState();
  chrome.runtime.sendMessage({ popupState: popupState });
}

function stickerSelected(e) {
  console.log("stickerSelected: ", e.target.value);
  var popupState = getPopupState();
  chrome.runtime.sendMessage({ popupState: popupState });
}

function sprayPaintCheckboxClicked(e) {
  console.log("sprayPaintCheckboxClicked: ", e.target.checked);
  stickerCheckbox.checked = false;
  var popupState = getPopupState();
  chrome.runtime.sendMessage({ popupState: popupState });
}

function sprayPaintColorSelected(e) {
  console.log("paintColorSelected: ", e.target.value);
  var popupState = getPopupState();
  chrome.runtime.sendMessage({ popupState: popupState });
}

function fontSelected(e) {
  console.log("fontSelected: ", e.target.value);
  var popupState = getPopupState();
  chrome.runtime.sendMessage({ popupState: popupState, fontChanged: true });
}

console.log("popup js running");

// chrome.runtime.onConnect.addListener(function(port) {
//     console.assert(port.name == "popup");
//     console.log("connected to background script");
//     port.onMessage.addListener(function(msg) {
//         if (popupOptions.stickers) {
//             addSticker(msg.pageX, msg.pageY);
//         }
//     });
// });

chrome.runtime.sendMessage("getPopupState", function (response) {
  console.log("message response:", response);
  editPageCheckbox.checked = response.popupState.isEditing;
  stickerCheckbox.checked = response.popupState.addSticker;
  stickerSelect.value = response.popupState.stickerValue;
  sprayPaintCheckbox.checked = response.popupState.addPaint;
  sprayPaintColorSelect.value = response.popupState.paintColor;
});

var editPageCheckbox = document.querySelector("#edit-page-checkbox");
var stickerCheckbox = document.querySelector("#sticker-checkbox");
console.log(stickerCheckbox);
var stickerSelect = document.querySelector("#sticker-select");
var sprayPaintCheckbox = document.querySelector("#spray-paint-checkbox");
var sprayPaintColorSelect = document.querySelector("#spray-paint-color-select");
var fontSelect = document.querySelector("#font-select");
editPageCheckbox.addEventListener("click", editPageCheckboxClicked);
stickerCheckbox.addEventListener("click", stickerCheckboxClicked);
stickerSelect.addEventListener("input", stickerSelected);
sprayPaintCheckbox.addEventListener("click", sprayPaintCheckboxClicked);
sprayPaintColorSelect.addEventListener("input", sprayPaintColorSelected);
fontSelect.addEventListener("input", fontSelected);
