// page.js
//
// Classes to store edits to a page and a list of pages that have been edited.

export class PageList {
    /* Stores all of the pages that have been edited by the user as well as
    information about the user like the browser used.
    */
    constructor(pagesJSON) {
        if (pagesJSON) {
            this.pages = JSON.parse(pagesJSON);
        } else {
            this.pages = [];
        }
    }

    addPage(page) {
        this.pages.push(page);
    }
    
    findPageByURL(url) {
        /* Finds a page by it's URL and returns it. Returns null if the page doesn't
        exist.
        */
        for (page in this.pages) {
            if (page.url == url) {
                return page;
            }
        }
        return null;
    }

    removePageByURL(url) {
        /*Finds a page by it's URL and removes it if it exists.
        */
    }
}

export class PageEdits {
    /* Edits to a single webpage.
    */
    constructor(pageURL, edits){
        this.edits = []
        this.pageURL = pageURL;
        if (typeof edits !== 'undefined') {
            this.edits = edits;
        }
    }

}
