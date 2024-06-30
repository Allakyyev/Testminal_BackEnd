import { Errors } from '@devexpress/utils/lib/errors';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
export class HashBasedCacheCore {
    constructor() {
        this.clear();
    }
    get count() { return this.numElements; }
    ;
    clear() {
        this.hashtable = {};
        this.numElements = 0;
    }
    getItem(item) {
        const existingElement = this.addItemInternal(this.hashtable, item);
        if (existingElement !== null)
            return existingElement;
        this.processNewItem(item);
        this.numElements++;
        return item;
    }
    forEach(callback) {
        NumberMapUtils.forEach(this.hashtable, (items) => ListUtils.forEach(items, callback));
    }
    findItemByPredicate(predicate) {
        return NumberMapUtils.anyOf(this.hashtable, (items) => ListUtils.elementBy(items, (item) => predicate(item)));
    }
    processNewItem(_item) { }
    isExist(item) {
        const hash = item.getHashCode();
        let listOfElements = this.hashtable[hash];
        if (listOfElements) {
            for (let i = 0, elem; elem = listOfElements[i]; i++) {
                if (elem === item || elem.equals(item))
                    return true;
            }
        }
        return false;
    }
    DEBUG_MAX_CELL_LENGTH() {
        return NumberMapUtils.max(this.hashtable, a => a.length).length;
    }
    removeItems(shouldRemove) {
        const newHashtable = {};
        let numElements = 0;
        NumberMapUtils.forEach(this.hashtable, (items) => items.forEach(item => {
            if (!shouldRemove(item)) {
                this.addItemInternal(newHashtable, item);
                numElements++;
            }
        }));
        this.hashtable = newHashtable;
        this.numElements = numElements;
    }
    addItemInternal(hashtable, item) {
        const hash = item.getHashCode();
        let listOfElements = hashtable[hash];
        if (listOfElements) {
            for (let i = 0, elem; elem = listOfElements[i]; i++) {
                if (elem === item || elem.equals(item))
                    return elem;
            }
        }
        else
            hashtable[hash] = listOfElements = [];
        listOfElements.push(item);
        return null;
    }
}
export class HashBasedCache extends HashBasedCacheCore {
    constructor() {
        super();
    }
    clearTemporaryCache() {
        this.tempCacheForMerge = {};
    }
    clear() {
        super.clear();
        this.clearTemporaryCache();
    }
    merge(jsonObjs, convertFromJSON) {
        NumberMapUtils.forEach(jsonObjs, (property, index) => this.addItemForMerge(convertFromJSON(property), index));
    }
    getItemByJsonKey(jsonKey) {
        return this.tempCacheForMerge[jsonKey];
    }
    addItemForMerge(item, jsonKey) {
        return this.tempCacheForMerge[jsonKey] = this.getItem(item);
    }
    convertToJSON(convertToJSON) {
        const result = [];
        NumberMapUtils.forEach(this.hashtable, (items) => ListUtils.forEach(items, (item) => result.push(convertToJSON(item))));
        return result;
    }
    indexOf(_item) {
        throw new Error(Errors.NotImplemented);
    }
    copyFrom(obj) {
        this.hashtable = NumberMapUtils.map(obj.hashtable, el => ListUtils.deepCopy(el));
        this.tempCacheForMerge = NumberMapUtils.deepCopy(obj.tempCacheForMerge);
        this.numElements = obj.numElements;
    }
}
