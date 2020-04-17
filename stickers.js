document.addEventListener("mousedown", (e) => {
    let xpos = e.pageX;
    let ypos = e.pageY;
    var node = document.createElement("DIV");
    node.setAttribute("id", "tactical_internetism_temp_sticker_id");
    node.setAttribute("style", `position:absolute;top:${ypos}px;left:${xpos}px;z-index:1000`);
    var textnode = document.createTextNode("❤️");
    node.appendChild(textnode);
    document.body.appendChild(node);
    //document.getElementById("tactical_internetism_temp_sticker_id").style.transform("translate(50px,50px)");
    console.log(xpos, ypos);
})