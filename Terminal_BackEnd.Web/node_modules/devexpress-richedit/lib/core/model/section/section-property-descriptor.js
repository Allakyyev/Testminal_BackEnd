import { Equals } from '@devexpress/utils/lib/utils/comparers';
import { SectionColumnCountHistoryItem, SectionColumnsInfoHistoryItem, SectionDifferentFirstPageHistoryItem, SectionEqualWidthColumnsHistoryItem, SectionFooterOffsetHistoryItem, SectionHeaderOffsetHistoryItem, SectionLandscapeHistoryItem, SectionMarginBottomHistoryItem, SectionMarginLeftHistoryItem, SectionMarginRightHistoryItem, SectionMarginTopHistoryItem, SectionPageHeightHistoryItem, SectionPageWidthHistoryItem, SectionPaperKindHistoryItem, SectionSpaceHistoryItem, SectionStartTypeHistoryItem } from '../history/items/section-properties-history-items';
import { JSONSectionProperty } from '../json/enums/json-section-enums';
import { SectionStartType } from './enums';
import { PaperKind } from './paper-kind';
import { SectionColumnProperties } from './section-column-properties';
export class SectionPropertiesMarginLeftDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 1440;
    }
    setProp(props, newValue) {
        props.marginLeft = newValue;
    }
    getProp(props) {
        return props.marginLeft;
    }
    getHistoryItemConstructor() {
        return SectionMarginLeftHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.MarginLeft;
    }
}
export class SectionPropertiesMarginTopDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 1440;
    }
    setProp(props, newValue) {
        props.marginTop = newValue;
    }
    getProp(props) {
        return props.marginTop;
    }
    getHistoryItemConstructor() {
        return SectionMarginTopHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.MarginTop;
    }
}
export class SectionPropertiesMarginRightDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 1440;
    }
    setProp(props, newValue) {
        props.marginRight = newValue;
    }
    getProp(props) {
        return props.marginRight;
    }
    getHistoryItemConstructor() {
        return SectionMarginRightHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.MarginRight;
    }
}
export class SectionPropertiesMarginBottomDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 1440;
    }
    setProp(props, newValue) {
        props.marginBottom = newValue;
    }
    getProp(props) {
        return props.marginBottom;
    }
    getHistoryItemConstructor() {
        return SectionMarginBottomHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.MarginBottom;
    }
}
export class SectionPropertiesFooterOffsetDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 720;
    }
    setProp(props, newValue) {
        props.footerOffset = newValue;
    }
    getProp(props) {
        return props.footerOffset;
    }
    getHistoryItemConstructor() {
        return SectionFooterOffsetHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.FooterOffset;
    }
}
export class SectionPropertiesHeaderOffsetDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 720;
    }
    setProp(props, newValue) {
        props.headerOffset = newValue;
    }
    getProp(props) {
        return props.headerOffset;
    }
    getHistoryItemConstructor() {
        return SectionHeaderOffsetHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.HeaderOffset;
    }
}
export class SectionPropertiesColumnCountDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 1;
    }
    setProp(props, newValue) {
        props.columnCount = newValue;
    }
    getProp(props) {
        return props.columnCount;
    }
    getHistoryItemConstructor() {
        return SectionColumnCountHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.ColumnCount;
    }
}
export class SectionPropertiesSpaceDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 720;
    }
    setProp(props, newValue) {
        props.space = newValue;
    }
    getProp(props) {
        return props.space;
    }
    getHistoryItemConstructor() {
        return SectionSpaceHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.Space;
    }
}
export class SectionPropertiesEqualWidthColumnsDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = true;
    }
    setProp(props, newValue) {
        props.equalWidthColumns = newValue;
    }
    getProp(props) {
        return props.equalWidthColumns;
    }
    getHistoryItemConstructor() {
        return SectionEqualWidthColumnsHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.EqualWidthColumns;
    }
}
export class SectionPropertiesColumnsInfoDescriptor {
    constructor() {
        this.binaryEquals = SectionColumnProperties.equalsColumnsInfoBinary;
        this.defaultValue = [];
    }
    setProp(props, newValue) {
        props.columnsInfo = newValue;
    }
    getProp(props) {
        return props.columnsInfo;
    }
    getHistoryItemConstructor() {
        return SectionColumnsInfoHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.ColumnsInfo;
    }
}
export class SectionPropertiesPageWidthDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 11906;
    }
    setProp(props, newValue) {
        props.pageWidth = newValue;
    }
    getProp(props) {
        return props.pageWidth;
    }
    getHistoryItemConstructor() {
        return SectionPageWidthHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.PageWidth;
    }
}
export class SectionPropertiesPageHeightDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 16838;
    }
    setProp(props, newValue) {
        props.pageHeight = newValue;
    }
    getProp(props) {
        return props.pageHeight;
    }
    getHistoryItemConstructor() {
        return SectionPageHeightHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.PageHeight;
    }
}
export class SectionPropertiesStartTypeDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = SectionStartType.NextPage;
    }
    setProp(props, newValue) {
        props.startType = newValue;
    }
    getProp(props) {
        return props.startType;
    }
    getHistoryItemConstructor() {
        return SectionStartTypeHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.StartType;
    }
}
export class SectionPropertiesLandscapeDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.landscape = newValue;
    }
    getProp(props) {
        return props.landscape;
    }
    getHistoryItemConstructor() {
        return SectionLandscapeHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.Landscape;
    }
}
export class SectionPropertiesDifferentFirstPageDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.differentFirstPage = newValue;
    }
    getProp(props) {
        return props.differentFirstPage;
    }
    getHistoryItemConstructor() {
        return SectionDifferentFirstPageHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.DifferentFirstPage;
    }
}
export class SectionPropertiesPaperKindDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = PaperKind.Letter;
    }
    setProp(props, newValue) {
        props.paperKind = newValue;
    }
    getProp(props) {
        return props.paperKind;
    }
    getHistoryItemConstructor() {
        return SectionPaperKindHistoryItem;
    }
    getJSONProperty() {
        return JSONSectionProperty.PaperKind;
    }
}
export class SectionPropertyDescriptor {
}
SectionPropertyDescriptor.marginLeft = new SectionPropertiesMarginLeftDescriptor();
SectionPropertyDescriptor.marginTop = new SectionPropertiesMarginTopDescriptor();
SectionPropertyDescriptor.marginRight = new SectionPropertiesMarginRightDescriptor();
SectionPropertyDescriptor.marginBottom = new SectionPropertiesMarginBottomDescriptor();
SectionPropertyDescriptor.footerOffset = new SectionPropertiesFooterOffsetDescriptor();
SectionPropertyDescriptor.headerOffset = new SectionPropertiesHeaderOffsetDescriptor();
SectionPropertyDescriptor.columnCount = new SectionPropertiesColumnCountDescriptor();
SectionPropertyDescriptor.space = new SectionPropertiesSpaceDescriptor();
SectionPropertyDescriptor.equalWidthColumns = new SectionPropertiesEqualWidthColumnsDescriptor();
SectionPropertyDescriptor.columnsInfo = new SectionPropertiesColumnsInfoDescriptor();
SectionPropertyDescriptor.pageWidth = new SectionPropertiesPageWidthDescriptor();
SectionPropertyDescriptor.pageHeight = new SectionPropertiesPageHeightDescriptor();
SectionPropertyDescriptor.startType = new SectionPropertiesStartTypeDescriptor();
SectionPropertyDescriptor.landscape = new SectionPropertiesLandscapeDescriptor();
SectionPropertyDescriptor.differentFirstPage = new SectionPropertiesDifferentFirstPageDescriptor();
SectionPropertyDescriptor.paperKind = new SectionPropertiesPaperKindDescriptor();
SectionPropertyDescriptor.ALL_FIELDS = [
    SectionPropertyDescriptor.marginLeft,
    SectionPropertyDescriptor.marginTop,
    SectionPropertyDescriptor.marginRight,
    SectionPropertyDescriptor.marginBottom,
    SectionPropertyDescriptor.footerOffset,
    SectionPropertyDescriptor.headerOffset,
    SectionPropertyDescriptor.columnCount,
    SectionPropertyDescriptor.space,
    SectionPropertyDescriptor.equalWidthColumns,
    SectionPropertyDescriptor.columnsInfo,
    SectionPropertyDescriptor.pageWidth,
    SectionPropertyDescriptor.pageHeight,
    SectionPropertyDescriptor.startType,
    SectionPropertyDescriptor.landscape,
    SectionPropertyDescriptor.differentFirstPage,
    SectionPropertyDescriptor.paperKind
];
