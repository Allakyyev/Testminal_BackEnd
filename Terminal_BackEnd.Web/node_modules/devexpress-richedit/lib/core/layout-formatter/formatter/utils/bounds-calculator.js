import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { isEven } from '@devexpress/utils/lib/utils/common';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class BoundsCalculator {
    constructor() {
        this.pageIndex = -1;
    }
    init(section) {
        this.section = section;
        this.mirrorMargins = section.documentModel.mirrorMargins;
        const sectionProperties = this.section.sectionProperties;
        this.equalWidthColumns = sectionProperties.equalWidthColumns;
        this.columnCount = sectionProperties.columnCount;
        this.space = UnitConverter.twipsToPixelsF(sectionProperties.space);
        this.marginTop = UnitConverter.twipsToPixelsF(sectionProperties.marginTop);
        this.marginBottom = UnitConverter.twipsToPixelsF(sectionProperties.marginBottom);
        this.marginRight = UnitConverter.twipsToPixelsF(sectionProperties.marginRight);
        this.marginBottom = UnitConverter.twipsToPixelsF(sectionProperties.marginBottom);
        this.marginLeft = UnitConverter.twipsToPixelsF(sectionProperties.marginLeft);
        this.pageWidth = UnitConverter.twipsToPixelsF(sectionProperties.pageWidth);
        this.pageHeight = UnitConverter.twipsToPixelsF(sectionProperties.pageHeight);
        this.headerOffset = UnitConverter.twipsToPixelsF(sectionProperties.headerOffset);
        this.footerOffset = UnitConverter.twipsToPixelsF(sectionProperties.footerOffset);
        if (this.mirrorMargins && this.pageIndex >= 0 && isEven(this.pageIndex))
            [this.marginRight, this.marginLeft] = [this.marginLeft, this.marginRight];
        this.columnsInfo = ListUtils.map(sectionProperties.columnsInfo, (columnProps) => columnProps.clone().applyConverter(UnitConverter.twipsToPixelsF));
        this.avaliablePageHeight = this.pageHeight - (this.marginTop + this.marginBottom);
        this.availableHeaderFooterWidth = this.pageWidth - this.marginLeft - this.marginRight;
    }
    initWhenPageStart(pageIndex) {
        this.pageIndex = pageIndex;
        this.mainPageAreasBounds = [];
        this.mainColumnsBounds = [];
    }
    setHeaderBounds(currHeight) {
        if (currHeight == 0) {
            this.headerPageAreaBounds = null;
            this.headerColumnBounds = null;
            return;
        }
        const height = currHeight == -1 ? Number.MAX_VALUE :
            Math.max(this.marginTop - this.headerOffset, Math.min(Math.floor(this.pageHeight * BoundsCalculator.MAX_HEADER_FOOTER_HEIGHT_COEFF), currHeight));
        this.headerPageAreaBounds = new Rectangle(this.marginLeft, this.headerOffset, this.availableHeaderFooterWidth, height);
        this.headerColumnBounds = new Rectangle(0, 0, this.headerPageAreaBounds.width, this.headerPageAreaBounds.height);
    }
    setFooterBounds(currHeight) {
        if (currHeight == 0) {
            this.footerPageAreaBounds = null;
            this.footerColumnBounds = null;
            return;
        }
        if (currHeight == -1) {
            this.footerPageAreaBounds = new Rectangle(this.marginLeft, this.pageHeight - this.footerOffset, this.availableHeaderFooterWidth, Number.MAX_VALUE);
            this.footerColumnBounds = new Rectangle(0, 0, this.footerPageAreaBounds.width, this.footerPageAreaBounds.height);
        }
        else {
            currHeight = Math.min(Math.round(this.pageHeight * BoundsCalculator.MAX_HEADER_FOOTER_HEIGHT_COEFF), currHeight);
            const pageAreaHeight = this.footerOffset + currHeight;
            this.footerPageAreaBounds = new Rectangle(this.marginLeft, this.pageHeight - pageAreaHeight, this.availableHeaderFooterWidth, pageAreaHeight);
            this.footerColumnBounds = new Rectangle(0, 0, this.footerPageAreaBounds.width, currHeight);
        }
    }
    calculateMainPageAreaBounds(previousMainPageAreaHeight) {
        let y;
        if (previousMainPageAreaHeight > 0) {
            const previousPageAreaBounds = this.mainPageAreasBounds[this.mainPageAreasBounds.length - 1];
            for (let colBound of this.mainColumnsBounds[this.mainColumnsBounds.length - 1])
                colBound.height = previousMainPageAreaHeight;
            previousPageAreaBounds.height = previousMainPageAreaHeight;
            y = previousPageAreaBounds.bottom;
        }
        else
            y = Math.max(this.marginTop, this.headerPageAreaBounds ? this.headerPageAreaBounds.bottom : 0);
        let height = Math.min(this.pageHeight - this.marginBottom, this.footerPageAreaBounds ? this.footerPageAreaBounds.y : Number.MAX_VALUE) - y;
        this.mainPageAreasBounds.push(new Rectangle(this.marginLeft, y, this.availableHeaderFooterWidth, height));
    }
    calculateColumnBounds(pageAreaBounds) {
        if (this.equalWidthColumns) {
            const oneColumnWidth = Math.floor((this.availableHeaderFooterWidth - (this.columnCount - 1) * this.space) / this.columnCount);
            const colWidthPlusSpace = oneColumnWidth + this.space;
            this.mainColumnsBounds.push(ListUtils.initByCallback(this.columnCount, (columnIndex) => new Rectangle(colWidthPlusSpace * columnIndex, 0, oneColumnWidth, pageAreaBounds.height)));
        }
        else {
            let currXPos = 0;
            this.mainColumnsBounds.push(ListUtils.map(this.columnsInfo, (columnInfo) => {
                const rect = new Rectangle(currXPos, 0, Math.max(1, columnInfo.width), pageAreaBounds.height);
                currXPos += columnInfo.width + columnInfo.space;
                return rect;
            }));
        }
    }
    calculatePageBounds(y) {
        this.pageBounds = new Rectangle(0, y, this.pageWidth, this.pageHeight);
    }
}
BoundsCalculator.MAX_HEADER_FOOTER_HEIGHT_COEFF = 0.48;
