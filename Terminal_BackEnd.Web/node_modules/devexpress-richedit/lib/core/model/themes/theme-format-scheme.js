import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StyleMatrixElementType } from './enums';
export class ThemeFormatScheme {
    constructor() {
        this.backgroundFillStyleList = [];
        this.fillStyleList = [];
        this.lineStyleList = [];
        this.effectStyleList = [];
        this.name = "";
    }
    get isValidate() {
        return this.checkValidation();
    }
    getOutlineByType(type) {
        return this.getElementByType(type, this.lineStyleList);
    }
    getOutlineByIndex(index) {
        return this.getElementByIndex(index, this.lineStyleList);
    }
    getFillByType(type) {
        return this.getElementByType(type, this.fillStyleList);
    }
    getFillByIndex(index) {
        var backgroundIndex = 1000;
        if (index < backgroundIndex)
            return this.getElementByIndex(index, this.fillStyleList);
        return this.getElementByIndex(index - backgroundIndex, this.backgroundFillStyleList);
    }
    getEffectStyle(type) {
        return this.getElementByType(type, this.effectStyleList);
    }
    getElementByType(type, items) {
        if (type == StyleMatrixElementType.Subtle)
            return items[0];
        if (type == StyleMatrixElementType.Moderate)
            return items[1];
        if (type == StyleMatrixElementType.Intense)
            return items[2];
        return null;
    }
    getElementByIndex(index, items) {
        const count = items.length;
        return index < 1 || count == 0 ? null : items[Math.min(index, count) - 1];
    }
    checkValidation() {
        return this.backgroundFillStyleList.length >= 3 && this.fillStyleList.length >= 3 && this.lineStyleList.length >= 3 && this.effectStyleList.length >= 3;
    }
    copyFrom(obj) {
        this.clear();
        this.name = obj.name;
        this.backgroundFillStyleList = ListUtils.map(obj.backgroundFillStyleList, (e) => e.clone());
        this.fillStyleList = ListUtils.map(obj.fillStyleList, (e) => e.clone());
        this.lineStyleList = ListUtils.map(obj.lineStyleList, (e) => e.clone());
        this.effectStyleList = ListUtils.map(obj.effectStyleList, (e) => e.clone());
    }
    clear() {
        this.name = "";
        ListUtils.clear(this.backgroundFillStyleList);
        ListUtils.clear(this.fillStyleList);
        ListUtils.clear(this.lineStyleList);
        ListUtils.clear(this.effectStyleList);
    }
}
