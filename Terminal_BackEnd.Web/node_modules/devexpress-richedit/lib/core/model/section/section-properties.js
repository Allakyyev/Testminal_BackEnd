import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Margins } from '@devexpress/utils/lib/geometry/margins';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { SectionStartType } from './enums';
import { SectionColumnProperties } from './section-column-properties';
import { PaperKind } from './paper-kind';
import { LineNumberingProperties } from './line-numbering-properties';
export class SectionProperties {
    constructor() {
        this.margins = new Margins(1440, 1440, 1440, 1440);
        this.headerOffset = 720;
        this.footerOffset = 720;
        this.columnCount = 1;
        this.space = 720;
        this.equalWidthColumns = true;
        this.columnsInfo = [];
        this.pageSize = new Size(12240, 15840);
        this.startType = SectionStartType.NextPage;
        this.landscape = false;
        this.differentFirstPage = false;
        this.paperKind = PaperKind.Letter;
        this.firstPageNumber = -1;
        this.continueNumbering = true;
        this.lineNumbering = new LineNumberingProperties();
    }
    static createSimpleSectionProperties(width, height) {
        const simpleSectionProperties = new SectionProperties();
        simpleSectionProperties.margins = new Margins(0, 0, 0, 0);
        simpleSectionProperties.pageWidth = UnitConverter.pixelsToTwips(width);
        simpleSectionProperties.pageHeight = UnitConverter.pixelsToTwips(height);
        return simpleSectionProperties;
    }
    get marginLeft() { return this.margins.left; }
    ;
    get marginTop() { return this.margins.top; }
    ;
    get marginRight() { return this.margins.right; }
    ;
    get marginBottom() { return this.margins.bottom; }
    ;
    get pageWidth() { return this.pageSize.width; }
    ;
    get pageHeight() { return this.pageSize.height; }
    ;
    set marginLeft(val) { this.margins.left = val; }
    ;
    set marginTop(val) { this.margins.top = val; }
    ;
    set marginRight(val) { this.margins.right = val; }
    ;
    set marginBottom(val) { this.margins.bottom = val; }
    ;
    set pageWidth(val) { this.pageSize.width = val; }
    ;
    set pageHeight(val) { this.pageSize.height = val; }
    ;
    copyFrom(obj) {
        this.columnCount = obj.columnCount;
        if (obj.columnsInfo) {
            this.columnsInfo = [];
            for (var i = 0; i < obj.columnsInfo.length; i++)
                this.columnsInfo.push(new SectionColumnProperties(obj.columnsInfo[i].width, obj.columnsInfo[i].space));
        }
        else
            this.columnsInfo = obj.columnsInfo;
        this.lineNumbering.copyFrom(obj.lineNumbering);
        this.equalWidthColumns = obj.equalWidthColumns;
        this.marginBottom = obj.marginBottom;
        this.marginLeft = obj.marginLeft;
        this.marginRight = obj.marginRight;
        this.marginTop = obj.marginTop;
        this.pageHeight = obj.pageHeight;
        this.pageWidth = obj.pageWidth;
        this.space = obj.space;
        this.startType = obj.startType;
        this.landscape = obj.landscape;
        this.differentFirstPage = obj.differentFirstPage;
        this.headerOffset = obj.headerOffset;
        this.footerOffset = obj.footerOffset;
        this.paperKind = obj.paperKind;
        this.firstPageNumber = obj.firstPageNumber;
        this.continueNumbering = obj.continueNumbering;
    }
    clone() {
        var obj = new SectionProperties();
        obj.copyFrom(this);
        return obj;
    }
    equals(obj) {
        if (!obj)
            return false;
        return this.margins.equals(obj.margins) &&
            this.headerOffset == obj.headerOffset &&
            this.footerOffset == obj.footerOffset &&
            this.columnCount == obj.columnCount &&
            this.space == obj.space &&
            this.equalWidthColumns == obj.equalWidthColumns &&
            this.pageSize.equals(obj.pageSize) &&
            this.startType == obj.startType &&
            this.landscape == obj.landscape &&
            this.differentFirstPage == obj.differentFirstPage &&
            SectionColumnProperties.equalsColumnsInfoBinary(this.columnsInfo, obj.columnsInfo) &&
            this.paperKind == obj.paperKind &&
            this.firstPageNumber == obj.firstPageNumber &&
            this.continueNumbering == obj.continueNumbering;
    }
}
