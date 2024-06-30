import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class ColumnCalculator {
    static generateSectionColumns(properties) {
        var availablePageWidth = properties.pageWidth - (properties.marginLeft + properties.marginRight + properties.space * (properties.columnCount - 1));
        var availablePageHeight = properties.pageHeight - (properties.marginTop + properties.marginBottom);
        var columnOffsetX = properties.marginLeft;
        var sectionColumns = [];
        for (var i = 0; i < properties.columnCount; i++) {
            var columnWidth = Math.max(properties.equalWidthColumns ? Math.floor(availablePageWidth / (properties.columnCount - i)) : properties.columnsInfo[i].width, 1);
            var column = new Rectangle(UnitConverter.twipsToPixelsF(columnOffsetX), UnitConverter.twipsToPixelsF(properties.marginTop), Math.max(UnitConverter.twipsToPixelsF(columnWidth), 1), UnitConverter.twipsToPixelsF(availablePageHeight));
            sectionColumns.push(column);
            columnOffsetX += columnWidth + (properties.equalWidthColumns ? properties.space : properties.columnsInfo[i].space);
            availablePageWidth -= columnWidth;
        }
        return sectionColumns;
    }
    static findMinimalColumnSize(properties) {
        return ListUtils.min(ColumnCalculator.generateSectionColumns(properties), a => a.width).createSize();
    }
}
