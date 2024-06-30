import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { TableCellPropertiesMergerBorderBottom, TableCellPropertiesMergerBorderLeft, TableCellPropertiesMergerBorderRight, TableCellPropertiesMergerBorderTop, TableCellPropertiesMergerMarginBottom, TableCellPropertiesMergerMarginLeft, TableCellPropertiesMergerMarginRight, TableCellPropertiesMergerMarginTop } from '../properties-mergers/table-cell-properties-merger';
import { ConditionalTableStyleFormatting, TableCellMergingState } from '../secondary-structures/table-base-structures';
import { TableWidthUnit } from '../secondary-structures/table-units';
export class TableCell {
    constructor(parentRow, properties) {
        this.preferredWidth = TableWidthUnit.createDefault();
        this.columnSpan = 1;
        this.verticalMerging = TableCellMergingState.None;
        this.conditionalFormatting = ConditionalTableStyleFormatting.WholeTable;
        this.parentRow = parentRow;
        this.properties = properties;
    }
    destructor(positionManager) {
        if (this.startParagraphPosition)
            positionManager.unregisterPosition(this.startParagraphPosition);
        if (this.endParagrapPosition)
            positionManager.unregisterPosition(this.endParagrapPosition);
    }
    get interval() { return FixedInterval.fromPositions(this.startParagraphPosition.value, this.endParagrapPosition.value); }
    get isFirstCellInRow() {
        return this === this.parentRow.cells[0];
    }
    getActualTopCellBorder(defaultCellProperties) {
        const isTopOutsideBorder = this.parentRow.parentTable.rows[0] == this.parentRow;
        return this.getActualBorderCore(new TableCellPropertiesMergerBorderTop(this.parentRow.tablePropertiesException, isTopOutsideBorder), defaultCellProperties);
    }
    getActualLeftCellBorder(defaultCellProperties) {
        const isLeftOutsideBorder = this.parentRow.cells[0] == this;
        return this.getActualBorderCore(new TableCellPropertiesMergerBorderLeft(this.parentRow.tablePropertiesException, isLeftOutsideBorder), defaultCellProperties);
    }
    getActualBottomCellBorder(defaultCellProperties) {
        const isBottomOutsideBorder = ListUtils.last(this.parentRow.parentTable.rows) == this.parentRow;
        return this.getActualBorderCore(new TableCellPropertiesMergerBorderBottom(this.parentRow.tablePropertiesException, isBottomOutsideBorder), defaultCellProperties);
    }
    getActualRightCellBorder(defaultCellProperties) {
        const isRightOutsideBorder = ListUtils.last(this.parentRow.cells) == this;
        return this.getActualBorderCore(new TableCellPropertiesMergerBorderRight(this.parentRow.tablePropertiesException, isRightOutsideBorder), defaultCellProperties);
    }
    getActualBorderCore(tableCellPropertiesMerger, defaultCellProperties) {
        const tableStyle = this.parentRow.parentTable.style;
        return tableCellPropertiesMerger.getProperty(this.properties, tableStyle, this.conditionalFormatting, defaultCellProperties);
    }
    getActualLeftCellMargin(model) {
        return this.getActualCellMarginCore(new TableCellPropertiesMergerMarginLeft(this.parentRow.parentTable, model, this.parentRow.tablePropertiesException), model.defaultTableCellProperties);
    }
    getActualTopCellMargin(model) {
        return this.getActualCellMarginCore(new TableCellPropertiesMergerMarginTop(this.parentRow.parentTable, model, this.parentRow.tablePropertiesException), model.defaultTableCellProperties);
    }
    getActualRightCellMargin(model) {
        return this.getActualCellMarginCore(new TableCellPropertiesMergerMarginRight(this.parentRow.parentTable, model, this.parentRow.tablePropertiesException), model.defaultTableCellProperties);
    }
    getActualBottomCellMargin(model) {
        return this.getActualCellMarginCore(new TableCellPropertiesMergerMarginBottom(this.parentRow.parentTable, model, this.parentRow.tablePropertiesException), model.defaultTableCellProperties);
    }
    getActualCellMarginCore(tableCellPropertiesMerger, defaultTableCellProperties) {
        return tableCellPropertiesMerger.getProperty(this.properties, this.parentRow.parentTable.style, this.conditionalFormatting, defaultTableCellProperties);
    }
    clone(subDocument, parentRow) {
        const result = new TableCell(parentRow, subDocument.documentModel.cache.tableCellPropertiesCache.getItem(this.properties));
        result.preferredWidth = this.preferredWidth.clone();
        result.columnSpan = this.columnSpan;
        result.verticalMerging = this.verticalMerging;
        result.startParagraphPosition = subDocument.positionManager.registerPosition(this.startParagraphPosition.value);
        result.endParagrapPosition = subDocument.positionManager.registerPosition(this.endParagrapPosition.value);
        return result;
    }
}
