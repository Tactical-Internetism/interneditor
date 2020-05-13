var port = chrome.runtime.connect({"name":"mouseclicks"});

window.addEventListener("mouseup", e => {
        port.postMessage({"pageX": e.pageX, "pageY": e.pageY});
    });
