import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { ConstInterval } from '@devexpress/utils/lib/intervals/const';
import { Comparers } from '@devexpress/utils/lib/utils/comparers';
import { LinkedInterval } from './position/linked-interval';
export class BookmarkBase extends ConstInterval {
    constructor(positionManager, interval) {
        super();
        this._interval = new LinkedInterval(positionManager, interval);
    }
    get start() { return this._interval.start; }
    get length() { return this._interval.length; }
    get end() { return this._interval.end; }
    get interval() { return this._interval.getFixedInterval(); }
    equals(obj) {
        return obj && this._interval.equals(obj._interval);
    }
    destructor(positionManager) {
        this._interval.destructor(positionManager);
    }
}
export class BookmarkNameValidator {
    static isValidName(name, allowHiddenBookmarks) {
        return name && name.length && !/\d/.test(name[0]) && (allowHiddenBookmarks || name[0] != "_") &&
            !BookmarkNameValidator.prohibitedSymbolsForName.test(name);
    }
}
BookmarkNameValidator.prohibitedSymbolsForName = /.*[\`\~\!\@\#\$\%\^\&\*\(\)\+\{\}\|\:\"\<\>\?\-\=\[\]\.\,\;\'\/\\ ].*/;
export class Bookmark extends BookmarkBase {
    constructor(positionManager, interval, name) {
        super(positionManager, interval);
        this.name = "";
        this.name = name;
    }
    static isValidName(name, allowHiddenBookmarks) {
        return BookmarkNameValidator.isValidName(name, allowHiddenBookmarks);
    }
    isHidden() {
        return this.name.length > 0 && this.name[0] == "_";
    }
    isToc() {
        return this.name.toUpperCase().indexOf("_TOC") == 0;
    }
    equals(obj) {
        return super.equals(obj) && this.name == obj.name;
    }
    get constBookmark() {
        return new ConstBookmark(this, this.name);
    }
    clone(subDocument) {
        return new Bookmark(subDocument.positionManager, this.interval, this.name);
    }
}
export class ConstBookmark extends ConstInterval {
    constructor(interval, name) {
        super();
        this.interval = new BoundaryInterval(interval.start, interval.end);
        this.name = name;
    }
    get start() { return this.interval.start; }
    get length() { return this.interval.length; }
    get end() { return this.interval.end; }
    equals(obj) {
        return obj && this.name == obj.name && this.interval.equals(obj.interval);
    }
    createBookmark(positionManager) {
        return new Bookmark(positionManager, this.interval, this.name);
    }
    static comparer(a, b) {
        const diff = a.start - b.start;
        return diff == 0 ? Comparers.string(a.name, b.name) : diff;
    }
}
export class BookmarkAndSubDocument {
    constructor(bookmark, subDocument) {
        this.bookmark = bookmark;
        this.subDocument = subDocument;
    }
}
