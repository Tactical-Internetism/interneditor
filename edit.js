// edit.js
// author: Jacob
//
// Classes defining Edit objects which represent changes to a 
// webpage. Each edit contains a unit of change that is made to
// a webpage. Each type of Edit should have the same structure
// but can implement a different editPage function to actually 
// generate the edit contents.

class Edit {
    /* Base class defining the structure of an Edit object.
    All edits should contain the following properities:

        type: type of edit being made
        contents: content specific to the type of edit

    */
    constructor(contents){
        this.type = null;
        this.contents = contents;
    }

    editPage() {
    }

    stringify() {
        editObject = {
            type: this.type, 
            contents: this.contents,
            edit_func: this.editPage.toString(),
            };
        return JSON.stringify(editObject);
    }
}

export class BackgroundEdit extends Edit {
    /* contents of BackgroundEdit object:

        color: color the background should be changed to
    
    */
    constructor(contents){
        super(contents);
        this.type = "background";
    }

    editPage() {
        chrome.tabs.executeScript(null, {
            code:"document.body.style.backgroundColor='" + this.contents.color + "'"
            });
    }
}

export class StickerEdit extends Edit {
    /* contents of StickerEdit object:

        xpos:           x position of the sticker
        ypos:           y position of the sticker
        stickerType:    image or text
        sticker:        path to sticker file or sticker text
    
    */
    constructor(contents){
        super(contents);
        this.type = "sticker";
    }

    editPage() {
        var script = "var node = document.createElement(\"DIV\");node.setAttribute(\"id\", \"tactical_internetism_temp_sticker_id\");node.setAttribute(\"style\", `position:absolute;top:${" + this.contents.ypos + "}px;left:${" + this.contents.xpos + "}px;z-index:1000`);var textnode = document.createTextNode(\"" + this.contents.sticker + "\");node.appendChild(textnode);document.body.appendChild(node);"
        //document.getElementById("tactical_internetism_temp_sticker_id").style.transform("translate(50px,50px)");
        chrome.tabs.executeScript(null, {
            code:script
            });
    }
}

export class SprayPaintEdit extends Edit {
    constructor(contents){
        super(contents);
        this.type = "spray_paint";
    }

    editPage() {
        console.log("executing script...");
        chrome.tabs.executeScript(null, {
            file: "spray_paint.js"
        })
    }
}
