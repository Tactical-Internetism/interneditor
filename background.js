// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { BackgroundEdit, StickerEdit } from "./edit.js";
import { PageEdits, PageList } from "./page.js";

function newPageOpened(url) {
  /* Wrapper function used to store chrome tab url.
    Should be used in callback function to chrome.tabs.query()
    Necessary because query() is asynchronous.

    surely there is a better way to do this??
    */
  console.log("background url: " + url);
  // check if page already exists in database
  chrome.storage.sync.get(["userPageList"], function (results) {
    var chromePagesStorage = results.userPageList;
    var userPageList = new PageList(chromePagesStorage);
    var page = userPageList.findPageByURL(url);
    if (page) {
      console.log("page found, loading edits");
      page.applyEdits();
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
            chrome.storage.sync.get({isEditing: false}, (results) => {
                console.log(results);
                sendResponse({ isEditing: results.isEditing });
            })
        } else {
            // set state using request...
            if (request.isEditing !== null) {
                chrome.storage.sync.set({isEditing: request.isEditing}, () => {
                    console.log("set isEditing to: ", request.isEditing);
                });
            }
        }
    }
    return true;
});

chrome.webNavigation.onDOMContentLoaded.addListener(function (details) {
  newPageOpened(details.url);
});
