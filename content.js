
function pageClicked(e) {
  if (document.hasFocus()) {
    chrome.runtime.sendMessage({ 
      request: "addEditToPage",
      data: {
        pageX: e.pageX,
        pageY: e.pageY
      }
    });
  }
}


console.log("content url: " + window.location.href);
    
window.addEventListener("mouseup", pageClicked);

var iFrame  = document.createElement ("iframe");
iFrame.style.position = "absolute"
iFrame.style.zIndex = "10000"
iFrame.src  = chrome.extension.getURL ("toolbar.html");

document.body.insertBefore(iFrame, document.body.firstChild);

function getPopupState() {
  return {
    replaceFString: replaceFindStringField.value,
    replaceRString: replaceReplaceStringField.value,

    stickerRadioSelected: stickerRadio.checked,
    stickerValue: stickerSelect.value,
    paintRadioSelected: spraypaintRadio.checked,
    paintColor: spraypaintColorSelect.value,
    fontFamily: fontSelect.value,

    font: fontSelect.value,
  }
}

function setPopupState(e) {
  console.log("event: ", e);
  var popupState = getPopupState();
  chrome.runtime.sendMessage({ popupState: popupState });
}

function fontSelected(e) {
  console.log("fontSelected: ", e.target.value);
  var popupState = getPopupState();
  chrome.runtime.sendMessage({ popupState: popupState, fontChanged: true });
}

console.log("popup js running");

chrome.runtime.sendMessage("popupOpened", function (response) {
  console.log("back to popup")
})

chrome.runtime.sendMessage("getPopupState", function (response) {
  console.log("message response:", response);
  replaceFindStringField.value = response.popupState.replaceFString;
  replaceReplaceStringField.value = response.popupState.replaceRString;

  stickerRadio.checked = response.popupState.stickerRadioSelected;
  stickerSelect.value = response.popupState.stickerValue;
  spraypaintRadio.checked = response.popupState.paintRadioSelected;
  spraypaintColorSelect.value = response.popupState.paintColor;

  fontSelect.value = response.popupState.fontFamily;
});

// Replace
var replaceFindStringField = document.querySelector("#replace-fstring");
var replaceReplaceStringField = document.querySelector("#replace-rstring");
var replaceApplyButton = document.querySelector("#replace-apply");
replaceApplyButton.addEventListener("input", setPopupState);

// Mouse edits
var spraypaintRadio = document.querySelector("#spraypaint-radio");
var spraypaintColorSelect = document.querySelector("#spraypaint-color-select");
spraypaintRadio.addEventListener("click", setPopupState);
spraypaintColorSelect.addEventListener("input", setPopupState);
console.log(spraypaintRadio);

var stickerRadio = document.querySelector("#sticker-radio");
var stickerSelect = document.querySelector("#sticker-select");
stickerRadio.addEventListener("click", setPopupState);
stickerSelect.addEventListener("input", setPopupState);

// Font change
var fontSelect = document.querySelector("#font-select");
fontSelect.addEventListener("input", fontSelected);
