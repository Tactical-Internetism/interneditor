// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import {
  BackgroundEdit,
  FontEdit,
  StickerEdit,
  TextReplaceEdit,
} from "./edit.js";
import { PageEdits, PageList } from "./page.js";

function saveEditToPage(edit, url) {
  chrome.storage.sync.get(["userPageList"], function (results) {
    var chromePagesStorage = results.userPageList;
    var userPageList = new PageList(chromePagesStorage);
    var page = userPageList.findPageByURL(url);
    if (!page) {
      page = new PageEdits(url);
    } else {
      userPageList.removePageByURL(url);
    }
    page.edits.push(edit);
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

function changeFont(fontFamily, tabId, url) {
  var contents = {
    fontFamily: fontFamily,
  };
  var edit = new FontEdit(contents);
  edit.editPage(tabId);
  saveEditToPage(edit, url);
}

function textReplace(replaceFString, replaceRString, tabId, url) {
  var contents = {
    replaceFString: replaceFString,
    replaceRString: replaceRString,
  };
  console.log("textReplace contents:", contents);
  var edit = new TextReplaceEdit(contents);
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

  if (!sender.tab) {
    // maybe some alternative logic
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

      if (request.stateChange === "font") {
        getCurrentTab((tab) => {
          changeFont(request.popupState.fontFamily, tab.id, tab.url);
        });
      } else if (request.stateChange === "replace string") {
        getCurrentTab((tab) => {
          textReplace(
            request.popupState.replaceFString,
            request.popupState.replaceRString,
            tab.id,
            tab.url
          );
        });
      }
    }
  } else if (request.request == "mouseClick") {
    chrome.storage.sync.get(["popupState"], (results) => {
      console.log("results: " + results);
      if (results.popupState.stickerRadioSelected) {
        addSticker(
          request.data.pageX,
          request.data.pageY,
          results.popupState.stickerValue,
          sender.tab.id,
          sender.tab.url
        );
      } else if (results.popupState.paintRadioSelected) {
        /*
        addPaint(
          request.data.pageX,
          request.data.pageY,
          results.popupState.paintColor,
          sender.tab.id,
          sender.tab.url
        );
        */
      }
    });
  }
  return true;
});

chrome.webNavigation.onDOMContentLoaded.addListener(function (details) {
  loadStoredEditsToPage(details.url, details.tabId);
  chrome.tabs.executeScript(details.tabId, { file: "content.js" });
});

function getCurrentTab(tabCallback) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabArray) {
    tabCallback(tabArray[0]);
  });
}
