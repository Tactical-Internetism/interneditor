// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import {PageEdits, PageList} from './page.js';
import {initPopupMenu} from './popup.js';

var pages  = new PageList();   // can pass JSON of existing pages here
function newPageOpened(url){
    /* Wrapper function used to store chrome tab url.
    Should be used in callback function to chrome.tabs.query()
    Necessary because query() is asynchronous.

    surely there is a better way to do this??
    */
    console.log("background url: " + url);
    // check if page already exists in database
    var page = pages.findPageByURL(url);
    if (page) {
        // implement changes
    }
    // if not
    // pass, wait for popup menu edits
}
    
document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({"active":true},function(tab){newPageOpened(tab[0].url);});
});

initPopupMenu(pages);
