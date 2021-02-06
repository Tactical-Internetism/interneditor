// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

import { BackgroundEdit, StickerEdit, SprayPaintEdit } from "./edit.js";
import { PageEdits, PageList } from "./page.js";


function fontSelected(e) {
  console.log("css on click activated");
  chrome.tabs.executeScript(null,
    {code:"document.body.style." + e.target.className + "='" + e.target.id + "'"});
    window.close();
 // node.nodeType ... type 3 is a text node
}

function beginEditingPage(url) {
  /* Sets up a page to begin editing. If the page exists in the databases, adds
    to the existing edits. If not, creates a new PageEdits object to track the
    edits on the page.
    */
  console.log("popup url: " + url);
  chrome.storage.sync.get(["userPageList"], function (results) {
    var chromePagesStorage = results.userPageList;
    var userPageList = new PageList(chromePagesStorage);
    var page = userPageList.findPageByURL(url);
    if (!page) {
      page = new PageEdits(url);
      userPageList.addPage(page);
      chrome.storage.sync.set({ userPageList: userPageList });
    }
    chrome.storage.sync.set({ currPage: page });
  });
  setIconActionEventListeners();
  beginListeningForWindowClicks();
}

function getPopupState() {
  return {
    isEditing: editPageCheckbox.checked,
    addSticker: stickerCheckbox.checked,
    stickerValue: stickerSelect.value,
    addPaint: sprayPaintCheckbox.checked,
    paintColor: sprayPaintColorSelect.value,
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

console.log("popup js running");

var popupOptions = {
  currPageEdit: false,
  stickers: false,
};

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
var fontSelect = document.querySelector("#dropdown-fonts");
editPageCheckbox.addEventListener("click", editPageCheckboxClicked);
stickerCheckbox.addEventListener("click", stickerCheckboxClicked);
stickerSelect.addEventListener("input", stickerSelected);
sprayPaintCheckbox.addEventListener("click", sprayPaintCheckboxClicked);
sprayPaintColorSelect.addEventListener("input", sprayPaintColorSelected);
fontSelect.addEventListener("click", fontSelected);
