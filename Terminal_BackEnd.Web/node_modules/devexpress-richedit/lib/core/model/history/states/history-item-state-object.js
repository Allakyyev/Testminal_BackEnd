import { Errors } from '@devexpress/utils/lib/errors';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { BorderInfo } from '../../borders/border-info';
import { AnchorTextBoxSize, PictureSize } from '../../floating-objects/sizes';
import { FontInfo } from '../../fonts/font-info';
import { JSONMaskedCharacterPropertiesConverter } from '../../json/importers/json-masked-character-properties-converter';
import { JSONMaskedParagraphPropertiesConverter } from '../../json/importers/json-masked-paragraph-properties-converter';
import { JSONShapeConverter } from '../../json/importers/json-shape-converter';
import { JSONTabConverter } from '../../json/importers/json-tab-converter';
import { JSONColumnsSectionPropertiesConverter } from '../../json/importers/section/json-columns-section-properties-converter';
import { JSONAnchorInfoConverter } from '../../json/importers/sub-document/json-anchor-info-converter';
import { JSONTextBoxPropertiesConverter } from '../../json/importers/sub-document/json-text-box-properties-converter';
import { JSONAnchorTextBoxSizeConverterConverter } from '../../json/importers/sub-document/sizes/json-anchor-text-box-size-converter';
import { JSONInlinePictureSizeConverterConverter } from '../../json/importers/sub-document/sizes/json-inline-picture-size-converter';
import { TableHeightUnit, TableWidthUnit } from '../../tables/secondary-structures/table-units';
export class HistoryItemIntervalStateObject {
    constructor(interval, value) {
        this.interval = interval.clone();
        this.value = value;
    }
    merge(object) {
        this.interval.length += object.interval.length;
    }
    canMerge(object) {
        return this.interval.end === object.interval.start && this.isEqualValue(object);
    }
    isEqualValue(object) {
        return this.value === object.value;
    }
    toJSON(withPostData) {
        return [this.interval.start, this.interval.length, this.getPropertyValueForJSON(this.value, withPostData)];
    }
    getPropertyValueForJSON(value, _withPostData) {
        if (value instanceof FontInfo)
            return value.name;
        return value;
    }
}
export class HistoryItemTabStateObject extends HistoryItemIntervalStateObject {
    constructor(interval, tabInfo) {
        super(interval, tabInfo);
    }
    isEqualValue(object) {
        return this.value.position == object.value.position;
    }
    getPropertyValueForJSON(value) {
        return JSONTabConverter.convertToJSON(value);
    }
}
export class HistoryItemTextBufferStateObject extends HistoryItemIntervalStateObject {
    constructor(startPosition, text) {
        super(new FixedInterval(startPosition, text.length), text);
    }
    canMerge(_stateValue) {
        return false;
    }
}
export class HistoryItemIntervalStyleStateObject extends HistoryItemIntervalStateObject {
    constructor(interval, style) {
        super(interval, style);
    }
    getPropertyValueForJSON(value) {
        return value.styleName;
    }
}
export class HistoryItemIntervalParagraphPropertiesStateObject extends HistoryItemIntervalStateObject {
    constructor(interval, properties) {
        super(interval, properties);
    }
    getPropertyValueForJSON(value) {
        return JSONMaskedParagraphPropertiesConverter.convertToJSON(value);
    }
}
export class HistoryItemIntervalCharacterPropertiesStateObject extends HistoryItemIntervalStateObject {
    constructor(interval, properties) {
        super(interval, properties);
    }
    getPropertyValueForJSON(value) {
        return JSONMaskedCharacterPropertiesConverter.convertToJSON(value);
    }
}
export class HistoryItemIntervalUseStateObject extends HistoryItemIntervalStateObject {
    constructor(interval, value, use) {
        super(interval, value);
        this.use = use;
    }
    canMerge(stateValue) {
        return super.canMerge(stateValue) && this.use === stateValue.use;
    }
    toJSON() {
        return super.toJSON().concat([this.use ? 1 : 0]);
    }
}
export class HistoryItemSectionStateObject {
    constructor(sectionIndex, value) {
        this.value = value;
        this.sectionIndex = sectionIndex;
    }
    toJSON() {
        return [this.sectionIndex, this.getPropertyValueForJSON(this.value)];
    }
    getPropertyValueForJSON(value) {
        if (value instanceof Array)
            return JSONColumnsSectionPropertiesConverter.convertToJSON(value);
        return value;
    }
    canMerge(_obj) { return false; }
    merge(_obj) { }
}
export class HistoryItemListLevelStateObject {
    constructor(isAbstractNumberingList, numberingListIndex, listLevelIndex, value) {
        this.isAbstractNumberingList = isAbstractNumberingList;
        this.numberingListIndex = numberingListIndex;
        this.listLevelIndex = listLevelIndex;
        this.value = value;
    }
    toJSON() {
        return [this.isAbstractNumberingList ? 1 : 0, this.numberingListIndex, this.listLevelIndex, this.getPropertyValueForJSON(this.value)];
    }
    canMerge(_obj) {
        return false;
    }
    merge(_obj) {
        throw new Error(Errors.NotImplemented);
    }
    getPropertyValueForJSON(value) {
        if (value instanceof FontInfo)
            return value.name;
        return value;
    }
}
export class HistoryItemListLevelUseStateObject extends HistoryItemListLevelStateObject {
    constructor(isAbstractNumberingList, numberingListIndex, listLevelIndex, value, use) {
        super(isAbstractNumberingList, numberingListIndex, listLevelIndex, value);
        this.use = use;
    }
    toJSON() {
        return super.toJSON().concat([this.use ? 1 : 0]);
    }
}
export class HistoryItemTableStateObject {
    constructor(tableStartPosition, tableNestedLevel, tableIndex, value) {
        this.tableIndex = tableIndex;
        this.value = value;
        this.tableStartPosition = tableStartPosition;
        this.tableNestedLevel = tableNestedLevel;
    }
    toJSON() {
        return [this.tableStartPosition, this.tableNestedLevel, this.getPropertyValueForJSON(this.value)];
    }
    canMerge(_obj) {
        return false;
    }
    merge(_obj) {
        throw new Error(Errors.NotImplemented);
    }
    getPropertyValueForJSON(value) {
        if (value instanceof TableWidthUnit)
            return [value.type, value.value];
        if (value instanceof TableHeightUnit)
            return [value.type, value.value];
        if (value instanceof BorderInfo)
            return [value.color.toJSON(), value.frame, value.offset, value.shadow, value.style, value.width];
        return value;
    }
}
export class HistoryItemTableUseStateObject extends HistoryItemTableStateObject {
    constructor(tableStartPosition, tableNestedLevel, tableIndex, value, use) {
        super(tableStartPosition, tableNestedLevel, tableIndex, value);
        this.use = use;
    }
    toJSON() {
        return super.toJSON().concat([this.use ? 1 : 0]);
    }
}
export class HistoryItemTableComplexUseStateObject extends HistoryItemTableStateObject {
    constructor(tableStartPosition, tableNestedLevel, tableIndex, value, uses) {
        super(tableStartPosition, tableNestedLevel, tableIndex, value);
        this.uses = uses;
    }
    toJSON() {
        let uses = [];
        let usesLength = this.uses.length;
        for (let i = 0; i < usesLength; i++)
            uses.push(this.uses[i] ? 1 : 0);
        return super.toJSON().concat([uses]);
    }
    getPropertyValueForJSON(value) {
        let result = [];
        let length = value.length;
        for (let i = 0; i < length; i++)
            result.push(super.getPropertyValueForJSON(value[i]));
        return result;
    }
}
export class HistoryItemTableCellStateObject {
    constructor(tableStartPosition, tableNestedLevel, tableIndex, rowIndex, cellIndex, value) {
        this.tableIndex = tableIndex;
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
        this.value = value;
        this.tableStartPosition = tableStartPosition;
        this.tableNestedLevel = tableNestedLevel;
    }
    toJSON() {
        return [this.tableStartPosition, this.tableNestedLevel, this.rowIndex, this.cellIndex, this.getPropertyValueForJSON(this.value)];
    }
    canMerge(_obj) {
        return false;
    }
    merge(_obj) {
        throw new Error(Errors.NotImplemented);
    }
    getPropertyValueForJSON(value) {
        if (value instanceof TableWidthUnit)
            return [value.type, value.value];
        if (value instanceof TableHeightUnit)
            return [value.type, value.value];
        if (value instanceof BorderInfo)
            return [value.color.toJSON(), value.frame, value.offset, value.shadow, value.style, value.width];
        return value;
    }
}
export class HistoryItemTableCellUseStateObject extends HistoryItemTableCellStateObject {
    constructor(tableStartPosition, tableNestedLevel, tableIndex, rowIndex, cellIndex, value, use) {
        super(tableStartPosition, tableNestedLevel, tableIndex, rowIndex, cellIndex, value);
        this.use = use;
    }
    toJSON() {
        return super.toJSON().concat([this.use ? 1 : 0]);
    }
}
export class HistoryItemTableCellComplexUseStateObject extends HistoryItemTableCellStateObject {
    constructor(tableStartPosition, tableNestedLevel, tableIndex, rowIndex, cellIndex, value, uses) {
        super(tableStartPosition, tableNestedLevel, tableIndex, rowIndex, cellIndex, value);
        this.uses = uses;
    }
    toJSON() {
        let uses = [];
        let usesLength = this.uses.length;
        for (let i = 0; i < usesLength; i++) {
            uses.push(this.uses[i] ? 1 : 0);
        }
        return super.toJSON().concat([uses]);
    }
    getPropertyValueForJSON(value) {
        let result = [];
        let length = value.length;
        for (let i = 0; i < length; i++)
            result.push(super.getPropertyValueForJSON(value[i]));
        return result;
    }
}
export class HistoryItemTableRowStateObject {
    constructor(tableStartPosition, tableNestedLevel, tableIndex, rowIndex, value) {
        this.tableIndex = tableIndex;
        this.rowIndex = rowIndex;
        this.value = value;
        this.tableStartPosition = tableStartPosition;
        this.tableNestedLevel = tableNestedLevel;
    }
    toJSON() {
        return [this.tableStartPosition, this.tableNestedLevel, this.rowIndex, this.getPropertyValueForJSON(this.value)];
    }
    canMerge(_obj) {
        return false;
    }
    merge(_obj) {
        throw new Error(Errors.NotImplemented);
    }
    getPropertyValueForJSON(value) {
        if (value instanceof TableWidthUnit)
            return [value.type, value.value];
        if (value instanceof TableHeightUnit)
            return [value.type, value.value];
        return value;
    }
}
export class HistoryItemTableRowUseStateObject extends HistoryItemTableRowStateObject {
    constructor(tableStartPosition, tableNestedLevel, tableIndex, rowIndex, value, use) {
        super(tableStartPosition, tableNestedLevel, tableIndex, rowIndex, value);
        this.use = use;
    }
    toJSON() {
        return super.toJSON().concat([this.use ? 1 : 0]);
    }
}
export class HistoryItemIntervalAnchorInfoStateObject extends HistoryItemIntervalStateObject {
    constructor(interval, properties) {
        super(interval, properties);
    }
    getPropertyValueForJSON(value) {
        return JSONAnchorInfoConverter.convertToJSON(value);
    }
}
export class HistoryItemIntervalAnchorSizeStateObject extends HistoryItemIntervalStateObject {
    constructor(interval, properties) {
        super(interval, properties);
    }
    getPropertyValueForJSON(value) {
        if (value instanceof PictureSize)
            return JSONInlinePictureSizeConverterConverter.convertToJSON(value);
        if (value instanceof AnchorTextBoxSize)
            return JSONAnchorTextBoxSizeConverterConverter.convertToJSON(value);
        return value;
    }
}
export class HistoryItemIntervalShapeStateObject extends HistoryItemIntervalStateObject {
    constructor(interval, properties) {
        super(interval, properties);
    }
    getPropertyValueForJSON(value) {
        return JSONShapeConverter.convertToJSON(value);
    }
}
export class HistoryItemIntervalAnchoredTextBoxPropertiesStateObject extends HistoryItemIntervalStateObject {
    constructor(interval, properties) {
        super(interval, properties);
    }
    getPropertyValueForJSON(value) {
        return JSONTextBoxPropertiesConverter.convertToJSON(value);
    }
}
export class HistoryItemInlineObjectPropertiesStateObject extends HistoryItemIntervalStateObject {
    getPropertyValueForJSON(value) {
        if (value instanceof Size)
            return [value.width, value.height];
        else
            return value;
    }
}
