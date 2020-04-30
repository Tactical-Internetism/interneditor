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
    type = null;

    constructor(contents){
        this.contents = contents;
        this.editPage();
    }

    function editPage() {
        pass;
    }

    function stringify() {
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
    type = "background";

    function editPage() {
        chrome.tabs.executeScript(null, {
            code:"document.body.sty;e.backgroundColor='" + this.contents.color + "'"
            });
    }
}
