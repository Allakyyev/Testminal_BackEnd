import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
export class ListIdProviderBase {
    constructor(documentModel) {
        this.documentModel = documentModel;
        this.lastId = 0;
    }
    getMap() {
        if (!this.map) {
            this.map = {};
            for (var i = 0, list; list = this.getLists()[i]; i++)
                this.map[list.innerId] = true;
        }
        return this.map;
    }
    getNextId() {
        const map = this.getMap();
        do {
            this.lastId++;
        } while (map[this.lastId]);
        map[this.lastId] = true;
        return this.lastId;
    }
}
export class NumberingListIdProvider extends ListIdProviderBase {
    getLists() {
        return this.documentModel.numberingLists;
    }
    clone(model) {
        const result = new NumberingListIdProvider(model);
        result.map = NumberMapUtils.shallowCopy(this.map);
        return result;
    }
}
export class AbstractNumberingListIdProvider extends ListIdProviderBase {
    getLists() {
        return this.documentModel.abstractNumberingLists;
    }
    clone(model) {
        const result = new AbstractNumberingListIdProvider(model);
        result.map = NumberMapUtils.shallowCopy(this.map);
        return result;
    }
}
