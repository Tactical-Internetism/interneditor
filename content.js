function pageClicked(e) {
  if (document.hasFocus()) {
    chrome.runtime.sendMessage({
      request: "mouseClick",
      data: {
        pageX: e.pageX,
        pageY: e.pageY,
      },
    });
  }
}

console.log("content url: " + window.location.href);

//var port = chrome.runtime.connect({"name":"mouseclicks"});
window.addEventListener("mouseup", pageClicked);
//       port.postMessage({"pageX": e.pageX, "pageY": e.pageY});
