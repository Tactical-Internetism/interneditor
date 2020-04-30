// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

console.log("start extension");
import {BackgroundEdit} from './edit.js';

'use strict';

class PageEdits {
    /* Edits to a single webpage.
    */
    edits = [];

    constructor(pageURL, edits){
        this.pageURL = pageURL;
        if (typeof edits !== 'undefined') {
            this.edits = edits;
        }
    }

    function colorClicked(e) {
        contents = {
            color: e.target.id;
        };
        edit = BackgroundEdit(contents);
        edits.push(edit);
      //window.close();
    }
    
    function stickersCheckboxClicked(e) {
      if (e.target.checked) {
        chrome.tabs.executeScript(null,
          {file:"stickers.js"});
      } else {
        // THIS DOESN'T WORK
        chrome.tabs.executeScript(null,
          {code:"document.removeEventListener('click');"});
      }
    }
}
    
document.addEventListener('DOMContentLoaded', function () {
    pageURL = chrome.tabs.getCurrent(function(tab){return tab.url});
    // check if page already exists in database
    console.log(pageURL); 
    // else
    page = PageEdits(pageURL);
    var colorDivs = document.querySelectorAll('.color');
    for (var i = 0; i < colorDivs.length; i++) {
      colorDivs[i].addEventListener('click', page.colorClicked);
    }
  
    var stickersCheckbox = document.querySelector('input');
    stickersCheckbox.addEventListener('click', page.stickersCheckboxClicked);
});
