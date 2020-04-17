// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function colorClicked(e) {
  chrome.tabs.executeScript(null,
    {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
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

document.addEventListener('DOMContentLoaded', function () {
  var colorDivs = document.querySelectorAll('.color');
  for (var i = 0; i < colorDivs.length; i++) {
    colorDivs[i].addEventListener('click', colorClicked);
  }

  var stickersCheckbox = document.querySelector('input');
  stickersCheckbox.addEventListener('click', stickersCheckboxClicked);
});
