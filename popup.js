// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import {BackgroundEdit, StickerEdit} from './edit.js';
import {PageEdits, PageList} from './page.js';

'use strict';

function editPageCheckboxClicked(e) {
    if (e.target.checked) {
        chrome.tabs.query({"active":true},function(tab){beginEditingPage(tab[0].url);});
    } else {
        currPage = null;
    }
}

function addSticker(pageX, pageY) {
    var contents = {
        "xpos": pageX,
        "ypos": pageY,
        "stickerType": "text",
        "sticker": "❤️",
    }
    var edit = new StickerEdit(contents);
    currPage.edits.push(edit);
    console.log(currPage);
}
    
function colorClicked(e) {
    if (currPage)  {
        var contents = {
            "color": e.target.id,
        };
        var edit = new BackgroundEdit(contents);
        currPage.edits.push(edit);
        console.log(currPage);
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

function beginEditingPage(url){
    /* Wrapper function used to store chrome tab url.
    Should be used in callback function to chrome.tabs.query()
    Necessary because query() is asynchronous.

    surely there is a better way to do this??
    */
    console.log("popup url: " + url);
    var page = pages.findPageByURL(url);
    // if page doesn't exist in database, make a new one
    if (! page) {
        page = new PageEdits(url);
        pages.addPage(page);
    }
    console.log(page);
    currPage = page;
    // set event listeners for icon actions
    var colorDivs = document.querySelectorAll('.color');
    for (var i = 0; i < colorDivs.length; i++) {
      colorDivs[i].addEventListener('click', colorClicked);
    }
    var stickersCheckbox = document.querySelector('#stickers');
    stickersCheckbox.addEventListener('click', stickersCheckboxClicked);
    // begin listening for window clicks
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

var pages;
var currPage;
var popupOptions = {"stickers": false};

export function initPopupMenu(backgroundPages) {
    pages = backgroundPages;
    var editPageCheckbox = document.querySelector('#edit-page');
    editPageCheckbox.addEventListener('click', editPageCheckboxClicked);
}
