import { MapCreator } from '../../../base-utils/map-creator';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { MaskedParagraphProperties } from '../../../core/model/paragraph/paragraph-properties';
import { ShadingInfo } from '../../../core/model/shadings/shading-info';
import { TableCellProperties, TableCellPropertiesMask } from '../../../core/model/tables/properties/table-cell-properties';
import { TableCellVerticalAlignment } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { TableWidthUnit, TableWidthUnitType } from '../../../core/model/tables/secondary-structures/table-units';
import { AttrUtils } from '@devexpress/utils/lib/utils/attr';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ImportedParagraphRunInfo } from '../containers/runs';
import { ImportedTableCellInfo } from '../containers/tables';
import { HtmlImportUtils } from '../utils/utils';
import { HtmlTagImporterBase } from './base';
import { HtmlTableTagImporter } from './table';
import { HtmlTrTagImporter } from './tr';
import { TabProperties } from '../../../core/model/paragraph/paragraph-style';
export class HtmlTdTagImporter extends HtmlTagImporterBase {
    elementTag() {
        return "TD";
    }
    importBefore() {
        ListUtils.last(this.importer.levelInfo).allowInsertRuns = true;
        this.rowImporter = this.getClosestImporterByTagName(HtmlTrTagImporter.tagName);
        HtmlTdTagImporter.addVerticalMergedCells(this.importer, this.getClosestImporterByTagName(HtmlTableTagImporter.tagName), this.rowImporter);
        this.startPosition = this.importer.currPosition;
    }
    isImportChilds() {
        return true;
    }
    importAfter() {
        const cell = this.element;
        const cellWidth = HtmlImportUtils.getTableWidthUnit(this.element.style.width || AttrUtils.getElementAttribute(this.element, "width"));
        const preferredWidth = cellWidth ? cellWidth : new TableWidthUnit().init(0, TableWidthUnitType.Auto);
        const columnSpan = cell.colSpan > 1000 ? 1 : (cell.colSpan == 0 ? Number.MAX_VALUE : cell.colSpan);
        const rowSpan = cell.rowSpan == 0 ? Number.MAX_VALUE : cell.rowSpan;
        const cellStyle = DomUtils.getCurrentStyle(cell);
        const props = new TableCellProperties();
        this.importCellBorders(this.importer.modelManager.model.colorProvider, props, cellStyle);
        this.importMargins(props, cellStyle);
        this.setVerticalAlign(props, cellStyle);
        this.setBackgroungColor(props, cellStyle);
        const lastImportedRun = this.importer.getLastImportedRun();
        if (!lastImportedRun || !this.importer.prevRunIsParagraph ||
            this.importer.currPosition - lastImportedRun.runLength < this.startPosition) {
            this.importer.addParagraphRun(null, this.element, true);
        }
        this.rowImporter.cells.push(new ImportedTableCellInfo(preferredWidth, this.startPosition, this.importer.currPosition, columnSpan, rowSpan, props, true));
    }
    static addVerticalMergedCells(importer, tableImporter, rowImporter) {
        const prevRow = ListUtils.last(tableImporter.rows);
        if (!prevRow)
            return;
        let currColSpan = rowImporter.gridBeforeInfo.gridBefore +
            ListUtils.accumulate(rowImporter.cells, 0, (acc, cell) => acc + cell.columnSpan);
        while (true) {
            const prevRowImpCell = prevRow.getCellByColumnSpan(currColSpan);
            if (prevRowImpCell && prevRowImpCell.rowSpan > 1) {
                const impCell = prevRowImpCell.clone();
                impCell.rowSpan--;
                impCell.startPosition = importer.currPosition;
                impCell.endPosition = importer.currPosition + 1;
                impCell.firstWhenVerticallyMerged = false;
                rowImporter.cells.push(impCell);
                currColSpan += impCell.columnSpan;
                importer.addRun(new ImportedParagraphRunInfo(null, importer.charPropsBundle, new MaskedParagraphProperties(), new TabProperties()), true);
            }
            else
                break;
        }
    }
    setBackgroungColor(props, cellStyle) {
        let cellBackgroundColor = ColorUtils.fromString(cellStyle.backgroundColor);
        if (cellBackgroundColor) {
            props.setUseValue(TableCellPropertiesMask.UseShadingInfoIndex, true);
            props.shadingInfo = ShadingInfo.createByColor(ColorModelInfo.makeByColor(cellBackgroundColor));
        }
    }
    setVerticalAlign(props, cellStyle) {
        const align = HtmlTdTagImporter.verticalAlignInfo[cellStyle.verticalAlign];
        if (align !== undefined) {
            props.verticalAlignment = align;
            props.setUseValue(TableCellPropertiesMask.UseVerticalAlignment, true);
        }
    }
    importCellBorders(colorProvider, props, cellStyle) {
        HtmlImportUtils.setBorders(colorProvider, props, props.borders, cellStyle, TableCellPropertiesMask.UseTopBorder, TableCellPropertiesMask.UseRightBorder, TableCellPropertiesMask.UseBottomBorder, TableCellPropertiesMask.UseLeftBorder);
    }
    importMargins(props, cellStyle) {
        this.importMargin(props, cellStyle.paddingTop, TableCellPropertiesMask.UseTopMargin, (margins, value) => margins.top = value);
        this.importMargin(props, cellStyle.paddingRight, TableCellPropertiesMask.UseRightMargin, (margins, value) => margins.right = value);
        this.importMargin(props, cellStyle.paddingBottom, TableCellPropertiesMask.UseBottomMargin, (margins, value) => margins.bottom = value);
        this.importMargin(props, cellStyle.paddingLeft, TableCellPropertiesMask.UseLeftMargin, (margins, value) => margins.left = value);
    }
    importMargin(props, value, mask, setMargin) {
        const margin = HtmlImportUtils.getTableWidthUnit(value);
        if (margin) {
            setMargin(props.cellMargins, margin);
            props.setUseValue(mask, true);
        }
    }
}
HtmlTdTagImporter.verticalAlignInfo = new MapCreator()
    .add("bottom", TableCellVerticalAlignment.Bottom)
    .add("middle", TableCellVerticalAlignment.Center)
    .add("top", TableCellVerticalAlignment.Top)
    .get();
export class HtmlThTagImporter extends HtmlTdTagImporter {
    elementTag() {
        return "TH";
    }
}
