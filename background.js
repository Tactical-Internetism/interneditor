// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


function findPageByURL(userPageList, url) {
    for (let i  = 0; i < userPageList.pages.length; i++) {
        var page = userPageList.pages[i];
        if (page.url == url) {
            return page;
        }
    }
    return null;
}

function newPageOpened(url){
    /* Wrapper function used to store chrome tab url.
    Should be used in callback function to chrome.tabs.query()
    Necessary because query() is asynchronous.

    surely there is a better way to do this??
    */
    console.log("background url: " + url);
    // check if page already exists in database
    chrome.storage.sync.get(['userPageList'], function(results) {
        var userPageList = results.userPageList;
        console.log(userPageList);
        var page = findPageByURL(userPageList, url);
        if (page) {
            console.log("page found, loading edits");
            // imple ment changes
        }
    });
}

console.log("background js running");

chrome.webNavigation.onDOMContentLoaded.addListener( function (details) {
    chrome.tabs.query({"active":true},function(tab){newPageOpened(tab[0].url);});
});

