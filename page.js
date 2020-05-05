// page.js
//
// Classes to store edits to a page and a list of pages that have been edited.

import {BackgroundEdit, StickerEdit} from './edit.js';

export class PageList {
    /* Stores all of the pages that have been edited by the user as well as
    information about the user like the browser used.
    */
    constructor(chromePagesStorage) {
        this.pages = [];
        if (chromePagesStorage) {
            for (let i  = 0; i < chromePagesStorage.pages.length; i++) {
                var page = chromePagesStorage.pages[i];
                page = new PageEdits(page.url, page.edits);
                this.pages.push(page);
            }
        }
    }

    addPage(page) {
        this.pages.push(page);
    }
    
    findPageByURL(url) {
        /* Finds a page by it's URL and returns it. Returns null if the page doesn't
        exist.
        */
        for (let i  = 0; i < this.pages.length; i++) {
            var page = this.pages[i];
            if (page.url == url) {
                return page;
            }
        }
        return null;
    }

    removePageByURL(url) {
        /*Finds a page by it's URL and removes it if it exists.
        */
        this.pages = this.pages.filter( function(value, index, arr) {
            return (url !== value.pageURL);
        });
    }
}

export class PageEdits {
    /* Edits to a single webpage.
    */
    constructor(pageURL, edits){
        this.edits = []
        this.url = pageURL;
        if (edits) {
            for (let j = 0; j < edits.length; j++) {
                var edit = edits[j];
                console.log(edit);
                if (edit.type == "background") {
                    edit = new BackgroundEdit(edit.contents);
                }
                this.edits.push(edit);
            }
        }
    }
}
