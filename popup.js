// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

import {BackgroundEdit, StickerEdit} from './edit.js';
import {PageEdits, PageList} from './page.js';

function saveCurrPageToPages() {
    chrome.storage.sync.get(['currPage'], function (results) {
        var currPage = results.currPage;
        currPage = new PageEdits(currPage.url, currPage.edits);
        chrome.storage.sync.get(['userPageList'], function(results) {
            var chromePagesStorage = results.userPageList;
            var userPageList = new PageList(chromePagesStorage);
            userPageList.removePageByURL(currPage.url);
            userPageList.addPage(currPage);
            chrome.storage.sync.set({'userPageList': userPageList});
        });
    });
}

function addSticker(pageX, pageY) {
    var contents = {
        "xpos": pageX,
        "ypos": pageY,
        "stickerType": "text",
        "sticker": "❤️",
    }
    var edit = new StickerEdit(contents);
    edit.editPage();
    chrome.storage.sync.get(["currPage"], function (results) {
        var currPage = results.currPage;
        currPage = new PageEdits(currPage.url, currPage.edits);
        currPage.edits.push(edit);
        chrome.storage.sync.set({"currPage": currPage});
    });
    saveCurrPageToPages();
}
    
function colorClicked(e) {
    if (popupOptions["currPageEdit"])  {
        console.log("color clicked");
        var contents = {
            "color": e.target.id,
        };
        var edit = new BackgroundEdit(contents);
        edit.editPage();
        chrome.storage.sync.get(["currPage"], function (results) {
            var currPage = results.currPage;
            currPage = new PageEdits(currPage.url, currPage.edits);
            currPage.edits.push(edit);
            chrome.storage.sync.set({"currPage": currPage});
        });
        saveCurrPageToPages();
    }
  //window.close();
}

function stickersCheckboxClicked(e) {
    if (e.target.checked) {
        popupOptions["stickers"] = true;
    } else {
        popupOptions["stickers"] = false;
    }
}

function setIconActionEventListeners() {
    /* set event listeners for background color selection and sticker checkbox
    */
    var colorDivs = document.querySelectorAll('.color');
    for (var i = 0; i < colorDivs.length; i++) {
      colorDivs[i].addEventListener('click', colorClicked);
    }
    var stickersCheckbox = document.querySelector('#stickers');
    stickersCheckbox.addEventListener('click', stickersCheckboxClicked);
}

function beginListeningForWindowClicks() {
    /* sets up a runtime connection to recieve messages from the content
    script running on the current page. This allows the popup menu to recieve
    info about how the user is interacting with the page (i.e. recording clicks)
    for the purpose of determining  edits.
    */
    chrome.tabs.executeScript(null,{file:"detect_window_mouse_events.js"});
    chrome.runtime.onConnect.addListener(function(port) {
        console.assert(port.name == "mouseclicks");
        console.log("connected to content script");
        port.onMessage.addListener(function(msg) {
            if (popupOptions.stickers) {
                addSticker(msg.pageX, msg.pageY);
            }
        });
    });
}

function beginEditingPage(url) {
    /* Sets up a page to begin editing. If the page exists in the databases, adds
    to the existing edits. If not, creates a new PageEdits object to track the 
    edits on the page.
    */
    console.log("popup url: " + url);
    chrome.storage.sync.get(['userPageList'], function(results) {
        var chromePagesStorage = results.userPageList;
        var userPageList = new PageList(chromePagesStorage);
        var page = userPageList.findPageByURL(url);
        if (! page) {
            page = new PageEdits(url);
            userPageList.addPage(page);
            chrome.storage.sync.set({'userPageList': userPageList});
        }
        chrome.storage.sync.set({'currPage': page});
    });
    setIconActionEventListeners();
    beginListeningForWindowClicks();
}

function editPageCheckboxClicked(e) {
    /* If the checkbox to edit the page is clicked, calls the function to begin editing
    the current page. Otherwise, sets the currPage to null to stop editing the page.
    */
    if (e.target.checked) {
        popupOptions['currPageEdit'] = true;
        chrome.tabs.query({"active":true},function(tab){beginEditingPage(tab[0].url);});
    } else {
        popupOptions['currPageEdit'] = false;
        chrome.storage.sync.set({'currPage': null});
    }
}

console.log("popup js running");

var popupOptions = {
    "currPageEdit": false,
    "stickers": false
};
var editPageCheckbox = document.querySelector('#edit-page');
editPageCheckbox.addEventListener('click', editPageCheckboxClicked);

