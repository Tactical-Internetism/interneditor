// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { BackgroundEdit, StickerEdit } from "./edit.js";
import { PageEdits, PageList } from "./page.js";

function saveEditToPage(edit, url) {
  chrome.storage.sync.get(["userPageList"], function (results) {
    var chromePagesStorage = results.userPageList;
    var userPageList = new PageList(chromePagesStorage);
    var page = userPageList.findPageByURL(url);
    page.edits.push(edit);
    userPageList.removePageByURL(url);
    userPageList.addPage(page);
    chrome.storage.sync.set({ userPageList: userPageList });
  });
}

function addSticker(pageX, pageY, sticker, tabId, url) {
  var contents = {
    xpos: pageX,
    ypos: pageY,
    stickerType: "text",
    sticker: sticker,
  };
  var edit = new StickerEdit(contents);
  edit.editPage(tabId);
  saveEditToPage(edit, url);
}

function loadStoredEditsToPage(url, tabId) {
  chrome.storage.sync.get(["userPageList"], function (results) {
    var chromePagesStorage = results.userPageList;
    var userPageList = new PageList(chromePagesStorage);
    var page = userPageList.findPageByURL(url);
    if (page) {
      console.log("page found, loading edits");
      page.applyEdits(tabId);
    }
  });
}

console.log("background js running");

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("sender:", sender);
  console.log("request:", request);
  
  if (!sender.tab) { // maybe some alternative logic
      // from popup
    if (request === "getPopupState") {
      chrome.storage.sync.get(["popupState"], (results) => {
        console.log(results);
        sendResponse({ popupState: results.popupState });
      });
    } else {
      // set state using request...
      if (request.popupState) {
        chrome.storage.sync.set({ popupState: request.popupState }, () => {
          console.log("set popupState to: ", request.popupState);
        });
      }
    }
  } else if (request.request == "addEditToPage") {
    chrome.storage.sync.get(["popupState"], (results) => {
      if (results.popupState.addSticker) {
        addSticker(
          request.data.pageX,
          request.data.pageY,
          results.popupState.stickerValue,
          sender.tab.id,
          sender.tab.url
        );
      } else if (results.popupState.addPaint) {
        addPaint(
          request.data.pageX,
          request.data.pageY,
          results.popupState.paintColor,
          sender.tab.id,
          sender.tab.url
        );
      }
    });
  }
  return true;
});

chrome.webNavigation.onDOMContentLoaded.addListener(function (details) {
  console.log("background url: " + details.url);
  loadStoredEditsToPage(details.url, details.tabId);
  chrome.tabs.executeScript(details.tabId, { file: "content.js" });
});
