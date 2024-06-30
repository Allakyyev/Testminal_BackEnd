import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { TableAlignmentApplier } from '../../../core/layout-formatter/table/table-alignment-applier';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutColumn } from '../../../core/layout/main-structures/layout-column';
import { TableCellCellMarginsHistoryItem, TableCellNoWrapHistoryItem, TableCellPreferredWidthHistoryItem, TableCellVerticalAlignmentHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { TableCellMarginsHistoryItem, TableCellSpacingHistoryItem, TableIndentHistoryItem, TableLayoutTypeHistoryItem, TablePreferredWidthHistoryItem, TableTableRowAlignmentHistoryItem } from '../../../core/model/history/items/tables/table-properties-history-items';
import { TableRowCantSplitHistoryItem, TableRowCellSpacingHistoryItem, TableRowHeightHistoryItem, TableRowTableRowAlignmentHistoryItem } from '../../../core/model/history/items/tables/table-row-properties-history-items';
import { TableCellPropertiesMergerNoWrap, TableCellVerticalAlignmentMerger } from '../../../core/model/tables/properties-mergers/table-cell-properties-merger';
import { TableRowPropertiesMergerCantSplit, TableRowPropertiesMergerCellSpacing } from '../../../core/model/tables/properties-mergers/table-row-properties-merger';
import { TableCellPropertiesMask } from '../../../core/model/tables/properties/table-cell-properties';
import { ConditionalTableStyleFormatting, TableCellMargins, TableCellMergingState, TableLayoutType, TableRowAlignment } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { TableHeightUnit, TableHeightUnitType, TableWidthUnit, TableWidthUnitType } from '../../../core/model/tables/secondary-structures/table-units';
import { TableCellUtils } from '../../../core/model/tables/table-utils';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { TableUtilsEx } from '../../rich-utils/table-utils-ex';
import { SimpleCommandState } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogTablePropertiesCommand extends ShowDialogCommandBase {
    getState() {
        let state = new SimpleCommandState(this.isEnabled());
        state.visible = this.selection.tableInfo.extendedData.numRows > 0 && !this.selection.specialRunInfo.isPictureSelected();
        return state;
    }
    createParameters(options) {
        let dialogParams = new TablePropertiesDialogParameters();
        const table = this.selection.tableInfo.table;
        const subDocument = options.subDocument;
        const position = table.parentCell ? table.parentCell.endParagrapPosition.value : this.selection.intervals[0].start;
        let lp = subDocument.isMain() ?
            new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, position, DocumentLayoutDetailsLevel.Row)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false)) :
            new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, position, this.selection.pageIndex, DocumentLayoutDetailsLevel.Row)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
        let maxTableWidth = UnitConverter.pixelsToTwipsF(table.parentCell ? lp.row.width : LayoutColumn.findSectionColumnWithMinimumWidth(lp.pageArea.columns));
        dialogParams.init(this.selection.tableInfo, this.control.modelManager.model, maxTableWidth, this.getInitialTab());
        return dialogParams;
    }
    applyParameters(_state, newParams, initParams) {
        const modelManipulator = this.modelManipulator;
        const subDocument = this.selection.activeSubDocument;
        const tableInfo = this.selection.tableInfo;
        const table = tableInfo.table;
        const history = this.history;
        if (!subDocument.isEditable([FixedInterval.fromPositions(table.getStartPosition(), table.getEndPosition())]))
            return false;
        let changed = false;
        history.beginTransaction();
        newParams.tablePreferredWidth = this.getActualPreferredWidth(newParams.useDefaultTableWidth, newParams.tablePreferredWidth);
        if (newParams.tablePreferredWidth && !newParams.tablePreferredWidth.equals(initParams.tablePreferredWidth)) {
            history.addAndRedo(new TablePreferredWidthHistoryItem(modelManipulator, subDocument, table.index, newParams.tablePreferredWidth));
            changed = true;
        }
        if (newParams.tableRowAlignment !== undefined && newParams.tableRowAlignment !== null && newParams.tableRowAlignment !== initParams.tableRowAlignment) {
            history.addAndRedo(new TableTableRowAlignmentHistoryItem(modelManipulator, subDocument, table.index, newParams.tableRowAlignment, true));
            for (let i = 0; i < table.rows.length; i++)
                history.addAndRedo(new TableRowTableRowAlignmentHistoryItem(modelManipulator, subDocument, table.index, i, newParams.tableRowAlignment, true));
            changed = true;
        }
        if (!newParams.tableRowAlignment || newParams.tableRowAlignment !== TableRowAlignment.Left)
            newParams.tableIndent = 0;
        if (newParams.tableIndent !== initParams.tableIndent) {
            let newTableIndent = TableWidthUnit.create(newParams.tableIndent, TableWidthUnitType.ModelUnits);
            history.addAndRedo(new TableIndentHistoryItem(modelManipulator, subDocument, table.index, newTableIndent, true));
            changed = true;
        }
        if (!newParams.allowCellSpacing)
            newParams.cellSpacing = 0;
        if (newParams.cellSpacing !== undefined && newParams.cellSpacing !== initParams.cellSpacing) {
            let newCellSpacing;
            if (newParams.allowCellSpacing)
                newCellSpacing = TableWidthUnit.create(newParams.cellSpacing / 2, TableWidthUnitType.ModelUnits);
            else
                newCellSpacing = subDocument.documentModel.defaultTableProperties.cellSpacing.clone();
            history.addAndRedo(new TableCellSpacingHistoryItem(modelManipulator, subDocument, table.index, newCellSpacing, true));
            for (let i = 0; i < table.rows.length; i++)
                history.addAndRedo(new TableRowCellSpacingHistoryItem(modelManipulator, subDocument, table.index, i, newCellSpacing, true));
            changed = true;
        }
        let newlayoutType = newParams.resizeToFitContent ? TableLayoutType.Autofit : TableLayoutType.Fixed;
        if (newlayoutType !== table.properties.layoutType) {
            history.addAndRedo(new TableLayoutTypeHistoryItem(modelManipulator, subDocument, table.index, newlayoutType, true));
            changed = true;
        }
        if (newParams.defaultCellMarginTop !== initParams.defaultCellMarginTop || newParams.defaultCellMarginRight !== initParams.defaultCellMarginRight ||
            newParams.defaultCellMarginBottom !== initParams.defaultCellMarginBottom || newParams.defaultCellMarginLeft !== initParams.defaultCellMarginLeft) {
            let topCellMargin = TableWidthUnit.create(newParams.defaultCellMarginTop, TableWidthUnitType.ModelUnits);
            let rightCellmargin = TableWidthUnit.create(newParams.defaultCellMarginRight, TableWidthUnitType.ModelUnits);
            let bottomCellMargin = TableWidthUnit.create(newParams.defaultCellMarginBottom, TableWidthUnitType.ModelUnits);
            let leftCellMargin = TableWidthUnit.create(newParams.defaultCellMarginLeft, TableWidthUnitType.ModelUnits);
            let newCellMargins = [topCellMargin, rightCellmargin, bottomCellMargin, leftCellMargin];
            history.addAndRedo(new TableCellMarginsHistoryItem(modelManipulator, subDocument, table.index, newCellMargins, [true, true, true, true]));
            changed = true;
        }
        newParams.rowHeight = this.getActualRowHeight(newParams.useDefaultRowHeight, newParams.rowHeight);
        ListUtils.forEach(tableInfo.extendedData.rows, (rowInfo) => {
            const row = table.rows[rowInfo.rowIndex];
            if (newParams.rowHeight && !row.height.equals(newParams.rowHeight)) {
                history.addAndRedo(new TableRowHeightHistoryItem(modelManipulator, subDocument, table.index, rowInfo.rowIndex, newParams.rowHeight));
                changed = true;
            }
            if (newParams.cantSplit !== undefined && newParams.cantSplit != initParams.cantSplit) {
                history.addAndRedo(new TableRowCantSplitHistoryItem(modelManipulator, subDocument, table.index, rowInfo.rowIndex, newParams.cantSplit, true));
                changed = true;
            }
        });
        newParams.columnPreferredWidth = this.getActualPreferredWidth(newParams.useDefaultColumnWidth, newParams.columnPreferredWidth);
        if (newParams.columnPreferredWidth) {
            const columnsRange = TableUtilsEx.getColumnsRangeBySelectedCells(tableInfo.extendedData);
            if (columnsRange.isNormalized()) {
                ListUtils.forEach(table.rows, (row, rowIndex) => {
                    ListUtils.forEach(TableCellUtils.getCellIndicesByColumnsRange(row, columnsRange), (cellIndex) => {
                        if (!row.cells[cellIndex].preferredWidth.equals(newParams.columnPreferredWidth)) {
                            history.addAndRedo(new TableCellPreferredWidthHistoryItem(modelManipulator, subDocument, table.index, rowIndex, cellIndex, newParams.columnPreferredWidth));
                            changed = true;
                        }
                    });
                });
            }
        }
        newParams.cellPreferredWidth = this.getActualPreferredWidth(newParams.useDefaultCellWidth, newParams.cellPreferredWidth);
        tableInfo.extendedData.foreach(() => { }, (cellInfo, rowInfo) => {
            const cell = cellInfo.cell;
            if (newParams.cellPreferredWidth && !cell.preferredWidth.equals(newParams.cellPreferredWidth) && !newParams.cellPreferredWidth.equals(initParams.cellPreferredWidth)) {
                history.addAndRedo(new TableCellPreferredWidthHistoryItem(modelManipulator, subDocument, table.index, rowInfo.rowIndex, cellInfo.cellIndex, newParams.cellPreferredWidth));
                changed = true;
            }
            if (cell.verticalMerging === TableCellMergingState.Restart) {
                let nextCellRowIndex = rowInfo.rowIndex + 1;
                while (table.rows[nextCellRowIndex]) {
                    let nextCellIndex = TableCellUtils.getCellIndexByColumnIndex(table.rows[nextCellRowIndex], cellInfo.cellIndex);
                    let nextCell = table.rows[nextCellRowIndex].cells[nextCellIndex];
                    if (nextCell.verticalMerging !== TableCellMergingState.Continue)
                        break;
                    if (newParams.cellPreferredWidth && !nextCell.preferredWidth.equals(newParams.cellPreferredWidth)) {
                        history.addAndRedo(new TableCellPreferredWidthHistoryItem(modelManipulator, subDocument, table.index, nextCellRowIndex, nextCellIndex, newParams.cellPreferredWidth));
                        changed = true;
                    }
                    nextCellRowIndex++;
                }
            }
            if (newParams.cellVerticalAlignment !== undefined && newParams.cellVerticalAlignment !== null && newParams.cellVerticalAlignment !== initParams.cellVerticalAlignment) {
                history.addAndRedo(new TableCellVerticalAlignmentHistoryItem(modelManipulator, subDocument, table.index, rowInfo.rowIndex, cellInfo.cellIndex, newParams.cellVerticalAlignment, true));
                changed = true;
            }
            if (newParams.cellNoWrap !== undefined && newParams.cellNoWrap != initParams.cellNoWrap) {
                history.addAndRedo(new TableCellNoWrapHistoryItem(modelManipulator, subDocument, table.index, rowInfo.rowIndex, cellInfo.cellIndex, newParams.cellNoWrap, true));
                changed = true;
            }
            if (newParams.cellMarginsSameAsTable) {
                let defaultCellMargins = subDocument.documentModel.defaultTableCellProperties.cellMargins;
                if (!defaultCellMargins.equals(cell.properties.cellMargins)) {
                    let newCellMargins = [defaultCellMargins.top.clone(), defaultCellMargins.right.clone(), defaultCellMargins.bottom.clone(), defaultCellMargins.left.clone()];
                    history.addAndRedo(new TableCellCellMarginsHistoryItem(modelManipulator, subDocument, table.index, rowInfo.rowIndex, cellInfo.cellIndex, newCellMargins, [false, false, false, false]));
                    changed = true;
                }
            }
            else {
                if (newParams.cellMarginTop !== initParams.cellMarginTop || newParams.cellMarginRight !== initParams.cellMarginRight ||
                    newParams.cellMarginBottom !== initParams.cellMarginBottom || newParams.cellMarginLeft !== initParams.cellMarginLeft) {
                    let topCellMargin = TableWidthUnit.create(newParams.cellMarginTop, TableWidthUnitType.ModelUnits);
                    let rightCellmargin = TableWidthUnit.create(newParams.cellMarginRight, TableWidthUnitType.ModelUnits);
                    let bottomCellMargin = TableWidthUnit.create(newParams.cellMarginBottom, TableWidthUnitType.ModelUnits);
                    let leftCellMargin = TableWidthUnit.create(newParams.cellMarginLeft, TableWidthUnitType.ModelUnits);
                    let newCellMargins = [topCellMargin, rightCellmargin, bottomCellMargin, leftCellMargin];
                    history.addAndRedo(new TableCellCellMarginsHistoryItem(modelManipulator, subDocument, table.index, rowInfo.rowIndex, cellInfo.cellIndex, newCellMargins, [true, true, true, true]));
                    changed = true;
                }
            }
        });
        history.endTransaction();
        return changed;
    }
    getActualPreferredWidth(useDefaultValue, preferredWidth) {
        if (useDefaultValue === null)
            return null;
        if (useDefaultValue === true)
            return TableWidthUnit.create(0, TableWidthUnitType.Auto);
        return preferredWidth;
    }
    getActualRowHeight(useDefaultRowHeight, rowHeight) {
        if (useDefaultRowHeight === null)
            return null;
        if (useDefaultRowHeight === true)
            return TableHeightUnit.createDefault();
        return rowHeight;
    }
    getInitialTab() {
        return TablePropertiesDialogTab.Table;
    }
    getDialogName() {
        return "TableProperties";
    }
}
export class DialogCellPropertiesCommand extends DialogTablePropertiesCommand {
    getInitialTab() {
        return TablePropertiesDialogTab.Cell;
    }
}
export class TablePropertiesDialogParameters extends DialogParametersBase {
    init(tableInfo, model, maxTableWidth, tab) {
        const table = tableInfo.table;
        this.tableInit(table, model);
        this.rowInit(tableInfo, model);
        this.columnInit(tableInfo);
        this.cellInit(tableInfo, model);
        this.maxTableWidth = maxTableWidth;
        this.initialTab = tab;
        this.isNestedTable = table.nestedLevel > 0;
    }
    tableInit(table, model) {
        this.useDefaultTableWidth = table.preferredWidth.type === TableWidthUnitType.Auto || table.preferredWidth.type === TableWidthUnitType.Nil;
        this.tablePreferredWidth = table.preferredWidth.clone();
        this.tableRowAlignment = TableAlignmentApplier.getTableAlignment(table);
        const actualTableIndent = table.getActualTableIndent(model.defaultTableProperties);
        this.tableIndent = actualTableIndent.type === TableWidthUnitType.ModelUnits ? actualTableIndent.value : 0;
        this.cellSpacing = this.getCellSpacing(table, model);
        this.allowCellSpacing = this.cellSpacing !== 0;
        const layoutType = table.getActualTableLayout(model.defaultTableProperties);
        this.resizeToFitContent = layoutType === TableLayoutType.Autofit;
        this.defaultCellMarginLeft = table.getActualLeftMargin(model.defaultTableProperties).value;
        this.defaultCellMarginRight = table.getActualRightMargin(model.defaultTableProperties).value;
        this.defaultCellMarginTop = table.getActualTopMargin(model.defaultTableProperties).value;
        this.defaultCellMarginBottom = table.getActualBottomMargin(model.defaultTableProperties).value;
    }
    getCellSpacing(table, model) {
        let firstRow = table.rows[0];
        let firstRowCellSpacing = new TableRowPropertiesMergerCellSpacing(model, table, firstRow.tablePropertiesException)
            .getProperty(firstRow.properties, table.style, ConditionalTableStyleFormatting.FirstRow, model.defaultTableRowProperties);
        for (let i = 0, currentRow; currentRow = table.rows[i]; i++) {
            let currentRowCellSpacing = new TableRowPropertiesMergerCellSpacing(model, table, currentRow.tablePropertiesException)
                .getProperty(currentRow.properties, table.style, currentRow.conditionalFormatting, model.defaultTableRowProperties);
            if (!firstRowCellSpacing.equals(currentRowCellSpacing))
                return null;
        }
        return firstRowCellSpacing.type === TableWidthUnitType.ModelUnits ? (firstRowCellSpacing.value * 2) : 0;
    }
    rowInit(tableInfo, model) {
        const table = tableInfo.table;
        let identicalRowHeight = true;
        let identicalCantSplit = true;
        let cantSplitMerger = new TableRowPropertiesMergerCantSplit();
        let firstRow = table.rows[tableInfo.extendedData.startRowIndex];
        let firstRowCantSplit = cantSplitMerger.getProperty(firstRow.properties, table.style, firstRow.conditionalFormatting, model.defaultTableRowProperties);
        let firstRowHeight = firstRow.height.clone();
        ListUtils.reverseForEach(tableInfo.extendedData.rows, (rowInfo) => {
            let currentRow = table.rows[rowInfo.rowIndex];
            let currentCantSplit = cantSplitMerger.getProperty(currentRow.properties, table.style, currentRow.conditionalFormatting, model.defaultTableRowProperties);
            identicalRowHeight = currentRow.height.equals(firstRowHeight);
            identicalCantSplit = identicalCantSplit && (firstRowCantSplit === currentCantSplit);
        }, tableInfo.extendedData.rows.length - 1, 1);
        this.useDefaultRowHeight = identicalRowHeight ? firstRowHeight.value === 0 : null;
        this.cantSplit = identicalCantSplit ? firstRowCantSplit : null;
        this.rowHeight = TableHeightUnit.create(identicalRowHeight ? firstRowHeight.value : 0, firstRowHeight.type === TableHeightUnitType.Exact ? TableHeightUnitType.Exact : TableHeightUnitType.Minimum);
    }
    columnInit(tableInfo) {
        const table = tableInfo.table;
        let identicalColumnWidth = true;
        const columnsRange = TableUtilsEx.getColumnsRangeBySelectedCells(tableInfo.extendedData);
        let firstCellWidth = null;
        for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
            let cellIndices = TableCellUtils.getCellIndicesByColumnsRange(row, columnsRange);
            for (let i = 0; i < cellIndices.length; i++) {
                let cellIndex = cellIndices[i];
                if (firstCellWidth === null)
                    firstCellWidth = table.rows[rowIndex].cells[cellIndex].preferredWidth;
                else
                    identicalColumnWidth = identicalColumnWidth && table.rows[rowIndex].cells[cellIndex].preferredWidth.equals(firstCellWidth);
            }
        }
        this.useDefaultColumnWidth = identicalColumnWidth ? firstCellWidth.type === TableWidthUnitType.Auto : null;
        this.columnPreferredWidth = firstCellWidth.clone();
    }
    cellInit(tableInfo, model) {
        const table = tableInfo.table;
        this.cellMarginsSameAsTable = true;
        let identicalCellWidth = true;
        let identicalVerticalAlignment = true;
        let identicalNoWrap = true;
        let identicalLeftMargins = true;
        let identicalRightMargins = true;
        let identicalTopMargins = true;
        let identicalBottomMargins = true;
        let noWrapMerger = new TableCellPropertiesMergerNoWrap();
        let verticalAlignmentMerger = new TableCellVerticalAlignmentMerger();
        let firstSelectedCell = tableInfo.extendedData.firstCell;
        let firstCellWidth = firstSelectedCell.preferredWidth.clone();
        let firstCellVerticalAlignment = verticalAlignmentMerger.getProperty(firstSelectedCell.properties, table.style, firstSelectedCell.conditionalFormatting, model.defaultTableCellProperties);
        let firstCellNoWrap = noWrapMerger.getProperty(firstSelectedCell.properties, table.style, firstSelectedCell.conditionalFormatting, model.defaultTableCellProperties);
        let firstCellMargins = this.getActualCellMargins(table, firstSelectedCell, model);
        ListUtils.forEach(tableInfo.extendedData.rows, (rowInfo) => {
            ListUtils.forEach(rowInfo.cells, (cellInfo) => {
                const cell = cellInfo.cell;
                identicalCellWidth = identicalCellWidth && (firstCellWidth.equals(cell.preferredWidth));
                let currentCellVerticalAlignment = verticalAlignmentMerger.getProperty(cell.properties, table.style, cell.conditionalFormatting, model.defaultTableCellProperties);
                identicalVerticalAlignment = identicalVerticalAlignment && (firstCellVerticalAlignment === currentCellVerticalAlignment);
                let currentCellNoWrap = noWrapMerger.getProperty(cell.properties, table.style, cell.conditionalFormatting, model.defaultTableCellProperties);
                identicalNoWrap = identicalNoWrap && (firstCellNoWrap === currentCellNoWrap);
                let curreantCellMargins = this.getActualCellMargins(table, cell, model);
                identicalTopMargins = identicalTopMargins && firstCellMargins.top.equals(curreantCellMargins.top);
                identicalRightMargins = identicalRightMargins && firstCellMargins.right.equals(curreantCellMargins.right);
                identicalBottomMargins = identicalBottomMargins && firstCellMargins.bottom.equals(curreantCellMargins.bottom);
                identicalLeftMargins = identicalLeftMargins && firstCellMargins.left.equals(curreantCellMargins.left);
                if (cell.properties.getUseValue(TableCellPropertiesMask.UseTopMargin) || cell.properties.getUseValue(TableCellPropertiesMask.UseRightMargin) ||
                    cell.properties.getUseValue(TableCellPropertiesMask.UseBottomMargin) || cell.properties.getUseValue(TableCellPropertiesMask.UseLeftMargin))
                    this.cellMarginsSameAsTable = false;
            });
        });
        this.useDefaultCellWidth = identicalCellWidth ? firstCellWidth.type === TableWidthUnitType.Auto : null;
        this.cellPreferredWidth = firstCellWidth;
        this.cellVerticalAlignment = identicalVerticalAlignment ? firstCellVerticalAlignment : null;
        this.cellNoWrap = identicalNoWrap ? firstCellNoWrap : null;
        this.cellMarginTop = identicalTopMargins ? firstCellMargins.top.value : null;
        this.cellMarginRight = identicalRightMargins ? firstCellMargins.right.value : null;
        this.cellMarginBottom = identicalBottomMargins ? firstCellMargins.bottom.value : null;
        this.cellMarginLeft = identicalLeftMargins ? firstCellMargins.left.value : null;
    }
    getActualCellMargins(_table, cell, model) {
        const cellMarginLeft = cell.getActualLeftCellMargin(model).clone();
        const cellMarginRight = cell.getActualRightCellMargin(model).clone();
        const cellMarginTop = cell.getActualTopCellMargin(model).clone();
        const cellMarginBottom = cell.getActualBottomCellMargin(model).clone();
        return TableCellMargins.create(cellMarginTop, cellMarginRight, cellMarginBottom, cellMarginLeft);
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.useDefaultTableWidth = obj.useDefaultTableWidth;
        this.tablePreferredWidth = obj.tablePreferredWidth.clone();
        this.tableRowAlignment = obj.tableRowAlignment;
        this.tableIndent = obj.tableIndent;
        this.cellSpacing = obj.cellSpacing;
        this.allowCellSpacing = obj.allowCellSpacing;
        this.resizeToFitContent = obj.resizeToFitContent;
        this.defaultCellMarginLeft = obj.defaultCellMarginLeft;
        this.defaultCellMarginRight = obj.defaultCellMarginRight;
        this.defaultCellMarginTop = obj.defaultCellMarginTop;
        this.defaultCellMarginBottom = obj.defaultCellMarginTop;
        this.useDefaultRowHeight = obj.useDefaultRowHeight;
        this.rowHeight = obj.rowHeight.clone();
        this.cantSplit = obj.cantSplit;
        this.useDefaultColumnWidth = obj.useDefaultColumnWidth;
        this.columnPreferredWidth = obj.columnPreferredWidth.clone();
        this.useDefaultCellWidth = obj.useDefaultCellWidth;
        this.cellPreferredWidth = obj.cellPreferredWidth.clone();
        this.cellVerticalAlignment = obj.cellVerticalAlignment;
        this.cellNoWrap = obj.cellNoWrap;
        this.cellMarginLeft = obj.cellMarginLeft;
        this.cellMarginRight = obj.cellMarginRight;
        this.cellMarginTop = obj.cellMarginTop;
        this.cellMarginBottom = obj.cellMarginBottom;
        this.cellMarginsSameAsTable = obj.cellMarginsSameAsTable;
        this.maxTableWidth = obj.maxTableWidth;
        this.initialTab = obj.initialTab;
        this.isNestedTable = obj.isNestedTable;
    }
    clone() {
        const newInstance = new TablePropertiesDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(converter) {
        if (this.tablePreferredWidth && this.tablePreferredWidth.type === TableWidthUnitType.ModelUnits)
            this.tablePreferredWidth.value = converter(this.tablePreferredWidth.value);
        if (this.tableIndent)
            this.tableIndent = converter(this.tableIndent);
        if (this.cellSpacing)
            this.cellSpacing = converter(this.cellSpacing);
        if (this.defaultCellMarginLeft)
            this.defaultCellMarginLeft = converter(this.defaultCellMarginLeft);
        if (this.defaultCellMarginRight)
            this.defaultCellMarginRight = converter(this.defaultCellMarginRight);
        if (this.defaultCellMarginTop)
            this.defaultCellMarginTop = converter(this.defaultCellMarginTop);
        if (this.defaultCellMarginBottom)
            this.defaultCellMarginBottom = converter(this.defaultCellMarginBottom);
        if (this.rowHeight)
            this.rowHeight.value = converter(this.rowHeight.value);
        if (this.columnPreferredWidth && this.columnPreferredWidth.type === TableWidthUnitType.ModelUnits)
            this.columnPreferredWidth.value = converter(this.columnPreferredWidth.value);
        if (this.cellPreferredWidth && this.cellPreferredWidth.type === TableWidthUnitType.ModelUnits)
            this.cellPreferredWidth.value = converter(this.cellPreferredWidth.value);
        if (this.cellMarginTop)
            this.cellMarginTop = converter(this.cellMarginTop);
        if (this.cellMarginRight)
            this.cellMarginRight = converter(this.cellMarginRight);
        if (this.cellMarginBottom)
            this.cellMarginBottom = converter(this.cellMarginBottom);
        if (this.cellMarginLeft)
            this.cellMarginLeft = converter(this.cellMarginLeft);
        if (this.maxTableWidth)
            this.maxTableWidth = converter(this.maxTableWidth);
        return this;
    }
}
export class TablePropertiesDialogDefaults {
}
TablePropertiesDialogDefaults.MinTableIndentByDefault = -15 * 1440;
TablePropertiesDialogDefaults.MaxTableIndentByDefault = 15 * 1440;
TablePropertiesDialogDefaults.MinTableWidthByDefault = 0;
TablePropertiesDialogDefaults.MaxTableWidthInModelUnitsByDefault = 22 * 1440;
TablePropertiesDialogDefaults.MaxTableWidthInPercentByDefault = 600;
TablePropertiesDialogDefaults.MinRowHeightByDefault = 0;
TablePropertiesDialogDefaults.MaxRowHeightByDefault = 22 * 1440;
TablePropertiesDialogDefaults.MinColumnWidthByDefault = 0;
TablePropertiesDialogDefaults.MaxColumnWidthInModelUnitsByDefault = 22 * 1440;
TablePropertiesDialogDefaults.MaxColumnWidthInPercentByDefault = 100;
TablePropertiesDialogDefaults.MinCellWidthByDefault = 0;
TablePropertiesDialogDefaults.MaxCellWidthInModelUnitsByDefault = 22 * 1440;
TablePropertiesDialogDefaults.MaxCellWidthInPercentByDefault = 100;
export var TablePropertiesDialogTab;
(function (TablePropertiesDialogTab) {
    TablePropertiesDialogTab[TablePropertiesDialogTab["Table"] = 0] = "Table";
    TablePropertiesDialogTab[TablePropertiesDialogTab["Row"] = 1] = "Row";
    TablePropertiesDialogTab[TablePropertiesDialogTab["Column"] = 2] = "Column";
    TablePropertiesDialogTab[TablePropertiesDialogTab["Cell"] = 3] = "Cell";
})(TablePropertiesDialogTab || (TablePropertiesDialogTab = {}));
